// "Conoce sobre mí": texto a un lado y fotos del alto horno al otro. Las fotos
// se revelan al llegar a la sección y se desplazan a distinto ritmo al hacer
// scroll (paralaje). Las imágenes son de public/experiencia/paz-del-rio.
import { useRef } from 'react';
import { motion, MotionConfig, useScroll, useTransform } from 'motion/react';

type Idioma = 'es' | 'en';

const PIE = 'Alto Horno · Acerías Paz del Río';

export function SobreMi({ titulo, lang }: { titulo: string; lang: Idioma }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const yGrande = useTransform(scrollYProgress, [0, 1], ['-9%', '9%']);
  const yChica = useTransform(scrollYProgress, [0, 1], ['14%', '-14%']);
  const marco = useTransform(scrollYProgress, [0, 1], [24, -24]);

  const parrafos = lang === 'es'
    ? [
        'Ingeniero Metalúrgico y Especialista en Gestión de la Productividad y Mejoramiento Continuo, con sólida trayectoria en la transformación de procesos industriales y análisis de datos.',
        'Experto en la implementación de metodologías de mejora continua y desarrollo de software para la automatización de reportes y toma de decisiones. Destaco por mi capacidad para generar impacto en los resultados del negocio a través de soluciones tecnológicas ágiles.',
      ]
    : [
        'Metallurgical Engineer and Specialist in Productivity Management and Continuous Improvement, with a solid track record in transforming industrial processes and data analysis.',
        'Expert in implementing continuous improvement methodologies and software development for report automation and decision making. I stand out for my ability to generate impact on business results through agile technological solutions.',
      ];

  return (
    <MotionConfig reducedMotion="user">
      <section id="about" className="py-28 px-5 sm:px-8 overflow-hidden">
        <div ref={ref} className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_1.15fr] gap-14 lg:gap-20 items-center">
          <div className="max-w-xl">
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6 }}
              className="text-[11px] uppercase tracking-[0.22em] text-gray-500 dark:text-gray-400 mb-4"
            >
              {lang === 'es' ? 'Quién soy' : 'About'}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, delay: 0.05 }}
              className="mb-6"
            >
              {titulo}
            </motion.h2>
            {parrafos.map((p, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.8, delay: 0.15 + i * 0.12 }}
                className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-5"
              >
                {p}
              </motion.p>
            ))}
          </div>

          <div className="relative pb-16 sm:pb-20">
            {/* Foto grande: se descubre de arriba abajo y se mueve con el scroll */}
            <motion.div
              initial={{ clipPath: 'inset(0 0 100% 0)' }}
              whileInView={{ clipPath: 'inset(0 0 0% 0)' }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 1.3, ease: [0.65, 0, 0.35, 1] }}
              className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-gray-300 dark:bg-gray-800 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.55)]"
            >
              <motion.img
                src="/experiencia/paz-del-rio/3.webp"
                alt={lang === 'es' ? 'Interior del alto horno' : 'Inside the blast furnace'}
                loading="lazy"
                style={{ y: yGrande }}
                initial={{ scale: 1.3 }}
                whileInView={{ scale: 1.15 }}
                viewport={{ once: true }}
                transition={{ duration: 2.2, ease: 'easeOut' }}
                className="absolute inset-0 w-full h-[125%] -top-[12%] object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/55 to-transparent" />
              <span className="absolute right-5 bottom-4 text-[11px] uppercase tracking-[0.2em] text-white/90">{PIE}</span>
            </motion.div>

            {/* Foto chica: entra desde un lado y sube más rápido */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.9, delay: 0.7, ease: 'easeOut' }}
              style={{ y: marco }}
              className="absolute -bottom-0 left-4 sm:left-[-2.5rem] w-[52%] sm:w-[46%]"
            >
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border-4 border-[#efefec] dark:border-[#0c0c0d] shadow-[0_24px_50px_-20px_rgba(0,0,0,0.6)]">
                <motion.img
                  src="/experiencia/paz-del-rio/5.webp"
                  alt={lang === 'es' ? 'Zona de colada y escoria del alto horno' : 'Blast furnace cast house and slag'}
                  loading="lazy"
                  style={{ y: yChica }}
                  className="absolute inset-0 w-full h-[130%] -top-[15%] object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
