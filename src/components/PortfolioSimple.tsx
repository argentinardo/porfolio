import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { NeuralNetworkBackground } from './SimpleAnimations';
import ServiceCards from './ServiceCards';
import ContactForm from './ContactForm';
import ProjectsShowcase from './ProjectsShowcase';
import MobileStickyBar from './MobileStickyBar';
import { socialLinks } from '../data/profileData';
import { 
  CodeBracketIcon,
  DevicePhoneMobileIcon,
  WrenchScrewdriverIcon,
  RocketLaunchIcon,
  BriefcaseIcon,
  UserGroupIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  CpuChipIcon,
  ChevronRightIcon,
  XMarkIcon,
  WindowIcon,
  ChevronDownIcon,
  // Nuevos iconos más profesionales
  AcademicCapIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { SkipLink } from './SkipLink';
import '../styles/portfolio.css';

interface ProfileSection {
  id: string;
  title: string;
  subtitle: string;
  content: string[];
  notebookContent?: {
    type: 'code' | 'design' | 'terminal' | 'browser';
    code?: string;
    language?: string;
    url?: string;
  } | null;
}

// Componente para texto animado con cursor parpadeante
const AnimatedText: React.FC<{ text: string; speed?: number; className?: string }> = ({ 
  text, 
  speed = 50, 
  className = '' 
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { i18n } = useTranslation();

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
  }, [text, i18n.language]);

  useEffect(() => {
    // En móvil, mostrar todo el texto inmediatamente sin animación
    if (isMobile) {
      setDisplayedText(text);
      setCurrentIndex(text.length);
      return;
    }

    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, speed, isMobile]);

  // Cursor parpadeante solo en desktop
  useEffect(() => {
    if (isMobile) return;
    
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(cursorTimer);
  }, [isMobile]);

  return (
    <span className={className}>
      {displayedText}
      {!isMobile && showCursor && <span className="blinking-cursor">|</span>}
    </span>
  );
};

// Componente para renderizar elementos de lista con iconos
const ListItemWithIcon: React.FC<{ text: string; index: number; sectionId: string }> = ({ text, index, sectionId }) => {
  const getIconForSection = (sectionId: string, index: number) => {
    if (sectionId === 'freelance') {
      const icons = [
        GlobeAltIcon,           // Desarrollo de sitios web completos
        CodeBracketIcon,     // Aplicaciones React/TypeScript
        DevicePhoneMobileIcon, // Diseño responsivo y mobile-first
        WrenchScrewdriverIcon, // Mantenimiento y optimización
        RocketLaunchIcon,    // Migración de tecnologías legacy
        AcademicCapIcon,     // Consultoría técnica y mentoring
        CpuChipIcon          // Implementación de IA en local
      ];
      return icons[index] || GlobeAltIcon;
    } else if (sectionId === 'contact') {
      const icons = [
        BriefcaseIcon,       // Busco proyectos freelance interesantes
        UserGroupIcon,       // Colaboraciones a largo plazo
        EnvelopeIcon,        // Contacto directo y respuesta rápida
        ClockIcon,           // Disponibilidad inmediata
        GlobeAltIcon         // Proyectos internacionales
      ];
      return icons[index] || BriefcaseIcon;
    }
    return null;
  };

  const IconComponent = getIconForSection(sectionId, index);

  if (!IconComponent) {
    return <p className="content-item" role="listitem">{text}</p>;
  }

  return (

      <p className="content-item">{text}</p>
  );
};


const PortfolioSimple: React.FC = () => {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [displaySection, setDisplaySection] = useState(0);
  const [isNotebookElevated, setIsNotebookElevated] = useState(false);
  const [isNotebookClosed, setIsNotebookClosed] = useState(false);
  const [isWindowMinimized, setIsWindowMinimized] = useState(false);
  const [isWindowMaximized, setIsWindowMaximized] = useState(false);
  const [activeGame, setActiveGame] = useState<{ url: string; title: string } | null>(null);
  const prevSectionRef = useRef<number>(0);
  const notebookContainerRef = useRef<HTMLDivElement>(null);

  // Función para manejar cuando se hace clic en un juego
  const handlePlayGame = (gameUrl: string, gameTitle: string) => {
    setActiveGame({ url: gameUrl, title: gameTitle });
  };

  // Generar secciones dinámicamente desde las traducciones
  const profileSections = useMemo(() => {
    return [
    {
      id: 'intro',
      title: t('intro.title'),
      subtitle: t('intro.subtitle'),
      content: t('intro.content', { returnObjects: true }) as string[],
      notebookContent: {
        type: 'code' as const,
        code: t('intro.notebook.code'),
        language: 'typescript'
      }
    },
    {
      id: 'services',
      title: t('services.title'),
      subtitle: t('services.subtitle'),
      content: [],
      notebookContent: {
        type: 'code' as const,
        code: t('services.notebook.code'),
        language: 'javascript'
      }
    },
    {
      id: 'projects',
      title: t('projects.title'),
      subtitle: t('projects.subtitle'),
      content: [],
      notebookContent: {
        type: 'code' as const,
        code: t('projects.notebook.code'),
        language: 'javascript'
      }
    },
    {
      id: 'experience',
      title: t('experience.title'),
      subtitle: t('experience.subtitle'),
      content: t('experience.content', { returnObjects: true }) as string[],
      notebookContent: {
        type: 'code' as const,
        code: t('experience.notebook.code')
      }
    },
    {
      id: 'contact',
      title: t('contact.title'),
      subtitle: t('contact.subtitle'),
      content: [
        t('contact.description')
      ],
      notebookContent: {
        type: 'code' as const,
        code: t('contact.notebook.code'),
        language: 'javascript'
      }
    }
  ];
  }, [t]);

  // Asegurar que el contenido se actualice cuando cambie el idioma
  useEffect(() => {
    // Forzar la actualización del contenido cuando cambie el idioma
    const currentSection = profileSections[displaySection];
    if (currentSection && currentSection.notebookContent) {
      // Esto asegura que el contenido se actualice inmediatamente
      setDisplaySection(displaySection);
    }
  }, [t, profileSections, displaySection]);



  useEffect(() => {
    if (prevSectionRef.current !== activeSection) {
      // Iniciar animación de cierre
      setIsNotebookClosed(true);
      
      // Cambiar contenido a mitad de la animación
      setTimeout(() => {
        setDisplaySection(activeSection);
      }, 300);
      
      // Terminar animación
      setTimeout(() => {
        setIsNotebookClosed(false);
      }, 600);
      
    } else if (prevSectionRef.current === activeSection && displaySection !== activeSection) {
      // Inicializar displaySection si no coincide
      setDisplaySection(activeSection);
    }
    prevSectionRef.current = activeSection;
  }, [activeSection, displaySection]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollTop / docHeight;
      
      const sectionIndex = Math.round(progress * (profileSections.length - 1));
      setActiveSection(Math.max(0, Math.min(sectionIndex, profileSections.length - 1)));
      
      // Si la notebook está maximizada y se hace scroll, volver al estado normal
      if (isWindowMaximized) {
        setIsWindowMaximized(false);
        // También desminimizar si estaba minimizada
        if (isWindowMinimized) {
          setIsWindowMinimized(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isWindowMaximized, isWindowMinimized, profileSections.length]);

  const currentSection = profileSections[displaySection];
  
  // Calcular si estamos en la sección de servicios para mover la notebook
  const isServicesSection = profileSections[activeSection]?.id === 'services';
  
  useEffect(() => {
    if (isServicesSection) {
      // Cuando estamos en servicios, la notebook deja de estar fija
      setIsNotebookElevated(true);
    } else {
      setIsNotebookElevated(false);
    }
  }, [isServicesSection]);

  const renderWindowContent = () => {
    
    // Determinar el título de la ventana
    let windowTitle = currentSection.title;
    if (currentSection.id === 'projects' && activeGame) {
      windowTitle = activeGame.title;
    }
    
    const windowHeader = (
      <div className="editor-header">
        <div className="window-controls">
          <button 
            className="control-btn red" 
            aria-label="Cerrar ventana"
            onClick={() => handleWindowControl('close')}
          >
            <XMarkIcon className="control-icon" />
          </button>
          <button 
            className="control-btn yellow" 
            aria-label="Minimizar ventana"
            onClick={() => handleWindowControl('minimize')}
          >
            <ChevronDownIcon className="control-icon" />
          </button>
          <button 
            className="control-btn green" 
            aria-label="Maximizar ventana"
            onClick={() => handleWindowControl('maximize')}
          >
            <WindowIcon className="control-icon" />
          </button>
        </div>
        <span className="editor-filename">
          {windowTitle}
        </span>
      </div>
    );

    // Renderizar contenido específico para cada sección dentro del notebook
    if (currentSection.id === 'services') {
      return (
        <div className="window-base services">
          {windowHeader}
          <div className="code-content">
            <ServiceCards isVisible={true} />
          </div>
        </div>
      );
    }

    if (currentSection.id === 'projects') {
      
      // Si hay un juego activo, mostrar el iframe
      if (activeGame) {
        return (
          <div className="window-base game">
            {windowHeader}
            <div className="game-content">
              <iframe
                src={activeGame.url}
                title={activeGame.title}
                allowFullScreen
              />
            </div>
          </div>
        );
      }
      
      // Si no hay juego activo, mostrar la lista de proyectos
      return (
        <div className="window-base projects">
          {windowHeader}
          <div className="code-content">
            <ProjectsShowcase isVisible={true} minimal={true} onPlayGame={handlePlayGame} />
          </div>
        </div>
      );
    }

    if (currentSection.id === 'contact') {
      return (
        <div className="window-base contact">
          {windowHeader}
          <div className="code-content">
            <ContactForm isVisible={true} />
          </div>
        </div>
      );
    }

    // Para otras secciones, usar el notebookContent original
    if (!currentSection.notebookContent) return null;

    const notebookContent = currentSection.notebookContent;
    if (!notebookContent) return null;
    
    const { type, code } = notebookContent;

    switch (type) {
      case 'code':
        return (
          <div className={`window-base ${type}`}>
            {windowHeader}
            <pre className="code-content">
              <code>
                <AnimatedText 
                  text={code || ''} 
                  speed={2} 
                  className="animated-code"
                />
              </code>
            </pre>
          </div>
        );

      default:
        return null;
    }
  };

  const renderMobileNotebook = (section: ProfileSection) => {
    // Caso especial para el formulario de contacto
    if (section.id === 'contact') {
      return (
        <div className="window-base contact">
          <div className="editor-header">
            <div className="window-controls">
              <button 
                className="control-btn red" 
                aria-label="Cerrar ventana"
                disabled
              >
                <XMarkIcon className="control-icon" />
              </button>
              <button 
                className="control-btn yellow" 
                aria-label="Minimizar ventana"
                disabled
              >
                <ChevronDownIcon className="control-icon" />
              </button>
              <button 
                className="control-btn green" 
                aria-label="Maximizar ventana"
                disabled
              >
                <WindowIcon className="control-icon" />
              </button>
            </div>
            <span className="editor-filename">
              {section.title}
            </span>
          </div>
          <div className="code-content">
            <ContactForm isVisible={true} />
          </div>
        </div>
      );
    }

    // Caso especial para la sección de proyectos
    if (section.id === 'projects') {
      return (
        <div className="window-base projects">
          <div className="editor-header">
            <div className="window-controls">
              <button 
                className="control-btn red" 
                aria-label="Cerrar ventana"
                disabled
              >
                <XMarkIcon className="control-icon" />
              </button>
              <button 
                className="control-btn yellow" 
                aria-label="Minimizar ventana"
                disabled
              >
                <ChevronDownIcon className="control-icon" />
              </button>
              <button 
                className="control-btn green" 
                aria-label="Maximizar ventana"
                disabled
              >
                <WindowIcon className="control-icon" />
              </button>
            </div>
            <span className="editor-filename">
              {section.title}
            </span>
          </div>
          <div className="code-content">
            <ProjectsShowcase isVisible={true} minimal={true} onPlayGame={handlePlayGame} />
          </div>
        </div>
      );
    }

    if (!section.notebookContent) return null;

    const notebookContent = section.notebookContent;
    if (!notebookContent) return null;
    
    const { type, code } = notebookContent;

    const windowHeader = (
      <div className="editor-header">
        <div className="window-controls">
          <button 
            className="control-btn red" 
            aria-label="Cerrar ventana"
            disabled
          >
            <XMarkIcon className="control-icon" />
          </button>
          <button 
            className="control-btn yellow" 
            aria-label="Minimizar ventana"
            disabled
          >
            <ChevronDownIcon className="control-icon" />
          </button>
          <button 
            className="control-btn green" 
            aria-label="Maximizar ventana"
            disabled
          >
            <WindowIcon className="control-icon" />
          </button>
        </div>
        <span className="editor-filename">
          {section.title}
        </span>
      </div>
    );

    switch (type) {
      case 'code':
        return (
          <div className={`window-base ${type}`}>
            {windowHeader}
            <pre className="code-content">
              <code>
                <AnimatedText 
                  text={code || ''} 
                  speed={2} 
                  className="animated-code"
                />
              </code>
            </pre>
          </div>
        );

      default:
        return null;
    }
  };

  const handleWindowControl = (action: 'close' | 'minimize' | 'maximize') => {
    switch (action) {
      case 'close':
        // Si hay un juego activo, cerrar el juego en lugar de la ventana
        if (activeGame) {
          setActiveGame(null);
        } else {
          setIsNotebookClosed(true);
          // Reabrir después de la animación de cierre
          setTimeout(() => {
            setIsNotebookClosed(false);
          }, 600);
        }
        break;
      case 'minimize':
        if (isWindowMaximized) {
          // Si está maximizada, restaurar al tamaño original
          setIsWindowMaximized(false);
          setIsWindowMinimized(false);
        } else {
          // Si no está maximizada, minimizar
          setIsWindowMinimized(!isWindowMinimized);
        }
        break;
      case 'maximize':
        setIsWindowMaximized(!isWindowMaximized);
        // Si está minimizado, también lo desminimiza
        if (isWindowMinimized) {
          setIsWindowMinimized(false);
        }
        break;
    }
  };

  const scrollToSection = (index: number) => {
    const section = profileSections[index];
    if (!section) return;

    // Buscar el elemento subtitle de la sección
    const subtitleElement = document.getElementById(`subtitle-${section.id}`);
    if (subtitleElement) {
      // Calcular la posición del subtitle
      const rect = subtitleElement.getBoundingClientRect();
      const scrollTop = window.pageYOffset + rect.top;
      
      // Ajustar para la barra sticky en mobile (4rem = 64px) + 20px de separación
      const isMobile = window.innerWidth <= 768;
      const offset = isMobile ? 84 : 20; // 64px (barra sticky) + 20px (separación)
      
      window.scrollTo({ 
        top: scrollTop - offset, 
        behavior: 'smooth' 
      });
    } else {
      // Fallback: usar el método anterior
      const targetScroll = (index / (profileSections.length - 1)) * 
        (document.documentElement.scrollHeight - window.innerHeight);
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  };

  const handleMobileMenuToggle = (isOpen: boolean) => {
    setIsMobileMenuOpen(isOpen);
    
    // Enviar evento para sincronizar el estado del menú
    const event = new CustomEvent('toggleMobileMenu', { detail: { isOpen } });
    window.dispatchEvent(event);
    
    // Cerrar el menú después de hacer click en una sección
    if (!isOpen) {
      setTimeout(() => {
        const closeEvent = new CustomEvent('closeMobileMenu');
        window.dispatchEvent(closeEvent);
      }, 100);
    }
  };

  // Escuchar eventos para sincronizar el estado del menú
  useEffect(() => {
    const handleCloseMobileMenu = () => {
      setIsMobileMenuOpen(false);
    };

    window.addEventListener('closeMobileMenu', handleCloseMobileMenu);
    
    return () => {
      window.removeEventListener('closeMobileMenu', handleCloseMobileMenu);
    };
  }, []);

  // Insertar marcadores en el menú móvil
  useEffect(() => {
    const mobileMarkersContainer = document.getElementById('mobile-navigation-markers');
    if (mobileMarkersContainer) {
      mobileMarkersContainer.innerHTML = '';
      profileSections.forEach((section, index) => {
        const marker = document.createElement('button');
        marker.className = `mobile-progress-dot ${index === activeSection ? 'active' : ''}`;
        marker.onclick = () => {
          scrollToSection(index);
          // Cerrar el menú móvil después de hacer click
          setIsMobileMenuOpen(false);
          setTimeout(() => {
            const event = new CustomEvent('closeMobileMenu');
            window.dispatchEvent(event);
          }, 100);
        };
        marker.innerHTML = `
          <ChevronRightIcon class="mobile-progress-indicator-icon" />
          <span class="mobile-progress-dot-label">${section.title}</span>
        `;
        mobileMarkersContainer.appendChild(marker);
      });
    }
  }, [activeSection, profileSections, scrollToSection]);

  return (
    <div className="portfolio-container" role="main" aria-label="Portfolio de Damian Nardini">
      <SkipLink />
      <NeuralNetworkBackground />
      
      {/* Barra sticky para mobile */}
      <MobileStickyBar 
        activeSection={activeSection}
        onMenuToggle={handleMobileMenuToggle}
        isMenuOpen={isMobileMenuOpen}
      />
      
      {/* Layout fijo con notebook */}
      <div className="fixed-layout" aria-hidden="true">
        <div className="content-grid">
          {/* Notebook */}
          <div 
            ref={notebookContainerRef} 
            className={`notebook-container ${isNotebookElevated ? 'elevated' : ''}`}
            aria-label="Pantalla de notebook mostrando contenido del portfolio"
          >
            <div className={`notebook ${
              currentSection.notebookContent ? 'active' : 'inactive'
            } ${isWindowMinimized ? 'minimized' : ''} ${isWindowMaximized ? 'maximized' : ''}`}>
              <div className="laptop-base"></div>
              <div className={`laptop-screen ${isNotebookClosed ? 'animating' : ''}`}>
                <div className="screen-content">
                  {renderWindowContent()}
                </div>
                <div className="screen-reflection"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido que hace scroll */}
      <div className="scrollable-content">
        {profileSections.map((section, index) => (
          <section 
            key={index} 
            className="scrollable-section"
            id={`section-${section?.id}`}
            aria-labelledby={`title-${section?.id}`}
          >
            <div className="scrollable-text">
              <p className="subtitle" id={`subtitle-${section?.id}`}>{section.subtitle}</p>
              <h1 className="main-title" id={`title-${section?.id}`} data-text={section.title}>{section.title}</h1>
              {section?.id === 'services' ? (
                <>
                  <div className="content-list" role="list">
                    {section.content.map((item, itemIndex) => (
                      <ListItemWithIcon 
                        key={itemIndex} 
                        text={item} 
                        index={itemIndex}
                        sectionId={section?.id}
                      />
                    ))}
                  </div>
                  <div className="content-list" role="list">
                    <p className="content-item">
                      Ofrezco soluciones de front-end, y servicios especializados en automatización, inteligencia artificial local y desarrollo web. 
                      Cada solución está diseñada para optimizar procesos empresariales y mejorar la eficiencia operativa.
                    </p>
                  </div>
                </>
              ) : section?.id === 'projects' ? (
                <div className="content-list" role="list">
                  <p className="content-item">
                    {t('projects.description')}
                  </p>
                </div>
              ) : section?.id === 'contact' ? (
                <>
                  <div className="content-list" role="list">
                    {section.content.map((item, itemIndex) => (
                      <ListItemWithIcon 
                        key={itemIndex} 
                        text={item} 
                        index={itemIndex}
                        sectionId={section?.id}
                      />
                    ))}
                  </div>
                  <nav className="social-links" aria-label="Enlaces sociales">
                    <a
                      href={socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link primary"
                      aria-label="Visitar perfil de LinkedIn"
                    >
                      LinkedIn
                    </a>
                    <a
                      href={socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link secondary"
                      aria-label="Visitar perfil de GitHub"
                    >
                      GitHub
                    </a>
                  </nav>
                </>
              ) : (
                <>
                  <div className="content-list" role="list">
                    {section.content.map((item, itemIndex) => (
                      <ListItemWithIcon 
                        key={itemIndex} 
                        text={item} 
                        index={itemIndex}
                        sectionId={section?.id}
                      />
                    ))}
                  </div>
                  {index === profileSections.length - 1 && (
                    <nav className="social-links" aria-label="Enlaces sociales">
                      <a
                        href={socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link primary"
                        aria-label="Visitar perfil de LinkedIn"
                      >
                        LinkedIn
                      </a>
                      <a
                        href={socialLinks.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link secondary"
                        aria-label="Visitar perfil de GitHub"
                      >
                        GitHub
                      </a>
                    </nav>
                  )}
                </>
              )}
            </div>
            
            {/* Notebook móvil */}
            <div className="mobile-notebook-container">
              <div className="mobile-notebook active">
                <div className="laptop-base"></div>
                <div className="laptop-screen">
                  <div className="screen-content">
                    {renderMobileNotebook(section)}
                  </div>
                  <div className="screen-reflection"></div>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      <nav className="progress-indicators" aria-label="Navegación por secciones">
                {/* Checkpoints con efectos de nodos */}
        {profileSections.map((section, index) => (
          <button
            key={index}
            className={`progress-dot ${index === activeSection ? 'active' : ''}`}
            onClick={() => scrollToSection(index)}
            aria-label={`Ir a sección: ${section.title}`}
            aria-current={index === activeSection ? 'true' : 'false'}
          >
            <ChevronRightIcon className="progress-indicator-icon" />
            <span className="progress-dot-label">{section.title}</span>
          </button>
        ))}
      </nav>


    </div>
  );
};

export default PortfolioSimple; 