/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  Bot, 
  Database, 
  Mail, 
  MessageCircle,
  User,
  Zap, 
  Cpu, 
  FileJson, 
  LineChart, 
  ChevronRight, 
  ChevronLeft,
  Languages,
  Linkedin,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Activity,
  TrendingUp,
  Target,
  ShieldCheck,
  Lightbulb,
  Github,
  Loader2,
  Code,
  Plus,
  Sun,
  Moon
} from 'lucide-react';
import {
  Area} from 'recharts';

import { translations } from './translations';

// Cargados en diferido: Recharts y PapaParse pesan mas que todo el resto
// del sitio junto, y solo hacen falta al llegar a la analitica o al Data Lab.
const Resume = React.lazy(() => import('./Resume').then(m => ({ default: m.Resume })));
const ParetoChartComponent = React.lazy(() => import('./charts').then(m => ({ default: m.ParetoChartComponent })));
const IshikawaDiagram = React.lazy(() => import('./charts').then(m => ({ default: m.IshikawaDiagram })));
const RadarChartComponent = React.lazy(() => import('./charts').then(m => ({ default: m.RadarChartComponent })));
const TrendChartComponent = React.lazy(() => import('./charts').then(m => ({ default: m.TrendChartComponent })));
const LiveDashboard = React.lazy(() => import('./charts').then(m => ({ default: m.LiveDashboard })));
const DataAnalyzer = React.lazy(() => import('./charts').then(m => ({ default: m.DataAnalyzer })));
import { WORLD_PATH } from './data/worldMap';

// --- Translations ---

const CONTACT_WEBHOOK_URL = import.meta.env.VITE_CONTACT_WEBHOOK_URL as string | undefined;

// --- Palabra motivacional rotativa del inicio ---
const MOTIVATION = {
  es: ['INNOVAR', 'AUTOMATIZAR', 'OPTIMIZAR', 'PREDECIR', 'TRANSFORMAR'],
  en: ['INNOVATE', 'AUTOMATE', 'OPTIMIZE', 'PREDICT', 'TRANSFORM'],
};

const RotatingWord = ({ lang }: { lang: 'es' | 'en' }) => {
  const words = MOTIVATION[lang];
  const [i, setI] = useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => setI((p) => (p + 1) % words.length), 2600);
    return () => clearInterval(timer);
  }, [words.length]);

  return (
    <div className="flex items-center justify-center gap-3 h-12 mb-2 overflow-hidden">
      <span className="h-px w-10 bg-brand/50" />
      <AnimatePresence mode="wait">
        <motion.span
          key={`${lang}-${i}`}
          initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -24, filter: 'blur(6px)' }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="text-2xl md:text-4xl font-black text-brand tracking-[0.2em]"
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
      <span className="h-px w-10 bg-brand/50" />
    </div>
  );
};

// --- Proyectos ---
// `shots` = número de capturas disponibles en /proyectos/{id}/{1..n}.webp
// Para añadir una imagen: colócala como el siguiente número y sube `shots`.
interface Project {
  id: string;
  shots: number;
  title: string;
  client: string;
  country: 'España' | 'México' | 'Colombia';
  city: string;
  desc: { es: string; en: string };
  tags: string[];
}

const COUNTRIES = ['España', 'México', 'Colombia'] as const;

// Banderas dibujadas como SVG: Windows no trae los glifos de emoji de bandera
// y los renderiza como las dos letras del país ("ES" en vez de 🇪🇸).
const Flag = ({ country, className = 'w-9' }: { country: string; className?: string }) => {
  const shell = `${className} inline-block rounded-[3px] ring-1 ring-black/15 dark:ring-white/25 shadow-sm align-middle`;

  if (country === 'España') {
    return (
      <svg viewBox="0 0 90 60" className={shell} role="img" aria-label="Bandera de España">
        <rect width="90" height="60" fill="#AA151B" />
        <rect y="15" width="90" height="30" fill="#F1BF00" />
      </svg>
    );
  }

  if (country === 'México') {
    return (
      <svg viewBox="0 0 105 60" className={shell} role="img" aria-label="Bandera de México">
        <rect width="105" height="60" fill="#CE1126" />
        <rect width="70" height="60" fill="#FFFFFF" />
        <rect width="35" height="60" fill="#006847" />
        {/* Emblema simplificado: sin él se confunde con la bandera de Italia */}
        <circle cx="52.5" cy="30" r="8.5" fill="none" stroke="#8C6239" strokeWidth="1.8" />
        <path d="M46.5 28.5q6-6.5 12 0-6 5.5-12 0z" fill="#8C6239" />
      </svg>
    );
  }

  if (country === 'Colombia') {
    return (
      <svg viewBox="0 0 90 60" className={shell} role="img" aria-label="Bandera de Colombia">
        <rect width="90" height="60" fill="#CE1126" />
        <rect width="90" height="45" fill="#003893" />
        <rect width="90" height="30" fill="#FCD116" />
      </svg>
    );
  }

  return null;
};

const PROJECTS: Project[] = [
  {
    id: '1',
    shots: 4,
    title: 'BHR Due Diligence',
    client: 'Business & Human Rights',
    country: 'España',
    city: 'Madrid',
    desc: {
      es: 'Plataforma de gestión de evaluaciones de derechos humanos y medio ambiente para cadenas de suministro. Incluye formularios multiidioma, base de datos PostgreSQL, dashboards comparativos por proveedor y país, y generación automática de informes en Word y PowerPoint asistida por IA. Diseñada para manejar grandes volúmenes de datos con despliegue en la nube.',
      en: 'Human rights and environmental due-diligence platform for supply chains. Multilingual assessment forms, PostgreSQL database, comparative dashboards by supplier and country, and AI-assisted automatic report generation in Word and PowerPoint. Built to handle large data volumes with cloud deployment.',
    },
    tags: ['PostgreSQL', 'Dashboards', 'IA Generativa', 'Cloud'],
  },
  {
    id: '2',
    shots: 4,
    title: 'Gestor de Reportes de Inspección',
    client: 'ADEMINCOL',
    country: 'Colombia',
    city: 'Bogotá',
    desc: {
      es: 'Sistema integral para una empresa de inspección industrial: gestión de almacenes y equipos, control de certificados y personal, y captura de información en campo mediante aplicaciones móviles con registro fotográfico. Automatiza la generación de informes normalizados de todas las técnicas de ensayo, optimizando drásticamente los tiempos de entrega.',
      en: 'End-to-end system for an industrial inspection company: warehouse and equipment management, certificate and personnel tracking, and field data capture through mobile apps with photographic records. Automates standardized report generation across all testing techniques, drastically cutting delivery times.',
    },
    tags: ['Python', 'Bases de Datos', 'Apps de Campo', 'Automatización'],
  },
  {
    id: '3',
    shots: 2,
    title: 'BHR Country Risk Compass',
    client: 'Repsol · Inditex',
    country: 'España',
    city: 'Madrid',
    desc: {
      es: 'Dashboard de inteligencia de riesgo país en derechos humanos, desarrollado para analizar y comparar cómo Repsol e Inditex gestionan los derechos humanos en cada territorio donde operan. Cubre 194 países y 16 indicadores de riesgo, permitiendo contrastar la exposición de cada compañía frente a sus mercados de operación.',
      en: 'Human rights country-risk intelligence dashboard, built to analyze and compare how Repsol and Inditex manage human rights across every territory where they operate. Covers 194 countries and 16 risk indicators, benchmarking each company\'s exposure against its operating markets.',
    },
    tags: ['Análisis de Riesgo', 'Dashboards', 'Benchmarking', 'Multiempresa'],
  },
  {
    id: '4',
    shots: 4,
    title: 'Plataforma Académica Alto Horno',
    client: 'Acerías Paz del Río',
    country: 'Colombia',
    city: 'Sogamoso',
    desc: {
      es: 'Plataforma educativa con modelos 3D interactivos del alto horno: cuerpo, estufas y escoriadero. Simula los flujos de aire y gas, la fuente de aire de soplo, el sistema de carga por campanas y la salida de escoria, explicando el proceso completo de reducción. Se entregó además como aplicativo de escritorio para su despliegue sencillo en planta.',
      en: 'Educational platform with interactive 3D models of the blast furnace: body, stoves and slag runner. Simulates air and gas flows, the blast air source, the bell charging system and slag tapping, explaining the full reduction process. Also delivered as a desktop application for easy on-site deployment.',
    },
    tags: ['Blender', 'Modelado 3D', 'Python', 'App de Escritorio'],
  },
  {
    id: '5',
    shots: 4,
    title: 'KG Academy',
    client: 'KG Gestión Integral S.A.S.',
    country: 'Colombia',
    city: 'Palmira',
    desc: {
      es: 'Plataforma académica de formación virtual en Seguridad y Salud en el Trabajo, dirigida a organizaciones. Incluye catálogo de cursos por categoría, constructor de contenido, banco de preguntas y evaluaciones diagnósticas y finales, emisión de certificados con código único y verificación pública, además de gestión de empresas, planes, roles y auditoría.',
      en: 'Virtual training platform for Occupational Health and Safety, aimed at organizations. Features a course catalog by category, content builder, question bank with diagnostic and final assessments, certificate issuing with unique codes and public verification, plus company, plan, role and audit management.',
    },
    tags: ['LMS', 'Certificación', 'Roles y Permisos', 'Full-Stack'],
  },
  {
    id: '6',
    shots: 3,
    title: 'Portal Tributario Municipal',
    client: 'Alcaldía de Paipa (+3 municipios)',
    country: 'Colombia',
    city: 'Paipa',
    desc: {
      es: 'Plataforma de recaudo de impuestos municipales (Industria y Comercio, Predial y Retenciones): liquidación automática de impuestos, pagos en línea por PSE, generación de formularios oficiales en PDF con código de barras y firma digital. La solución se replicó posteriormente en tres municipios adicionales.',
      en: 'Municipal tax collection platform (Business, Property and Withholding taxes): automatic tax calculation, online PSE payments, official PDF form generation with barcodes and digital signature. The solution was later replicated across three additional municipalities.',
    },
    tags: ['GovTech', 'Pagos PSE', 'PDF + Código de Barras', 'Firma Digital'],
  },
  {
    id: '7',
    shots: 0,
    title: 'Automatización de Flujos de Aprobación',
    client: 'Sector Corporativo',
    country: 'México',
    city: 'Ciudad de México',
    desc: {
      es: 'Automatización integral del sistema de solicitudes y flujos de aprobación de una organización corporativa, digitalizando el circuito completo desde el registro de la solicitud hasta la autorización final y optimizando la gestión administrativa.',
      en: 'End-to-end automation of a corporate organization\'s request system and approval workflows, digitalizing the full circuit from request submission to final authorization and streamlining administrative management.',
    },
    tags: ['Automatización', 'Workflows', 'Power Automate'],
  },
];

// Carrusel que va pasando las capturas de cada proyecto automáticamente.
const ProjectCarousel = ({ project }: { project: Project }) => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  React.useEffect(() => {
    if (project.shots < 2 || paused) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % project.shots);
    }, 3500);
    return () => clearInterval(timer);
  }, [project.shots, paused]);

  const go = (dir: number) =>
    setIndex((prev) => (prev + dir + project.shots) % project.shots);

  if (project.shots === 0) {
    return (
      <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-gray-100 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 flex items-center justify-center">
        <div className="text-center px-6">
          <Lightbulb className="text-brand/40 mx-auto mb-3" size={40} />
          <p className="text-xs text-gray-500 dark:text-gray-500 uppercase tracking-widest font-bold">Capturas próximamente</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-gray-200 dark:bg-black/40 border border-gray-200 dark:border-white/10 group/carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Todas las capturas quedan montadas y sólo cambia la opacidad por CSS.
          Con AnimatePresence las imágenes se acumulaban y podían quedarse
          congeladas en opacity 0; así el cambio nunca puede fallar. */}
      {Array.from({ length: project.shots }).map((_, i) => (
        <img
          key={i}
          src={`/proyectos/${project.id}/${i + 1}.webp`}
          alt={`${project.title} — captura ${i + 1}`}
          loading={i === 0 ? 'eager' : 'lazy'}
          aria-hidden={i !== index}
          className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-500 ease-in-out ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      {project.shots > 1 && (
        <>
          {/* Flechas semitransparentes: se marcan al pasar el mouse */}
          <button
            onClick={() => go(-1)}
            aria-label="Captura anterior"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/30 hover:bg-black/60 backdrop-blur-sm text-white/70 hover:text-white flex items-center justify-center transition-all opacity-60 group-hover/carousel:opacity-100"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Captura siguiente"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/30 hover:bg-black/60 backdrop-blur-sm text-white/70 hover:text-white flex items-center justify-center transition-all opacity-60 group-hover/carousel:opacity-100"
          >
            <ChevronRight size={22} />
          </button>

          <div className="absolute bottom-3 right-3 z-10 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-sm text-[10px] font-bold text-white/80">
            {index + 1} / {project.shots}
          </div>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {Array.from({ length: project.shots }).map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Ver captura ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? 'w-6 bg-brand' : 'w-1.5 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// Panel de países: reemplaza el mapa abstracto anterior, que no dejaba claro
// dónde se hicieron los proyectos.
// Coordenadas ya proyectadas (Mercator) sobre el lienzo de WORLD_PATH.
const CITY_XY: Record<string, { x: number; y: number }> = {
  'Madrid': { x: 821.5, y: 245.3 },
  'Ciudad de México': { x: 158.8, y: 415.0 },
  'Bogotá': { x: 332.8, y: 519.9 },
  'Sogamoso': { x: 340.7, y: 512.9 },
  'Paipa': { x: 339.5, y: 512.5 },
  'Palmira': { x: 317.3, y: 528.1 },
};

// Recuadros de encuadre por región, en coordenadas del mapa.
// Los tres recuadros de pais miden lo mismo (300x210), asi que el zoom es
// identico en los tres: k = 2.67. Antes cada uno tenia su propio tamano y
// Colombia llegaba a 6.7x, donde la geometria de Natural Earth 110m (baja
// resolucion, pensada para vista mundial) se deforma y parece una mancha.
const MAP_VIEWS: Record<string, { x: number; y: number; w: number; h: number }> = {
  todos:      { x: 110, y: 200, w: 780, h: 370 },
  'España':   { x: 671, y: 140, w: 300, h: 210 },
  'México':   { x: 9,   y: 310, w: 300, h: 210 },
  'Colombia': { x: 179, y: 415, w: 300, h: 210 },
};

const VB_W = 1000;
const VB_H = 560;

const WorldMap = ({ lang }: { lang: 'es' | 'en' }) => {
  const [region, setRegion] = useState<string>('todos');

  const view = MAP_VIEWS[region];
  const k = Math.min(VB_W / view.w, VB_H / view.h);
  const tx = VB_W / 2 - (view.x + view.w / 2) * k;
  const ty = VB_H / 2 - (view.y + view.h / 2) * k;
  const to = (p: { x: number; y: number }) => ({ x: p.x * k + tx, y: p.y * k + ty });

  // Vista mundial: un pin por país. Vista de país: un pin por ciudad.
  const pins =
    region === 'todos'
      ? COUNTRIES.map((c) => {
          const cities = [...new Set(PROJECTS.filter((p) => p.country === c).map((p) => p.city))];
          const pts = cities.map((n) => CITY_XY[n]).filter(Boolean);
          const avg = {
            x: pts.reduce((a, b) => a + b.x, 0) / pts.length,
            y: pts.reduce((a, b) => a + b.y, 0) / pts.length,
          };
          const n = PROJECTS.filter((p) => p.country === c).length;
          return {
            key: c,
            label: c,
            sub: `${n} ${lang === 'es' ? (n === 1 ? 'proyecto' : 'proyectos') : (n === 1 ? 'project' : 'projects')}`,
            ...to(avg),
            onClick: () => setRegion(c),
          };
        })
      : [...new Set(PROJECTS.filter((p) => p.country === region).map((p) => p.city))].map((city) => {
          const n = PROJECTS.filter((p) => p.city === city).length;
          return {
            key: city,
            label: city,
            sub: `${n} ${lang === 'es' ? (n === 1 ? 'proyecto' : 'proyectos') : (n === 1 ? 'project' : 'projects')}`,
            ...to(CITY_XY[city]),
            onClick: () => {},
          };
        });

  // Colocacion de etiquetas. Paipa y Sogamoso estan a 0.4 unidades una de
  // otra en el mapa: a cualquier zoom caen sobre el mismo punto, asi que
  // ningun ajuste de "arriba o abajo" las separa. En vez de eso, cada
  // etiqueta es una placa al costado del pin y se apilan en columna,
  // unidas al pin por una linea guia.
  const ALTO_PLACA = 42;
  const SEPARACION = 8;

  const placed = [...pins]
    .sort((a, b) => a.y - b.y)
    .map((p) => {
      const anchoTexto = Math.max(p.label.length * 8.6, p.sub.length * 7.2);
      const w = Math.round(anchoTexto + 26);
      // Si no cabe a la derecha, la placa se voltea al otro lado del pin.
      const cabeDerecha = p.x + 22 + w < VB_W - 12;
      return { ...p, w, lado: cabeDerecha ? 1 : -1, cy: p.y };
    });

  // Empuja hacia abajo cada placa que invada la anterior.
  for (let i = 1; i < placed.length; i++) {
    const minimo = placed[i - 1].cy + ALTO_PLACA + SEPARACION;
    if (placed[i].cy < minimo) placed[i].cy = minimo;
  }

  // Si la columna se sale por abajo, se sube el bloque completo.
  const desborde = placed.length
    ? placed[placed.length - 1].cy + ALTO_PLACA / 2 - (VB_H - 12)
    : 0;
  if (desborde > 0) placed.forEach((p) => { p.cy -= desborde; });

  return (
    <div className="mb-20">
      {/* Selector de región */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        <button
          onClick={() => setRegion('todos')}
          className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
            region === 'todos'
              ? 'bg-brand text-brand-black'
              : 'bg-gray-200/70 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-white/10'
          }`}
        >
          {lang === 'es' ? 'Ver todo' : 'View all'}
        </button>
        {COUNTRIES.map((c) => (
          <button
            key={c}
            onClick={() => setRegion(c)}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${
              region === c
                ? 'bg-brand text-brand-black'
                : 'bg-gray-200/70 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-white/10'
            }`}
          >
            <Flag country={c} className="w-5" />
            {c}
          </button>
        ))}
      </div>

      <div className="relative rounded-[32px] overflow-hidden border border-gray-200 dark:border-white/5 bg-gray-100 dark:bg-white/[0.02]">
        <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="w-full h-auto block" role="img"
             aria-label={lang === 'es' ? 'Mapa de países donde se han realizado proyectos' : 'Map of countries where projects were delivered'}>
          {/* Tierra firme: se escala con el zoom */}
          <g style={{ transform: `translate(${tx}px, ${ty}px) scale(${k})`, transition: 'transform 700ms cubic-bezier(0.4,0,0.2,1)' }}>
            <path
              d={WORLD_PATH}
              className="fill-gray-300 dark:fill-white/[0.07] stroke-gray-400 dark:stroke-white/10"
              strokeWidth={0.5 / k}
            />
          </g>

          {/* Pines: fuera del grupo escalado para que no crezcan con el zoom */}
          {placed.map((p, i) => (
            <g
              key={p.key}
              onClick={p.onClick}
              className={region === 'todos' ? 'cursor-pointer' : ''}
            >
              {/* Halo que late. La animacion arranca escalonada por pin. */}
              <circle cx={p.x} cy={p.y} r="14" fill="#D97706" opacity="0.18">
                <animate attributeName="r" values="10;20;10" dur="2.6s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.28;0;0.28" dur="2.6s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
              </circle>
              <circle cx={p.x} cy={p.y} r="6" fill="#D97706" stroke="var(--map-halo)" strokeWidth="2.5" />

              {/* Linea guia del pin a su placa */}
              <path
                d={`M ${p.x + p.lado * 7} ${p.y} L ${p.x + p.lado * 16} ${p.cy}`}
                stroke="#D97706" strokeWidth="1.5" opacity="0.55" fill="none"
              />

              {/* Placa con el nombre y el conteo */}
              <g transform={`translate(${p.x + p.lado * 16 - (p.lado < 0 ? p.w : 0)}, ${p.cy - 21})`}>
                <rect
                  width={p.w} height="42" rx="10"
                  className="fill-white/95 dark:fill-[#1b1d22]/95 stroke-gray-300 dark:stroke-white/15"
                  strokeWidth="1"
                />
                <text
                  x="13" y="18"
                  className="fill-gray-900 dark:fill-white"
                  fontSize="15" fontWeight="800"
                >
                  {p.label}
                </text>
                <text x="13" y="33" fill="#D97706" fontSize="12.5" fontWeight="700">
                  {p.sub}
                </text>
              </g>
            </g>
          ))}
        </svg>

        <p className="absolute bottom-3 left-5 text-[10px] text-gray-500 dark:text-gray-600">
          {region === 'todos'
            ? (lang === 'es' ? 'Toca un país para ver sus ciudades' : 'Tap a country to see its cities')
            : (lang === 'es' ? 'Ciudades donde se ejecutaron los proyectos' : 'Cities where projects were delivered')}
        </p>
      </div>
    </div>
  );
};

// Banda de cierre del inicio: lleva a la pagina de Proyectos.
// Antes habia una franja de cifras (proyectos / paises / certificaciones);
// se quito porque resultaba poco creible.
const CLIENT_LOGOS: { file: string; name: string }[] = [
  // { file: 'ademincol.png', name: 'ADEMINCOL' },
  // Cada logo va en public/logos/clientes/ y requiere permiso de la marca.
];

// Boton de volver compartido por las paginas internas.
export const BackButton = ({ onBack, lang }: { onBack: () => void; lang: 'es' | 'en' }) => (
  <button
    onClick={onBack}
    className="group inline-flex items-center gap-2.5 pl-3 pr-5 py-2.5 rounded-full glass border-gray-200 dark:border-white/10 hover:border-brand/50 text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-brand transition-all hover:-translate-x-0.5"
  >
    <span className="w-7 h-7 rounded-full bg-brand/10 group-hover:bg-brand flex items-center justify-center transition-colors">
      <ChevronLeft size={16} className="text-brand group-hover:text-white transition-colors" />
    </span>
    {lang === 'es' ? 'Volver al portafolio' : 'Back to portfolio'}
  </button>
);

// --- Servicios ---
// Cada tarjeta se despliega para mostrar entregables concretos y herramientas,
// en vez de quedarse en una sola linea generica.
interface Service {
  icon: typeof Bot;
  title: { es: string; en: string };
  desc: { es: string; en: string };
  items: { es: string[]; en: string[] };
  tools: string[];
}

const SERVICES: Service[] = [
  {
    icon: Code,
    title: { es: 'Desarrollo Web y de Software', en: 'Web & Software Development' },
    desc: {
      es: 'Aplicaciones y portales a la medida, del diseño de la interfaz a la base de datos y la puesta en producción.',
      en: 'Custom applications and portals, from interface design to the database and going live.',
    },
    items: {
      es: [
        'Aplicaciones web completas: interfaz, servidor, base de datos y despliegue',
        'Portales de consulta y trámites para entidades públicas',
        'Plataformas internas de gestión con roles, permisos y trazabilidad',
        'Integración con sistemas existentes por API y publicación en la nube',
      ],
      en: [
        'Full web applications: interface, backend, database and deployment',
        'Public-facing portals for citizen services and procedures',
        'Internal management platforms with roles, permissions and audit trails',
        'Integration with existing systems via API and cloud deployment',
      ],
    },
    tools: ['React', 'TypeScript', 'Python', 'SQL', 'FastAPI', 'Firebase'],
  },
  {
    icon: Bot,
    title: { es: 'Agentes de IA', en: 'AI Agents' },
    desc: {
      es: 'Asistentes que leen tus propios documentos y bases de datos, y responden o redactan por ti.',
      en: 'Assistants that read your own documents and databases, then answer or draft on your behalf.',
    },
    items: {
      es: [
        'Asistentes que consultan tus manuales, informes y bases de datos internas',
        'Clasificación y extracción automática de datos desde PDF, correos y formularios',
        'Redacción automática de informes en Word y PowerPoint a partir de los resultados',
        'Integración con las herramientas que ya usa tu equipo',
      ],
      en: [
        'Assistants that query your manuals, reports and internal databases',
        'Automatic classification and extraction from PDFs, emails and forms',
        'Automatic drafting of Word and PowerPoint reports from the results',
        'Integration with the tools your team already uses',
      ],
    },
    tools: ['LLMs', 'RAG', 'Python', 'APIs'],
  },
  {
    icon: FileJson,
    title: { es: 'Automatización de Formatos', en: 'Form & Report Automation' },
    desc: {
      es: 'Del formato en papel o Excel a la captura digital en campo con generación automática del informe.',
      en: 'From paper or Excel forms to digital field capture with automatic report generation.',
    },
    items: {
      es: [
        'Captura en campo desde el celular, con fotos, firma y funcionamiento sin señal',
        'Generación del informe final en Excel o PDF con tu plantilla corporativa',
        'Consolidación de toda la información en una sola base de datos',
        'Trazabilidad de quién registró qué y cuándo',
      ],
      en: [
        'Field capture from a phone, with photos, signature and offline support',
        'Final report generated in Excel or PDF using your corporate template',
        'All information consolidated into a single database',
        'Full traceability of who recorded what and when',
      ],
    },
    tools: ['AppSheet', 'Python', 'Apps Script', 'openpyxl'],
  },
  {
    icon: BarChart3,
    title: { es: 'Business Intelligence', en: 'Business Intelligence' },
    desc: {
      es: 'Tableros que se actualizan solos y responden las preguntas que de verdad mueven el negocio.',
      en: 'Dashboards that refresh themselves and answer the questions that actually move the business.',
    },
    items: {
      es: [
        'Definición de indicadores junto con las áreas que los van a usar',
        'Modelo de datos y limpieza de las fuentes existentes',
        'Tableros en Power BI o Tableau con actualización automática',
        'Permisos por rol y capacitación al equipo para que no dependan de mí',
      ],
      en: [
        'KPI definition together with the teams that will use them',
        'Data model and cleanup of existing sources',
        'Power BI or Tableau dashboards with automatic refresh',
        'Role-based access and team training so they do not depend on me',
      ],
    },
    tools: ['Power BI', 'Tableau', 'SQL', 'DAX'],
  },
  {
    icon: Zap,
    title: { es: 'AppSheet & Power Automate', en: 'AppSheet & Power Automate' },
    desc: {
      es: 'Aplicaciones internas y flujos de aprobación sin montar un desarrollo a la medida desde cero.',
      en: 'Internal apps and approval flows without building custom software from scratch.',
    },
    items: {
      es: [
        'Aplicaciones internas para solicitudes, inventarios o inspecciones',
        'Flujos de aprobación por niveles con notificaciones automáticas',
        'Integración con Google Sheets, SharePoint, correo y WhatsApp',
        'Puesta en marcha en semanas, no en meses',
      ],
      en: [
        'Internal apps for requests, inventories or inspections',
        'Multi-level approval flows with automatic notifications',
        'Integration with Google Sheets, SharePoint, email and WhatsApp',
        'Live in weeks, not months',
      ],
    },
    tools: ['AppSheet', 'Power Automate', 'Google Workspace'],
  },
  {
    icon: Database,
    title: { es: 'Big Data & SQL', en: 'Big Data & SQL' },
    desc: {
      es: 'Sacar la información de archivos de Excel dispersos y ponerla en una base de datos que aguante.',
      en: 'Getting information out of scattered Excel files and into a database that holds up.',
    },
    items: {
      es: [
        'Diseño del modelo de datos y migración desde hojas de cálculo',
        'Procesos de carga y transformación automáticos (ETL)',
        'Optimización de consultas lentas y de reportes que tardan',
        'Respaldos, control de acceso y registro de auditoría',
      ],
      en: [
        'Data model design and migration from spreadsheets',
        'Automated load and transformation processes (ETL)',
        'Optimization of slow queries and slow reports',
        'Backups, access control and audit logging',
      ],
    },
    tools: ['PostgreSQL', 'SQL Server', 'Python', 'Docker'],
  },
  {
    icon: LineChart,
    title: { es: 'Análisis Estadístico en R', en: 'Statistical Analysis in R' },
    desc: {
      es: 'Cuando la pregunta no se responde con un promedio: estadística aplicada al proceso industrial.',
      en: 'When an average will not answer the question: statistics applied to industrial processes.',
    },
    items: {
      es: [
        'Pareto, capacidad de proceso y cartas de control',
        'Regresión y series de tiempo para proyectar comportamiento',
        'Diseño de experimentos para encontrar la causa real de un problema',
        'Modelos de riesgo bajo API 581 e integridad de activos',
      ],
      en: [
        'Pareto, process capability and control charts',
        'Regression and time series to project behavior',
        'Design of experiments to find the real root cause',
        'Risk models under API 581 and asset integrity',
      ],
    },
    tools: ['R', 'Shiny', 'Minitab', 'Python'],
  },
];

// --- Areas de servicio con diagramas ---
// Diagramas propios en SVG en vez de imagenes de internet: se adaptan al
// tema, se ven nitidos a cualquier tamaño y no dependen de licencias ajenas.
const D = {
  caja: 'fill-white dark:fill-white/[0.06] stroke-gray-300 dark:stroke-white/15',
  cajaRoja: 'fill-brand/10 stroke-brand/50',
  texto: 'fill-gray-700 dark:fill-gray-300',
  textoTenue: 'fill-gray-500',
  linea: 'stroke-gray-400 dark:stroke-white/25',
};

const Flecha = ({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) => (
  <>
    <line x1={x1} y1={y1} x2={x2 - 7} y2={y2} className={D.linea} strokeWidth="1.5" strokeDasharray="4 3" />
    <polygon points={`${x2},${y2} ${x2 - 8},${y2 - 4} ${x2 - 8},${y2 + 4}`} className="fill-brand" />
  </>
);

const DIAGRAMS: Record<string, React.ReactNode> = {
  // ERP / CRM: modulos -> aplicacion -> base de datos
  desarrollo: (
    <svg viewBox="0 0 420 190" className="w-full h-auto">
      {['Clientes', 'Inventario', 'Facturación'].map((m, i) => (
        <g key={m}>
          <rect x="6" y={18 + i * 52} width="104" height="38" rx="8" className={D.caja} strokeWidth="1.5" />
          <text x="58" y={41 + i * 52} textAnchor="middle" fontSize="12" fontWeight="700" className={D.texto}>{m}</text>
        </g>
      ))}
      <Flecha x1={114} y1={95} x2={150} y2={95} />
      <rect x="152" y="52" width="112" height="86" rx="12" className={D.cajaRoja} strokeWidth="2" />
      <text x="208" y="88" textAnchor="middle" fontSize="13" fontWeight="900" className="fill-brand">ERP / CRM</text>
      <text x="208" y="106" textAnchor="middle" fontSize="10" className={D.textoTenue}>web + móvil</text>
      <Flecha x1={268} y1={95} x2={304} y2={95} />
      <ellipse cx="356" cy="64" rx="48" ry="12" className={D.caja} strokeWidth="1.5" />
      <path d="M308 64v62c0 6.6 21.5 12 48 12s48-5.4 48-12V64" className={D.caja} strokeWidth="1.5" />
      <text x="356" y="106" textAnchor="middle" fontSize="11" fontWeight="700" className={D.texto}>Base de datos</text>
    </svg>
  ),

  // Fuentes dispersas -> proceso de carga -> almacen unico
  datos: (
    <svg viewBox="0 0 420 190" className="w-full h-auto">
      {['Excel', 'Sheets', 'Sensores', 'Formularios'].map((m, i) => (
        <g key={m}>
          <rect x="6" y={10 + i * 44} width="92" height="32" rx="7" className={D.caja} strokeWidth="1.5" />
          <text x="52" y={30 + i * 44} textAnchor="middle" fontSize="11" fontWeight="700" className={D.texto}>{m}</text>
          <line x1="100" y1={26 + i * 44} x2="140" y2="95" className={D.linea} strokeWidth="1.2" strokeDasharray="3 3" />
        </g>
      ))}
      <polygon points="142,58 214,58 186,100 186,132 170,124 170,100" className={D.cajaRoja} strokeWidth="2" />
      <text x="178" y="84" textAnchor="middle" fontSize="11" fontWeight="900" className="fill-brand">ETL</text>
      <Flecha x1={220} y1={95} x2={258} y2={95} />
      <ellipse cx="312" cy="62" rx="52" ry="13" className={D.caja} strokeWidth="1.5" />
      <path d="M260 62v66c0 7.2 23.3 13 52 13s52-5.8 52-13V62" className={D.caja} strokeWidth="1.5" />
      <text x="312" y="106" textAnchor="middle" fontSize="11" fontWeight="700" className={D.texto}>PostgreSQL</text>
      <text x="312" y="122" textAnchor="middle" fontSize="9" className={D.textoTenue}>una sola fuente</text>
    </svg>
  ),

  // Antes: cadena manual larga. Despues: un solo paso automatico.
  automatizacion: (
    <svg viewBox="0 0 420 190" className="w-full h-auto">
      <text x="8" y="20" fontSize="10" fontWeight="900" className={D.textoTenue}>ANTES · manual</text>
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <rect x={8 + i * 62} y="30" width="48" height="30" rx="6" className={D.caja} strokeWidth="1.4" />
          <text x={32 + i * 62} y="49" textAnchor="middle" fontSize="10" className={D.textoTenue}>{i + 1}</text>
          {i < 4 && <line x1={58 + i * 62} y1="45" x2={68 + i * 62} y2="45" className={D.linea} strokeWidth="1.4" />}
        </g>
      ))}
      <text x="330" y="49" fontSize="11" fontWeight="700" className={D.textoTenue}>3 h</text>

      <text x="8" y="104" fontSize="10" fontWeight="900" className="fill-brand">DESPUÉS · automático</text>
      <rect x="8" y="114" width="110" height="38" rx="8" className={D.cajaRoja} strokeWidth="2" />
      <text x="63" y="138" textAnchor="middle" fontSize="11" fontWeight="900" className="fill-brand">1 clic</text>
      <Flecha x1={122} y1={133} x2={160} y2={133} />
      <rect x="164" y="114" width="140" height="38" rx="8" className={D.caja} strokeWidth="1.5" />
      <text x="234" y="138" textAnchor="middle" fontSize="11" fontWeight="700" className={D.texto}>Informe generado</text>
      <text x="330" y="138" fontSize="11" fontWeight="900" className="fill-brand">2 min</text>
    </svg>
  ),

  // Datos crudos -> indicadores -> decision
  analitica: (
    <svg viewBox="0 0 420 190" className="w-full h-auto">
      <rect x="8" y="26" width="120" height="138" rx="10" className={D.caja} strokeWidth="1.5" />
      <text x="68" y="20" textAnchor="middle" fontSize="10" fontWeight="900" className={D.textoTenue}>DATOS CRUDOS</text>
      {[0, 1, 2, 3, 4, 5].map((r) => (
        <g key={r}>
          {[0, 1, 2].map((c) => (
            <rect key={c} x={20 + c * 34} y={38 + r * 20} width="26" height="9" rx="2"
                  className="fill-gray-300 dark:fill-white/15" />
          ))}
        </g>
      ))}
      <Flecha x1={134} y1={95} x2={168} y2={95} />

      {/* barras + tendencia */}
      <rect x="176" y="26" width="128" height="138" rx="10" className={D.caja} strokeWidth="1.5" />
      <text x="240" y="20" textAnchor="middle" fontSize="10" fontWeight="900" className="fill-brand">INDICADORES</text>
      {[38, 62, 30, 76, 52].map((h, i) => (
        <rect key={i} x={190 + i * 23} y={146 - h} width="15" height={h} rx="3"
              className={i === 3 ? 'fill-brand' : 'fill-brand/35'} />
      ))}
      <polyline points="197,112 220,92 243,120 266,76 289,100" fill="none" className="stroke-amber-500" strokeWidth="2" />
      <Flecha x1={310} y1={95} x2={344} y2={95} />

      <rect x="348" y="60" width="66" height="70" rx="10" className={D.cajaRoja} strokeWidth="2" />
      <text x="381" y="88" textAnchor="middle" fontSize="11" fontWeight="900" className="fill-brand">Decisión</text>
      <text x="381" y="106" textAnchor="middle" fontSize="9" className={D.textoTenue}>con evidencia</text>
    </svg>
  ),

  // Ciclo PDCA con las normas alrededor.
  // Los cuatro tramos van separados y con su propia punta de flecha; antes
  // era un unico arco de 270 grados y las etiquetas caian encima de el.
  calidad: (
    <svg viewBox="0 0 420 190" className="w-full h-auto">
      {/* anillo de referencia */}
      <circle cx="132" cy="95" r="46" className={D.caja} strokeWidth="1.2" strokeDasharray="2 4" fillOpacity="0" />

      {/* cada etapa: un arco con su flecha, girando en sentido horario */}
      {[
        { d: 'M150.7 53.0 A46 46 0 0 1 174.0 76.3', f: '177.7,84.5 178.6,74.3 169.5,78.3' },
        { d: 'M174.0 113.7 A46 46 0 0 1 150.7 137.0', f: '142.5,140.7 152.7,141.6 148.7,132.5' },
        { d: 'M113.3 137.0 A46 46 0 0 1 90.0 113.7', f: '86.3,105.5 85.4,115.7 94.5,111.7' },
        { d: 'M90.0 76.3 A46 46 0 0 1 113.3 53.0', f: '121.5,49.3 111.3,48.4 115.3,57.5' },
      ].map((tramo, i) => (
        <g key={i}>
          <path d={tramo.d} fill="none" stroke="#D97706" strokeWidth="3.5" strokeLinecap="round" />
          <polygon points={tramo.f} fill="#D97706" />
        </g>
      ))}

      {/* etapas, fuera del anillo para que no lo pisen */}
      {[
        { t: 'PLANEAR', x: 132, y: 29 },
        { t: 'HACER', x: 202, y: 99 },
        { t: 'VERIFICAR', x: 132, y: 173 },
        { t: 'ACTUAR', x: 62, y: 99 },
      ].map((q) => (
        <text key={q.t} x={q.x} y={q.y} textAnchor="middle" fontSize="11" fontWeight="900"
              fill="#D97706">{q.t}</text>
      ))}

      <text x="132" y="92" textAnchor="middle" fontSize="11.5" fontWeight="900" className={D.texto}>MEJORA</text>
      <text x="132" y="106" textAnchor="middle" fontSize="11.5" fontWeight="900" className={D.texto}>CONTINUA</text>

      {['ISO 9001', 'ISO 14001', 'ISO 45001', 'ISO 17025', 'API 580 / 581'].map((n, i) => (
        <g key={n}>
          <rect x="248" y={16 + i * 32} width="164" height="24" rx="12" className={D.cajaRoja} strokeWidth="1.5" />
          <text x="330" y={32 + i * 32} textAnchor="middle" fontSize="11" fontWeight="700" fill="#D97706">{n}</text>
        </g>
      ))}
    </svg>
  ),
};

interface Area {
  key: string;
  icon: typeof Bot;
  title: { es: string; en: string };
  desc: { es: string; en: string };
  bullets: { es: string[]; en: string[] };
}

const AREAS: Area[] = [
  {
    key: 'desarrollo',
    icon: Code,
    title: { es: 'Desarrollo de Software a la Medida', en: 'Custom Software Development' },
    desc: {
      es: 'Construyo el sistema que tu operación necesita cuando el software del mercado no encaja: ERP, CRM, portales de trámites o aplicaciones de campo.',
      en: 'I build the system your operation needs when off-the-shelf software does not fit: ERP, CRM, service portals or field applications.',
    },
    bullets: {
      es: ['ERP y CRM por módulos', 'Portales de atención y trámites', 'Aplicaciones de campo con foto y firma', 'Roles, permisos y auditoría'],
      en: ['Modular ERP and CRM', 'Service and request portals', 'Field apps with photo and signature', 'Roles, permissions and audit trail'],
    },
  },
  {
    key: 'datos',
    icon: Database,
    title: { es: 'Infraestructura y Arquitectura de Datos', en: 'Data Infrastructure & Architecture' },
    desc: {
      es: 'Saco la información de decenas de archivos sueltos y la llevo a una base de datos única, con procesos de carga automáticos.',
      en: 'I take information out of dozens of scattered files into a single database, with automated load processes.',
    },
    bullets: {
      es: ['Diseño del modelo de datos', 'Migración desde Excel y Sheets', 'Procesos ETL automáticos', 'Respaldos, accesos y seguridad'],
      en: ['Data model design', 'Migration from Excel and Sheets', 'Automated ETL processes', 'Backups, access control and security'],
    },
  },
  {
    key: 'automatizacion',
    icon: Zap,
    title: { es: 'Automatización de Procesos', en: 'Process Automation' },
    desc: {
      es: 'Lo que hoy toma horas de copiar y pegar queda en un botón: informes, flujos de aprobación y notificaciones.',
      en: 'What today takes hours of copy-paste becomes a single button: reports, approval flows and notifications.',
    },
    bullets: {
      es: ['Generación automática de informes', 'Flujos de aprobación por niveles', 'Notificaciones por correo y WhatsApp', 'Integración entre sistemas'],
      en: ['Automatic report generation', 'Multi-level approval flows', 'Email and WhatsApp notifications', 'System-to-system integration'],
    },
  },
  {
    key: 'analitica',
    icon: BarChart3,
    title: { es: 'Analítica, BI e Inteligencia Artificial', en: 'Analytics, BI & Artificial Intelligence' },
    desc: {
      es: 'Convierto la tabla en una respuesta: qué está fallando, por qué, y qué va a pasar si no se corrige.',
      en: 'I turn the table into an answer: what is failing, why, and what happens if it is not fixed.',
    },
    bullets: {
      es: ['Tableros en Power BI y Tableau', 'Estadística aplicada al proceso', 'Modelos predictivos y machine learning', 'Agentes de IA sobre tus documentos'],
      en: ['Power BI and Tableau dashboards', 'Statistics applied to the process', 'Predictive models and machine learning', 'AI agents over your documents'],
    },
  },
  {
    key: 'calidad',
    icon: ShieldCheck,
    title: { es: 'Calidad y Sistemas Integrados de Gestión', en: 'Quality & Integrated Management Systems' },
    desc: {
      es: 'Mi base de ingeniería: auditorías internas, documentación y integridad de activos bajo norma, no solo la parte de software.',
      en: 'My engineering foundation: internal audits, documentation and asset integrity under standards, not just the software side.',
    },
    bullets: {
      es: ['Auditorías internas ISO 9001, 14001, 45001', 'Laboratorios bajo ISO 17025', 'Integridad de activos API 580 / 581 / 570', 'Documentación e indicadores del SIG'],
      en: ['Internal audits ISO 9001, 14001, 45001', 'Laboratories under ISO 17025', 'Asset integrity API 580 / 581 / 570', 'IMS documentation and indicators'],
    },
  },
];

const ServiceAreas = ({ lang }: { lang: 'es' | 'en' }) => (
  <div className="space-y-6 mb-24">
    {AREAS.map((area, i) => {
      const Icono = area.icon;
      return (
        <motion.div
          key={area.key}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.35 }}
          className="glass rounded-[28px] p-6 md:p-9 border-gray-200 dark:border-white/5 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center hover:border-brand/30 transition-colors"
        >
          <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
            <div className="rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 p-4">
              {DIAGRAMS[area.key]}
            </div>
          </div>

          <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-brand/10 flex items-center justify-center shrink-0">
                <Icono className="text-brand" size={22} />
              </div>
              <span className="text-[10px] font-black text-brand uppercase tracking-[0.2em]">
                {String(i + 1).padStart(2, '0')} · {lang === 'es' ? 'Área de servicio' : 'Service area'}
              </span>
            </div>
            <h3 className="text-2xl md:text-3xl font-black mb-3">{area.title[lang]}</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-5">{area.desc[lang]}</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2">
              {area.bullets[lang].map((b) => (
                <li key={b} className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle2 size={15} className="text-brand shrink-0 mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      );
    })}
  </div>
);

const ServiceCard: React.FC<{ service: Service; lang: 'es' | 'en'; index: number }> = ({ service, lang, index }) => {
  const [open, setOpen] = useState(false);
  const Icono = service.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: (index % 3) * 0.05 }}
      viewport={{ once: true }}
      className={`glass rounded-3xl transition-all group border-gray-200 dark:border-white/5 ${
        open ? 'border-brand/40' : 'hover:border-brand/40'
      }`}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full text-left p-7 cursor-pointer"
      >
        <div className="flex items-start justify-between gap-4 mb-5">
          <div
            className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center transition-colors ${
              open ? 'bg-brand' : 'bg-brand/10 group-hover:bg-brand'
            }`}
          >
            <Icono
              className={`transition-colors ${open ? 'text-brand-black' : 'text-brand group-hover:text-brand-black'}`}
              size={26}
            />
          </div>
          <span
            className={`mt-1 text-gray-400 transition-transform duration-300 ${open ? 'rotate-45' : ''}`}
            aria-hidden
          >
            <Plus size={20} />
          </span>
        </div>

        <h3 className="text-xl font-bold mb-2">{service.title[lang]}</h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">{service.desc[lang]}</p>

        {/* Despliegue con grid 0fr -> 1fr: anima la altura sin saber cuánto mide */}
        <div
          className={`grid transition-[grid-template-rows] duration-500 ease-out ${
            open ? 'grid-rows-[1fr] mt-6' : 'grid-rows-[0fr]'
          }`}
        >
          <div className="overflow-hidden">
            <ul className="space-y-2.5 mb-5">
              {service.items[lang].map((it) => (
                <li key={it} className="flex gap-2.5 text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle2 size={16} className="text-brand shrink-0 mt-0.5" />
                  <span>{it}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-1.5">
              {service.tools.map((tool) => (
                <span
                  key={tool}
                  className="px-2.5 py-1 rounded-full bg-gray-200/70 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>

        <span className="mt-5 inline-block text-[10px] font-black uppercase tracking-widest text-brand">
          {open
            ? (lang === 'es' ? 'Ocultar detalle' : 'Hide detail')
            : (lang === 'es' ? 'Ver qué incluye' : 'See what is included')}
        </span>
      </button>
    </motion.div>
  );
};

// --- Como trabajo ---
// Responde las tres dudas de quien contrata: cuanto cuesta, si voy a entender
// su negocio, y que pasa si desaparezco a mitad del proyecto.
const STEPS = [
  {
    icon: MessageCircle,
    title: { es: 'Diagnóstico', en: 'Diagnostic' },
    badge: { es: 'Gratis · 15 min', en: 'Free · 15 min' },
    desc: {
      es: 'Me cuentas qué te está costando tiempo o dinero. Te digo si tiene solución, por dónde empezaría y si soy la persona indicada. Si no lo soy, te lo digo.',
      en: 'You tell me what is costing you time or money. I tell you whether it has a solution, where I would start, and whether I am the right person. If I am not, I will say so.',
    },
  },
  {
    icon: FileJson,
    title: { es: 'Propuesta', en: 'Proposal' },
    badge: { es: 'Por escrito', en: 'In writing' },
    desc: {
      es: 'Alcance, tiempo y precio cerrados antes de empezar. Sabes exactamente qué recibes y cuánto cuesta, sin sorpresas a mitad de camino.',
      en: 'Scope, timeline and price agreed before starting. You know exactly what you get and what it costs, with no surprises halfway through.',
    },
  },
  {
    icon: Code,
    title: { es: 'Construcción', en: 'Build' },
    badge: { es: 'Con entregas parciales', en: 'With partial deliveries' },
    desc: {
      es: 'Vas viendo avances reales durante el proceso, no una caja negra que aparece al final. Si algo no va por buen camino, lo corregimos a tiempo.',
      en: 'You see real progress along the way, not a black box that shows up at the end. If something is off track, we correct it in time.',
    },
  },
  {
    icon: ShieldCheck,
    title: { es: 'Entrega y acompañamiento', en: 'Handover & support' },
    badge: { es: 'Sin dependencia', en: 'No lock-in' },
    desc: {
      es: 'Capacito a tu equipo y entrego la documentación. El sistema queda funcionando sin que dependas de mí para operarlo.',
      en: 'I train your team and hand over the documentation. The system keeps running without depending on me to operate it.',
    },
  },
];

const HowIWork = ({ lang }: { lang: 'es' | 'en' }) => (
  <section id="process" className="py-28 px-6 relative overflow-hidden">
    <div className="tech-grid opacity-60" />
    <div className="max-w-6xl mx-auto relative">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-black mb-4">
          {lang === 'es' ? 'Cómo trabajo' : 'How I work'}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
          {lang === 'es'
            ? 'Para que sepas exactamente qué pasa desde que me escribes hasta que el sistema queda funcionando.'
            : 'So you know exactly what happens from the moment you write to me until the system is up and running.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {STEPS.map((step, i) => {
          const Icono = step.icon;
          return (
            <motion.div
              key={step.title.en}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-3xl p-6 border-gray-200 dark:border-white/5 relative flex flex-col"
            >
              <span className="absolute top-5 right-6 text-4xl font-black text-brand/12 dark:text-brand/20 leading-none">
                {i + 1}
              </span>
              <div className="w-11 h-11 rounded-xl bg-brand/10 flex items-center justify-center mb-4">
                <Icono className="text-brand" size={21} />
              </div>
              <h3 className="text-lg font-black mb-1.5">{step.title[lang]}</h3>
              <span className="inline-block self-start text-[9px] font-black uppercase tracking-widest text-brand bg-brand/10 border border-brand/25 px-2 py-1 rounded-full mb-3">
                {step.badge[lang]}
              </span>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{step.desc[lang]}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);


// Marcador mientras se descarga un bloque diferido. Mantiene la altura para
// que el contenido de abajo no salte cuando termina de cargar.
const CargandoBloque = ({ alto = 'h-[300px]' }: { alto?: string }) => (
  <div className={`${alto} w-full rounded-2xl bg-gray-100 dark:bg-white/[0.03] animate-pulse flex items-center justify-center`}>
    <Loader2 className="text-brand/50 animate-spin" size={26} />
  </div>
);

const PantallaCargando = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center">
    <Loader2 className="text-brand animate-spin" size={34} />
  </div>
);


// Barra de progreso de lectura: indica cuanto queda de pagina.
const BarraProgreso = () => {
  const [pct, setPct] = useState(0);

  React.useEffect(() => {
    let frame = 0;
    const calcular = () => {
      frame = 0;
      const alto = document.documentElement.scrollHeight - window.innerHeight;
      setPct(alto > 0 ? Math.min(100, (window.scrollY / alto) * 100) : 0);
    };
    // requestAnimationFrame evita recalcular en cada pixel de scroll
    const alScroll = () => { if (!frame) frame = requestAnimationFrame(calcular); };
    window.addEventListener('scroll', alScroll, { passive: true });
    window.addEventListener('resize', alScroll);
    calcular();
    return () => {
      window.removeEventListener('scroll', alScroll);
      window.removeEventListener('resize', alScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-[3px] z-[60] pointer-events-none">
      <div
        className="h-full brand-gradient transition-[width] duration-150 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};

const ProjectsCta = ({ lang, onVerProyectos }: { lang: 'es' | 'en'; onVerProyectos: () => void }) => (
  <section className="py-24 px-6 border-y border-gray-200 dark:border-white/5">
    <div className="max-w-4xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl md:text-4xl font-black mb-4">
          {lang === 'es' ? 'Mira lo que he construido' : 'See what I have built'}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-10">
          {lang === 'es'
            ? 'Plataformas, dashboards y automatizaciones en produccion en Espana, Mexico y Colombia.'
            : 'Platforms, dashboards and automations running in production across Spain, Mexico and Colombia.'}
        </p>
        <button
          onClick={onVerProyectos}
          className="inline-flex items-center gap-3 px-8 py-4 brand-gradient rounded-xl font-bold text-sm uppercase tracking-widest hover:scale-105 transition-transform text-brand-black"
        >
          {lang === 'es' ? 'Ver todos los proyectos' : 'View all projects'}
          <ArrowRight size={20} />
        </button>
      </motion.div>

      {CLIENT_LOGOS.length > 0 && (
        <div className="mt-20">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] mb-10">
            {lang === 'es' ? 'Organizaciones con las que he trabajado' : 'Organizations I have worked with'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-14 gap-y-8">
            {CLIENT_LOGOS.map((logo) => (
              <img
                key={logo.file}
                src={`/logos/clientes/${logo.file}`}
                alt={logo.name}
                title={logo.name}
                className="h-10 max-w-[150px] object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  </section>
);

const ProjectsSection = ({ lang }: { lang: 'es' | 'en' }) => (
  <section id="projects" className="py-32 px-6 bg-gray-100/50 dark:bg-gray-100/50 dark:bg-white/[0.01]">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-black mb-4">
          {lang === 'es' ? 'Proyectos y Trayectoria' : 'Projects & Track Record'}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          {lang === 'es'
            ? 'Soluciones diseñadas, construidas y puestas en producción en España, México y Colombia.'
            : 'Solutions designed, built and shipped to production across Spain, Mexico and Colombia.'}
        </p>
      </div>

      <WorldMap lang={lang} />

      {/* Dos columnas: la captura arriba y el texto debajo, para que las
          tarjetas se comparen de un vistazo. */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {PROJECTS.map((project, i) => (
          <motion.article
            key={project.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.35, delay: (i % 2) * 0.06 }}
            className="glass rounded-[32px] p-5 md:p-7 border-gray-200 dark:border-white/5 flex flex-col hover:border-brand/30 transition-colors"
          >
            <ProjectCarousel project={project} />

            <div className="flex items-center gap-3 mt-6 mb-3">
              <Flag country={project.country} className="w-9 shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-black text-brand uppercase tracking-[0.2em] truncate">
                  {project.client}
                </span>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  {project.city} · {project.country}
                </span>
              </div>
            </div>

            <h3 className="text-xl md:text-2xl font-black mb-3">{project.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6 flex-1">
              {project.desc[lang]}
            </p>

            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-full bg-gray-200/70 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  </section>
);

// --- Components ---

// --- Contact Form Component ---

const ContactForm = ({ lang }: { lang: 'es' | 'en' }) => {
  const t = translations[lang].contact;
  // `empresa` es la trampa antispam: va oculta y una persona nunca la llena,
  // asi que si llega con texto el backend descarta el envio.
  const [form, setForm] = useState({ name: '', email: '', message: '', empresa: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  if (!CONTACT_WEBHOOK_URL) return null;

  // Si el envio falla, el mensaje no se pierde: se abre el correo con todo
  // ya escrito para que baste con darle enviar.
  const respaldoMailto = () => {
    const asunto = encodeURIComponent(`Contacto desde tu sitio — ${form.name || ''}`.trim());
    const cuerpo = encodeURIComponent(`${form.message}\n\n---\n${form.name}\n${form.email}`);
    return `mailto:diealeherbla.dh@gmail.com?subject=${asunto}&body=${cuerpo}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch(CONTACT_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ ...form, lang, page: 'didakus1177.github.io' }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus('success');
      setForm({ name: '', email: '', message: '', empresa: '' });
    } catch (err) {
      console.error('Contact form error:', err);
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-10 pt-10 border-t border-gray-200 dark:border-white/10">
      <h3 className="text-lg font-bold mb-6">{t.formTitle}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          required
          placeholder={t.formName}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors"
        />
        <input
          type="email"
          required
          placeholder={t.formEmail}
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors"
        />
      </div>
      <textarea
        required
        rows={4}
        placeholder={t.formMessage}
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        className="w-full bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors mb-4 resize-none"
      />
      {/* Trampa antispam. Oculta con CSS en vez de type="hidden" porque los
          robots que llenan formularios sí escriben en los campos ocultos por
          atributo. aria-hidden y tabIndex la sacan del paso de los lectores
          de pantalla y del recorrido con Tab. */}
      <input
        type="text"
        name="empresa"
        value={form.empresa}
        onChange={(e) => setForm({ ...form, empresa: e.target.value })}
        className="absolute w-px h-px -left-[9999px] opacity-0"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full sm:w-auto px-8 py-3 brand-gradient text-brand-black rounded-xl font-bold text-sm uppercase tracking-widest hover:scale-105 transition-transform disabled:opacity-60 disabled:hover:scale-100"
      >
        {status === 'sending' ? t.formSending : t.formSubmit}
      </button>
      {status === 'success' && <p className="mt-4 text-sm font-bold text-teal-500">{t.formSuccess}</p>}
      {status === 'error' && (
        <p className="mt-4 text-sm font-bold text-brand">
          {t.formError}{' '}
          <a href={respaldoMailto()} className="underline hover:no-underline">
            {t.formErrorLink}
          </a>
        </p>
      )}
    </form>
  );
};


export default function App() {
  const [lang, setLang] = useState<'es' | 'en'>('es');
  const [currentPage, setCurrentPage] = useState<'home' | 'resume' | 'datalab' | 'projects'>('home');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [bgIndex, setBgIndex] = useState(0);

  const t = translations[lang];

  React.useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Rotacion de las fotos de fondo del hero.
  // 8 s por foto: con 5 s la transicion de 2,2 s ocupaba casi la mitad del
  // tiempo y no se alcanzaba a apreciar cada imagen.
  React.useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % 4);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const toggleLang = () => setLang(prev => prev === 'es' ? 'en' : 'es');

  const openGmail = () => {
    window.open('https://mail.google.com/mail/?view=cm&fs=1&to=dialhebl.dh@gmail.com', '_blank');
  };

  if (currentPage === 'resume') {
    return (
      <Suspense fallback={<PantallaCargando />}>
        <Resume onBack={() => setCurrentPage('home')} lang={lang} />
      </Suspense>
    );
  }

  if (currentPage === 'datalab') {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#0a0a0a] dark:text-white transition-colors duration-300 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <BackButton onBack={() => setCurrentPage('home')} lang={lang} />
          <Suspense fallback={<CargandoBloque alto="h-[420px]" />}>
            <DataAnalyzer lang={lang} />
          </Suspense>
        </div>
      </div>
    );
  }

  if (currentPage === 'projects') {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#0a0a0a] dark:text-white transition-colors duration-300 pt-20">
        <div className="max-w-7xl mx-auto px-6">
          <BackButton onBack={() => setCurrentPage('home')} lang={lang} />
        </div>
        <ProjectsSection lang={lang} />
      </div>
    );
  }

  return (
    <div className="min-h-screen selection:bg-brand selection:text-brand-black bg-gray-50 text-gray-900 dark:bg-brand-black dark:text-brand-white transition-colors duration-300 relative">
      <BarraProgreso />

      {/* --- Navbar --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-gray-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <a href="#hero" className="flex items-center gap-3">
            <span className="font-black text-lg md:text-xl tracking-tighter uppercase">
              Diego <span className="text-brand">Hernández</span>
            </span>
            <span className="hidden lg:block text-[10px] font-bold text-gray-500 dark:text-gray-500 uppercase tracking-[0.2em] border-l border-gray-300 dark:border-white/10 pl-3">
              Desarrollo &middot; Analítica Industrial &amp; IA
            </span>
          </a>

          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-6 font-medium text-sm text-gray-600 dark:text-gray-400">
              <a href="#about" className="hover:text-gray-900 dark:hover:text-white transition-colors">{t.nav.about}</a>
              <a href="#solutions" className="hover:text-gray-900 dark:hover:text-white transition-colors">{t.nav.solutions}</a>
              <a href="#process" className="hover:text-gray-900 dark:hover:text-white transition-colors">{lang === 'es' ? 'Cómo trabajo' : 'How I work'}</a>
              <button onClick={() => setCurrentPage('projects')} className="hover:text-gray-900 dark:hover:text-white transition-colors">{lang === 'es' ? 'Proyectos' : 'Projects'}</button>
              
              <button onClick={() => setCurrentPage('datalab')} className="hover:text-gray-900 dark:hover:text-white transition-colors">Data Lab</button>
              <button onClick={() => setCurrentPage('resume')} className="hover:text-gray-900 dark:hover:text-white transition-colors">Curriculum</button>
              <a href="#contact" className="hover:text-gray-900 dark:hover:text-white transition-colors">{t.nav.contact}</a>
            </div>
            
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-1.5 rounded-full border border-gray-300 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-gray-600 dark:text-gray-300"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button 
              onClick={toggleLang}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-300 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-widest"
            >
              <Languages size={14} className="text-brand" />
              {lang}
            </button>
          </div>
        </div>
      </nav>

      {/* --- Hero --- */}
      <section id="hero" className="relative pt-40 pb-24 px-6 overflow-hidden min-h-[800px] flex items-center">
        {/* Background: animated glow + photo slider */}
        <div className="absolute inset-0 -z-20 overflow-hidden bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-300">
          {/* Las 4 fotos quedan montadas y solo cambia la opacidad.
              La opacidad va en `style` y no en clases de Tailwind porque
              `dark:opacity-45` no existe en la escala por defecto y el fondo
              se quedaba al 25% tambien en modo oscuro.
              Tampoco se cargan en diferido: al rotar, la siguiente foto
              todavia no habia llegado y el fondo aparecia vacio. */}
          {[0, 1, 2, 3].map((n) => (
            <img
              key={n}
              src={`/fondo/bg${n + 1}.webp`}
              alt=""
              aria-hidden
              fetchPriority={n === 0 ? 'high' : 'low'}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[2200ms] ease-in-out ${
                n === bgIndex ? 'hero-ken-burns' : ''
              }`}
              style={{ opacity: n === bgIndex ? (theme === 'dark' ? 0.55 : 0.28) : 0 }}
            />
          ))}
          {/* Velo para que el texto siga legible sobre la foto */}
          <div className="absolute inset-0 bg-gray-50/55 dark:bg-brand-black/45" />
          <div className="hero-gradient-bg" />
          <div className="tech-grid" />
          {/* Manchas de color que flotan lentamente: dan movimiento al fondo */}
          <div className="section-halo float-slow w-[420px] h-[420px] bg-brand/25 dark:bg-brand/20 -top-20 -left-24" />
          <div
            className="section-halo float-slow w-[360px] h-[360px] bg-amber-500/15 dark:bg-amber-500/10 bottom-0 right-0"
            style={{ animationDelay: '-9s' }}
          />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-gray-50 dark:from-brand-black to-transparent" />
        </div>

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-brand/20 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto text-center w-full relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-40 h-40 mx-auto mb-8 rounded-full overflow-hidden border-4 border-brand/20 shadow-[0_0_50px_rgba(245,158,11,0.25)]"
          >
            <img src="/profile.webp" alt="Diego Hernández" className="w-full h-full object-cover" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 text-sm font-medium text-brand"
          >
            <Cpu size={16} />
            {t.hero.subtitle}
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-[0.9] overflow-hidden">
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.45, ease: "easeOut" }}
              className="block"
            >
              DIEGO ALEJANDRO
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.45, ease: "easeOut" }}
              className="block text-brand"
            >
              HERNÁNDEZ BLANCO
            </motion.span>
          </h1>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <RotatingWord lang={lang} />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            {t.hero.description}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.18 }}
            className="mb-10"
          >
            <button 
              onClick={() => setCurrentPage('resume')} 
              className="px-8 py-3 glass rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-white/10 dark:hover:bg-gray-200 dark:hover:bg-white/10 transition-colors text-brand inline-flex items-center gap-2"
            >
              <FileJson size={20} />
              {lang === 'es' ? 'Ver Curriculum Completo' : 'View Full Resume'}
            </button>
          </motion.div>

          {/* Gancho: quitar el riesgo de dar el primer paso */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="inline-flex items-center gap-2 mb-8 px-5 py-2.5 rounded-full bg-brand/8 dark:bg-brand/12 border border-brand/30 text-sm font-bold text-brand"
          >
            <CheckCircle2 size={17} />
            {t.hero.freeConsult}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="flex flex-wrap justify-center gap-4">
              <button 
                onClick={openGmail}
                className="px-10 py-4 brand-gradient text-brand-black rounded-xl font-bold text-xl shadow-[0_10px_30px_rgba(245,158,11,0.35)] hover:scale-105 transition-transform flex items-center gap-3"
              >
                {t.hero.cta}
                <ArrowRight size={24} />
              </button>
              
              <div className="flex flex-wrap justify-center gap-4">
                <a 
                  href="https://wa.me/573337279204"
                  target="_blank"
                  rel="noreferrer"
                  className="p-4 glass rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 transition-all text-brand flex items-center gap-2 font-bold whitespace-nowrap"
                >
                  <MessageCircle size={20} />
                  +57 333 727 9204
                </a>
                <a 
                  href="https://wa.me/573216291861"
                  target="_blank"
                  rel="noreferrer"
                  className="p-4 glass rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 transition-all text-orange-600 flex items-center gap-2 font-bold whitespace-nowrap"
                >
                  <MessageCircle size={20} />
                  +57 321 629 1861
                </a>
                <a
                  href="https://wa.me/525647901745"
                  target="_blank"
                  rel="noreferrer"
                  className="p-4 glass rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 transition-all text-teal-600 dark:text-teal-400 flex items-center gap-2 font-bold whitespace-nowrap"
                >
                  <MessageCircle size={20} />
                  +52 56 4790 1745
                </a>
                <a 
                  href="https://github.com/DIDAKUS1177/didakus1177.github.io"
                  target="_blank"
                  rel="noreferrer"
                  className="p-4 glass rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 transition-all text-gray-600 dark:text-gray-400 flex items-center gap-2 font-bold whitespace-nowrap"
                >
                  <Github size={20} />
                  GitHub
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- Tools Marquee --- */}
      <div className="py-12 border-y border-gray-200 dark:border-white/5 bg-gray-100/60 dark:bg-white/[0.02] overflow-hidden">
        <div className="flex gap-12 animate-marquee whitespace-nowrap">
          {['Power BI', 'SQL', 'Python', 'R', 'AppSheet', 'Power Automate', 'Tableau', 'Machine Learning', 'AI Agents', 'Big Data'].map((tool, i) => (
            <span key={i} className="text-2xl font-black text-gray-400 dark:text-white/20 uppercase tracking-tighter italic">
              {tool}
            </span>
          ))}
          {['Power BI', 'SQL', 'Python', 'R', 'AppSheet', 'Power Automate', 'Tableau', 'Machine Learning', 'AI Agents', 'Big Data'].map((tool, i) => (
            <span key={i + 10} className="text-2xl font-black text-gray-400 dark:text-white/20 uppercase tracking-tighter italic">
              {tool}
            </span>
          ))}
        </div>
      </div>

      {/* --- About --- */}
      <section id="about" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-6">{t.nav.about}</h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-6">
                {lang === 'es' 
                  ? 'Ingeniero Metalúrgico y Especialista en Gestión de la Productividad y Mejoramiento Continuo, con sólida trayectoria en la transformación de procesos industriales y análisis de datos.'
                  : 'Metallurgical Engineer and Specialist in Productivity Management and Continuous Improvement, with a solid track record in transforming industrial processes and data analysis.'}
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-8">
                {lang === 'es'
                  ? 'Experto en la implementación de metodologías de mejora continua y desarrollo de software para la automatización de reportes y toma de decisiones. Destaco por mi capacidad para generar impacto en los resultados del negocio a través de soluciones tecnológicas ágiles.'
                  : 'Expert in implementing continuous improvement methodologies and software development for report automation and decision making. I stand out for my ability to generate impact on business results through agile technological solutions.'}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="rounded-[32px] overflow-hidden h-64 glass border-gray-200 dark:border-white/5"
              >
                <img src="/team1.webp" alt="Equipo de trabajo" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="rounded-[32px] overflow-hidden h-64 glass border-white/5 mt-12"
              >
                <img src="/team2.webp" alt="Trabajo en campo" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Muestra de analisis (parte de Servicios) --- */}
      <section id="analytics" className="pb-32 px-6 bg-gray-100/50 dark:bg-white/[0.01]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] font-black text-brand uppercase tracking-[0.25em]">
              {lang === 'es' ? 'Muestra de trabajo' : 'Work sample'}
            </span>
            <h3 className="text-3xl md:text-4xl font-black mb-4 mt-3">{t.analytics.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {lang === 'es'
                ? 'Estos son los análisis que entrego dentro de los proyectos: no son imágenes de ejemplo, son los gráficos reales que uso para encontrar dónde está el problema.'
                : 'These are the analyses I deliver inside projects: not stock images, but the actual charts I use to find where the problem is.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Pareto */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="glass p-8 rounded-[40px] border-gray-200 dark:border-white/5"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center">
                  <BarChart3 className="text-brand" size={20} />
                </div>
                <h3 className="text-xl font-bold">{t.analytics.pareto.title}</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-8">{t.analytics.pareto.desc}</p>
              <Suspense fallback={<CargandoBloque alto="h-[300px]" />}><ParetoChartComponent /></Suspense>
            </motion.div>

            {/* Ishikawa */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="glass p-8 rounded-[40px] border-white/5 overflow-hidden"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center">
                  <Target className="text-brand" size={20} />
                </div>
                <h3 className="text-xl font-bold">{t.analytics.ishikawa.title}</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-8">{t.analytics.ishikawa.desc}</p>
              <Suspense fallback={<CargandoBloque alto="h-[300px]" />}><IshikawaDiagram /></Suspense>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Radar Chart */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="lg:col-span-1 glass p-8 rounded-[40px] border-gray-200 dark:border-white/5"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center">
                  <Target className="text-brand" size={20} />
                </div>
                <h3 className="text-xl font-bold">{t.analytics.radar.title}</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-8">{t.analytics.radar.desc}</p>
              <Suspense fallback={<CargandoBloque alto="h-[300px]" />}><RadarChartComponent /></Suspense>
            </motion.div>

            {/* Trends Chart */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="lg:col-span-2 glass p-8 rounded-[40px] border-gray-200 dark:border-white/5"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center">
                  <TrendingUp className="text-brand" size={20} />
                </div>
                <h3 className="text-xl font-bold">{t.analytics.trends.title}</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-8">{t.analytics.trends.desc}</p>
              <Suspense fallback={<CargandoBloque alto="h-[300px]" />}><TrendChartComponent /></Suspense>
            </motion.div>
          </div>

          <div className="mt-8">
            {/* Dashboard */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass p-8 rounded-[40px] border-brand/20 bg-brand/[0.02]"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center">
                    <Activity className="text-brand" size={20} />
                  </div>
                  <h3 className="text-xl font-bold">{t.analytics.dashboard.title}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Live System</span>
                </div>
              </div>
              <Suspense fallback={<CargandoBloque alto="h-[150px]" />}><LiveDashboard lang={lang} /></Suspense>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- Data Analyzer --- */}
      {/* Moved to separate page */}

      {/* --- Servicios: areas, detalle y muestra de analisis --- */}
      <section id="solutions" className="pt-32 pb-24 px-6 relative overflow-hidden bg-gray-100/50 dark:bg-white/[0.01]">
        <div className="tech-grid opacity-70" />
        <div className="section-halo float-slow w-[500px] h-[500px] bg-brand/10 dark:bg-brand/[0.07] top-1/4 -right-40" />

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">{t.services.title}</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              {lang === 'es'
                ? 'No vendo herramientas sueltas: acompaño el problema desde el diagnóstico hasta que la solución queda funcionando y el equipo sabe usarla.'
                : 'I do not sell isolated tools: I follow the problem from diagnosis until the solution is running and the team knows how to use it.'}
            </p>
          </div>

          <ServiceAreas lang={lang} />

          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-black mb-3">
              {lang === 'es' ? 'El detalle de cada servicio' : 'The detail of each service'}
            </h3>
            <p className="text-[11px] font-bold uppercase tracking-widest text-brand">
              {lang === 'es' ? 'Toca cada tarjeta para desplegarla' : 'Tap each card to expand it'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            {SERVICES.map((service, i) => (
              <ServiceCard key={service.title.en} service={service} lang={lang} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* --- Impacto (propuesta) --- */}
      <HowIWork lang={lang} />

      <ProjectsCta lang={lang} onVerProyectos={() => setCurrentPage('projects')} />

      {/* --- Success Map --- */}
      {/* Moved to separate page */}

      {/* --- Contact --- */}
      <section id="contact" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-black mb-4">{t.contact.title}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              {t.contact.subtitle}
            </p>
          </div>

          {/* Canales de contacto en rejilla; antes habia un recuadro vacio
              con un icono de chip que no aportaba nada. */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {[
              { onClick: openGmail, icon: Mail, bg: 'bg-brand',
                title: t.contact.gmail, sub: 'dialhebl.dh@gmail.com' },
              { href: 'https://wa.me/573337279204', icon: MessageCircle, bg: 'bg-[#25D366]',
                title: t.contact.whatsapp, sub: '+57 333 727 9204' },
              { href: 'https://wa.me/573216291861', icon: MessageCircle, bg: 'bg-[#25D366]',
                title: t.contact.whatsappPersonal, sub: '+57 321 629 1861' },
              { href: 'https://wa.me/525647901745', icon: MessageCircle, bg: 'bg-[#25D366]',
                title: t.contact.whatsappMx, sub: '+52 56 4790 1745' },
              { href: 'https://www.linkedin.com/in/diego-alejandro-hernandez-blanco-08b64120b',
                icon: Linkedin, bg: 'bg-[#0A66C2]', title: t.contact.linkedin, sub: 'Diego A. Hernández Blanco' },
            ].map((c) => {
              const Icono = c.icon;
              const contenido = (
                <>
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`w-12 h-12 shrink-0 rounded-xl ${c.bg} flex items-center justify-center`}>
                      <Icono className="text-white" size={22} />
                    </div>
                    <div className="text-left min-w-0">
                      <p className="font-bold truncate">{c.title}</p>
                      <p className="text-sm text-gray-500 truncate">{c.sub}</p>
                    </div>
                  </div>
                  <ChevronRight className="shrink-0 text-gray-400 group-hover:text-brand group-hover:translate-x-1 transition-all" />
                </>
              );
              const clase = "flex items-center justify-between gap-3 p-5 glass rounded-2xl border-gray-200 dark:border-white/5 hover:border-brand/40 transition-all group w-full";
              return c.href ? (
                <a key={c.sub} href={c.href} target="_blank" rel="noreferrer" className={clase}>{contenido}</a>
              ) : (
                <button key={c.sub} onClick={c.onClick} className={clase}>{contenido}</button>
              );
            })}
          </div>

          {/* Disponibilidad: da contexto util antes de que escriban */}
          <div className="glass rounded-2xl border-gray-200 dark:border-white/5 p-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm">
            <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              {lang === 'es' ? 'Disponible para nuevos proyectos' : 'Available for new projects'}
            </span>
            <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <MapPin size={15} className="text-brand" />
              {lang === 'es' ? 'Ciudad de México · remoto' : 'Mexico City · remote'}
            </span>
            <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Languages size={15} className="text-brand" />
              {lang === 'es' ? 'Español · Inglés' : 'Spanish · English'}
            </span>
          </div>

          <div className="max-w-2xl mx-auto">
            <ContactForm lang={lang} />
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="py-12 px-6 border-t border-gray-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <a href="#hero" className="font-black text-sm tracking-tighter uppercase">
            Diego <span className="text-brand">Hernández</span>
          </a>
          
          <p className="text-gray-500 dark:text-gray-500 text-sm">
            {t.footer}
          </p>

          <div className="flex items-center gap-4">
            <a
              href="https://www.linkedin.com/in/diego-alejandro-hernandez-blanco-08b64120b"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="p-2 glass rounded-lg hover:text-brand transition-colors"
            >
              <Linkedin size={18} />
            </a>
            <button
              onClick={openGmail}
              aria-label={t.contact.gmail}
              className="p-2 glass rounded-lg hover:text-brand transition-colors"
            >
              <Mail size={18} />
            </button>
          </div>
        </div>
      </footer>

      {/* --- Floating Action Buttons --- */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-[100]">
        <a 
          href="https://wa.me/573337279204" 
          target="_blank"
          rel="noreferrer"
          className="w-14 h-14 bg-brand rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(245,158,11,0.45)] hover:scale-110 transition-transform group relative"
          title={t.contact.whatsapp}
        >
          {/* Icono grafito, no blanco: sobre el ambar del modo oscuro el
              blanco da 2.15:1 y un icono necesita 3:1. El grafito da 3.6:1
              en claro y 8.3:1 en oscuro. */}
          <MessageCircle className="text-brand-black" size={28} />
          <span className="absolute right-full mr-4 glass px-3 py-1 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {t.contact.whatsapp}
          </span>
        </a>
        
        <a 
          href="https://wa.me/573216291861" 
          target="_blank"
          rel="noreferrer"
          className="w-14 h-14 bg-orange-600 rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(234,88,12,0.3)] hover:scale-110 transition-transform group relative"
          title={t.contact.whatsappPersonal}
        >
          <User className="text-white" size={28} />
          <span className="absolute right-full mr-4 glass px-3 py-1 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {t.contact.whatsappPersonal}
          </span>
        </a>

        <a 
          href="https://www.linkedin.com/in/diego-alejandro-hernandez-blanco-08b64120b" 
          target="_blank"
          rel="noreferrer"
          className="w-14 h-14 bg-[#0A66C2] rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(10,102,194,0.3)] hover:scale-110 transition-transform group relative"
          title={t.contact.linkedin}
        >
          <Linkedin className="text-white" size={28} />
          <span className="absolute right-full mr-4 glass px-3 py-1 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            LinkedIn
          </span>
        </a>

        <a 
          href="https://github.com/DIDAKUS1177/didakus1177.github.io" 
          target="_blank"
          rel="noreferrer"
          className="w-14 h-14 bg-[#333] rounded-full flex items-center justify-center shadow-lg dark:shadow-[0_10px_30px_rgba(255,255,255,0.1)] hover:scale-110 transition-transform group relative"
          title="GitHub"
        >
          <Github className="text-white" size={28} />
          <span className="absolute right-full mr-4 glass px-3 py-1 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            GitHub
          </span>
        </a>

        {/* Este boton usaba `glass`, que en modo claro es bg-white/70, con el
            icono en text-white: blanco sobre blanco, desaparecia. Ahora lleva
            fondo solido como los otros cuatro, asi un unico icono blanco
            funciona en ambos temas sin depender de la variante dark. */}
        <button
          onClick={openGmail}
          className="w-14 h-14 bg-slate-600 rounded-full flex items-center justify-center shadow-lg dark:shadow-[0_10px_30px_rgba(255,255,255,0.1)] hover:scale-110 transition-transform group relative"
          title={t.contact.gmail}
        >
          <Mail className="text-white" size={28} />
          <span className="absolute right-full mr-4 glass px-3 py-1 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Email
          </span>
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(245, 158, 11, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(245, 158, 11, 0.8);
        }
      `}} />
    </div>
  );
}
