// Fondo vectorial de todo el sitio: una nave que viaja por la pantalla
// siguiendo el scroll (sobre una ruta punteada), una luna, un planeta con
// anillo, estrellas que titilan y cometas ocasionales. Va fijo y detrás del
// contenido, con trazo fino y muy tenue para respetar la estética minimalista.
import { useEffect, useRef } from 'react';
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

export function FondoEspacial() {
  const ruta = useRef<SVGPathElement>(null);
  const nave = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const progreso = useSpring(scrollYProgress, { stiffness: 55, damping: 22, mass: 0.6 });
  const yLuna = useTransform(scrollYProgress, [0, 1], ['0vh', '-45vh']);
  const yPlaneta = useTransform(scrollYProgress, [0, 1], ['0vh', '-25vh']);

  useEffect(() => {
    const colocar = (v: number) => {
      const path = ruta.current;
      const el = nave.current;
      if (!path || !el) return;
      const largo = path.getTotalLength();
      const t = Math.max(0, Math.min(1, v)) * largo;
      const p = path.getPointAtLength(t);
      const a = path.getPointAtLength(Math.max(0, t - 5));
      const b = path.getPointAtLength(Math.min(largo, t + 5));
      const w = window.innerWidth;
      const h = window.innerHeight;
      const grados = (Math.atan2(((b.y - a.y) / 1000) * h, ((b.x - a.x) / 1000) * w) * 180) / Math.PI;
      el.style.transform = `translate(${(p.x / 1000) * w}px, ${(p.y / 1000) * h}px) rotate(${grados}deg)`;
    };
    colocar(progreso.get());
    const quitar = progreso.on('change', colocar);
    const alRedimensionar = () => colocar(progreso.get());
    window.addEventListener('resize', alRedimensionar);
    return () => {
      quitar();
      window.removeEventListener('resize', alRedimensionar);
    };
  }, [progreso]);

  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10 overflow-hidden pointer-events-none text-gray-900 dark:text-white">
      {/* Ruta punteada de la nave */}
      <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
        <path
          ref={ruta}
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
          <path d="M44 86a38 38 0 0 0 56 22" strokeOpacity="0" />
        </svg>
      </motion.div>

      {/* Cometas ocasionales */}
      <span className="cometa" style={{ top: '14%', animationDelay: '2s' }} />
      <span className="cometa" style={{ top: '48%', animationDelay: '9s', animationDuration: '13s' }} />

      {/* Nave */}
      <div ref={nave} className="absolute left-0 top-0 will-change-transform">
        <svg viewBox="-40 -26 80 52" width="92" height="60" className="nave-bob -translate-x-1/2 -translate-y-1/2 text-brand overflow-visible" style={{ opacity: 0.8 }}>
          <NaveTrazo />
        </svg>
      </div>
    </div>
  );
}
