

export interface ProfileSection {
  id: string;
  title: string;
  subtitle: string;
  content: string[];
  notebookContent?: {
    type: 'code' | 'design' | 'terminal' | 'browser';
    code?: string;
    language?: string;
    url?: string;
  };
}

export const profileSections: ProfileSection[] = [
  {
    id: 'intro',
    title: 'Desarrollador Frontend ',
    subtitle: 'Argentinardo',
    content: [
      '10+ años de experiencia en desarrollo web frontend',
      'Especializado en React, TypeScript y tecnologías modernas',
      'Disponible para proyectos freelance y colaboraciones',
      'Enfocado en crear experiencias de usuario excepcionales'
    ],
    notebookContent: {
      type: 'code',
      language: 'typescript',
      code: `const developer = {
  name: "Argentinardo",
  experience: "10+ años en Frontend",
  specialization: "React • TypeScript • UI/UX",
  passion: "Crear experiencias web únicas",
  location: "Barcelona",
  available: true,
};

console.log("¡Hola! Soy " + developer.name);
console.log("Con " + developer.experience + " de experiencia");
console.log("¿Trabajamos juntos?");

 ¡Hola! Soy Damian Nardini
 Con 10+ años en Frontend de experiencia  
¿Trabajamos juntos?
`
    }
  },
  {
    id: 'journey',
    title: 'Experiencia Laboral',
    subtitle: 'Trayectoria Profesional',
    content: [
      'Frontend Developer en empresas tecnológicas consolidadas',
      'Especializado en React, Vue.js y arquitectura CSS',
      'Experiencia con metodologías ágiles y equipos multidisciplinarios',
      'Colaboración con clientes de diversos sectores empresariales',
      'Desarrollo de aplicaciones web de alto impacto'
    ],
    notebookContent: {
      type: 'terminal',
      code: `console.log(damian.experience)

📅 2019-2024: FRONT-END DEVELOPER
   🏢 MULTIPLICA | BARCELONA
   • Colaboré con equipos multidisciplinarios para diseñar interfaces
   • Optimicé rendimiento de aplicaciones web
   • Trabajé con clientes: Aedas, Occident, Balearia
   • Implementé metodologías ágiles

📅 2019: FRONT-END / ARQUITECTO CSS
   🏢 SUNTRANSFERS | BARCELONA
   • Arquitectura BEMIT (BEM + ITCSS)
   • Tecnologías: GIT, GitHub, JavaScript, CSS (Less, Sass)
   • Metodología Agile (Scrum, Jira, Slack)

📅 2018-2019: FRONT-END /JS - CSS
   🏢 GLOBAL PLANNING SOLUTIONS | BARCELONA
   • Desarrollo frontend con Vue.js
   • Maquetado en Vuefy
   • Configuración de webpack
   • Diseño visual de componentes

📅 2017: FRONT-END / ARQUITECTO CSS
   🏢 SPENTA BEEZY | BARCELONA
   • Maquetación CSS/HTML
   • Tecnologías: Sass, Handlebars, Webpack, Git
   • Maquetación para e-mail

📅 2015-2016: FRONT-END / WEB UI
   🏢 FREELANCE | ROSARIO
   • Diseño y maquetado de themes WordPress
   • Proyectos con Less, Bootstrap, WordPressCSS

📅 2012-2014: FRONT-END / PLD
   🏢 GLOBANT | ROSARIO
   • Clientes: Blackberry, EMC, Mastercard, MercedesBenz
   • HTML5/CSS3, JavaScript, jQuery
   • Frameworks: Bootstrap, Foundation
   • Preprocesadores: Sass, Less

📅 2008-2012: MAQUETADOR / DISEÑADOR MULTIMEDIA
   🏢 VISIONGRAF | ROSARIO
   • Presentaciones multimedia
   • Desarrollo de páginas web

📅 2006-2007: MAQUETADOR CSS
   🏢 ESTUDIO HORMIGA | ROSARIO
   • Clientes: La Segunda, Los Pumas
   • Maquetación PSD a XHTML/CSS

📅 2006-2007: MAQUETADOR - DISEÑADOR WEB
   🏢 ESTUDIO QUADRA | ROSARIO
   • Maquetación, Diseño Web, Animación Flash

console.log(+10 años de experiencia)`
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
      type: 'browser',
      url: 'https://mecano-game.netlify.app'
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
    title: 'Trabajemos Juntos',
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