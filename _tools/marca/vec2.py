# -*- coding: utf-8 -*-
# Vectorizador v2 para logos geometricos: esquinas nitidas, tramos rectos exactos,
# circulos y arcos exactos, y Bezier suave para el resto.
import math
import numpy as np, cv2
from vec import _ajustar, _suavizar, _esquinas, _unit


def _suav_abierto(pts, sigma):
    n = len(pts)
    r = int(3 * sigma) + 1
    if n <= 2 * r:
        sigma = max(n / 6.0, 0.6)
        r = int(3 * sigma) + 1
        if n <= r + 1:
            return pts.copy()
    izq = 2 * pts[0] - pts[1:r + 1][::-1]
    der = 2 * pts[-1] - pts[-r - 1:-1][::-1]
    ext = np.vstack([izq, pts, der])
    k = np.exp(-0.5 * (np.arange(-r, r + 1) / sigma) ** 2)
    k /= k.sum()
    return np.stack([np.convolve(ext[:, d], k, mode='valid') for d in (0, 1)], 1)


def _circulo(pts):
    x, y = pts[:, 0], pts[:, 1]
    A = np.c_[2 * x, 2 * y, np.ones(len(x))]
    b = x * x + y * y
    sol = np.linalg.lstsq(A, b, rcond=None)[0]
    cx, cy = sol[0], sol[1]
    R2 = sol[2] + cx * cx + cy * cy
    if R2 <= 0:
        return None
    R = math.sqrt(R2)
    res = np.abs(np.hypot(x - cx, y - cy) - R)
    return cx, cy, R, float(res.max())


def _linea_ajustada(pts):
    c = pts.mean(0)
    u, s, vt = np.linalg.svd(pts - c, full_matrices=False)
    d = vt[0]
    nrm = np.array([-d[1], d[0]])
    dev = np.abs((pts - c) @ nrm)
    return c, d, float(dev.max())


def _inter(c1, d1, c2, d2):
    A = np.array([d1, -d2]).T
    if abs(np.linalg.det(A)) < 1e-6:
        return None
    t = np.linalg.solve(A, c2 - c1)
    return c1 + d1 * t[0]


def _cubica_a_linea(c, tol):
    ch = c[3] - c[0]
    lc = np.linalg.norm(ch)
    if lc < 1e-9:
        return False
    nrm = np.array([-ch[1], ch[0]]) / lc
    return max(abs((c[1] - c[0]) @ nrm), abs((c[2] - c[0]) @ nrm)) < tol * 0.6


def _arco_svg(p0, p1, R, pts):
    """Segmento de arco SVG desde p0 hasta p1 con radio R, usando la orientacion
    de los puntos intermedios para elegir sweep y large-arc."""
    cx, cy, _, _ = _circulo(pts)
    a0 = math.atan2(p0[1] - cy, p0[0] - cx)
    am = math.atan2(pts[len(pts) // 2][1] - cy, pts[len(pts) // 2][0] - cx)
    a1 = math.atan2(p1[1] - cy, p1[0] - cx)

    def dif(a, b):
        return (b - a + math.pi) % (2 * math.pi) - math.pi
    # sentido: recorrer p0 -> medio -> p1
    d01 = dif(a0, am)
    sweep = 1 if d01 > 0 else 0
    total = 0.0
    prev = a0
    for q in pts[:: max(1, len(pts) // 40)]:
        a = math.atan2(q[1] - cy, q[0] - cx)
        total += dif(prev, a)
        prev = a
    total += dif(prev, a1)
    large = 1 if abs(total) > math.pi else 0
    return ('A', R, large, sweep, p1)


def _tramo(P, i, j, tol, sigma_fit, paso, tol_arco, tol_linea=None):
    n = len(P)
    ln = (j - i) % n or n
    idx = [(i + s) % n for s in range(ln + 1)]
    raw = P[idx]
    ps = _suav_abierto(raw, sigma_fit)
    ps[0], ps[-1] = raw[0], raw[-1]
    # recta exacta
    c, d, dev = _linea_ajustada(ps)
    if dev < (tol_linea if tol_linea else tol * 0.9):
        return [('L', ps[-1])], ps
    # arco exacto
    ci = _circulo(ps)
    if ci and len(ps) > 40 and ci[3] < tol_arco and ci[2] < 4000:
        return [_arco_svg(ps[0], ps[-1], ci[2], ps)], ps
    sel = list(range(0, len(ps), paso))
    if sel[-1] != len(ps) - 1:
        sel.append(len(ps) - 1)
    q = ps[sel]
    if len(q) < 3:
        return [('L', q[-1])], ps
    m = min(3, len(q) - 1)
    t1 = _unit(q[m] - q[0])
    t2 = _unit(q[-1 - m] - q[-1])
    cur = []
    _ajustar(q, t1, t2, tol * tol, cur)
    segs = []
    p0 = q[0]
    for cb in cur:
        if _cubica_a_linea(cb, tol):
            segs.append(('L', cb[3]))
        else:
            segs.append(('C', cb[1], cb[2], cb[3]))
    return segs, ps


def _refinar_esquinas(P, esq, tol, sigma_fit, ventana=40, salto=24, tol_linea=None):
    """Mueve cada esquina a la interseccion de las dos rectas vecinas cuando ambas
    son rectas de verdad. Devuelve dict indice->punto nuevo."""
    n = len(P)
    nuevo = {}
    for a, i in enumerate(esq):
        ant = esq[a - 1]
        sig = esq[(a + 1) % len(esq)]
        l_ant = (i - ant) % n or n
        l_sig = (sig - i) % n or n
        if l_ant < ventana + salto + 10 or l_sig < ventana + salto + 10:
            continue
        A = P[[(i - salto - s) % n for s in range(ventana)]]
        B = P[[(i + salto + s) % n for s in range(ventana)]]
        cA, dA, devA = _linea_ajustada(A)
        cB, dB, devB = _linea_ajustada(B)
        lim = (tol_linea * 0.8) if tol_linea else tol * 0.7
        if devA > lim or devB > lim:
            continue
        q = _inter(cA, dA, cB, dB)
        if q is not None and np.linalg.norm(q - P[i]) < 40:
            nuevo[i] = q
    return nuevo


def ajustar_cerrado(P, tol=3.0, k=10, ang_min=38, sigma_det=4.0, sigma_fit=14.0,
                    paso=6, tol_arco=2.5, tol_linea=None):
    n = len(P)
    P = P.astype(float)
    Sd = _suavizar(P, sigma_det)
    esq = _esquinas(Sd, k, ang_min)
    if not esq:
        S = _suavizar(P, 7.0)
        ci = _circulo(S[::3])
        if ci and ci[3] < tol_arco * 1.3:
            cx, cy, R, _ = ci
            return ('circulo', cx, cy, R)
        pts = np.vstack([S, S[:1]])[::4]
        t = _unit(S[k % n] - S[(-k) % n])
        cur = []
        _ajustar(pts, t, -t, tol * tol, cur)
        segs = [('C', c[1], c[2], c[3]) for c in cur]
        return ('ruta', S[0], segs)
    nuevo = _refinar_esquinas(P, esq, tol, sigma_fit, tol_linea=tol_linea)
    P2 = P.copy()
    for i, q in nuevo.items():
        P2[i] = q
    segs = []
    for a in range(len(esq)):
        i, j = esq[a], esq[(a + 1) % len(esq)]
        s, _ = _tramo(P2, i, j, tol, sigma_fit, paso, tol_arco, tol_linea)
        segs += s
    return ('ruta', P2[esq[0]], segs)


def _fmt(q, dec=2):
    a = f'{q[0]:.{dec}f}'.rstrip('0').rstrip('.')
    b = f'{q[1]:.{dec}f}'.rstrip('0').rstrip('.')
    return f'{a} {b}'


def a_path(res, f, escala, dec=2):
    if res[0] == 'circulo':
        _, cx, cy, R = res
        (x, y) = f((cx, cy))
        r = R / escala
        return (f'M{x - r:.{dec}f} {y:.{dec}f}a{r:.{dec}f} {r:.{dec}f} 0 1 0 {2 * r:.{dec}f} 0'
                f'a{r:.{dec}f} {r:.{dec}f} 0 1 0 {-2 * r:.{dec}f} 0Z')
    _, ini, segs = res
    d = ['M' + _fmt(f(ini), dec)]
    for sg in segs:
        if sg[0] == 'L':
            d.append('L' + _fmt(f(sg[1]), dec))
        elif sg[0] == 'A':
            _, R, large, sweep, p = sg
            r = R / escala
            d.append(f'A{r:.{dec}f} {r:.{dec}f} 0 {large} {sweep} ' + _fmt(f(p), dec))
        else:
            d.append('C' + _fmt(f(sg[1]), dec) + ' ' + _fmt(f(sg[2]), dec) + ' ' + _fmt(f(sg[3]), dec))
    d.append('Z')
    return ''.join(d)


def trazar(V, caja, umbral, escala=8, area_min=240, tol=3.0, k=10, ang_min=38, margen=6,
           blur=1.0, sigma_fit=14.0, paso=6, tol_arco=2.5, devolver_puntos=False, relativo=None, tol_linea=None):
    x0, y0, x1, y1 = caja
    x0, y0 = max(0, x0 - margen), max(0, y0 - margen)
    x1, y1 = min(V.shape[1], x1 + margen), min(V.shape[0], y1 + margen)
    rec = V[y0:y1, x0:x1].astype(np.float32)
    if blur > 0:
        rec = cv2.GaussianBlur(rec, (0, 0), blur)
    if relativo:
        # umbral adaptativo: la mitad entre el trazo vecino mas brillante y el fondo,
        # con un piso por encima del fondo. Asi entran los trazos tenues (brazos del K).
        r, fondo, piso = relativo
        loc = cv2.dilate(rec, np.ones((2 * r + 1, 2 * r + 1), np.uint8))
        T = np.maximum(piso, (loc + fondo) / 2.0)
        rec = rec - T + 128.0
        umbral = 128
    up = cv2.resize(rec, None, fx=escala, fy=escala, interpolation=cv2.INTER_CUBIC)
    m = (up > umbral).astype(np.uint8)
    cont, jer = cv2.findContours(m, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_NONE)
    out = []
    f = lambda p: ((p[0] + 0.5) / escala + x0, (p[1] + 0.5) / escala + y0)
    for i, c in enumerate(cont):
        a = cv2.contourArea(c)
        if a < area_min:
            continue
        P = c[:, 0, :].astype(float)
        res = ajustar_cerrado(P, tol=tol, k=k, ang_min=ang_min, sigma_fit=sigma_fit,
                              paso=paso, tol_arco=tol_arco, tol_linea=tol_linea)
        bx, by, bw, bh = cv2.boundingRect(c)
        out.append(dict(
            path=a_path(res, f, escala),
            hole=jer[0][i][3] >= 0,
            bbox=(bx / escala + x0, by / escala + y0, (bx + bw) / escala + x0, (by + bh) / escala + y0),
            area=a / escala / escala,
            tipo=res[0],
            n=(len(res[2]) if res[0] == 'ruta' else 0),
        ))
    return out
