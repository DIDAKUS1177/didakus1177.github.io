// Fondo vectorial de todo el sitio: una luna, un planeta con anillo, estrellas
// que titilan, cometas ocasionales y una ruta punteada. Va fijo y detrás del
// contenido, con trazo fino y muy tenue para respetar la estética minimalista.
// La nave (Nave) vive en otra capa, encima del contenido, porque se puede tocar.
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { NaveTrazo } from './Ilustraciones';

// Ruta de la nave en un lienzo de 1000 x 1000 que se estira a la pantalla.
const RUTA = 'M50,400 C230,300 470,340 650,240 S970,330 900,520 S400,540 240,700 S520,930 910,880';

// [x %, y %, radio, retraso s]
const ESTRELLAS: [number, number, number, number][] = [
  [6, 12, 1.6, 0], [14, 30, 1.2, 1.1], [22, 8, 1.4, 2.3], [31, 22, 1, 0.6], [38, 40, 1.5, 1.8],
  [47, 14, 1.1, 3], [55, 33, 1.6, 0.3], [63, 9, 1.2, 2.1], [71, 26, 1, 1.4], [79, 16, 1.5, 2.8],
  [88, 38, 1.2, 0.9], [94, 11, 1.4, 1.7], [9, 52, 1.3, 2.5], [18, 68, 1, 0.4], [27, 58, 1.5, 1.9],
  [35, 77, 1.2, 3.2], [44, 62, 1, 0.8], [52, 85, 1.5, 2.2], [61, 56, 1.2, 1.3], [69, 72, 1.4, 0.2],
  [77, 63, 1, 2.9], [85, 82, 1.5, 1.6], [93, 59, 1.2, 0.7], [4, 88, 1.4, 2], [13, 94, 1, 3.4],
  [24, 86, 1.2, 1.2], [41, 92, 1.5, 0.1], [58, 96, 1, 2.6], [74, 90, 1.3, 1.5], [90, 94, 1.1, 0.5],
];

// --- La nave ------------------------------------------------------------------
// Dos modos. En "ruta" avanza por la ruta punteada según el scroll. Si la tocas
// da una pirueta con chispas y pasa a "libre": te sigue el cursor (a distancia,
// para no taparlo) hasta que la sueltes con el botón o con Esc, o hasta que dejes
// el mouse quieto unos segundos; entonces vuelve sola a su ruta.
type Modo = 'ruta' | 'libre' | 'vuelta';
type Chispa = { id: number; dx: number; dy: number };

const grados = (r: number) => (r * 180) / Math.PI;
const giroCorto = (de: number, a: number) => ((((a - de) % 360) + 540) % 360) - 180;

function Nave() {
  const ruta = useRef<SVGPathElement>(null);
  const posEl = useRef<HTMLDivElement>(null);
  const rotEl = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const progreso = useSpring(scrollYProgress, { stiffness: 55, damping: 22, mass: 0.6 });

  const est = useRef({ modo: 'ruta' as Modo, x: 0, y: 0, ang: 0, tx: 0, ty: 0, mov: 0, raf: 0 });
  const [libre, setLibre] = useState(false);
  const [girando, setGirando] = useState(false);
  const [encima, setEncima] = useState(false);
  const [chispas, setChispas] = useState<Chispa[]>([]);
  const [lang, setLang] = useState<'es' | 'en'>(document.documentElement.lang === 'en' ? 'en' : 'es');

  useEffect(() => {
    const alCambiar = () => setLang(document.documentElement.lang === 'en' ? 'en' : 'es');
    window.addEventListener('idioma', alCambiar);
    return () => window.removeEventListener('idioma', alCambiar);
  }, []);

  // Punto de la ruta que corresponde a un avance (0 a 1), en pixeles de pantalla
  const puntoRuta = (v: number) => {
    const path = ruta.current;
    if (!path) return null;
    const largo = path.getTotalLength();
    const t = Math.max(0, Math.min(1, v)) * largo;
    const p = path.getPointAtLength(t);
    const a = path.getPointAtLength(Math.max(0, t - 5));
    const b = path.getPointAtLength(Math.min(largo, t + 5));
    const w = window.innerWidth;
    const h = window.innerHeight;
    return {
      x: (p.x / 1000) * w,
      y: (p.y / 1000) * h,
      ang: grados(Math.atan2(((b.y - a.y) / 1000) * h, ((b.x - a.x) / 1000) * w)),
    };
  };

  const pintar = () => {
    const e = est.current;
    if (posEl.current) posEl.current.style.transform = `translate(${e.x}px, ${e.y}px)`;
    if (rotEl.current) rotEl.current.style.transform = `rotate(${e.ang}deg)`;
  };

  const detener = () => cancelAnimationFrame(est.current.raf);

  const bucle = () => {
    const e = est.current;
    if (e.modo === 'libre') {
      // Se coloca a 90 px del cursor, del lado por el que llegó, y lo mira
      const dx = e.x - e.tx;
      const dy = e.y - e.ty;
      const d = Math.hypot(dx, dy) || 1;
      const metaX = e.tx + (dx / d) * 90;
      const metaY = e.ty + (dy / d) * 90;
      e.x += (metaX - e.x) * 0.07;
      e.y += (metaY - e.y) * 0.07;
      const mira = grados(Math.atan2(e.ty - e.y, e.tx - e.x));
      e.ang += giroCorto(e.ang, mira) * 0.1;
      if (performance.now() - e.mov > 9000) volver();
    } else if (e.modo === 'vuelta') {
      const r = puntoRuta(progreso.get());
      if (r) {
        e.x += (r.x - e.x) * 0.08;
        e.y += (r.y - e.y) * 0.08;
        e.ang += giroCorto(e.ang, r.ang) * 0.1;
        if (Math.hypot(r.x - e.x, r.y - e.y) < 6) e.modo = 'ruta';
      } else {
        e.modo = 'ruta';
      }
    }
    pintar();
    if (e.modo !== 'ruta') e.raf = requestAnimationFrame(bucle);
  };

  const volver = () => {
    const e = est.current;
    if (e.modo === 'ruta') return;
    e.modo = 'vuelta';
    setLibre(false);
    detener();
    e.raf = requestAnimationFrame(bucle);
  };

  // Posicion segun el scroll (solo en modo ruta)
  useEffect(() => {
    const colocar = (v: number) => {
      const e = est.current;
      if (e.modo !== 'ruta') return;
      const r = puntoRuta(v);
      if (!r) return;
      e.x = r.x; e.y = r.y; e.ang = r.ang;
      pintar();
    };
    colocar(progreso.get());
    const quitar = progreso.on('change', colocar);
    const alRedimensionar = () => colocar(progreso.get());
    window.addEventListener('resize', alRedimensionar);
    return () => {
      quitar();
      window.removeEventListener('resize', alRedimensionar);
      detener();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progreso]);

  // El cursor (o el dedo) es la meta de la nave en modo libre
  useEffect(() => {
    const mover = (ev: PointerEvent) => {
      const e = est.current;
      e.tx = ev.clientX;
      e.ty = ev.clientY;
      e.mov = performance.now();
    };
    const tecla = (ev: KeyboardEvent) => { if (ev.key === 'Escape') volver(); };
    window.addEventListener('pointermove', mover, { passive: true });
    window.addEventListener('pointerdown', mover, { passive: true });
    window.addEventListener('keydown', tecla);
    return () => {
      window.removeEventListener('pointermove', mover);
      window.removeEventListener('pointerdown', mover);
      window.removeEventListener('keydown', tecla);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const alTocar = () => {
    const e = est.current;
    // Pirueta y chispas
    setGirando(false);
    requestAnimationFrame(() => setGirando(true));
    window.setTimeout(() => setGirando(false), 1000);
    const nuevas = Array.from({ length: 14 }, (_, i) => {
      const a = (i / 14) * Math.PI * 2 + Math.random() * 0.4;
      const r = 40 + Math.random() * 46;
      return { id: performance.now() + i, dx: Math.cos(a) * r, dy: Math.sin(a) * r };
    });
    setChispas(nuevas);
    window.setTimeout(() => setChispas([]), 900);
    // Alterna el modo
    if (e.modo === 'ruta' || e.modo === 'vuelta') {
      e.modo = 'libre';
      e.mov = performance.now();
      if (!e.tx && !e.ty) { e.tx = e.x + 120; e.ty = e.y + 80; }
      setLibre(true);
      detener();
      e.raf = requestAnimationFrame(bucle);
    } else {
      volver();
    }
  };

  const texto = {
    es: { pista: libre ? 'Haz clic para soltarme' : '¡Haz clic y píloteame!', soltar: 'Devolver la nave a su ruta', etiqueta: 'Nave espacial: haz clic para pilotarla' },
    en: { pista: libre ? 'Click to let me go' : 'Click and fly me!', soltar: 'Send the ship back to its route', etiqueta: 'Spaceship: click to fly it' },
  }[lang];

  return (
    <div className="fixed inset-0 z-40 pointer-events-none text-brand">
      {/* Copia invisible de la ruta, para calcular donde va la nave */}
      <svg viewBox="0 0 1000 1000" width="0" height="0" className="absolute" aria-hidden="true">
        <path ref={ruta} d={RUTA} fill="none" />
      </svg>

      <div ref={posEl} className="absolute left-0 top-0 will-change-transform">
        <button
          type="button"
          aria-label={texto.etiqueta}
          onClick={alTocar}
          onPointerEnter={() => setEncima(true)}
          onPointerLeave={() => setEncima(false)}
          className="pointer-events-auto cursor-pointer -translate-x-1/2 -translate-y-1/2 relative w-[96px] h-[64px] flex items-center justify-center bg-transparent border-0 p-0 outline-offset-4"
        >
          <div ref={rotEl} className={`absolute inset-0 flex items-center justify-center ${girando ? 'nave-pirueta' : ''}`}>
            <svg
              viewBox="-40 -26 80 52"
              width="92"
              height="60"
              className={`nave-bob overflow-visible transition-[filter,scale] duration-200 ${encima ? 'scale-[1.18] nave-caliente' : ''}`}
              style={{ opacity: 0.85 }}
            >
              <NaveTrazo />
            </svg>
          </div>
          {chispas.map((c) => (
            <span key={c.id} className="chispa" style={{ ['--dx' as string]: `${c.dx}px`, ['--dy' as string]: `${c.dy}px` }} />
          ))}
        </button>
        {encima && (
          <span className="absolute left-1/2 -translate-x-1/2 -top-12 whitespace-nowrap rounded-full bg-gray-900 text-white dark:bg-white dark:text-gray-900 text-[11px] font-semibold px-3 py-1 shadow-lg pointer-events-none">
            {texto.pista}
          </span>
        )}
      </div>

      {libre && (
        <button
          type="button"
          onClick={volver}
          className="pointer-events-auto fixed bottom-5 left-5 z-50 rounded-full bg-gray-900 text-white dark:bg-white dark:text-gray-900 text-sm font-semibold px-4 py-2 shadow-lg hover:opacity-85 transition-opacity"
        >
          {texto.soltar} · Esc
        </button>
      )}
    </div>
  );
}

// --- Fondo ---------------------------------------------------------------------
export function FondoEspacial() {
  const { scrollYProgress } = useScroll();
  const yLuna = useTransform(scrollYProgress, [0, 1], ['0vh', '-45vh']);
  const yPlaneta = useTransform(scrollYProgress, [0, 1], ['0vh', '-25vh']);

  return (
    <>
      <div aria-hidden="true" className="fixed inset-0 -z-10 overflow-hidden pointer-events-none text-gray-900 dark:text-white">
        {/* Ruta punteada de la nave */}
        <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
          <path
            d={RUTA}
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.13"
            strokeWidth="1.3"
            strokeDasharray="2 10"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* Estrellas */}
        <svg className="absolute inset-0 w-full h-full">
          {ESTRELLAS.map(([x, y, r, d], i) => (
            <circle key={i} className="ilu-titila" cx={`${x}%`} cy={`${y}%`} r={r} fill="currentColor" style={{ animationDelay: `${d}s` }} />
          ))}
        </svg>

        {/* Luna */}
        <motion.div style={{ y: yLuna }} className="absolute right-[5vw] top-[16vh] w-[96px] sm:w-[150px] opacity-[0.55]">
          <svg viewBox="0 0 160 160" className="w-full h-auto" fill="none" stroke="currentColor" strokeWidth="1.3">
            <circle cx="80" cy="80" r="62" fill="currentColor" fillOpacity="0.045" strokeOpacity="0.4" />
            <path d="M80 18a62 62 0 0 1 0 124a46 62 0 0 0 0 -124z" fill="currentColor" fillOpacity="0.06" stroke="none" />
            <circle cx="58" cy="62" r="11" strokeOpacity="0.28" />
            <circle cx="96" cy="100" r="15" strokeOpacity="0.28" />
            <circle cx="104" cy="50" r="6" strokeOpacity="0.28" />
            <circle cx="62" cy="108" r="5" strokeOpacity="0.28" />
          </svg>
        </motion.div>

        {/* Planeta con anillo */}
        <motion.div style={{ y: yPlaneta }} className="absolute left-[4vw] top-[62vh] w-[110px] sm:w-[170px] opacity-[0.45]">
          <svg viewBox="0 0 200 140" className="w-full h-auto" fill="none" stroke="currentColor" strokeWidth="1.3">
            <circle cx="100" cy="70" r="38" fill="currentColor" fillOpacity="0.045" strokeOpacity="0.4" />
            <path d="M70 58q30 10 60 0M66 76q34 12 68 0" strokeOpacity="0.22" />
            <ellipse cx="100" cy="70" rx="86" ry="20" transform="rotate(-16 100 70)" strokeOpacity="0.4" />
          </svg>
        </motion.div>

        {/* Cometas ocasionales */}
        <span className="cometa" style={{ top: '14%', animationDelay: '2s' }} />
        <span className="cometa" style={{ top: '48%', animationDelay: '9s', animationDuration: '13s' }} />
      </div>

      <Nave />
    </>
  );
}
