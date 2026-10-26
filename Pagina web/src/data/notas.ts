// Notas técnicas de la biblioteca. Son notas de estudio: valores típicos de la
// literatura, no datos de ningún equipo en particular.
//
// Para agregar una nota nueva basta con añadir un objeto al arreglo NOTAS
// (id, etiqueta, minutos, contenido en es y en, fuentes). La página la muestra
// sola, con su tarjeta y su vista de lectura.

export type Bloque =
  | { t: 'p'; x: string }
  | { t: 'h'; x: string }
  | { t: 'ul'; x: string[] }
  | { t: 'tabla'; cab: string[]; filas: string[][] }
  | { t: 'nota'; x: string }
  | { t: 'rangos'; titulo: string; max: number; datos: { n: string; min: number; max: number }[] };

export interface Contenido {
  titulo: string;
  resumen: string;
  bloques: Bloque[];
}

export interface Nota {
  id: string;
  etiqueta: { es: string; en: string };
  minutos: number;
  es: Contenido;
  en: Contenido;
  fuentes: string[];
}

export const NOTAS: Nota[] = [
  // ---------------------------------------------------------------- 1
  {
    id: 'modelos-de-inferencia',
    etiqueta: { es: 'Estadística y datos', en: 'Statistics and data' },
    minutos: 6,
    es: {
      titulo: 'Modelos de inferencia: los más estudiados y cuándo usar cada uno',
      resumen:
        'Un mapa de los modelos estadísticos y de aprendizaje que más se estudian para sacar conclusiones de los datos, con la pregunta que responde cada uno y su trampa más común.',
      bloques: [
        { t: 'h', x: 'Qué es inferir' },
        {
          t: 'p',
          x: `Inferir es pasar de lo que se observó en una muestra a una conclusión sobre algo más amplio: la población, el proceso completo o lo que pasará mañana. Casi todo el trabajo se reduce a tres tareas: estimar un valor desconocido (por ejemplo, la media de una variable de proceso), contrastar una hipótesis (¿cambió algo?) y predecir una observación nueva. Cada modelo se diseña para alguna de ellas, y confundirlas es la fuente más común de errores.`,
        },
        { t: 'h', x: 'Los modelos que más se estudian' },
        {
          t: 'tabla',
          cab: ['Modelo', 'Pregunta que responde', 'Supuesto clave', 'Cuidado con'],
          filas: [
            [
              'Regresión lineal y modelos lineales generalizados (logística, Poisson)',
              '¿Cómo cambia la respuesta cuando cambian las variables explicativas?',
              'Relación lineal en los parámetros, errores independientes y varianza adecuada',
              'Extrapolar fuera del rango de los datos y la multicolinealidad',
            ],
            [
              'Pruebas de hipótesis y ANOVA',
              '¿Estos grupos son realmente distintos o es ruido?',
              'Muestras independientes, normalidad aproximada y varianzas parecidas',
              'Mirar solo el valor p y hacer muchas pruebas sin corregir',
            ],
            [
              'Máxima verosimilitud',
              '¿Qué valores de los parámetros hacen más probables los datos observados?',
              'Una familia de distribuciones bien elegida',
              'Muestras pequeñas y modelos mal especificados',
            ],
            [
              'Inferencia bayesiana',
              '¿Cuánto creo en cada valor, combinando lo que ya sabía con los datos?',
              'Una distribución previa razonable',
              'Previas elegidas sin justificar y costo de cómputo',
            ],
            [
              'Series de tiempo (ARIMA, suavizamiento exponencial)',
              '¿Qué valores vienen, dada la dependencia en el tiempo?',
              'Estructura estable: tendencia y estacionalidad',
              'Cambios de régimen que rompen el patrón',
            ],
            [
              'Regularización (Ridge, Lasso) y modelos de árboles (bosques aleatorios, gradient boosting)',
              '¿Cuál es la mejor predicción cuando hay muchas variables?',
              'Los datos nuevos se parecen a los de entrenamiento',
              'Pérdida de interpretabilidad y sobreajuste sin validación',
            ],
            [
              'Inferencia causal (experimentos, diferencias en diferencias, variables instrumentales)',
              '¿Qué pasaría si intervengo?',
              'Asignación aleatoria o supuestos de identificación explícitos',
              'Confundir correlación con causa',
            ],
          ],
        },
        { t: 'h', x: 'La regresión, base de casi todo' },
        {
          t: 'p',
          x: `La regresión lineal es el punto de partida de la mayoría de estos modelos. Los modelos lineales generalizados cambian la distribución de la respuesta (binaria, conteos) manteniendo la misma lógica, y la regularización agrega una penalización para que el modelo no se pegue al ruido cuando hay muchas variables. Entender bien la regresión (residuos, supuestos, interpretación de coeficientes) hace mucho más fácil entender el resto.`,
        },
        { t: 'h', x: 'Cómo elegir' },
        {
          t: 'ul',
          x: [
            'Empieza por la pregunta: estimar, contrastar o predecir.',
            'Mira los datos antes de modelar: gráficos de dispersión, distribuciones y datos faltantes.',
            'Prefiere el modelo más simple que responda la pregunta y sube de complejidad solo si el error de validación lo justifica.',
            'Valida con datos que el modelo no vio (validación cruzada) y revisa los residuos.',
            'Reporta la incertidumbre con intervalos de confianza o creíbles, no solo con un número.',
          ],
        },
        {
          t: 'nota',
          x: 'En la práctica industrial rara vez el problema es el modelo: lo son la calidad de los datos y una pregunta mal planteada. Conviene dedicar más tiempo a entender el proceso que a probar algoritmos.',
        },
        { t: 'h', x: 'Herramientas' },
        {
          t: 'p',
          x: 'Todo lo anterior se puede trabajar en Minitab, en R (lm, glm, brms) o en Python (statsmodels, scikit-learn, PyMC).',
        },
      ],
    },
    en: {
      titulo: 'Inference models: the most studied ones and when to use each',
      resumen:
        'A map of the statistical and learning models most often studied to draw conclusions from data, with the question each one answers and its most common pitfall.',
      bloques: [
        { t: 'h', x: 'What inference means' },
        {
          t: 'p',
          x: `To infer is to move from what was observed in a sample to a conclusion about something broader: the population, the whole process or what will happen tomorrow. Almost all of the work comes down to three tasks: estimating an unknown value (for example, the mean of a process variable), testing a hypothesis (did something change?) and predicting a new observation. Each model is designed for one of them, and mixing them up is the most common source of mistakes.`,
        },
        { t: 'h', x: 'The most studied models' },
        {
          t: 'tabla',
          cab: ['Model', 'Question it answers', 'Key assumption', 'Watch out for'],
          filas: [
            [
              'Linear regression and generalized linear models (logistic, Poisson)',
              'How does the response change when the explanatory variables change?',
              'Linear in the parameters, independent errors and suitable variance',
              'Extrapolating beyond the data range and multicollinearity',
            ],
            [
              'Hypothesis tests and ANOVA',
              'Are these groups really different, or is it noise?',
              'Independent samples, approximate normality and similar variances',
              'Reading only the p-value and running many tests without correction',
            ],
            [
              'Maximum likelihood',
              'Which parameter values make the observed data most probable?',
              'A well-chosen family of distributions',
              'Small samples and misspecified models',
            ],
            [
              'Bayesian inference',
              'How strongly do I believe each value, combining prior knowledge with the data?',
              'A reasonable prior distribution',
              'Unjustified priors and computing cost',
            ],
            [
              'Time series (ARIMA, exponential smoothing)',
              'What values come next, given dependence over time?',
              'A stable structure: trend and seasonality',
              'Regime changes that break the pattern',
            ],
            [
              'Regularization (Ridge, Lasso) and tree models (random forests, gradient boosting)',
              'What is the best prediction when there are many variables?',
              'New data looks like the training data',
              'Loss of interpretability and overfitting without validation',
            ],
            [
              'Causal inference (experiments, difference in differences, instrumental variables)',
              'What would happen if I intervene?',
              'Random assignment or explicit identification assumptions',
              'Mistaking correlation for cause',
            ],
          ],
        },
        { t: 'h', x: 'Regression, the base of almost everything' },
        {
          t: 'p',
          x: `Linear regression is the starting point for most of these models. Generalized linear models change the distribution of the response (binary, counts) while keeping the same logic, and regularization adds a penalty so the model does not chase noise when there are many variables. Understanding regression well (residuals, assumptions, reading coefficients) makes everything else much easier.`,
        },
        { t: 'h', x: 'How to choose' },
        {
          t: 'ul',
          x: [
            'Start with the question: estimate, test or predict.',
            'Look at the data before modeling: scatter plots, distributions and missing values.',
            'Prefer the simplest model that answers the question, and add complexity only if validation error justifies it.',
            'Validate on data the model has not seen (cross-validation) and check the residuals.',
            'Report uncertainty with confidence or credible intervals, not just a single number.',
          ],
        },
        {
          t: 'nota',
          x: 'In industrial practice the model is rarely the problem: data quality and a poorly framed question are. It pays to spend more time understanding the process than trying algorithms.',
        },
        { t: 'h', x: 'Tools' },
        {
          t: 'p',
          x: 'All of the above can be done in Minitab, in R (lm, glm, brms) or in Python (statsmodels, scikit-learn, PyMC).',
        },
      ],
    },
    fuentes: [
      'Casella, G. y Berger, R. L. (2002). Statistical Inference, 2.ª ed. Duxbury.',
      'James, G., Witten, D., Hastie, T. y Tibshirani, R. (2021). An Introduction to Statistical Learning, 2.ª ed. Springer.',
      'Gelman, A. et al. (2013). Bayesian Data Analysis, 3.ª ed. CRC Press.',
      'Montgomery, D. C. (2017). Design and Analysis of Experiments, 9.ª ed. Wiley.',
    ],
  },

  // ---------------------------------------------------------------- 2
  {
    id: 'escorias-de-alto-horno',
    etiqueta: { es: 'Metalurgia', en: 'Metallurgy' },
    minutos: 7,
    es: {
      titulo: 'Escorias de alto horno: teoría básica',
      resumen:
        'Qué es la escoria, de qué está hecha, cómo se controlan su basicidad y su viscosidad, cómo retiene el azufre y para qué se usa después.',
      bloques: [
        { t: 'h', x: 'Qué es y de dónde sale' },
        {
          t: 'p',
          x: `La escoria es la fase líquida de óxidos que se forma en el alto horno con la ganga del mineral (sílice y alúmina, sobre todo), la ceniza del coque y los fundentes que se cargan, como la caliza y la dolomita. Como es mucho menos densa que el arrabio (cerca de 2,5 g/cm³ frente a unos 6,8 g/cm³), flota sobre el metal en el crisol y se separa de él al sangrar el horno.`,
        },
        { t: 'h', x: 'Composición típica' },
        {
          t: 'rangos',
          titulo: 'Rangos típicos de composición (% en masa)',
          max: 45,
          datos: [
            { n: 'CaO', min: 38, max: 42 },
            { n: 'SiO₂', min: 33, max: 38 },
            { n: 'Al₂O₃', min: 9, max: 14 },
            { n: 'MgO', min: 6, max: 10 },
            { n: 'S', min: 1, max: 2 },
          ],
        },
        {
          t: 'nota',
          x: 'Son valores típicos de la literatura; cada horno trabaja con su propia ventana según la carga. La cantidad de escoria suele estar entre 250 y 350 kg por tonelada de arrabio.',
        },
        { t: 'h', x: 'Para qué sirve' },
        {
          t: 'ul',
          x: [
            'Recoge la ganga y las cenizas para que salgan del horno.',
            'Retira azufre del metal (desulfuración): el calcio de la escoria lo fija como sulfuro.',
            'Ayuda a eliminar álcalis y a proteger el crisol.',
            'Se sangra caliente: su temperatura ronda los 1.450 a 1.520 °C.',
          ],
        },
        { t: 'h', x: 'Basicidad: el número que más se vigila' },
        {
          t: 'p',
          x: `La basicidad compara los óxidos básicos con los ácidos. Dos formas habituales son B2 = CaO / SiO₂ y B4 = (CaO + MgO) / (SiO₂ + Al₂O₃). En altos hornos suele mantenerse B2 cerca de 1,0 a 1,2. Subirla mejora la desulfuración, pero si se pasa la escoria se vuelve más refractaria (su punto de fusión sube) y espesa; bajarla la hace más fluida, pero retiene menos azufre.`,
        },
        { t: 'h', x: 'Viscosidad y estructura' },
        {
          t: 'p',
          x: `En la teoría iónica, la escoria líquida es una red de tetraedros de sílice (SiO₄) unidos por oxígenos. Los óxidos básicos como CaO y MgO aportan iones O²⁻ que rompen los enlaces Si–O–Si y reducen el tamaño de la red, por lo que la escoria fluye mejor. La alúmina puede comportarse como formadora o como modificadora de la red según la basicidad. Una escoria con la viscosidad correcta drena bien por el crisol y deja pasar el gas; una demasiado viscosa causa problemas de sangría y de marcha del horno.`,
        },
        { t: 'h', x: 'Desulfuración' },
        {
          t: 'p',
          x: `El azufre pasa del metal a la escoria según la reacción [S] + (CaO) + C = (CaS) + CO. El reparto de azufre, Ls = (%S en la escoria) / [%S en el metal], sube con la basicidad, con la temperatura y con un ambiente reductor (poco oxígeno disuelto). Por eso el crisol es el lugar donde mejor se desulfura: ahí coinciden alta temperatura, carbono y escoria básica.`,
        },
        { t: 'h', x: 'Qué se hace con la escoria' },
        {
          t: 'ul',
          x: [
            'Granulada (enfriada con agua): queda vítrea y, molida, se usa como adición al cemento porque es hidráulica latente.',
            'Enfriada al aire: se tritura y se usa como agregado para vías y concreto.',
            'Seguridad: el contacto de escoria líquida con agua o con humedad atrapada puede provocar explosiones.',
          ],
        },
        {
          t: 'nota',
          x: 'Son notas de estudio. Para decisiones de operación en un horno específico hay que usar los análisis y las ventanas de ese horno.',
        },
      ],
    },
    en: {
      titulo: 'Blast furnace slag: basic theory',
      resumen:
        'What slag is, what it is made of, how its basicity and viscosity are controlled, how it holds sulfur and what it is used for afterwards.',
      bloques: [
        { t: 'h', x: 'What it is and where it comes from' },
        {
          t: 'p',
          x: `Slag is the liquid oxide phase that forms in the blast furnace from the gangue of the ore (mostly silica and alumina), the coke ash and the fluxes in the charge, such as limestone and dolomite. Because it is much less dense than hot metal (about 2.5 g/cm³ versus about 6.8 g/cm³), it floats on the metal in the hearth and is separated from it when the furnace is tapped.`,
        },
        { t: 'h', x: 'Typical composition' },
        {
          t: 'rangos',
          titulo: 'Typical composition ranges (wt %)',
          max: 45,
          datos: [
            { n: 'CaO', min: 38, max: 42 },
            { n: 'SiO₂', min: 33, max: 38 },
            { n: 'Al₂O₃', min: 9, max: 14 },
            { n: 'MgO', min: 6, max: 10 },
            { n: 'S', min: 1, max: 2 },
          ],
        },
        {
          t: 'nota',
          x: 'These are typical values from the literature; each furnace runs in its own window depending on the burden. Slag volume is usually between 250 and 350 kg per tonne of hot metal.',
        },
        { t: 'h', x: 'What it is for' },
        {
          t: 'ul',
          x: [
            'It collects the gangue and ash so they leave the furnace.',
            'It removes sulfur from the metal (desulfurization): the calcium in the slag fixes it as sulfide.',
            'It helps remove alkalis and protects the hearth.',
            'It is tapped hot: its temperature is around 1,450 to 1,520 °C.',
          ],
        },
        { t: 'h', x: 'Basicity: the number watched most closely' },
        {
          t: 'p',
          x: `Basicity compares basic oxides with acid ones. Two common forms are B2 = CaO / SiO₂ and B4 = (CaO + MgO) / (SiO₂ + Al₂O₃). Blast furnaces usually keep B2 around 1.0 to 1.2. Raising it improves desulfurization, but go too far and the slag becomes more refractory (its melting point rises) and thick; lowering it makes the slag more fluid but it holds less sulfur.`,
        },
        { t: 'h', x: 'Viscosity and structure' },
        {
          t: 'p',
          x: `In the ionic theory, liquid slag is a network of silica tetrahedra (SiO₄) linked through oxygen. Basic oxides such as CaO and MgO supply O²⁻ ions that break the Si–O–Si bonds and shrink the network, so the slag flows better. Alumina can act as a network former or a modifier depending on basicity. Slag with the right viscosity drains well through the hearth and lets gas through; slag that is too viscous causes tapping and furnace operation problems.`,
        },
        { t: 'h', x: 'Desulfurization' },
        {
          t: 'p',
          x: `Sulfur moves from the metal to the slag according to the reaction [S] + (CaO) + C = (CaS) + CO. The sulfur partition, Ls = (%S in slag) / [%S in metal], increases with basicity, with temperature and with a reducing atmosphere (little dissolved oxygen). That is why the hearth is where desulfurization works best: high temperature, carbon and basic slag all meet there.`,
        },
        { t: 'h', x: 'What happens to the slag afterwards' },
        {
          t: 'ul',
          x: [
            'Granulated (water-quenched): it becomes glassy and, once ground, is used as a cement addition because it is latent hydraulic.',
            'Air-cooled: it is crushed and used as aggregate for roads and concrete.',
            'Safety: contact of liquid slag with water or trapped moisture can cause explosions.',
          ],
        },
        {
          t: 'nota',
          x: 'These are study notes. For operating decisions on a specific furnace, use that furnace analyses and operating windows.',
        },
      ],
    },
    fuentes: [
      'Biswas, A. K. (1981). Principles of Blast Furnace Ironmaking. Cootha Publishing House.',
      'Geerdes, M., Chaigneau, R., Kurunov, I., Lingiardi, O. y Ricketts, J. (2015). Modern Blast Furnace Ironmaking: An Introduction, 3.ª ed. IOS Press.',
    ],
  },

  // ---------------------------------------------------------------- 3
  {
    id: 'sistemas-integrados-de-gestion',
    etiqueta: { es: 'Calidad y gestión', en: 'Quality and management' },
    minutos: 6,
    es: {
      titulo: 'Sistemas Integrados de Gestión (SIG): calidad, ambiente y seguridad en uno solo',
      resumen:
        'Cómo se integran ISO 9001, 14001 y 45001 en un solo sistema, qué comparten y qué hace falta para que funcione y no se vuelva papeleo.',
      bloques: [
        { t: 'h', x: 'La idea' },
        {
          t: 'p',
          x: `Un Sistema Integrado de Gestión reúne en un solo sistema los requisitos de varias normas: calidad (ISO 9001), ambiente (ISO 14001) y seguridad y salud en el trabajo (ISO 45001), y puede sumar otras como gestión de activos (ISO 55001) o seguridad de la información (ISO 27001). En vez de tres manuales, tres auditorías y tres juegos de indicadores, hay una política, un mapa de procesos, una revisión por la dirección y un programa de auditoría.`,
        },
        { t: 'h', x: 'Por qué se puede integrar: la estructura común' },
        {
          t: 'p',
          x: `Las normas ISO de sistemas de gestión comparten una estructura de alto nivel (Anexo SL) con las mismas cláusulas y textos centrales. Las cláusulas 1 a 3 son alcance, referencias y términos; de la 4 a la 10 está el contenido que se audita. Eso permite diseñar los requisitos una sola vez.`,
        },
        {
          t: 'tabla',
          cab: ['Cláusula', 'Tema', 'Ciclo PHVA'],
          filas: [
            ['4', 'Contexto de la organización', 'Planear'],
            ['5', 'Liderazgo', 'Planear'],
            ['6', 'Planificación: riesgos, oportunidades y objetivos', 'Planear'],
            ['7', 'Apoyo: recursos, competencia, comunicación y documentos', 'Planear'],
            ['8', 'Operación', 'Hacer'],
            ['9', 'Evaluación del desempeño: seguimiento, auditoría interna y revisión', 'Verificar'],
            ['10', 'Mejora: no conformidades y acciones correctivas', 'Actuar'],
          ],
        },
        { t: 'h', x: 'Qué protege cada norma' },
        {
          t: 'tabla',
          cab: ['Norma', 'Enfoque', 'Qué protege'],
          filas: [
            ['ISO 9001:2015', 'Calidad', 'Que el producto o servicio cumpla lo que el cliente espera'],
            ['ISO 14001:2015', 'Ambiente', 'Que se controlen los impactos y las obligaciones ambientales'],
            ['ISO 45001:2018', 'Seguridad y salud en el trabajo', 'Que se prevengan lesiones y enfermedades de las personas'],
            ['ISO 55001:2014', 'Gestión de activos', 'El valor y el riesgo de los activos físicos durante su vida'],
            ['ISO 27001:2022', 'Seguridad de la información', 'Confidencialidad, integridad y disponibilidad de la información'],
          ],
        },
        {
          t: 'p',
          x: 'ISO/IEC 17025 (laboratorios) no sigue la estructura de alto nivel completa, pero se integra bien con la misma lógica de procesos y de mejora.',
        },
        { t: 'h', x: 'Elementos que no pueden faltar' },
        {
          t: 'ul',
          x: [
            'Política integrada y objetivos medibles.',
            'Matriz de riesgos y oportunidades, con los aspectos ambientales y los peligros.',
            'Control de documentos y registros.',
            'Indicadores con seguimiento periódico.',
            'Un solo programa de auditoría interna.',
            'Tratamiento de no conformidades y acciones correctivas.',
            'Revisión por la dirección.',
          ],
        },
        { t: 'h', x: 'Tres niveles de integración' },
        {
          t: 'ul',
          x: [
            'Coexistencia: cada norma por separado, con sus propios documentos.',
            'Alineación: procesos y documentos comunes, pero con auditorías todavía separadas.',
            'Integración plena: un solo sistema y una sola auditoría.',
          ],
        },
        { t: 'h', x: 'Errores comunes' },
        {
          t: 'ul',
          x: [
            'Documentar de más: procedimientos que nadie usa.',
            'Tratar el sistema como tarea del área de calidad y no de toda la organización.',
            'Indicadores que nadie mira ni mueven decisiones.',
            'Auditar para cumplir el papel y no para encontrar mejoras.',
          ],
        },
        {
          t: 'nota',
          x: 'Un SIG bien hecho se nota en que el trabajo diario ya sigue el procedimiento. Si hay que preparar la casa para la auditoría, el sistema está desconectado de la operación.',
        },
      ],
    },
    en: {
      titulo: 'Integrated Management Systems (IMS): quality, environment and safety in one',
      resumen:
        'How ISO 9001, 14001 and 45001 are combined into a single system, what they share and what it takes for it to work instead of turning into paperwork.',
      bloques: [
        { t: 'h', x: 'The idea' },
        {
          t: 'p',
          x: `An Integrated Management System brings the requirements of several standards into one system: quality (ISO 9001), environment (ISO 14001) and occupational health and safety (ISO 45001), and it can add others such as asset management (ISO 55001) or information security (ISO 27001). Instead of three manuals, three audits and three sets of indicators, there is one policy, one process map, one management review and one audit program.`,
        },
        { t: 'h', x: 'Why it can be integrated: the common structure' },
        {
          t: 'p',
          x: `ISO management system standards share a high level structure (Annex SL) with the same clauses and core texts. Clauses 1 to 3 are scope, references and terms; clauses 4 to 10 hold the content that gets audited. That lets the requirements be designed once.`,
        },
        {
          t: 'tabla',
          cab: ['Clause', 'Topic', 'PDCA cycle'],
          filas: [
            ['4', 'Context of the organization', 'Plan'],
            ['5', 'Leadership', 'Plan'],
            ['6', 'Planning: risks, opportunities and objectives', 'Plan'],
            ['7', 'Support: resources, competence, communication and documents', 'Plan'],
            ['8', 'Operation', 'Do'],
            ['9', 'Performance evaluation: monitoring, internal audit and review', 'Check'],
            ['10', 'Improvement: nonconformities and corrective action', 'Act'],
          ],
        },
        { t: 'h', x: 'What each standard protects' },
        {
          t: 'tabla',
          cab: ['Standard', 'Focus', 'What it protects'],
          filas: [
            ['ISO 9001:2015', 'Quality', 'That the product or service meets what the customer expects'],
            ['ISO 14001:2015', 'Environment', 'That environmental impacts and obligations are controlled'],
            ['ISO 45001:2018', 'Occupational health and safety', 'That injuries and illness to people are prevented'],
            ['ISO 55001:2014', 'Asset management', 'The value and risk of physical assets over their life'],
            ['ISO 27001:2022', 'Information security', 'Confidentiality, integrity and availability of information'],
          ],
        },
        {
          t: 'p',
          x: 'ISO/IEC 17025 (laboratories) does not follow the full high level structure, but it fits well with the same process and improvement logic.',
        },
        { t: 'h', x: 'Elements that cannot be missing' },
        {
          t: 'ul',
          x: [
            'An integrated policy and measurable objectives.',
            'A risk and opportunity matrix, including environmental aspects and hazards.',
            'Control of documents and records.',
            'Indicators with regular follow-up.',
            'A single internal audit program.',
            'Handling of nonconformities and corrective actions.',
            'Management review.',
          ],
        },
        { t: 'h', x: 'Three levels of integration' },
        {
          t: 'ul',
          x: [
            'Coexistence: each standard on its own, with its own documents.',
            'Alignment: common processes and documents, but audits still separate.',
            'Full integration: one system and one audit.',
          ],
        },
        { t: 'h', x: 'Common mistakes' },
        {
          t: 'ul',
          x: [
            'Over-documenting: procedures nobody uses.',
            'Treating the system as the quality department job instead of the whole organization.',
            'Indicators nobody looks at and that move no decisions.',
            'Auditing to satisfy the paperwork rather than to find improvements.',
          ],
        },
        {
          t: 'nota',
          x: 'A well-built IMS shows in the fact that daily work already follows the procedure. If the house has to be tidied up for the audit, the system is disconnected from operations.',
        },
      ],
    },
    fuentes: [
      'ISO 9001:2015. Sistemas de gestión de la calidad. Requisitos.',
      'ISO 14001:2015. Sistemas de gestión ambiental. Requisitos con orientación para su uso.',
      'ISO 45001:2018. Sistemas de gestión de la seguridad y salud en el trabajo. Requisitos con orientación para su uso.',
      'ISO/IEC Directives, Part 1, Consolidated ISO Supplement. Anexo SL (estructura de alto nivel).',
    ],
  },
];
