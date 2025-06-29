export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  category: 'ecommerce' | 'dashboard' | 'corporate' | 'pwa' | 'landing';
  year: number;
}

export const projects: Project[] = [
  {
    id: 'ecommerce-moderno',
    title: 'E-commerce React',
    description: 'Tienda online completa con carrito de compras, pasarela de pagos y panel administrativo. Diseño responsivo y optimizado para SEO.',
    technologies: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Stripe'],
    category: 'ecommerce',
    year: 2023,
    liveUrl: 'https://ecommerce-demo.com',
    githubUrl: 'https://github.com/damiannardini/ecommerce-react'
  },
  {
    id: 'dashboard-admin',
    title: 'Dashboard Administrativo',
    description: 'Panel de control completo para gestión de usuarios, ventas y analytics. Interfaz intuitiva con gráficos interactivos.',
    technologies: ['React', 'TypeScript', 'Chart.js', 'Material-UI', 'Firebase'],
    category: 'dashboard',
    year: 2023,
    liveUrl: 'https://dashboard-demo.com',
    githubUrl: 'https://github.com/damiannardini/admin-dashboard'
  },
  {
    id: 'sitio-corporativo',
    title: 'Sitio Web Corporativo',
    description: 'Sitio web moderno para empresa de tecnología. Diseño elegante con animaciones fluidas y optimización de performance.',
    technologies: ['React', 'Framer Motion', 'Tailwind CSS', 'Vite'],
    category: 'corporate',
    year: 2023,
    liveUrl: 'https://corporate-demo.com',
    githubUrl: 'https://github.com/damiannardini/corporate-site'
  },
  {
    id: 'pwa-app',
    title: 'Aplicación PWA',
    description: 'Aplicación web progresiva para gestión de tareas. Funciona offline y se instala como app nativa.',
    technologies: ['React', 'PWA', 'IndexedDB', 'Service Workers', 'CSS3'],
    category: 'pwa',
    year: 2022,
    liveUrl: 'https://pwa-demo.com',
    githubUrl: 'https://github.com/damiannardini/pwa-task-app'
  },
  {
    id: 'landing-page',
    title: 'Landing Page Conversión',
    description: 'Página de aterrizaje optimizada para conversiones. A/B testing integrado y análisis de comportamiento del usuario.',
    technologies: ['React', 'Google Analytics', 'Hotjar', 'Optimizely', 'CSS3'],
    category: 'landing',
    year: 2022,
    liveUrl: 'https://landing-demo.com',
    githubUrl: 'https://github.com/damiannardini/conversion-landing'
  },
  {
    id: 'legacy-migration',
    title: 'Migración Legacy a React',
    description: 'Migración completa de aplicación jQuery a React. Mejora del 300% en performance y mantenibilidad del código.',
    technologies: ['React', 'TypeScript', 'Webpack', 'Legacy Migration'],
    category: 'corporate',
    year: 2022,
    liveUrl: 'https://migration-demo.com',
    githubUrl: 'https://github.com/damiannardini/legacy-migration'
  }
];

export const projectCategories = {
  ecommerce: 'E-commerce',
  dashboard: 'Dashboards',
  corporate: 'Sitios Corporativos',
  pwa: 'Aplicaciones PWA',
  landing: 'Landing Pages'
}; 