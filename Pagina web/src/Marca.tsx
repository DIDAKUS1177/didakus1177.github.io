// Logo de Didakus como componentes SVG. Los colores salen de las variables
// --dk-* de index.css, que cambian con el tema: en oscuro el azul sube de tono
// para no perderse sobre el fondo casi negro.
import { useId } from 'react';
import { LK_A, LK_CAJA, LK_DID, LK_KUS, LK_MONO, MONO_CAJA, MONO_D } from './marca/trazos';

const parada = (o: number, v: string) => <stop key={v} offset={o} style={{ stopColor: `var(${v})` }} />;

const PARADAS_MONO: [number, string][] = [
  [0, '--dk-1'], [0.38, '--dk-2'], [0.5, '--dk-3'], [0.58, '--dk-4'], [0.72, '--dk-5'], [1, '--dk-6'],
];
const PARADAS_A: [number, string][] = [
  [0, '--dk-a1'], [0.3, '--dk-a2'], [0.5, '--dk-a3'], [0.75, '--dk-a4'], [1, '--dk-a5'],
];

type Props = { className?: string; titulo?: string };

const accesible = (titulo?: string) =>
  titulo ? { role: 'img' as const, 'aria-label': titulo } : { 'aria-hidden': true as const };

// Monograma DK: la marca sola, para la barra superior y los avatares.
export function Monograma({ className = '', titulo }: Props) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox={MONO_CAJA} className={className} focusable="false" {...accesible(titulo)}>
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="320" y1="0" x2="699" y2="0">
          {PARADAS_MONO.map(([o, v]) => parada(o, v))}
        </linearGradient>
      </defs>
      <path fill={`url(#${id})`} fillRule="evenodd" d={MONO_D} />
    </svg>
  );
}

// Logo horizontal sin subtitulo (el subtitulo no se lee por debajo de ~300 px).
export function LogoDidakus({ className = '', titulo }: Props) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox={LK_CAJA} className={className} focusable="false" {...accesible(titulo)}>
      <defs>
        <linearGradient id={`${id}m`} gradientUnits="userSpaceOnUse" x1="144" y1="0" x2="299" y2="0">
          {PARADAS_MONO.map(([o, v]) => parada(o, v))}
        </linearGradient>
        <linearGradient id={`${id}a`} gradientUnits="userSpaceOnUse" x1="533" y1="0" x2="614" y2="0">
          {PARADAS_A.map(([o, v]) => parada(o, v))}
        </linearGradient>
      </defs>
      <path fill={`url(#${id}m)`} fillRule="evenodd" d={LK_MONO} />
      <g transform="translate(0 8.5)">
        <path style={{ fill: 'var(--dk-did)' }} fillRule="evenodd" d={LK_DID} />
        <path fill={`url(#${id}a)`} fillRule="evenodd" d={LK_A} />
        <path style={{ fill: 'var(--dk-kus)' }} fillRule="evenodd" d={LK_KUS} />
      </g>
    </svg>
  );
}
