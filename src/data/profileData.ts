

export interface ProfileSection {
  id: string;
  title: string;
  subtitle: string;
  content: string[];
  notebookContent?: {
    type: 'code' | 'design' | 'browser';
    code?: string;
    language?: string;
    url?: string;
  };
}

export const profileSections: ProfileSection[] = [
  {
    id: 'intro',
    title: 'Frontend developer',
    subtitle: 'Damián Nardini',
    content: [
      '15+ años de experiencia en desarrollo web frontend',
      'Especializado en React, TypeScript y tecnologías modernas',
      'Disponible para proyectos freelance y colaboraciones',
      'Enfocado en crear experiencias de usuario excepcionales'
    ],
    notebookContent: {
      type: 'code',
      language: 'typescript',
      code: `const developer = {
  name: "Damián Nardini",
  experience: "15+ años en Frontend",
  specialization: "React • TypeScript • UI/UX",
  passion: "Crear experiencias web únicas",
  location: "Barcelona",
  available: true,
};

console.log("¡Hola! Soy " + developer.name);
console.log("Con " + developer.experience + " de experiencia");
console.log("¿En que puedo ayudarte?");

 ¡Hola! Soy Damian Nardini
 Con 15+ años en Frontend de experiencia  
¿En que puedo ayudarte?
`
    }
  },
  {
    id: 'journey',
    title: 'Experiencia Laboral',
    subtitle: 'Lo Que He Logrado',
    content: [
      'Desarrollo frontend especializado en React y Vue.js',
      'Arquitectura CSS escalable con metodologías BEMIT',
      'Optimización de rendimiento en aplicaciones web',
      'Colaboración con equipos multidisciplinarios',
      'Implementación de metodologías ágiles'
    ],
    notebookContent: {
      type: 'code',
      language: 'typescript',
      code: `console.log(damian.experience)

DESARROLLO FRONTEND AVANZADO
   • Reducción de tiempos de carga en 40% en aplicaciones críticas
   • Implementación de lazy loading y code splitting
   • Desarrollo de componentes reutilizables con React
   • Colaboración en proyectos para sectores inmobiliario y logística

ARQUITECTURA CSS ESCALABLE
   • Creación de sistemas de diseño mantenibles con metodología BEMIT
   • Optimización de flujos de trabajo con Git y GitHub
   • Desarrollo con Less, Sass y JavaScript moderno
   • Implementación de metodologías ágiles (Scrum, Jira)

DESARROLLO VUE.JS
   • Construcción de interfaces complejas con Vue.js
   • Implementación de layout responsivo con Vuefy
   • Configuración de bundlers y herramientas de build
   • Diseño de componentes visuales interactivos

LAYOUT Y EMAIL MARKETING
   • Creación de sistemas de layout CSS/HTML
   • Implementación de templates con Sass y Handlebars
   • Desarrollo de emails compatibles responsivos
   • Optimización de flujos de trabajo con Webpack

DESARROLLO WORDPRESS
   • Diseño y desarrollo de temas WordPress completos
   • Implementación de funcionalidades con Less y Bootstrap
   • Creación de experiencias de usuario únicas
   • Optimización de SEO y rendimiento

DESARROLLO FRONTEND CORPORATIVO
   • Desarrollo de interfaces para empresas Fortune 500
   • Implementación de HTML5/CSS3 y JavaScript avanzado
   • Trabajo con frameworks Bootstrap y Foundation
   • Optimización con preprocesadores Sass y Less`
    }
  },
  {
    id: 'projects',
    title: 'Proyectos Personales',
    subtitle: 'Desarrollo Creativo',
    content: [
      'Juegos web interactivos con JavaScript',
      'Aplicaciones React con animaciones avanzadas',
      'Proyectos experimentales de UI/UX',
      'Herramientas de desarrollo personal',
      'Demostraciones de tecnologías modernas'
    ],
    notebookContent: {
      type: 'code',
      language: 'javascript',
      code: `// Proyectos Personales de mi portfolio
const featuredProjects = {
  ecommerce: {
    title: "E-commerce React",
    description: "Tienda online completa con carrito y pasarela de pago",
    technologies: ["React", "TypeScript", "Node.js", "MongoDB"],
    features: ["Carrito de compras", "Pasarela de pago", "Panel admin", "SEO optimizado"]
  },
  dashboard: {
    title: "Dashboard Administrativo",
    description: "Panel de control para gestión de usuarios y analytics",
    technologies: ["React", "TypeScript", "Chart.js", "Firebase"],
    features: ["Gráficos interactivos", "Gestión de usuarios", "Analytics", "Responsive"]
  },
  corporate: {
    title: "Sitio Web Corporativo",
    description: "Sitio web moderno para empresa de tecnología",
    technologies: ["React", "Framer Motion", "Tailwind CSS"],
    features: ["Animaciones fluidas", "Diseño elegante", "Optimización", "Performance"]
  },
  pwa: {
    title: "Aplicación PWA",
    description: "Aplicación web progresiva para gestión de tareas",
    technologies: ["React", "PWA", "IndexedDB", "Service Workers"],
    features: ["Funciona offline", "Instalable", "Sincronización", "Nativo"]
  }
};

console.log("Proyectos Personales:", Object.keys(featuredProjects));
console.log("Tecnologías principales: React, TypeScript, Node.js");
console.log("Enfoque: UX/UI, Performance, Responsive Design");`
    }
  },
  {
    id: 'services',
    title: 'Servicios Profesionales',
    subtitle: 'Soluciones Web Completas',
    content: [
      'Desarrollo frontend especializado',
      'Diseño de interfaces modernas',
      'Optimización y mantenimiento',
      'Consultoría técnica'
    ],
    notebookContent: {
      type: 'browser',
      url: 'https://services-portfolio.com'
    }
  },
  {
    id: 'freelance',
    title: 'Servicios Freelance',
    subtitle: '¿Qué Puedo Hacer por Ti?',
    content: [
      'Desarrollo de sitios web completos',
      'Aplicaciones React/TypeScript',
      'Diseño responsivo y mobile-first',
      'Mantenimiento y optimización',
      'Migración de tecnologías legacy',
      'Consultoría técnica y mentoring',
      'Implementación de IA en local'
    ],
    notebookContent: {
      type: 'code',
      language: 'javascript',
      code: `// Servicios que ofrezco como Freelancer
const freelanceServices = {
  development: {
    websites: "Sitios web modernos y responsivos",
    applications: "Apps React/TypeScript",
    ecommerce: "Tiendas online completas",
    dashboards: "Paneles administrativos"
  },
  design: {
    responsive: "Mobile-first design",
    ux: "Experiencias de usuario",
    animations: "Interacciones fluidas",
    accessibility: "Sitios inclusivos"
  },
  ai: {
    localImplementation: "Implementación de IA en local",
    models: "Integración de modelos LLM",
    apis: "APIs de inteligencia artificial",
    automation: "Automatización con IA"
  },
  consulting: {
    codeReview: "Revisión y optimización",
    migration: "Actualización de tecnologías",
    mentoring: "Capacitación de equipos",
    architecture: "Arquitectura frontend"
  },
  rates: {
    hourly: "Tarifa por hora competitiva",
    project: "Presupuestos fijos",
    retainer: "Mantenimiento mensual",
    flexible: "Negociable según proyecto"
  }
};

export default freelanceServices;`
    }
  },
  {
    id: 'contact',
    title: 'Cuéntame tu idea',
    subtitle: 'Disponible para Nuevos Proyectos',
    content: [
      'Busco proyectos freelance interesantes',
      'Colaboraciones a largo plazo',
      'Contacto directo y respuesta rápida',
      'Disponibilidad inmediata'
    ],
    notebookContent: {
      type: 'browser',
      url: 'https://contact-portfolio.com'
    }
  }
];

export const socialLinks = {
  linkedin: 'https://www.linkedin.com/in/damiannardini',
  github: 'https://github.com/damiannardini',
  email: 'damiannardini@gmail.com'
}; 