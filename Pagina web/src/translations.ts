// Textos del sitio en espanol e ingles.
// En su propio modulo para que charts.tsx pueda usarlos sin depender de
// App.tsx, lo que crearia una importacion circular.
import { BarChart3, Bot, Database, FileJson, LineChart, Zap } from 'lucide-react';

export const translations = {
  es: {
    nav: {
      about: 'Conoce sobre mi',
      solutions: 'Soluciones',
      contact: 'Contacto',
    },
    hero: {
      title: 'Diego Hernández',
      subtitle: 'Desarrollo · Analítica Industrial & IA',
      description: 'Desarrollador de software y analista de datos. Ayudo a empresas industriales y entidades públicas a convertir sus datos en decisiones: construyo la aplicación que les falta, automatizo lo repetitivo y dejo al equipo sabiendo usarlo.',
      cta: 'Agendar diagnóstico gratuito',
      freeConsult: 'La primera consulta de diagnóstico es gratuita',
    },
    analytics: {
      title: 'Showcase de Analítica Avanzada',
      subtitle: 'Así encuentro dónde está el problema antes de proponer una solución',
      pareto: {
        title: 'Diagrama de Pareto (80/20)',
        desc: 'Identificación de las causas vitales que generan el 80% de los problemas en producción.',
      },
      ishikawa: {
        title: 'Diagrama de Ishikawa (Espina de Pescado)',
        desc: 'Análisis de causa-raíz estructurado por las 6M (Mano de obra, Maquinaria, Métodos, Materiales, Medición, Medio ambiente).',
      },
      radar: {
        title: 'Matriz de Desempeño KPI',
        desc: 'Comparativa multidimensional de indicadores críticos de rendimiento.',
      },
      trends: {
        title: 'Análisis Predictivo de Tendencias',
        desc: 'Proyección de comportamiento basada en modelos de Machine Learning.',
      },
      dashboard: {
        title: 'Dashboard de Control en Tiempo Real',
        desc: 'Visualización de KPIs críticos para el monitoreo industrial.',
        efficiency: 'Eficiencia OEE',
        quality: 'Índice de Calidad',
        downtime: 'Tiempo de Parada',
        throughput: 'Toneladas / Turno',
        objetivo: 'Meta',
        turno: 'últimos 8 turnos',
        demo: 'Datos de ejemplo con la estructura de un tablero real'
      }
    },
    analyzer: {
      title: 'Laboratorio de Datos (Beta)',
      subtitle: 'Sube tu archivo CSV para generar análisis automáticos de Pareto y Regresión.',
      upload: 'Subir Archivo CSV',
      downloadTemplate: 'Descargar Plantilla Base',
      stats: 'Estadísticas Complementarias',
      pareto: 'Análisis de Pareto Personalizado',
      regression: 'Análisis de Regresión Lineal',
      noData: 'Por favor, sube un archivo CSV para ver los resultados.',
      error: 'Error al procesar el archivo. Asegúrate de que el formato sea correcto (Columnas: Causa, Valor).'
    },
    services: {
      title: 'Soluciones de Alto Nivel',
      subtitle: 'Herramientas de vanguardia para la industria moderna',
      items: [
        { title: 'Agentes de IA', desc: 'Creación de agentes autónomos para optimizar procesos y atención.', icon: Bot },
        { title: 'Automatización de Formatos', desc: 'Digitalización y flujo automático de documentos críticos.', icon: FileJson },
        { title: 'Business Intelligence', desc: 'Dashboards avanzados en Power BI y Tableau.', icon: BarChart3 },
        { title: 'AppSheet & Power Automate', desc: 'Desarrollo de aplicaciones low-code y flujos de trabajo.', icon: Zap },
        { title: 'Big Data & SQL', desc: 'Arquitectura de datos robusta y escalable.', icon: Database },
        { title: 'Análisis Estadístico en R', desc: 'Modelado matemático profundo para predicción.', icon: LineChart },
      ]
    },
    contact: {
      title: 'Iniciemos la Conversación',
      subtitle: 'Cuéntame tu caso en 15 minutos. Te digo si tiene solución y por dónde empezaría, sin compromiso.',
      gmail: 'Enviar Correo (Gmail)',
      whatsapp: 'WhatsApp Directo',
      whatsappPersonal: 'WhatsApp Personal',
      whatsappMx: 'WhatsApp México',
      linkedin: 'Perfil de LinkedIn',
      phone: 'Llamar Directo',
      formTitle: 'O escríbeme directamente',
      formName: 'Nombre completo',
      formEmail: 'Correo electrónico',
      formMessage: '¿En qué puedo ayudarte?',
      formSubmit: 'Enviar mensaje',
      formSending: 'Enviando...',
      formSuccess: '¡Mensaje enviado! Te responderé pronto.',
      formError: 'No se pudo enviar.',
      formErrorLink: 'Abrir el mensaje en tu correo',
    },
    footer: '© 2026 Diego Hernández. Todos los derechos reservados.',
  },
  en: {
    nav: {
      about: 'Know about me',
      solutions: 'Solutions',
      contact: 'Contact',
    },
    hero: {
      title: 'Diego Hernández',
      subtitle: 'Development · Industrial Analytics & AI',
      description: 'I help industrial companies and public institutions turn their data into decisions: I automate the repetitive work, build the system they are missing, and leave the team knowing how to use it.',
      cta: 'Book a free diagnostic',
      freeConsult: 'The first diagnostic call is free',
    },
    analytics: {
      title: 'Advanced Analytics Showcase',
      subtitle: 'This is how I find where the problem is before proposing a solution',
      pareto: {
        title: 'Pareto Chart (80/20)',
        desc: 'Identification of the vital causes that generate 80% of production problems.',
      },
      ishikawa: {
        title: 'Ishikawa Diagram (Fishbone)',
        desc: 'Root-cause analysis structured by the 6Ms (Manpower, Machinery, Methods, Materials, Measurement, Mother Nature).',
      },
      radar: {
        title: 'KPI Performance Matrix',
        desc: 'Multidimensional comparison of critical performance indicators.',
      },
      trends: {
        title: 'Predictive Trend Analysis',
        desc: 'Behavior projection based on Machine Learning models.',
      },
      dashboard: {
        title: 'Real-Time Control Dashboard',
        desc: 'Visualization of critical KPIs for industrial monitoring.',
        efficiency: 'OEE Efficiency',
        quality: 'Quality Index',
        downtime: 'Downtime',
        throughput: 'Tons / Shift',
        objetivo: 'Target',
        turno: 'last 8 shifts',
        demo: 'Sample data with the structure of a real control board'
      }
    },
    analyzer: {
      title: 'Data Lab (Beta)',
      subtitle: 'Upload your CSV file to generate automatic Pareto and Regression analysis.',
      upload: 'Upload CSV File',
      downloadTemplate: 'Download Base Template',
      stats: 'Complementary Statistics',
      pareto: 'Custom Pareto Analysis',
      regression: 'Linear Regression Analysis',
      noData: 'Please upload a CSV file to see the results.',
      error: 'Error processing the file. Make sure the format is correct (Columns: Cause, Value).'
    },
    services: {
      title: 'High-Level Solutions',
      subtitle: 'Cutting-edge tools for modern industry',
      items: [
        { title: 'AI Agents', desc: 'Creation of autonomous agents to optimize processes and support.', icon: Bot },
        { title: 'Format Automation', desc: 'Digitalization and automatic flow of critical documents.', icon: FileJson },
        { title: 'Business Intelligence', desc: 'Advanced dashboards in Power BI and Tableau.', icon: BarChart3 },
        { title: 'AppSheet & Power Automate', desc: 'Low-code app development and workflows.', icon: Zap },
        { title: 'Big Data & SQL', desc: 'Robust and scalable data architecture.', icon: Database },
        { title: 'Statistical Analysis in R', desc: 'Deep mathematical modeling for prediction.', icon: LineChart },
      ]
    },
    contact: {
      title: 'Let\'s Start the Conversation',
      subtitle: 'Tell me about your case in 15 minutes. I will tell you whether it has a solution and where I would start, no strings attached.',
      gmail: 'Send Email (Gmail)',
      whatsapp: 'Direct WhatsApp',
      whatsappPersonal: 'Personal WhatsApp',
      whatsappMx: 'Mexico WhatsApp',
      linkedin: 'LinkedIn Profile',
      phone: 'Call Direct',
      formTitle: 'Or write to me directly',
      formName: 'Full name',
      formEmail: 'Email address',
      formMessage: 'How can I help you?',
      formSubmit: 'Send message',
      formSending: 'Sending...',
      formSuccess: 'Message sent! I will get back to you soon.',
      formError: 'Could not send it.',
      formErrorLink: 'Open the message in your email app',
    },
    footer: '© 2026 Diego Hernández. All rights reserved.',
  }
};
