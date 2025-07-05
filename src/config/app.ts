// Configuración centralizada de la aplicación
export const APP_CONFIG = {
  // Información básica
  name: 'Damian Nardini',
  title: 'Desarrollador Frontend ',
  description: 'Portfolio de Damian Nardini - Desarrollador Frontend  con 20+ años de experiencia en React, TypeScript y tecnologías modernas',
  
  // URLs
  baseUrl: 'https://damiannardini.com',
  social: {
    linkedin: 'https://www.linkedin.com/in/damiannardini',
    github: 'https://github.com/damiannardini',
    email: 'contacto@damiannardini.com'
  },
  
  // Configuración de animaciones
  animations: {
    particleCount: 250,
    spawnInterval: 50,
    maxNodesToSpawn: 50,
    pulseSpeed: 2,
    maxChainReactionDepth: 3
  },
  
  // Configuración de scroll
  scroll: {
    snapType: 'y mandatory',
    behavior: 'smooth'
  },
  
  // Configuración de performance
  performance: {
    throttleDelay: 16, // ~60fps
    debounceDelay: 150,
    maxParticles: 300
  },
  
  // Configuración de accesibilidad
  accessibility: {
    skipLinkText: 'Saltar al contenido principal',
    focusVisibleClass: 'focus-visible',
    reducedMotion: 'prefers-reduced-motion'
  }
};

// Tipos de configuración
export interface AppConfig {
  name: string;
  title: string;
  description: string;
  baseUrl: string;
  social: {
    linkedin: string;
    github: string;
    email: string;
  };
  animations: {
    particleCount: number;
    spawnInterval: number;
    maxNodesToSpawn: number;
    pulseSpeed: number;
    maxChainReactionDepth: number;
  };
  scroll: {
    snapType: string;
    behavior: string;
  };
  performance: {
    throttleDelay: number;
    debounceDelay: number;
    maxParticles: number;
  };
  accessibility: {
    skipLinkText: string;
    focusVisibleClass: string;
    reducedMotion: string;
  };
} 