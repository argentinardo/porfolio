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
    title: 'Desarrollador Frontend Senior',
    subtitle: 'Damian Nardini',
    content: [
      '20+ años de experiencia en desarrollo web frontend',
      'Especializado en React, TypeScript y tecnologías modernas',
      'Disponible para proyectos freelance y colaboraciones',
      'Enfocado en crear experiencias de usuario excepcionales'
    ],
    notebookContent: {
      type: 'code',
      language: 'typescript',
      code: `const seniorDeveloper = {
  name: "Damian Nardini",
  experience: "20+ años en Frontend",
  currentStatus: "Disponible para Freelance",
  specialization: "React • TypeScript • UI/UX",
  passion: "Crear experiencias web únicas",
  location: "Argentina",
  available: true,
  rate: "Competitiva y flexible"
};

console.log("¡Hola! Soy " + seniorDeveloper.name);
console.log("Con " + seniorDeveloper.experience + " de experiencia");
console.log("Actualmente: " + seniorDeveloper.currentStatus);`
    }
  },
  {
    id: 'journey',
    title: 'Mi Trayectoria',
    subtitle: '20 Años de Evolución Web',
    content: [
      'Comencé con HTML estático y JavaScript vanilla',
      'Evolucioné con jQuery, PHP y bases de datos',
      'Adapté mis skills a React, TypeScript y frameworks modernos',
      'Mantuve la pasión por crear interfaces intuitivas y atractivas',
      'Experiencia en múltiples industrias y tipos de proyectos'
    ],
    notebookContent: {
      type: 'terminal',
      code: `$ timeline --show "Damian's Web Journey"

📅 2003-2008: HTML/CSS/JavaScript Vanilla
   - Sitios web estáticos
   - Efectos con JavaScript
   - Compatibilidad cross-browser

📅 2008-2015: jQuery + PHP + MySQL
   - Aplicaciones web dinámicas
   - Integración con bases de datos
   - AJAX y interacciones asíncronas

📅 2015-2020: React + Node.js
   - Aplicaciones SPA modernas
   - Componentes reutilizables
   - APIs RESTful

📅 2020-Presente: React + TypeScript
   - Código más robusto y mantenible
   - Mejores prácticas modernas
   - Enfoque en performance y UX

$ echo "¡Siempre aprendiendo y evolucionando!"`
    }
  },
  {
    id: 'projects',
    title: 'Proyectos Destacados',
    subtitle: 'Portfolio de Trabajos',
    content: [
      'E-commerce con React y TypeScript',
      'Dashboards administrativos responsivos',
      'Sitios web corporativos modernos',
      'Aplicaciones web progresivas (PWA)',
      'Integraciones con APIs de terceros'
    ],
    notebookContent: {
      type: 'browser',
      url: 'https://portfolio-projects.com'
    }
  },
  {
    id: 'freelance',
    title: 'Servicios Freelance',
    subtitle: '¿Qué Puedo Hacer por Ti?',
    content: [
      '🖥️ Desarrollo de sitios web completos',
      '⚛️ Aplicaciones React/TypeScript',
      '📱 Diseño responsivo y mobile-first',
      '🔧 Mantenimiento y optimización',
      '🚀 Migración de tecnologías legacy',
      '💡 Consultoría técnica y mentoring'
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
      '💼 Busco proyectos freelance interesantes',
      '🤝 Colaboraciones a largo plazo',
      '📧 Contacto directo y respuesta rápida',
      '💻 Disponibilidad inmediata',
      '🌍 Trabajo remoto desde Argentina'
    ],
    notebookContent: {
      type: 'terminal',
      code: `$ contact --damian-nardini

📧 Email: contacto@damiannardini.com
💼 LinkedIn: linkedin.com/in/damiannardini
🐙 GitHub: github.com/damiannardini
📱 WhatsApp: +54 9 11 XXXX-XXXX

$ echo "¡Conversemos sobre tu proyecto!"
> ¡Conversemos sobre tu proyecto!

$ echo "Disponible para reuniones virtuales"
> Disponible para reuniones virtuales

$ echo "Respuesta en menos de 24 horas"
> Respuesta en menos de 24 horas

$ git status
> Ready to collaborate! 🚀`
    }
  }
];

export const socialLinks = {
  linkedin: 'https://www.linkedin.com/in/damiannardini',
  github: 'https://github.com/damiannardini',
  email: 'contacto@damiannardini.com'
}; 