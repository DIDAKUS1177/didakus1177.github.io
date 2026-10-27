// Ilustraciones vectoriales animadas de "Cómo trabajo", una por paso. Todo es
// SVG con el color de la marca (currentColor); las animaciones están en
// index.css (clases ilu-*) y se detienen con el botón de pausa.
import type { CSSProperties } from 'react';

const retraso = (s: number): CSSProperties => ({ animationDelay: `${s}s` });
const bloque = (s: number): CSSProperties => ({ ['--d' as string]: `${s}s` });

// Cohete pequeño de perfil (apunta a la derecha), para reutilizarlo.
export const NaveTrazo = () => (
  <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
    <path d="M30 0C18 10 -6 10 -16 6V-6C-6 -10 18 -10 30 0Z" fill="currentColor" fillOpacity=".14" />
    <circle cx="9" cy="0" r="4.2" />
    <path d="M-6 -8L-20 -19L-15 -6Z" fill="currentColor" fillOpacity=".14" />
    <path d="M-6 8L-20 19L-15 6Z" fill="currentColor" fillOpacity=".14" />
    <path className="ilu-llama-h" d="M-16 -4Q-38 0 -16 4Z" fill="currentColor" fillOpacity=".55" stroke="none" />
  </g>
);

const Diagnostico = () => (
  <>
    {/* Pregunta */}
    <g className="ilu-aparece">
      <rect x="14" y="12" width="112" height="46" rx="14" fill="currentColor" fillOpacity=".08" />
      <path d="M34 58l-6 12 20-12" fill="currentColor" fillOpacity=".08" />
      {[46, 62, 78].map((x, i) => (
        <circle key={x} className="ilu-punto" cx={x} cy="35" r="3.4" fill="currentColor" stroke="none" style={retraso(i * 0.18)} />
      ))}
    </g>
    {/* Respuesta */}
    <g className="ilu-aparece" style={retraso(1.4)}>
      <rect x="112" y="64" width="114" height="46" rx="14" fill="currentColor" fillOpacity=".2" />
      <path d="M200 110l6 10-20-10" fill="currentColor" fillOpacity=".2" />
      <path d="M128 80h64M128 94h40" strokeOpacity=".75" />
    </g>
    {/* Idea */}
    <g className="ilu-pulso" style={retraso(2.4)}>
      <circle cx="196" cy="26" r="11" />
      <path d="M191 39h10M193 44h6" />
      <path d="M196 6v-4M180 12l-3-3M212 12l3-3M174 26h-4M222 26h4" strokeOpacity=".6" />
    </g>
  </>
);

const Propuesta = () => (
  <>
    <rect x="72" y="8" width="96" height="104" rx="10" fill="currentColor" fillOpacity=".08" />
    <path className="ilu-trazo" d="M88 30h48" />
    <path className="ilu-trazo" d="M88 46h64" style={retraso(0.5)} />
    <path className="ilu-trazo" d="M88 62h56" style={retraso(1)} />
    <g className="ilu-sello">
      <circle cx="150" cy="92" r="16" fill="currentColor" stroke="none" />
      <path d="M142 92l6 6 11-12" stroke="#fff" strokeWidth="2.4" />
    </g>
    {/* Precio */}
    <g className="ilu-flota">
      <rect x="14" y="44" width="42" height="26" rx="8" fill="currentColor" fillOpacity=".16" />
      <text x="35" y="62" textAnchor="middle" fontSize="16" fontWeight="700" fill="currentColor" stroke="none">$</text>
    </g>
    {/* Tiempo */}
    <g className="ilu-flota" style={retraso(-2)}>
      <rect x="186" y="34" width="40" height="38" rx="7" />
      <path d="M186 46h40M196 29v8M216 29v8" />
      <path d="M196 58h6M208 58h6" strokeOpacity=".7" />
    </g>
  </>
);

const Construccion = () => (
  <>
    <path d="M24 108h192" strokeOpacity=".5" />
    {/* Base */}
    {[36, 88, 140].map((x, i) => (
      <rect key={x} className="ilu-bloque" x={x} y="84" width="48" height="22" rx="4" fill="currentColor" fillOpacity=".16" style={bloque(i * 0.8)} />
    ))}
    {/* Segundo piso */}
    {[62, 114].map((x, i) => (
      <rect key={x} className="ilu-bloque" x={x} y="58" width="48" height="22" rx="4" fill="currentColor" fillOpacity=".24" style={bloque(2.5 + i * 0.8)} />
    ))}
    {/* Cima */}
    <rect className="ilu-bloque" x="88" y="32" width="48" height="22" rx="4" fill="currentColor" fillOpacity=".34" style={bloque(4.2)} />
    {/* Código */}
    <text x="196" y="52" textAnchor="middle" fontSize="20" fontWeight="700" fill="currentColor" stroke="none" opacity=".55">{'</>'}</text>
    <rect className="ilu-cursor" x="186" y="62" width="20" height="3" rx="1.5" fill="currentColor" stroke="none" />
    <path className="ilu-titila" d="M20 24l3 6 6 3-6 3-3 6-3-6-6-3 6-3z" fill="currentColor" stroke="none" style={retraso(0.5)} />
  </>
);

const Entrega = () => (
  <>
    {/* Estrellas */}
    {[[26, 22], [214, 18], [196, 96], [44, 96]].map(([x, y], i) => (
      <circle key={i} className="ilu-titila" cx={x} cy={y} r="1.8" fill="currentColor" stroke="none" style={retraso(i * 0.6)} />
    ))}
    {/* Plataforma */}
    <path d="M70 110h100" strokeOpacity=".6" />
    <path d="M96 110l8-12h32l8 12" strokeOpacity=".6" />
    {/* Cohete que despega */}
    <g className="ilu-despega">
      <path d="M120 12c14 14 14 38 10 54h-20c-4-16-4-40 10-54z" fill="currentColor" fillOpacity=".14" />
      <circle cx="120" cy="38" r="6" />
      <path d="M110 56l-14 16 14-6zM130 56l14 16-14-6z" fill="currentColor" fillOpacity=".14" />
      <path className="ilu-llama" d="M114 70q6 22 12 0z" fill="currentColor" fillOpacity=".55" stroke="none" />
    </g>
    {/* Documentación */}
    <g className="ilu-flota">
      <rect x="18" y="46" width="40" height="52" rx="6" fill="currentColor" fillOpacity=".1" />
      <path d="M26 60h24M26 70h24M26 80h14" strokeOpacity=".7" />
    </g>
    {/* Sin dependencia: escudo */}
    <g className="ilu-flota" style={retraso(-2)}>
      <path d="M198 42l22 8v16c0 16-10 26-22 32-12-6-22-16-22-32V50z" fill="currentColor" fillOpacity=".12" />
      <path d="M189 68l6 6 11-12" />
    </g>
  </>
);

const PASOS = [Diagnostico, Propuesta, Construccion, Entrega];

export function IlustracionPaso({ n }: { n: number }) {
  const Paso = PASOS[n % PASOS.length];
  return (
    <svg
      viewBox="0 0 240 120"
      className="w-full h-auto text-brand overflow-visible"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <Paso />
    </svg>
  );
}
