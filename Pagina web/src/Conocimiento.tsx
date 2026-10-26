// Biblioteca: notas técnicas de estudio y publicaciones de investigación.
// Las notas viven en src/data/notas.ts y las publicaciones en
// src/data/publicaciones.json (ver PUBLICACIONES.md para agregar una).
import { Fragment, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowUpRight, BookOpen, FileText, ExternalLink } from 'lucide-react';
import { NOTAS, type Bloque, type Nota } from './data/notas';
import publicacionesData from './data/publicaciones.json';

type Idioma = 'es' | 'en';
type Pestana = 'notas' | 'publicaciones';

interface Publicacion {
  id: string;
  tipo: 'articulo' | 'ponencia' | 'tesis' | 'preprint' | 'capitulo';
  titulo: string;
  autores: string[];
  ano: number;
  medio: string;
  estado?: 'publicado' | 'en revision';
  resumen?: string;
  pdf?: string;
  doi?: string;
  url?: string;
}

const PUBLICACIONES = publicacionesData as Publicacion[];

const TIPOS: Record<Publicacion['tipo'], { es: string; en: string }> = {
  articulo: { es: 'Artículo', en: 'Article' },
  ponencia: { es: 'Ponencia', en: 'Conference paper' },
  tesis: { es: 'Tesis', en: 'Thesis' },
  preprint: { es: 'Preprint', en: 'Preprint' },
  capitulo: { es: 'Capítulo', en: 'Chapter' },
};

const T = {
  es: {
    atras: 'Volver al inicio',
    eyebrow: 'Biblioteca',
    notas: 'Notas técnicas',
    publicaciones: 'Publicaciones',
    notasIntro: 'Notas de estudio sobre los temas con los que trabajo: estadística, metalurgia y gestión. Valores típicos de la literatura, con sus fuentes.',
    pubIntro: 'Artículos, ponencias y trabajos de investigación.',
    todas: 'Todas las notas',
    lectura: 'min de lectura',
    leer: 'Leer',
    fuentes: 'Para profundizar',
    vacioTitulo: 'Aquí irán mis artículos de investigación',
    vacioTexto: 'Estoy cursando la Maestría en Informática en el Instituto Politécnico Nacional (2026 a 2028). Las publicaciones, ponencias y preprints se irán agregando aquí a medida que salgan.',
    todos: 'Todos',
    enRevision: 'En revisión',
    resumen: 'Resumen',
  },
  en: {
    atras: 'Back to home',
    eyebrow: 'Library',
    notas: 'Technical notes',
    publicaciones: 'Publications',
    notasIntro: 'Study notes on the topics I work with: statistics, metallurgy and management. Typical values from the literature, with their sources.',
    pubIntro: 'Articles, conference papers and research work.',
    todas: 'All notes',
    lectura: 'min read',
    leer: 'Read',
    fuentes: 'Further reading',
    vacioTitulo: 'My research articles will go here',
    vacioTexto: 'I am studying the Master in Informatics at the Instituto Politécnico Nacional (2026 to 2028). Publications, conference papers and preprints will be added here as they come out.',
    todos: 'All',
    enRevision: 'Under review',
    resumen: 'Abstract',
  },
};

// --- Bloques de una nota ---------------------------------------------------

const Rangos = ({ b }: { b: Extract<Bloque, { t: 'rangos' }> }) => (
  <figure className="my-8 rounded-2xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/[0.03] p-5 sm:p-6">
    <figcaption className="text-[11px] uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400 mb-5">{b.titulo}</figcaption>
    <div className="space-y-4">
      {b.datos.map((d, i) => (
        <div key={d.n} className="flex items-center gap-4">
          <span className="w-14 shrink-0 font-display text-xl">{d.n}</span>
          <div className="relative flex-1 h-3 rounded-full bg-black/8 dark:bg-white/10 overflow-hidden">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: i * 0.08, ease: 'easeOut' }}
              style={{ left: `${(d.min / b.max) * 100}%`, width: `${((d.max - d.min) / b.max) * 100}%`, transformOrigin: 'left' }}
              className="absolute top-0 bottom-0 rounded-full bg-brand"
            />
          </div>
          <span className="w-16 shrink-0 text-right text-sm tabular-nums text-gray-600 dark:text-gray-300">{d.min}–{d.max}</span>
        </div>
      ))}
    </div>
  </figure>
);

const BloqueVista = ({ b }: { b: Bloque }) => {
  switch (b.t) {
    case 'h':
      return <h3 className="font-display text-3xl mt-12 mb-3 leading-tight">{b.x}</h3>;
    case 'p':
      return <p className="text-[17px] leading-[1.75] text-gray-700 dark:text-gray-300 mb-4">{b.x}</p>;
    case 'ul':
      return (
        <ul className="list-disc pl-5 space-y-2 text-[17px] leading-[1.7] text-gray-700 dark:text-gray-300 mb-4 marker:text-brand">
          {b.x.map((li) => <li key={li}>{li}</li>)}
        </ul>
      );
    case 'nota':
      return (
        <aside className="my-8 border-l-2 border-brand pl-5 font-display text-2xl leading-snug italic text-gray-800 dark:text-gray-200">
          {b.x}
        </aside>
      );
    case 'tabla':
      return (
        <div className="my-6 overflow-x-auto rounded-2xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/[0.03]">
          <table className="w-full text-left text-sm min-w-[560px]">
            <thead>
              <tr className="border-b border-black/10 dark:border-white/10">
                {b.cab.map((c) => (
                  <th key={c} className="px-4 py-3 text-[11px] uppercase tracking-[0.14em] font-semibold text-gray-500 dark:text-gray-400">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.filas.map((fila, i) => (
                <tr key={i} className="border-b last:border-0 border-black/5 dark:border-white/5 align-top">
                  {fila.map((celda, j) => (
                    <td key={j} className={`px-4 py-3 leading-snug ${j === 0 ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                      {celda}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'rangos':
      return <Rangos b={b} />;
    default:
      return null;
  }
};

// --- Vistas ---------------------------------------------------------------

const Lectura = ({ nota, lang, onCerrar }: { nota: Nota; lang: Idioma; onCerrar: () => void }) => {
  const t = T[lang];
  const c = nota[lang];
  return (
    <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-3xl mx-auto">
      <button onClick={onCerrar} className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-brand transition-colors mb-8">
        <ArrowLeft size={16} /> {t.todas}
      </button>
      <p className="text-[11px] uppercase tracking-[0.2em] text-brand font-semibold mb-3">
        {nota.etiqueta[lang]} · {nota.minutos} {t.lectura}
      </p>
      <h1 className="font-display text-[clamp(2.2rem,5.5vw,3.8rem)] leading-[1.02] tracking-tight mb-5">{c.titulo}</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed pb-8 mb-4 border-b border-black/15 dark:border-white/15">{c.resumen}</p>
      {c.bloques.map((b, i) => <Fragment key={i}>{BloqueVista({ b })}</Fragment>)}
      <div className="mt-14 pt-6 border-t border-black/15 dark:border-white/15">
        <h4 className="text-[11px] uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 mb-3">{t.fuentes}</h4>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          {nota.fuentes.map((f) => <li key={f}>{f}</li>)}
        </ul>
      </div>
    </motion.article>
  );
};

const ListaNotas = ({ lang, onAbrir }: { lang: Idioma; onAbrir: (id: string) => void }) => {
  const t = T[lang];
  return (
    <div className="grid md:grid-cols-3 border-t border-black/20 dark:border-white/20">
      {NOTAS.map((n, i) => (
        <motion.button
          key={n.id}
          onClick={() => onAbrir(n.id)}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.1, duration: 0.6 }}
          className="group text-left p-6 sm:p-8 border-b md:border-b-0 md:border-r last:border-r-0 border-black/20 dark:border-white/20 hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-colors flex flex-col min-h-[340px]"
        >
          <span className="text-[11px] uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
            {String(i + 1).padStart(2, '0')} · {n.etiqueta[lang]}
          </span>
          <span className="font-display text-3xl leading-tight mt-4 group-hover:text-brand transition-colors">{n[lang].titulo}</span>
          <span className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{n[lang].resumen}</span>
          <span className="mt-auto pt-8 flex items-center justify-between text-sm font-medium">
            <span className="text-gray-500 dark:text-gray-400">{n.minutos} {t.lectura}</span>
            <span className="inline-flex items-center gap-1.5 group-hover:text-brand transition-colors">
              {t.leer}
              <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </span>
          </span>
        </motion.button>
      ))}
    </div>
  );
};

const ListaPublicaciones = ({ lang }: { lang: Idioma }) => {
  const t = T[lang];
  const [tipo, setTipo] = useState<'todos' | Publicacion['tipo']>('todos');

  if (PUBLICACIONES.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto text-center border border-dashed border-black/25 dark:border-white/25 rounded-3xl px-6 py-14 sm:px-12">
        <BookOpen size={34} strokeWidth={1.3} className="mx-auto text-brand mb-5" />
        <h2 className="font-display text-3xl sm:text-4xl mb-3">{t.vacioTitulo}</h2>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{t.vacioTexto}</p>
      </motion.div>
    );
  }

  const tipos = Array.from(new Set(PUBLICACIONES.map((p) => p.tipo)));
  const lista = PUBLICACIONES.filter((p) => tipo === 'todos' || p.tipo === tipo).sort((a, b) => b.ano - a.ano);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-8">
        {(['todos', ...tipos] as const).map((k) => (
          <button key={k} onClick={() => setTipo(k)}
            className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${tipo === k ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 border-transparent' : 'border-black/25 dark:border-white/25 hover:border-brand'}`}>
            {k === 'todos' ? t.todos : TIPOS[k][lang]}
          </button>
        ))}
      </div>
      <ul className="border-t border-black/20 dark:border-white/20">
        {lista.map((p, i) => (
          <motion.li key={p.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="grid sm:grid-cols-[110px_1fr] gap-x-8 gap-y-2 py-7 border-b border-black/20 dark:border-white/20">
            <div className="text-[11px] uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400 sm:pt-2">
              <div className="font-display text-3xl normal-case tracking-normal text-gray-900 dark:text-white">{p.ano}</div>
              {TIPOS[p.tipo][lang]}
            </div>
            <div>
              <h3 className="font-display text-2xl sm:text-3xl leading-tight">{p.titulo}</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {p.autores.join(', ')} · <span className="italic">{p.medio}</span>
                {p.estado === 'en revision' && <span className="ml-2 px-2 py-0.5 rounded-full border border-brand text-brand text-[11px] uppercase tracking-wider">{t.enRevision}</span>}
              </p>
              {p.resumen && (
                <details className="mt-3 group">
                  <summary className="cursor-pointer text-sm font-medium text-brand">{t.resumen}</summary>
                  <p className="mt-2 text-[15px] leading-relaxed text-gray-700 dark:text-gray-300">{p.resumen}</p>
                </details>
              )}
              <div className="mt-4 flex flex-wrap gap-3 text-sm font-medium">
                {p.pdf && <a href={p.pdf} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-brand"><FileText size={16} /> PDF</a>}
                {p.doi && <a href={`https://doi.org/${p.doi}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-brand"><ExternalLink size={16} /> DOI</a>}
                {p.url && <a href={p.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-brand"><ExternalLink size={16} /> Web</a>}
              </div>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

// --- Página ----------------------------------------------------------------

export function Conocimiento({
  tab, onCambiarTab, onBack, lang,
}: { tab: Pestana; onCambiarTab: (t: Pestana) => void; onBack: () => void; lang: Idioma }) {
  const t = T[lang];
  const [abierta, setAbierta] = useState<string | null>(null);
  const nota = NOTAS.find((n) => n.id === abierta);

  // Al cambiar de pestaña se cierra la nota que estuviera abierta.
  useEffect(() => { setAbierta(null); }, [tab]);
  useEffect(() => { window.scrollTo(0, 0); }, [abierta, tab]);

  return (
    <div className="min-h-screen bg-[#efefec] dark:bg-[#0c0c0d] text-gray-900 dark:text-brand-white transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-8 pb-24">
        <button onClick={onBack} className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-brand transition-colors mb-10">
          <ArrowLeft size={16} /> {t.atras}
        </button>

        {nota ? (
          <Lectura nota={nota} lang={lang} onCerrar={() => setAbierta(null)} />
        ) : (
          <>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-10">
              <p className="text-[11px] uppercase tracking-[0.22em] text-gray-500 dark:text-gray-400 mb-3">{t.eyebrow}</p>
              <h1 className="font-display text-[clamp(2.6rem,7vw,5rem)] leading-[0.98] tracking-tight">
                {tab === 'notas' ? t.notas : t.publicaciones}
              </h1>
              <p className="mt-4 max-w-xl text-gray-600 dark:text-gray-400 leading-relaxed">{tab === 'notas' ? t.notasIntro : t.pubIntro}</p>
              <div className="mt-6 flex gap-2">
                {(['notas', 'publicaciones'] as const).map((k) => (
                  <button key={k} onClick={() => onCambiarTab(k)}
                    className={`px-5 py-2 rounded-full text-sm font-semibold border transition-colors ${tab === k ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 border-transparent' : 'border-gray-900/60 dark:border-white/60 hover:bg-black/5 dark:hover:bg-white/10'}`}>
                    {k === 'notas' ? t.notas : t.publicaciones}
                  </button>
                ))}
              </div>
            </motion.div>

            {tab === 'notas' ? <ListaNotas lang={lang} onAbrir={setAbierta} /> : <ListaPublicaciones lang={lang} />}
          </>
        )}
      </div>
    </div>
  );
}
