// Barra superior de las páginas internas (Portafolio, Currículum y Biblioteca).
// Es la misma de la portada: nombre a la izquierda, Portafolio y Currículum
// siempre a la vista y los controles de tema e idioma a la derecha.
import { Moon, Pause, Play, Sun } from 'lucide-react';
import { Monograma } from './Marca';

type Idioma = 'es' | 'en';
type Pagina = 'home' | 'resume' | 'datalab' | 'projects' | 'notas' | 'publicaciones';

export function BarraPagina({
  actual, onIr, lang, theme, onTema, onIdioma, movimiento, onMovimiento,
}: {
  actual: Pagina;
  onIr: (p: Pagina) => void;
  lang: Idioma;
  theme: 'light' | 'dark';
  onTema: () => void;
  onIdioma: () => void;
  movimiento: boolean;
  onMovimiento: () => void;
}) {
  const pill = (activo: boolean) =>
    `px-3 sm:px-5 py-2 rounded-full text-[13px] sm:text-sm font-semibold transition-colors ${
      activo
        ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
        : 'border border-gray-900/70 dark:border-white/70 hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900'
    }`;

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#efefec]/85 dark:bg-[#0c0c0d]/80 border-b border-black/10 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-2 sm:gap-3">
        <button
          onClick={() => onIr('home')}
          aria-label={lang === 'es' ? 'Volver al inicio' : 'Back to home'}
          className="flex items-center gap-2.5 font-display text-[1.7rem] leading-none whitespace-nowrap hover:text-brand transition-colors"
        >
          <Monograma className="h-7 sm:h-8 w-auto shrink-0" />
          <span className="hidden md:inline">Diego Hernández</span>
        </button>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button onClick={() => onIr('projects')} className={pill(actual === 'projects')}>
            {lang === 'es' ? 'Portafolio' : 'Portfolio'}
          </button>
          <button onClick={() => onIr('resume')} className={pill(actual === 'resume')}>
            {lang === 'es' ? 'Currículum' : 'Resume'}
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onMovimiento}
            aria-label={movimiento ? (lang === 'es' ? 'Pausar las animaciones' : 'Pause animations') : (lang === 'es' ? 'Activar las animaciones' : 'Turn animations on')}
            aria-pressed={!movimiento}
            className="p-1.5 sm:p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors max-[340px]:hidden"
          >
            {movimiento ? <Pause size={17} /> : <Play size={17} />}
          </button>
          <button
            onClick={onTema}
            aria-label={lang === 'es' ? 'Cambiar entre tema claro y oscuro' : 'Switch between light and dark theme'}
            className="p-1.5 sm:p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <button
            onClick={onIdioma}
            aria-label={lang === 'es' ? 'Cambiar idioma a inglés' : 'Switch language to Spanish'}
            className="px-2 sm:px-2.5 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            {lang}
          </button>
        </div>
      </div>
    </nav>
  );
}
