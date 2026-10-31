# -*- coding: utf-8 -*-
# Vectorizador propio: mascara -> contornos -> curvas Bezier (Schneider) con
# deteccion de esquinas. Las coordenadas salen en pixeles de la imagen original.
import numpy as np, cv2


# ---------- Bezier cubica ----------
def _bez(c, t):
    t = np.asarray(t, float)[:, None]
    m = 1 - t
    return m**3 * c[0] + 3 * m**2 * t * c[1] + 3 * m * t**2 * c[2] + t**3 * c[3]


def _bez1(c, t):
    t = np.asarray(t, float)[:, None]
    m = 1 - t
    return 3 * m**2 * (c[1] - c[0]) + 6 * m * t * (c[2] - c[1]) + 3 * t**2 * (c[3] - c[2])


def _bez2(c, t):
    t = np.asarray(t, float)[:, None]
    m = 1 - t
    return 6 * m * (c[2] - 2 * c[1] + c[0]) + 6 * t * (c[3] - 2 * c[2] + c[1])


def _unit(v):
    n = np.linalg.norm(v)
    return v / n if n > 1e-12 else v


def _param(p):
    d = np.r_[0, np.cumsum(np.linalg.norm(np.diff(p, axis=0), axis=1))]
    return d / d[-1] if d[-1] > 0 else d


def _generar(p, u, t1, t2):
    p0, p3 = p[0], p[-1]
    b0 = (1 - u) ** 3
    b1 = 3 * u * (1 - u) ** 2
    b2 = 3 * u**2 * (1 - u)
    b3 = u**3
    a1 = t1[None, :] * b1[:, None]
    a2 = t2[None, :] * b2[:, None]
    c00, c01, c11 = (a1 * a1).sum(), (a1 * a2).sum(), (a2 * a2).sum()
    tmp = p - (p0[None, :] * (b0 + b1)[:, None] + p3[None, :] * (b2 + b3)[:, None])
    x0, x1 = (a1 * tmp).sum(), (a2 * tmp).sum()
    det = c00 * c11 - c01 * c01
    seg = np.linalg.norm(p3 - p0)
    if abs(det) > 1e-12:
        al1 = (x0 * c11 - x1 * c01) / det
        al2 = (c00 * x1 - c01 * x0) / det
    else:
        al1 = al2 = 0
    if al1 < 1e-6 * seg or al2 < 1e-6 * seg:
        al1 = al2 = seg / 3
    return np.array([p0, p0 + t1 * al1, p3 + t2 * al2, p3])


def _errmax(p, c, u):
    d = ((_bez(c, u) - p) ** 2).sum(1)
    i = int(d.argmax())
    return d[i], i


def _reparam(p, c, u):
    q, q1, q2 = _bez(c, u), _bez1(c, u), _bez2(c, u)
    num = ((q - p) * q1).sum(1)
    den = (q1 * q1).sum(1) + ((q - p) * q2).sum(1)
    un = u.copy()
    ok = np.abs(den) > 1e-12
    un[ok] = u[ok] - num[ok] / den[ok]
    return np.clip(un, 0, 1)


def _ajustar(p, t1, t2, err2, out):
    if len(p) == 2:
        d = np.linalg.norm(p[1] - p[0]) / 3
        out.append(np.array([p[0], p[0] + t1 * d, p[1] + t2 * d, p[1]]))
        return
    u = _param(p)
    prev = np.inf
    split = len(p) // 2
    for _ in range(4):
        c = _generar(p, u, t1, t2)
        e, i = _errmax(p, c, u)
        ordenado = bool(np.all(np.diff(u) >= -1e-9))
        if e < err2 and ordenado:
            out.append(c)
            return
        split = i
        if e >= max(err2, err2 * err2) and e >= prev:
            break
        u = _reparam(p, c, u)
        prev = e
    split = min(max(split, 1), len(p) - 2)
    tc = _unit(p[max(split - 2, 0)] - p[min(split + 2, len(p) - 1)])
    _ajustar(p[: split + 1], t1, tc, err2, out)
    _ajustar(p[split:], -tc, t2, err2, out)


# ---------- contornos ----------
def _suavizar(P, sigma):
    n = len(P)
    r = int(3 * sigma) + 1
    k = np.exp(-0.5 * (np.arange(-r, r + 1) / sigma) ** 2)
    k /= k.sum()
    out = np.zeros_like(P)
    for j, w in zip(range(-r, r + 1), k):
        out += w * np.roll(P, -j, axis=0)
    return out


def _esquinas(S, k, ang_min):
    n = len(S)
    idx = np.arange(n)
    a = S[(idx + k) % n] - S
    b = S - S[(idx - k) % n]
    cruz = b[:, 0] * a[:, 1] - b[:, 1] * a[:, 0]
    pto = (b * a).sum(1)
    ang = np.degrees(np.abs(np.arctan2(cruz, pto)))
    cand = []
    mx = np.maximum.reduce([np.roll(ang, s) for s in range(-k, k + 1)])
    for i in np.where((ang > ang_min) & (ang >= mx - 1e-9))[0]:
        if cand and (i - cand[-1]) % n < k and (i - cand[-1]) >= 0:
            continue
        cand.append(int(i))
    if len(cand) > 1 and (cand[0] + n - cand[-1]) < k:
        cand.pop()
    return cand


def _tramo(P, S, i, j, k, tol2, paso=4):
    n = len(P)
    ln = (j - i) % n or n
    idx = [(i + s) % n for s in range(ln + 1)]
    pts = S[idx].copy()
    pts[0], pts[-1] = P[idx[0]], P[idx[-1]]
    sel = list(range(0, len(pts), paso))
    if sel[-1] != len(pts) - 1:
        sel.append(len(pts) - 1)
    pts = pts[sel]
    if len(pts) < 3:
        return [('L', pts[-1])]
    ch = pts[-1] - pts[0]
    lc = np.linalg.norm(ch)
    if lc > 1e-9:
        nrm = np.array([-ch[1], ch[0]]) / lc
        dev = np.abs((pts - pts[0]) @ nrm).max()
        if dev * dev < tol2 * 0.5:
            return [('L', pts[-1])]
    m = min(3, len(pts) - 1)
    t1 = _unit(pts[m] - pts[0])
    t2 = _unit(pts[-1 - m] - pts[-1])
    cur = []
    _ajustar(pts, t1, t2, tol2, cur)
    return [('C', c[1], c[2], c[3]) for c in cur]


def ajustar_cerrado(P, tol=0.8, k=5, ang_min=38, sigma=2.0):
    """P: Nx2 contorno cerrado (en pixeles del mapa ampliado). Devuelve
    [inicio, [segmentos]] con segmentos ('L',p) o ('C',c1,c2,p)."""
    n = len(P)
    S = _suavizar(P.astype(float), sigma)
    esq = _esquinas(S, k, ang_min)
    tol2 = tol * tol
    segs = []
    if not esq:
        t = _unit(S[k % n] - S[(-k) % n])
        pts = np.vstack([S, S[:1]])[::4]
        pts = np.vstack([pts, pts[:1]]) if np.linalg.norm(pts[-1] - pts[0]) > 1e-6 else pts
        cur = []
        _ajustar(pts.astype(float), t, -t, tol2, cur)
        segs += [('C', c[1], c[2], c[3]) for c in cur]
        return S[0].astype(float), segs
    ini = P[esq[0]].astype(float)
    for a in range(len(esq)):
        i, j = esq[a], esq[(a + 1) % len(esq)]
        segs += _tramo(P.astype(float), S, i, j, k, tol2)
    return ini, segs


def a_path(ini, segs, f=lambda p: p, dec=2):
    def s(p):
        q = f(p)
        return f'{q[0]:.{dec}f} {q[1]:.{dec}f}'.replace('.00 ', ' ').replace('.00', '')
    d = ['M' + s(ini)]
    for sg in segs:
        if sg[0] == 'L':
            d.append('L' + s(sg[1]))
        else:
            d.append('C' + s(sg[1]) + ' ' + s(sg[2]) + ' ' + s(sg[3]))
    d.append('Z')
    return ''.join(d)


def trazar(V, caja, umbral, escala=4, area_min=60, tol=0.8, k=5, ang_min=38, margen=6, blur=0.0, sigma=2.0):
    """V: imagen de un canal (float). caja=(x0,y0,x1,y1). Devuelve lista de
    dicts {path, hole, bbox, area} con coordenadas en pixeles originales."""
    x0, y0, x1, y1 = caja
    x0, y0 = max(0, x0 - margen), max(0, y0 - margen)
    x1, y1 = min(V.shape[1], x1 + margen), min(V.shape[0], y1 + margen)
    rec = V[y0:y1, x0:x1].astype(np.float32)
    if blur > 0:
        rec = cv2.GaussianBlur(rec, (0, 0), blur)
    up = cv2.resize(rec, None, fx=escala, fy=escala, interpolation=cv2.INTER_CUBIC)
    m = (up > umbral).astype(np.uint8)
    cont, jer = cv2.findContours(m, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_NONE)
    res = []
    for i, c in enumerate(cont):
        a = cv2.contourArea(c)
        if a < area_min:
            continue
        P = c[:, 0, :].astype(float)
        ini, segs = ajustar_cerrado(P, tol=tol, k=k, ang_min=ang_min, sigma=sigma)
        f = lambda p: ((p[0] + 0.5) / escala + x0, (p[1] + 0.5) / escala + y0)
        bx, by, bw, bh = cv2.boundingRect(c)
        res.append(dict(
            path=a_path(ini, segs, f),
            hole=jer[0][i][3] >= 0,
            bbox=(bx / escala + x0, by / escala + y0, (bx + bw) / escala + x0, (by + bh) / escala + y0),
            area=a / escala / escala,
            n=len(segs),
        ))
    return res
