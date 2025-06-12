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
    title: 'Frontend Developer',
    subtitle: 'Damian Nardini',
    content: [
      'Desarrollador Frontend especializado en React, TypeScript y tecnologías web modernas.',
      'Experiencia en crear interfaces de usuario interactivas y responsivas.',
      'Apasionado por el diseño UX/UI y las animaciones web.'
    ],
    notebookContent: {
      type: 'code',
      language: 'typescript',
      code: `const developer = {
  name: "Damian Nardini",
  role: "Frontend Developer",
  skills: ["React", "TypeScript", "JavaScript"],
  passion: "Creating amazing user experiences",
  location: "Argentina",
  available: true
};

console.log(developer.passion);`
    }
  },
  {
    id: 'skills',
    title: 'Tecnologías',
    subtitle: 'Stack Tecnológico',
    content: [
      'React • TypeScript • JavaScript',
      'HTML5 • CSS3 • Tailwind CSS',
      'Node.js • Git • Responsive Design',
      'Animaciones • UX/UI • Performance'
    ],
    notebookContent: {
      type: 'code',
      language: 'javascript',
      code: `// Mi stack tecnológico favorito
const techStack = {
  frontend: {
    frameworks: ["React", "Next.js"],
    languages: ["TypeScript", "JavaScript"],
    styling: ["Tailwind CSS", "Styled Components"],
    animation: ["Framer Motion", "CSS Animations"]
  },
  tools: ["Git", "VS Code", "Figma"],
  learning: ["Three.js", "WebGL", "Node.js"]
};

export default techStack;`
    }
  },
  {
    id: 'experience',
    title: 'Experiencia',
    subtitle: 'Proyectos y Trabajo',
    content: [
      'Desarrollo de aplicaciones web modernas y responsivas',
      'Implementación de interfaces de usuario complejas',
      'Optimización de performance y SEO',
      'Colaboración en equipos ágiles'
    ],
    notebookContent: {
      type: 'browser',
      url: 'https://portfolio-example.com'
    }
  },
  {
    id: 'contact',
    title: 'Conectemos',
    subtitle: 'Contacto',
    content: [
      'LinkedIn: linkedin.com/in/damiannardini',
      'Disponible para nuevos proyectos',
      'Colaboraciones y oportunidades',
      'Desarrollo frontend y consultoría'
    ],
    notebookContent: {
      type: 'terminal',
      code: `$ git clone https://github.com/damiannardini
$ cd portfolio
$ npm install
$ npm start

> Ready! Portfolio running at localhost:3000

$ echo "Let's build something amazing together!"
> Let's build something amazing together!`
    }
  }
];

export const socialLinks = {
  linkedin: 'https://www.linkedin.com/in/damiannardini',
  github: 'https://github.com/damiannardini',
  email: 'contacto@damiannardini.com'
}; 