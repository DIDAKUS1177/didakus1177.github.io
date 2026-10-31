// Disparos y asteroides. Todo se dibuja en un solo <canvas> que va encima del
// contenido (y debajo de la barra superior), sin recibir clics: de vez en cuando
// cruza un asteroide y, si un disparo le atina, explota. Con la pantalla vacía no
// corre ningún cuadro de animación; el lienzo solo trabaja mientras hay algo que mover.

export type EstadoNave = { x: number; y: number; ang: number }; // ang en grados, hacia donde mira

export type Combate = {
  /** Grados hacia donde saldría un disparo al hacer clic en (cx, cy). */
  apuntar: (cx: number, cy: number) => number;
  disparar: (cx: number, cy: number) => void;
  lanzarAsteroide: () => void;
  /** Foto del estado, para revisar el comportamiento desde la consola. */
  estado: () => { rocas: { x: number; y: number; r: number }[]; balas: number; particulas: number };
  destruir: () => void;
};

type Opciones = {
  lienzo: HTMLCanvasElement;
  nave: () => EstadoNave;
  pausado: () => boolean;
  alCambiar?: (asteroides: number) => void;
};

type Bala = { x: number; y: number; px: number; py: number; vx: number; vy: number; vida: number };
type Roca = {
  x: number; y: number; vx: number; vy: number; r: number; rot: number; vrot: number;
  forma: [number, number][];            // [angulo, factor de radio] de cada vertice
  crateres: [number, number, number][]; // [angulo, distancia, radio] relativos a r
  edad: number;
};
type Tipo = 'chispa' | 'trozo' | 'anillo' | 'destello' | 'fogonazo';
type Particula = {
  tipo: Tipo; x: number; y: number; vx: number; vy: number; vida: number; max: number;
  r: number; r0: number; rot: number; vrot: number; c: number; pts?: [number, number][];
};

const TAU = Math.PI * 2;
const VEL_BALA = 1700;  // px por segundo
const LARGO_BALA = 34;
const NARIZ = 36;       // de la nave a su punta, en px
const MAX_ROCAS = 2;
const AYUDA = 38;       // un clic a menos de r + AYUDA de un asteroide manda la bala a su encuentro

// Colores como "r,g,b" para poder darles transparencia. En oscuro todo suma luz.
const PALETA = {
  claro: {
    roca: '51,65,85', halo: '255,255,255', bala: '13,148,136', nucleo: '29,78,216', anillo: '29,78,216', destello: '29,78,216',
    chispas: ['13,148,136', '29,78,216', '8,145,178', '180,83,9'], aditivo: false,
  },
  oscuro: {
    roca: '203,213,225', halo: '11,20,38', bala: '94,234,212', nucleo: '255,255,255', anillo: '103,232,249', destello: '103,232,249',
    chispas: ['94,234,212', '103,232,249', '255,255,255', '251,191,36'], aditivo: true,
  },
};

const rgba = (rgb: string, a: number) => `rgba(${rgb},${a})`;
const suave = (t: number) => 1 - (1 - t) * (1 - t);
const azar = (a: number, b: number) => a + Math.random() * (b - a);

function distSegmento(cx: number, cy: number, ax: number, ay: number, bx: number, by: number) {
  const dx = bx - ax;
  const dy = by - ay;
  const l2 = dx * dx + dy * dy;
  const t = l2 ? Math.max(0, Math.min(1, ((cx - ax) * dx + (cy - ay) * dy) / l2)) : 0;
  return Math.hypot(cx - (ax + t * dx), cy - (ay + t * dy));
}

// Tiempo en que una bala que sale de (ox, oy) alcanza a una roca que se mueve; null si no la alcanza.
function interceptar(ox: number, oy: number, r: Roca, vel: number) {
  const dx = r.x - ox;
  const dy = r.y - oy;
  const a = r.vx * r.vx + r.vy * r.vy - vel * vel;
  const b = 2 * (dx * r.vx + dy * r.vy);
  const c = dx * dx + dy * dy;
  if (Math.abs(a) < 1e-6) return b !== 0 && -c / b > 0 ? -c / b : null;
  const disc = b * b - 4 * a * c;
  if (disc < 0) return null;
  const s = Math.sqrt(disc);
  const t = [(-b - s) / (2 * a), (-b + s) / (2 * a)].filter((v) => v > 0).sort((p, q) => p - q)[0];
  return t === undefined ? null : t;
}

export function crearCombate(opc: Opciones): Combate {
  const { lienzo } = opc;
  const ctx = lienzo.getContext('2d') as CanvasRenderingContext2D;
  let ancho = 0;
  let alto = 0;
  const balas: Bala[] = [];
  const rocas: Roca[] = [];
  const parts: Particula[] = [];
  let raf = 0;
  let ultimo = 0;
  let temporizador = 0;
  let proximo = 0;           // cuando toca el siguiente asteroide (ms)
  let ultimoLanzamiento = 0;
  let reportados = 0;

  const medir = () => {
    const dpr = Math.min(1.75, window.devicePixelRatio || 1);
    ancho = lienzo.clientWidth;
    alto = lienzo.clientHeight;
    lienzo.width = Math.round(ancho * dpr);
    lienzo.height = Math.round(alto * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const avisar = () => {
    if (rocas.length !== reportados) {
      reportados = rocas.length;
      opc.alCambiar?.(reportados);
    }
  };

  const fuera = (x: number, y: number, m: number) => x < -m || x > ancho + m || y < -m || y > alto + m;

  // --- Disparo -----------------------------------------------------------------
  // Origen en la punta de la nave y direccion hacia el clic. Si el clic cae junto a
  // un asteroide, la bala va a donde estara cuando llegue: asi atinar no depende de
  // calcular la ventaja a ojo.
  const objetivo = (cx: number, cy: number) => {
    const n = opc.nave();
    let ang = Math.atan2(cy - n.y, cx - n.x);
    let ox = n.x + Math.cos(ang) * NARIZ;
    let oy = n.y + Math.sin(ang) * NARIZ;
    let cerca: Roca | null = null;
    let mejor = Infinity;
    for (const r of rocas) {
      const d = Math.hypot(cx - r.x, cy - r.y);
      if (d < r.r + AYUDA && d < mejor) { mejor = d; cerca = r; }
    }
    if (cerca) {
      const t = interceptar(ox, oy, cerca, VEL_BALA);
      if (t !== null) {
        ang = Math.atan2(cerca.y + cerca.vy * t - n.y, cerca.x + cerca.vx * t - n.x);
        ox = n.x + Math.cos(ang) * NARIZ;
        oy = n.y + Math.sin(ang) * NARIZ;
      }
    }
    return { ang, ox, oy };
  };

  const disparar = (cx: number, cy: number) => {
    if (opc.pausado() || !ancho) return;
    const { ang, ox, oy } = objetivo(cx, cy);
    balas.push({ x: ox, y: oy, px: ox, py: oy, vx: Math.cos(ang) * VEL_BALA, vy: Math.sin(ang) * VEL_BALA, vida: 1.7 });
    parts.push({ tipo: 'fogonazo', x: ox, y: oy, vx: 0, vy: 0, vida: 0.11, max: 0.11, r: 17, r0: 0, rot: 0, vrot: 0, c: 0 });
    acelerar();
    encender();
  };

  // --- Asteroides ---------------------------------------------------------------
  const lanzar = () => {
    if (!ancho || rocas.length >= MAX_ROCAS) return;
    const esc = Math.max(0.8, Math.min(1.15, ancho / 1280));
    const r = azar(24, 44) * esc;
    const m = r + 36;
    const lado = Math.random(); // izquierda, derecha o desde arriba
    let x: number, y: number, tx: number, ty: number;
    if (lado < 0.38) {
      x = -m; y = alto * azar(0.12, 0.8); tx = ancho + m; ty = alto * azar(0.1, 0.9);
    } else if (lado < 0.76) {
      x = ancho + m; y = alto * azar(0.12, 0.8); tx = -m; ty = alto * azar(0.1, 0.9);
    } else {
      x = ancho * azar(0.12, 0.88); y = -m; tx = ancho * azar(0.1, 0.9); ty = alto + m;
    }
    const d = Math.hypot(tx - x, ty - y);
    const v = Math.max(48, Math.min(165, d / azar(9, 15)));
    const n = 9 + Math.floor(Math.random() * 4);
    const forma = Array.from({ length: n }, (_, i): [number, number] => [(i / n) * TAU + azar(-0.15, 0.15), azar(0.78, 1.14)]);
    const crateres = Array.from({ length: 2 + Math.floor(Math.random() * 2) }, (): [number, number, number] => [
      Math.random() * TAU, azar(0.18, 0.56), azar(0.1, 0.2),
    ]);
    rocas.push({
      x, y, vx: ((tx - x) / d) * v, vy: ((ty - y) / d) * v, r,
      rot: Math.random() * TAU, vrot: azar(-0.45, 0.45), forma, crateres, edad: 0,
    });
    ultimoLanzamiento = Date.now();
    avisar();
    encender();
  };

  const programar = (ms: number) => {
    window.clearTimeout(temporizador);
    proximo = Date.now() + ms;
    temporizador = window.setTimeout(() => {
      if (!document.hidden && !opc.pausado()) lanzar();
      programar(azar(18000, 35000));
    }, ms);
  };

  // Quien dispara quiere ver mas: si no hay asteroides, el siguiente llega pronto.
  const acelerar = () => {
    if (rocas.length > 0 || Date.now() - ultimoLanzamiento < 9000) return;
    if (proximo - Date.now() > 5500) programar(azar(2600, 4400));
  };

  const explotar = (ro: Roca) => {
    const nueva = (p: Partial<Particula> & { tipo: Tipo; vida: number }): Particula => ({
      x: ro.x, y: ro.y, vx: 0, vy: 0, max: p.vida, r: 0, r0: 0, rot: 0, vrot: 0, c: 0, ...p,
    });
    parts.push(nueva({ tipo: 'destello', vida: 0.28, r: ro.r * 2.7 }));
    parts.push(nueva({ tipo: 'anillo', vida: 0.66, r0: ro.r * 0.5, r: ro.r * 3.1 }));
    parts.push(nueva({ tipo: 'anillo', vida: 0.44, r0: ro.r * 0.3, r: ro.r * 1.9 }));
    const chispas = Math.round(16 + ro.r * 0.6);
    for (let i = 0; i < chispas; i++) {
      const a = Math.random() * TAU;
      const v = azar(150, 400);
      parts.push(nueva({
        tipo: 'chispa', vida: azar(0.45, 0.95), vx: Math.cos(a) * v + ro.vx * 0.3, vy: Math.sin(a) * v + ro.vy * 0.3,
        c: Math.floor(Math.random() * 4),
      }));
    }
    // Pedazos de la roca: cada triangulo de centro a dos vertices sale disparado hacia afuera
    const m = ro.forma.length;
    for (let i = 0; i < m; i++) {
      const [a0, k0] = ro.forma[i];
      const [a1, k1] = ro.forma[(i + 1) % m];
      const x0 = Math.cos(a0 + ro.rot) * ro.r * k0;
      const y0 = Math.sin(a0 + ro.rot) * ro.r * k0;
      const x1 = Math.cos(a1 + ro.rot) * ro.r * k1;
      const y1 = Math.sin(a1 + ro.rot) * ro.r * k1;
      const gx = (x0 + x1) / 3;
      const gy = (y0 + y1) / 3;
      const dir = Math.atan2(gy, gx);
      const v = azar(70, 230);
      const vida = azar(0.9, 1.6);
      parts.push(nueva({
        tipo: 'trozo', x: ro.x + gx, y: ro.y + gy, vida, vx: Math.cos(dir) * v + ro.vx * 0.4, vy: Math.sin(dir) * v + ro.vy * 0.4,
        vrot: azar(-7, 7), pts: [[-gx, -gy], [x0 - gx, y0 - gy], [x1 - gx, y1 - gy]],
      }));
    }
  };

  // --- Bucle ---------------------------------------------------------------------
  const actualizar = (dt: number) => {
    for (let i = balas.length - 1; i >= 0; i--) {
      const b = balas[i];
      b.px = b.x; b.py = b.y;
      b.x += b.vx * dt; b.y += b.vy * dt;
      b.vida -= dt;
      let golpe = false;
      for (let j = rocas.length - 1; j >= 0; j--) {
        const ro = rocas[j];
        if (distSegmento(ro.x, ro.y, b.px, b.py, b.x, b.y) < ro.r * 0.95 + 3) {
          explotar(ro);
          rocas.splice(j, 1);
          golpe = true;
          break;
        }
      }
      if (golpe || b.vida <= 0 || fuera(b.x, b.y, 90)) balas.splice(i, 1);
    }
    for (let i = rocas.length - 1; i >= 0; i--) {
      const ro = rocas[i];
      ro.x += ro.vx * dt; ro.y += ro.vy * dt; ro.rot += ro.vrot * dt; ro.edad += dt;
      if (ro.edad > 1 && fuera(ro.x, ro.y, ro.r + 80)) rocas.splice(i, 1);
    }
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.vida -= dt;
      if (p.vida <= 0) { parts.splice(i, 1); continue; }
      if (p.tipo === 'chispa' || p.tipo === 'trozo') {
        const f = Math.exp(-(p.tipo === 'chispa' ? 3.2 : 1.5) * dt);
        p.vx *= f; p.vy *= f;
        p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vrot * dt;
      }
    }
    avisar();
  };

  const dibujarRoca = (ro: Roca, P: typeof PALETA.claro) => {
    ctx.save();
    ctx.translate(ro.x, ro.y);
    ctx.rotate(ro.rot);
    ctx.beginPath();
    ro.forma.forEach(([a, k], i) => {
      const px = Math.cos(a) * ro.r * k;
      const py = Math.sin(a) * ro.r * k;
      if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py);
    });
    ctx.closePath();
    ctx.fillStyle = rgba(P.roca, 0.12);
    ctx.fill();
    ctx.lineJoin = 'round';
    // Un halo del color contrario separa el trazo de lo que haya detras (fotos, texto)
    ctx.lineWidth = 4.4;
    ctx.strokeStyle = rgba(P.halo, 0.5);
    ctx.stroke();
    ctx.lineWidth = 2;
    ctx.strokeStyle = rgba(P.roca, 0.9);
    ctx.stroke();
    ctx.lineWidth = 1.4;
    ctx.strokeStyle = rgba(P.roca, 0.42);
    for (const [a, d, k] of ro.crateres) {
      ctx.beginPath();
      ctx.arc(Math.cos(a) * d * ro.r, Math.sin(a) * d * ro.r, k * ro.r, 0, TAU);
      ctx.stroke();
    }
    ctx.restore();
  };

  const dibujarBala = (b: Bala, P: typeof PALETA.claro) => {
    const v = Math.hypot(b.vx, b.vy) || 1;
    const x0 = b.x - (b.vx / v) * LARGO_BALA;
    const y0 = b.y - (b.vy / v) * LARGO_BALA;
    const g = ctx.createLinearGradient(x0, y0, b.x, b.y);
    g.addColorStop(0, rgba(P.bala, 0));
    g.addColorStop(1, rgba(P.bala, 1));
    ctx.lineCap = 'round';
    ctx.lineWidth = 2.6;
    ctx.strokeStyle = g;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
    ctx.fillStyle = rgba(P.nucleo, 1);
    ctx.beginPath();
    ctx.arc(b.x, b.y, 2.2, 0, TAU);
    ctx.fill();
  };

  const dibujarParticula = (p: Particula, P: typeof PALETA.claro) => {
    const k = p.vida / p.max; // 1 al nacer, 0 al morir
    if (p.tipo === 'trozo') {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = Math.min(1, k * 1.5);
      ctx.beginPath();
      p.pts!.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.closePath();
      ctx.fillStyle = rgba(P.roca, 0.1);
      ctx.fill();
      ctx.lineJoin = 'round';
      ctx.lineWidth = 1.4;
      ctx.strokeStyle = rgba(P.roca, 0.8);
      ctx.stroke();
      ctx.restore();
      return;
    }
    ctx.globalCompositeOperation = P.aditivo ? 'lighter' : 'source-over';
    if (p.tipo === 'destello' || p.tipo === 'fogonazo') {
      const rad = p.tipo === 'destello' ? p.r * (0.45 + 0.55 * (1 - k)) : p.r * (0.6 + 0.4 * (1 - k));
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad);
      const col = p.tipo === 'destello' ? P.destello : P.bala;
      g.addColorStop(0, rgba(col, (p.tipo === 'destello' ? 0.6 : 0.85) * k));
      g.addColorStop(1, rgba(col, 0));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, rad, 0, TAU);
      ctx.fill();
    } else if (p.tipo === 'anillo') {
      const rad = p.r0 + (p.r - p.r0) * suave(1 - k);
      ctx.globalAlpha = k * 0.9;
      ctx.lineWidth = 0.8 + 2.4 * k;
      ctx.strokeStyle = rgba(P.anillo, 1);
      ctx.beginPath();
      ctx.arc(p.x, p.y, rad, 0, TAU);
      ctx.stroke();
    } else {
      ctx.globalAlpha = Math.min(1, k * 1.4);
      ctx.lineCap = 'round';
      ctx.lineWidth = 1.8;
      ctx.strokeStyle = rgba(P.chispas[p.c], 1);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - p.vx * 0.045, p.y - p.vy * 0.045);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  };

  const dibujar = () => {
    ctx.clearRect(0, 0, ancho, alto);
    const P = document.documentElement.classList.contains('dark') ? PALETA.oscuro : PALETA.claro;
    for (const ro of rocas) dibujarRoca(ro, P);
    if (balas.length) {
      ctx.globalCompositeOperation = P.aditivo ? 'lighter' : 'source-over';
      ctx.shadowColor = rgba(P.bala, 0.9);
      ctx.shadowBlur = P.aditivo ? 12 : 4;
      for (const b of balas) dibujarBala(b, P);
      ctx.shadowBlur = 0;
      ctx.globalCompositeOperation = 'source-over';
    }
    for (const p of parts) dibujarParticula(p, P);
  };

  const vaciar = () => {
    balas.length = 0; rocas.length = 0; parts.length = 0;
    ctx.clearRect(0, 0, ancho, alto);
    avisar();
  };

  const paso = (t: number) => {
    raf = 0;
    // El primer cuadro puede traer una marca de tiempo anterior a la de "ultimo"
    const dt = Math.max(0.001, Math.min(0.08, (t - ultimo) / 1000 || 0.016));
    ultimo = t;
    if (opc.pausado()) { vaciar(); return; }
    actualizar(dt);
    dibujar();
    if (balas.length || rocas.length || parts.length) raf = requestAnimationFrame(paso);
    else ctx.clearRect(0, 0, ancho, alto);
  };

  const encender = () => {
    if (raf) return;
    ultimo = performance.now();
    raf = requestAnimationFrame(paso);
  };

  medir();
  window.addEventListener('resize', medir);
  programar(azar(6500, 10000)); // el primero llega pronto, para que se note

  const api: Combate = {
    apuntar: (cx, cy) => (objetivo(cx, cy).ang * 180) / Math.PI,
    disparar,
    lanzarAsteroide: lanzar,
    estado: () => ({ rocas: rocas.map((r) => ({ x: r.x, y: r.y, r: r.r })), balas: balas.length, particulas: parts.length }),
    destruir: () => {
      window.clearTimeout(temporizador);
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', medir);
      vaciar();
    },
  };
  (lienzo as unknown as Record<string, unknown>).__combate = api;
  return api;
}
