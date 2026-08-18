import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import Papa from 'papaparse';
import {
  Briefcase,
  GraduationCap,
  Award,
  Code,
  ChevronLeft,
  Download,
  BookOpen,
  Search,
  User,
  Loader2,
  ChevronRight,
  Image as ImageIcon,
  Languages,
  Phone,
  MessageCircle
} from 'lucide-react';

import fallbackCoursesData from './data/curriculum.json';
import { BackButton } from './App';

interface Course {
  id: string;
  topic: string;
  institute: string;
  type: string;
  name: string;
  hours: string;
  year: string;
  month: string;
}

const SHEET_CSV_URL = import.meta.env.VITE_CURRICULUM_SHEET_CSV_URL as string | undefined;

// Carga los cursos desde una hoja de Google Sheets publicada como CSV (si está
// configurada); si no, usa el respaldo local en src/data/curriculum.json.
function useCourses(): { courses: Course[]; loading: boolean; fromSheet: boolean } {
  const [courses, setCourses] = useState<Course[]>(fallbackCoursesData as Course[]);
  const [loading, setLoading] = useState(!!SHEET_CSV_URL);
  const [fromSheet, setFromSheet] = useState(false);

  useEffect(() => {
    if (!SHEET_CSV_URL) return;

    fetch(SHEET_CSV_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then((csvText) => {
        const parsed = Papa.parse<Course>(csvText, { header: true, skipEmptyLines: true });
        if (parsed.data.length > 0) {
          setCourses(parsed.data);
          setFromSheet(true);
        }
      })
      .catch((err) => {
        console.warn('No se pudo cargar el currículum desde Google Sheets, usando respaldo local.', err);
      })
      .finally(() => setLoading(false));
  }, []);

  return { courses, loading, fromSheet };
}

const INSTITUTE_TEXT_STYLE: Record<string, string> = {
  platzi: 'text-[#98CA3F]',
  sena: 'text-[#FF6E00]',
  mintic: 'text-[#000000] bg-white px-1 rounded',
  uptc: 'text-[#F39200]',
  ricaute: 'text-blue-400',
  'saber +': 'text-teal-400',
  ipn: 'text-[#6A1B32] dark:text-[#C8A2C8]',
};

const slugify = (s: string) => s.toLowerCase().trim().replace(/\s*\+\s*$/, '-mas').replace(/[^a-z0-9]+/g, '-');

// Intenta cargar public/logos/{slug}.png; si no existe, cae al texto con color de marca.
// Para activar un logo real solo hace falta colocar el archivo con ese nombre — sin tocar código.
const InstituteLogo = ({ institute, className = 'h-6 max-w-[110px]' }: { institute: string; className?: string }) => {
  const [imgFailed, setImgFailed] = useState(false);
  const key = institute.toLowerCase().trim();
  const textStyle = INSTITUTE_TEXT_STYLE[key] ?? '';

  if (!imgFailed) {
    // Placa blanca: IPN y UPTC son oscuros y se pierden sobre fondo oscuro.
    return (
      <span className="inline-flex items-center justify-center bg-white rounded-md px-1.5 py-1 ring-1 ring-black/10 dark:ring-white/15">
        <img
          src={`/logos/${slugify(institute)}.png`}
          alt={institute}
          className={`${className} object-contain`}
          onError={() => setImgFailed(true)}
        />
      </span>
    );
  }

  return <span className={`font-black tracking-tighter ${textStyle || 'text-gray-300'}`}>{institute}</span>;
};

const SITE_URL = 'https://didakus1177.github.io/';
const CV_PDF = '/Diego_Hernandez_Blanco_Hoja_de_Vida.pdf';

// Certificacion de idioma. Los puntajes salen de la constancia oficial del
// CENLEX y se pueden verificar en el sitio del IPN.
const LANGUAGES = {
  nativo: { es: 'Español — Nativo', en: 'Spanish — Native' },
  cert: {
    idioma: { es: 'Inglés', en: 'English' },
    nivel: 'B1',
    marco: { es: 'Marco Común Europeo de Referencia (MCER)', en: 'Common European Framework (CEFR)' },
    emisor: 'CENLEX Unidad Zacatenco — Instituto Politécnico Nacional (IPN)',
    tipo: { es: 'Examen de dominio del idioma inglés para maestría', en: 'English proficiency exam for master\'s admission' },
    fecha: { es: 'Junio 2026 · vigente hasta junio 2027', en: 'June 2026 · valid until June 2027' },
    verificar: 'https://www.servicios.cenlexz.ipn.mx/examenes/valida',
    puntajes: [
      { es: 'Comprensión de lectura', en: 'Reading comprehension', v: 90 },
      { es: 'Comprensión auditiva', en: 'Listening comprehension', v: 90 },
      { es: 'Expresión escrita', en: 'Written expression', v: 90 },
      { es: 'Expresión oral', en: 'Oral expression', v: 65 },
    ],
  },
};

// Referencias laborales, con telefono a peticion expresa del titular del sitio.
// Nota: al publicarse quedan visibles para cualquiera y son rastreables por
// robots que recolectan numeros. El enlace `tel:` y el de WhatsApp los hacen
// utiles desde el movil.
const REFERENCES = [
  { nombre: 'Iván Numpaké', cargo: { es: 'Especialista en Sostenibilidad', en: 'Sustainability Specialist' }, org: 'BHR Colombia', tel: '+57 317 501 3135' },
  { nombre: 'Rocío Téllez', cargo: { es: 'Consultora Especialista de Calidad', en: 'Quality Consultant' }, org: '—', tel: '+57 311 811 8722' },
  { nombre: 'Felipe Torres', cargo: { es: 'Especialista API — Integridad de Activos', en: 'API Specialist — Asset Integrity' }, org: 'ADEMINCOL', tel: '+57 317 401 6701' },
  { nombre: 'Javier Carvajal', cargo: { es: 'Coordinador de Mejora Continua', en: 'Continuous Improvement Coordinator' }, org: 'Acerías Paz del Río', tel: '+57 320 302 3095' },
  { nombre: 'Carlos Falcão', cargo: { es: 'Director de Alto Horno', en: 'Blast Furnace Director' }, org: 'Acerías Paz del Río', tel: '+57 320 890 9138' },
];

// Experiencia laboral. `photos` = cuántas imágenes hay en
// public/experiencia/{id}/{1..n}.webp — al subirlas y aumentar el número
// aparecen solas, sin tocar nada más.
const EXPERIENCE = [
  {
    id: 'ccd-uptc',
    photos: 0,
    title: 'Gestor de Proyectos y Procesos (OPS)',
    org: 'CÁMARA DE COMERCIO DE DUITAMA / UPTC',
    period: 'Sep 2025 – Feb 2026',
    bullets: [
      'Lideré la reestructuración y análisis de procesos operativos, logrando una estandarización que optimizó los tiempos de respuesta interinstitucionales.',
      'Implementé metodologías ágiles para la gestión de proyectos conjuntos, asegurando el cumplimiento de cronogramas y entregables clave.',
      'Desarrollé tableros de control y KPIs para el monitoreo en tiempo real del desempeño de los proyectos asignados.',
    ],
  },
  {
    id: 'bhr',
    photos: 0,
    title: 'Desarrollador de Software y Analista de Datos',
    org: 'BUSINESS AND HUMAN RIGHTS (BHR)',
    period: 'Proyecto',
    bullets: [
      'Creación de software a medida para la digitalización de formularios y procesos de recolección de información en campo.',
      'Automatización de la recopilación y regeneración de reportes, reduciendo significativamente los tiempos de procesamiento manual y errores operativos.',
      'Implementación de sistemas de análisis de datos para la interpretación masiva de encuestas y métricas de impacto social y empresarial.',
    ],
  },
  {
    id: 'ademincol',
    photos: 0,
    title: 'Ingeniero Desarrollador e Integral de Activos',
    org: 'ADEMINCOL',
    period: 'Jul 2024 – Actualidad',
    bullets: [
      'Gestión integral de integridad de activos industriales aplicando normativas API (580, 581, 570) y ASME.',
      'Transformación digital de procesos de inspección mediante el desarrollo de aplicaciones y análisis de datos con Python, R y SQL.',
      'Diseño de dashboards en Power BI para la visualización de riesgos y toma de decisiones basada en datos (RBI).',
    ],
  },
  {
    id: 'laboratorio',
    photos: 0,
    title: 'Auditor de Calidad y Procesos',
    org: 'LABORATORIO DE PRUEBAS ELECTROMECÁNICAS',
    period: 'Feb 2024 – Abr 2024',
    bullets: [
      'Ejecuté auditorías internas bajo normas ISO 17025 e ISO 9001, optimizando el sistema de gestión documental.',
      'Implementé controles en Power BI para el seguimiento de indicadores de calidad en tiempo real.',
    ],
  },
  {
    id: 'paz-del-rio',
    photos: 5,
    title: 'Ingeniero de Mejora Continua – Alto Horno',
    org: 'ACERÍAS PAZ DEL RÍO',
    period: 'Ene 2023 – Dic 2023',
    bullets: [
      'Lideré proyectos de mejora continua utilizando herramientas estadísticas (Minitab, Python) para identificar y eliminar cuellos de botella en producción.',
      'Desarrollé e implementé herramientas de control en Power BI y Excel Avanzado, mejorando la visibilidad operativa y la toma de decisiones.',
      'Apoyé la implementación y mantenimiento de sistemas de gestión integral (Hitch) bajo normas ISO.',
    ],
  },
];

// Tira de fotos de cada experiencia. Misma mecánica que el carrusel de
// proyectos: transición por CSS, con flechas cuando hay más de una.
const ExperiencePhotos = ({ exp, lang }: { exp: (typeof EXPERIENCE)[number]; lang: 'es' | 'en' }) => {
  const [i, setI] = useState(0);

  if (exp.photos === 0) {
    return (
      <div className="aspect-[16/9] rounded-2xl border border-dashed border-gray-300 dark:border-white/10 flex flex-col items-center justify-center gap-1.5 mb-5 bg-gray-50 dark:bg-white/[0.015]">
        <ImageIcon size={18} className="text-gray-400 dark:text-gray-600" />
        <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-600">
          {lang === 'es' ? 'Espacio para fotos' : 'Space for photos'}
        </p>
      </div>
    );
  }

  return (
    <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-5 bg-gray-200 dark:bg-black/40 group/exp">
      {Array.from({ length: exp.photos }).map((_, n) => (
        <img
          key={n}
          src={`/experiencia/${exp.id}/${n + 1}.webp`}
          alt={`${exp.title} — ${n + 1}`}
          loading="lazy"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            n === i ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      {exp.photos > 1 && (
        <>
          <button
            onClick={() => setI((p) => (p - 1 + exp.photos) % exp.photos)}
            aria-label="Anterior"
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/35 hover:bg-black/60 text-white/80 hover:text-white flex items-center justify-center opacity-60 group-hover/exp:opacity-100 transition-all"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => setI((p) => (p + 1) % exp.photos)}
            aria-label="Siguiente"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/35 hover:bg-black/60 text-white/80 hover:text-white flex items-center justify-center opacity-60 group-hover/exp:opacity-100 transition-all"
          >
            <ChevronRight size={18} />
          </button>

          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-black/45 text-[9px] font-bold text-white/85">
            {i + 1} / {exp.photos}
          </div>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {Array.from({ length: exp.photos }).map((_, n) => (
              <button
                key={n}
                onClick={() => setI(n)}
                aria-label={`Ver foto ${n + 1}`}
                className={`h-1 rounded-full transition-all ${
                  n === i ? 'w-4 bg-brand-red' : 'w-1 bg-white/60 hover:bg-white/90'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// Formación académica, de lo más reciente a lo más antiguo.
const EDUCATION = [
  {
    logo: 'IPN',
    title: 'Maestría en Informática',
    highlights: ['Investigación aplicada', 'Sistemas inteligentes', 'Ingeniería de software', 'Datos a gran escala'],
    institute: 'Instituto Politécnico Nacional (IPN) · México',
    years: '2026 – 2028',
    status: { es: 'En curso', en: 'In progress' },
    desc: {
      es: 'Formación avanzada en ciencias de la computación e ingeniería de software, orientada a la investigación aplicada en sistemas inteligentes y tratamiento de datos a gran escala.',
      en: 'Advanced training in computer science and software engineering, focused on applied research in intelligent systems and large-scale data processing.',
    },
  },
  {
    logo: 'SENA',
    title: 'Tecnólogo en Aplicaciones para Cloud',
    highlights: ['Arquitecturas escalables', 'Contenedores y Docker', 'Servicios administrados', 'Integración continua', 'Despliegue en la nube'],
    institute: 'SENA',
    years: '2025 – 2026',
    status: { es: 'En certificación', en: 'Awaiting certification' },
    desc: {
      es: 'Desarrollo y despliegue de aplicaciones en la nube: arquitecturas escalables, contenedores, servicios administrados e integración continua.',
      en: 'Development and deployment of cloud applications: scalable architectures, containers, managed services and continuous integration.',
    },
  },
  {
    logo: 'SENA',
    title: 'Tecnólogo en Análisis y Desarrollo de Sistemas de Información',
    highlights: ['Desarrollo en Power BI', 'AppSheet y low-code', 'Modelado de bases de datos', 'SQL', 'Ciclo de vida del software', 'Análisis de requisitos'],
    institute: 'SENA',
    years: '2022 – 2024',
    status: null,
    desc: {
      es: 'Análisis, diseño y construcción de sistemas de información: modelado de bases de datos, desarrollo de software y gestión del ciclo de vida de las aplicaciones.',
      en: 'Analysis, design and construction of information systems: database modeling, software development and application lifecycle management.',
    },
  },
  {
    logo: 'UPTC',
    title: 'Especialización en Gestión de la Productividad y Mejoramiento Continuo',
    highlights: ['Lean Manufacturing', 'Six Sigma', 'Kaizen', 'Indicadores de productividad', 'Estandarización de procesos'],
    institute: 'Universidad Pedagógica y Tecnológica de Colombia (UPTC)',
    years: '2023 – 2024',
    status: null,
    desc: {
      es: 'Metodologías de mejora continua aplicadas a la industria (Lean Manufacturing, Six Sigma, Kaizen), medición de productividad y estandarización de procesos operativos.',
      en: 'Continuous improvement methodologies applied to industry (Lean Manufacturing, Six Sigma, Kaizen), productivity measurement and operational process standardization.',
    },
  },
  {
    logo: 'UPTC',
    title: 'Ingeniería Metalúrgica',
    highlights: ['Grupo de investigación INCITEMA', 'Grupo GIMEP', 'Metalurgia extractiva', 'Ensayos no destructivos (END)', 'Ciencia de materiales', 'Siderurgia', 'Caracterización de materiales', 'Integridad de activos'],
    institute: 'Universidad Pedagógica y Tecnológica de Colombia (UPTC)',
    years: '2018 – 2023',
    status: null,
    desc: {
      es: 'Base de ingeniería en procesos siderúrgicos, ciencia de materiales, integridad de activos y control de calidad, sustento técnico de mi trabajo en entornos industriales.',
      en: 'Engineering foundation in steelmaking processes, materials science, asset integrity and quality control — the technical grounding for my work in industrial environments.',
    },
  },
];

interface ResumeProps {
  onBack: () => void;
  lang: 'es' | 'en';
}

export const Resume: React.FC<ResumeProps> = ({ onBack, lang }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [topicFilter, setTopicFilter] = useState('');
  const [instituteFilter, setInstituteFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const { courses, loading, fromSheet } = useCourses();

  const topics = Array.from(new Set(courses.map(c => c.topic))).filter(Boolean).sort();
  const institutes = Array.from(new Set(courses.map(c => c.institute))).filter(Boolean).sort();
  const types = Array.from(new Set(courses.map(c => c.type))).filter(Boolean).sort();

  const filteredCourses = courses.filter(course =>
    (course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.institute.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (topicFilter === '' || course.topic === topicFilter) &&
    (instituteFilter === '' || course.institute === instituteFilter) &&
    (typeFilter === '' || course.type === typeFilter)
  );

  const selectClass =
    "bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 hover:border-gray-400 dark:hover:border-white/25 transition-colors cursor-pointer";

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#0a0a0a] dark:text-white transition-colors duration-300 py-20 px-6">
      <div className="max-w-5xl mx-auto">
        
        <div className="mb-10">
          <BackButton onBack={onBack} lang={lang} />
        </div>

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-12 rounded-[40px] mb-12 relative overflow-hidden flex flex-col md:flex-row items-center gap-8"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red/10 blur-[100px] -z-10" />
          <div className="w-32 h-32 md:w-48 md:h-48 shrink-0 rounded-full overflow-hidden border-4 border-brand-red/20 shadow-[0_0_30px_rgba(211,47,47,0.2)]">
            <img src="/profile.webp" alt="Diego Hernández" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-black mb-4">DIEGO ALEJANDRO HERNÁNDEZ BLANCO</h1>
            <h2 className="text-xl md:text-2xl text-brand-red font-bold mb-6">
              Ingeniero Metalúrgico | Especialista en Productividad y Mejora Continua | Data Scientist
            </h2>
            <div className="flex flex-wrap gap-4 text-gray-600 dark:text-gray-400 text-sm mb-6">
              <span>📍 Ciudad de México (CDMX)</span>
              <span>📱 +57 321 629 1861</span>
              <span>✉️ dialhebl.dh@gmail.com</span>
            </div>

            <a
              href={CV_PDF}
              download="Diego_Hernandez_Blanco_Hoja_de_Vida.pdf"
              className="inline-flex items-center gap-2.5 px-6 py-3 red-gradient rounded-xl font-bold text-sm text-white hover:scale-105 transition-transform shadow-[0_8px_20px_rgba(211,47,47,0.3)]"
            >
              <Download size={18} />
              {lang === 'es' ? 'Descargar hoja de vida (PDF)' : 'Download resume (PDF)'}
            </a>
          </div>

          {/* QR al portafolio: util al imprimir el CV o mostrarlo en pantalla.
              Se muestra siempre la URL en texto para que no sea un enlace opaco. */}
          <a
            href={SITE_URL}
            className="shrink-0 md:ml-auto text-center group"
            title={lang === 'es' ? 'Abrir el portafolio' : 'Open the portfolio'}
          >
            <div className="w-28 h-28 rounded-2xl bg-white p-2 ring-1 ring-gray-300 dark:ring-white/20 shadow-sm group-hover:ring-brand-red transition-all">
              <img
                src="/qr-sitio.svg"
                alt={lang === 'es' ? 'Código QR del portafolio de Diego Hernández' : 'QR code to Diego Hernández portfolio'}
                className="w-full h-full"
              />
            </div>
            <p className="mt-2 text-[9px] font-bold uppercase tracking-widest text-gray-500">
              {lang === 'es' ? 'Escanea el portafolio' : 'Scan the portfolio'}
            </p>
            <p className="text-[9px] text-gray-500 dark:text-gray-600 break-all max-w-28">
              didakus1177.github.io
            </p>
          </a>
        </motion.div>

        {/* Profile */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
            <User className="text-brand-red" />
            {lang === 'es' ? 'PERFIL PROFESIONAL' : 'PROFESSIONAL PROFILE'}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
            Ingeniero Metalúrgico y Especialista en Gestión de la Productividad y Mejoramiento Continuo, con sólida trayectoria en la transformación de procesos industriales y análisis de datos. Experto en la implementación de metodologías de mejora continua (Lean Manufacturing, Six Sigma, Kaizen) y desarrollo de software para la automatización de reportes y toma de decisiones. Poseo dominio avanzado de herramientas de Business Intelligence (Power BI, Tableau) y lenguajes de programación (Python, R, SQL). Cuento con experiencia liderando proyectos de estandarización operativa y auditorías de calidad (ISO 9001, 14001, 45001). Destaco por mi capacidad para generar impacto en los resultados del negocio a través de soluciones tecnológicas ágiles y gestión estratégica de la información.
          </p>
        </motion.div>

        {/* Experience */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
            <Briefcase className="text-brand-red" />
            {lang === 'es' ? 'EXPERIENCIA LABORAL' : 'WORK EXPERIENCE'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {EXPERIENCE.map((exp) => (
              <div key={exp.id} className="glass p-6 rounded-3xl border-l-4 border-l-brand-red flex flex-col">
                <ExperiencePhotos exp={exp} lang={lang} />
                <h4 className="text-lg font-bold leading-snug">{exp.title}</h4>
                <div className="text-brand-red text-xs font-bold mb-4 mt-1">
                  {exp.org} | {exp.period}
                </div>
                <ul className="list-disc list-outside pl-4 text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  {exp.bullets.map((b, k) => <li key={k}>{b}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Education */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
            <GraduationCap className="text-brand-red" />
            {lang === 'es' ? 'FORMACIÓN ACADÉMICA' : 'EDUCATION'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {EDUCATION.map((e) => (
              <div key={e.title} className="glass p-6 rounded-2xl flex flex-col">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h4 className="font-bold leading-snug">{e.title}</h4>
                  {e.status && (
                    <span className="shrink-0 text-[9px] font-black uppercase tracking-widest text-amber-500 bg-amber-500/10 border border-amber-500/30 px-2 py-1 rounded-full">
                      {lang === 'es' ? e.status.es : e.status.en}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2.5 mb-3">
                  <InstituteLogo institute={e.logo} className="h-7 max-w-[80px]" />
                  <p className="text-sm text-brand-red font-bold">
                    {e.institute} · {e.years}
                  </p>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  {lang === 'es' ? e.desc.es : e.desc.en}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {e.highlights.map((h) => (
                    <span
                      key={h}
                      className="px-2.5 py-1 rounded-full bg-brand-red/8 dark:bg-brand-red/12 border border-brand-red/25 text-[10px] font-bold text-brand-red uppercase tracking-wide"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Courses Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <h3 className="text-2xl font-black flex items-center gap-3">
              <BookOpen className="text-brand-red" />
              {lang === 'es' ? 'CURSOS Y CERTIFICACIONES' : 'COURSES & CERTIFICATIONS'}
              {loading && <Loader2 className="animate-spin text-gray-500" size={18} />}
              {fromSheet && (
                <span className="text-[9px] font-bold text-teal-500 uppercase tracking-widest bg-teal-500/10 px-2 py-1 rounded-full">
                  {lang === 'es' ? 'En vivo · Google Sheets' : 'Live · Google Sheets'}
                </span>
              )}
            </h3>
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="text"
                  placeholder={lang === 'es' ? 'Buscar curso...' : 'Search course...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`${selectClass} pl-10 pr-4 w-full md:w-56`}
                />
              </div>
              <select value={topicFilter} onChange={(e) => setTopicFilter(e.target.value)} className={selectClass}>
                <option value="">{lang === 'es' ? 'Todas las temáticas' : 'All topics'}</option>
                {topics.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <select value={instituteFilter} onChange={(e) => setInstituteFilter(e.target.value)} className={selectClass}>
                <option value="">{lang === 'es' ? 'Todos los institutos' : 'All institutes'}</option>
                {institutes.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className={selectClass}>
                <option value="">{lang === 'es' ? 'Todos los tipos' : 'All types'}</option>
                {types.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <p className="text-xs text-gray-500 mb-4">
            {lang === 'es'
              ? `Mostrando ${filteredCourses.length} de ${courses.length} cursos`
              : `Showing ${filteredCourses.length} of ${courses.length} courses`}
          </p>

          <div className="glass rounded-[32px] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-gray-400 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-4">Temática</th>
                    <th className="p-4">Curso</th>
                    <th className="p-4">Instituto</th>
                    <th className="p-4">Tipo</th>
                    <th className="p-4">Horas</th>
                    <th className="p-4">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredCourses.map((course) => (
                    <tr key={course.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <span className="px-2 py-1 rounded bg-brand-red/20 text-brand-red text-[10px] font-bold uppercase">
                          {course.topic}
                        </span>
                      </td>
                      <td className="p-4 font-medium text-gray-200">{course.name}</td>
                      <td className="p-4"><InstituteLogo institute={course.institute} /></td>
                      <td className="p-4 text-gray-400">{course.type}</td>
                      <td className="p-4 text-gray-400">{course.hours !== 'NA' ? `${course.hours}h` : '-'}</td>
                      <td className="p-4 text-gray-400">{course.month}/{course.year}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredCourses.length === 0 && (
                <div className="p-8 text-center text-gray-500 italic">
                  {lang === 'es' ? 'No se encontraron cursos.' : 'No courses found.'}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Idiomas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
            <Languages className="text-brand-red" />
            {lang === 'es' ? 'IDIOMAS' : 'LANGUAGES'}
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="glass p-6 rounded-3xl flex flex-col justify-center">
              <p className="text-lg font-black mb-1">{LANGUAGES.nativo[lang]}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {lang === 'es' ? 'Lengua materna' : 'Mother tongue'}
              </p>
            </div>

            {/* Certificacion de ingles */}
            <div className="glass p-6 rounded-3xl lg:col-span-2 border-l-4 border-l-brand-red">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="text-lg font-black">
                    {LANGUAGES.cert.idioma[lang]}
                    <span className="ml-2 text-brand-red">{LANGUAGES.cert.nivel}</span>
                  </p>
                  <p className="text-xs text-gray-500">{LANGUAGES.cert.marco[lang]}</p>
                </div>
                <span className="shrink-0 text-[9px] font-black uppercase tracking-widest text-brand-red bg-brand-red/10 border border-brand-red/30 px-2.5 py-1 rounded-full">
                  {lang === 'es' ? 'Certificado' : 'Certified'}
                </span>
              </div>

              <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{LANGUAGES.cert.emisor}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{LANGUAGES.cert.tipo[lang]}</p>
              <p className="text-xs text-gray-500 mb-4">{LANGUAGES.cert.fecha[lang]}</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                {LANGUAGES.cert.puntajes.map((p) => (
                  <div key={p.en} className="bg-gray-100 dark:bg-white/5 rounded-xl p-2.5 text-center">
                    <div className="text-xl font-black text-brand-red">{p.v}</div>
                    <div className="text-[9px] font-bold uppercase tracking-wide text-gray-500 leading-tight">
                      {p[lang]}
                    </div>
                  </div>
                ))}
              </div>

              <a
                href={LANGUAGES.cert.verificar}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-bold text-brand-red hover:underline"
              >
                {lang === 'es' ? 'Verificar constancia en el IPN' : 'Verify certificate at IPN'}
                <ChevronRight size={13} />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Referencias laborales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
            <User className="text-brand-red" />
            {lang === 'es' ? 'REFERENCIAS LABORALES' : 'PROFESSIONAL REFERENCES'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {REFERENCES.map((r) => (
              <div key={r.nombre} className="glass p-5 rounded-2xl flex flex-col">
                <p className="font-bold mb-1">{r.nombre}</p>
                <p className="text-sm text-brand-red font-bold leading-snug">{r.cargo[lang]}</p>
                {r.org !== '—' && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{r.org}</p>
                )}

                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-200 dark:border-white/10">
                  <a
                    href={`tel:${r.tel.replace(/\s/g, '')}`}
                    className="flex items-center gap-1.5 text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-brand-red transition-colors"
                  >
                    <Phone size={14} className="text-brand-red shrink-0" />
                    {r.tel}
                  </a>
                  <a
                    href={`https://wa.me/${r.tel.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`WhatsApp de ${r.nombre}`}
                    title="WhatsApp"
                    className="ml-auto w-7 h-7 shrink-0 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366] text-[#25D366] hover:text-white flex items-center justify-center transition-colors"
                  >
                    <MessageCircle size={14} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
};
