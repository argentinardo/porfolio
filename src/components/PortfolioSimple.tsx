import React, { useState, useEffect, useRef } from 'react';
import { NeuralNetworkBackground } from './SimpleAnimations';
import ProjectsShowcase from './ProjectsShowcase';
import ServiceCards from './ServiceCards';
import ContactForm from './ContactForm';
import { profileSections, socialLinks } from '../data/profileData';
import { 
  ComputerDesktopIcon,
  CodeBracketIcon,
  DevicePhoneMobileIcon,
  WrenchScrewdriverIcon,
  RocketLaunchIcon,
  LightBulbIcon,
  BriefcaseIcon,
  UserGroupIcon,
  EnvelopeIcon,
  ComputerDesktopIcon as LaptopIcon,
  GlobeAltIcon,
  CalendarIcon,
  DocumentTextIcon,
  CpuChipIcon,
  ServerIcon,
  SparklesIcon,
  ChevronRightIcon,
  XMarkIcon,
  WindowIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import '../styles/portfolio.css';
import { SkipLink } from './SkipLink';

// Componente para texto animado con cursor parpadeante
const AnimatedText: React.FC<{ text: string; speed?: number; className?: string }> = ({ 
  text, 
  speed = 50, 
  className = '' 
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, speed]);

  // Cursor parpadeante
  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(cursorTimer);
  }, []);

  return (
    <span className={className}>
      {displayedText}
      {showCursor && <span className="blinking-cursor">|</span>}
    </span>
  );
};

// Componente para renderizar elementos de lista con iconos
const ListItemWithIcon: React.FC<{ text: string; index: number; sectionId: string }> = ({ text, index, sectionId }) => {
  const getIconForSection = (sectionId: string, index: number) => {
    if (sectionId === 'freelance') {
      const icons = [
        ComputerDesktopIcon,
        CodeBracketIcon,
        DevicePhoneMobileIcon,
        WrenchScrewdriverIcon,
        RocketLaunchIcon,
        LightBulbIcon
      ];
      return icons[index] || ComputerDesktopIcon;
    } else if (sectionId === 'contact') {
             const icons = [
         BriefcaseIcon,
         UserGroupIcon,
         EnvelopeIcon,
         LaptopIcon,
         GlobeAltIcon
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
    <div className="content-item-with-icon" role="listitem">
      <div className="content-icon">
        <IconComponent className="w-5 h-5" />
      </div>
      <p className="content-item">{text}</p>
    </div>
  );
};

// Componente para renderizar contenido de terminal con iconos
const TerminalContent: React.FC<{ code: string }> = ({ code }) => {
  const renderTerminalLine = (line: string, index: number) => {
    // Líneas que contienen fechas con iconos
    if (line.includes('📅')) {
      const yearMatch = line.match(/(\d{4}-\d{4}|\d{4}-Presente):/);
      if (yearMatch) {
        const year = yearMatch[1];
        const tech = line.split(':')[1]?.trim() || '';
        return (
          <div key={index} className="terminal-line-with-icon">
            <CalendarIcon className="w-4 h-4 terminal-icon" />
            <span className="terminal-text">
              <span className="terminal-year">{year}:</span> {tech}
            </span>
          </div>
        );
      }
    }
    
    // Líneas que contienen tecnologías específicas
    if (line.includes('HTML/CSS/JavaScript')) {
      return (
        <div key={index} className="terminal-line-with-icon">
          <DocumentTextIcon className="w-4 h-4 terminal-icon" />
          <span className="terminal-text">{line.replace('📅', '').trim()}</span>
        </div>
      );
    }
    
    if (line.includes('jQuery + PHP + MySQL')) {
      return (
        <div key={index} className="terminal-line-with-icon">
          <ServerIcon className="w-4 h-4 terminal-icon" />
          <span className="terminal-text">{line.replace('📅', '').trim()}</span>
        </div>
      );
    }
    
    if (line.includes('React + Node.js')) {
      return (
        <div key={index} className="terminal-line-with-icon">
          <CpuChipIcon className="w-4 h-4 terminal-icon" />
          <span className="terminal-text">{line.replace('📅', '').trim()}</span>
        </div>
      );
    }
    
    if (line.includes('React + TypeScript')) {
      return (
        <div key={index} className="terminal-line-with-icon">
          <SparklesIcon className="w-4 h-4 terminal-icon" />
          <span className="terminal-text">{line.replace('📅', '').trim()}</span>
        </div>
      );
    }
    
    // Líneas de comando
    if (line.startsWith('$')) {
      return (
        <div key={index} className="terminal-command">
          <span className="terminal-prompt">$</span>
          <span className="terminal-text">{line.substring(1).trim()}</span>
        </div>
      );
    }
    
    // Líneas de echo
    if (line.startsWith('echo')) {
      return (
        <div key={index} className="terminal-echo">
          <span className="terminal-prompt">$</span>
          <span className="terminal-text">{line}</span>
        </div>
      );
    }
    
    // Líneas normales
    return (
      <div key={index} className="terminal-line">
        <span className="terminal-text">{line}</span>
      </div>
    );
  };

  return (
    <div className="terminal-content">
      {code.split('\n').map((line, index) => renderTerminalLine(line, index))}
    </div>
  );
};

const PortfolioSimple: React.FC = () => {
  const [activeSection, setActiveSection] = useState(0);
  const [displaySection, setDisplaySection] = useState(0);
  const [isNotebookElevated, setIsNotebookElevated] = useState(false);
  const [isNotebookClosed, setIsNotebookClosed] = useState(false);
  const [isWindowMinimized, setIsWindowMinimized] = useState(false);
  const [isWindowMaximized, setIsWindowMaximized] = useState(false);
  const prevSectionRef = useRef<number>(0);
  const notebookContainerRef = useRef<HTMLDivElement>(null);

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
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentSection = profileSections[displaySection];
  
  // Calcular si estamos en la sección de servicios para mover la notebook
  const isServicesSection = profileSections[activeSection].id === 'services';
  
  useEffect(() => {
    if (isServicesSection) {
      // Cuando estamos en servicios, la notebook deja de estar fija
      setIsNotebookElevated(true);
    } else {
      setIsNotebookElevated(false);
    }
  }, [isServicesSection]);

  const renderWindowContent = () => {
    if (!currentSection.notebookContent) return null;

    const { type, code } = currentSection.notebookContent;

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
          {currentSection.title}
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

      case 'terminal':
        return (
          <div className={`window-base ${type}`}>
            {windowHeader}
            <div className="code-content">
              <TerminalContent code={code || ''} />
            </div>
          </div>
        );

      case 'browser':
        return (
          <div className="window-base browser">
            {windowHeader}
            <div className="browser-content">
              {currentSection.id === 'projects' ? (
                <ProjectsShowcase isVisible={true} minimal={true} />
              ) : currentSection.id === 'services' ? (
                <ServiceCards isVisible={true} minimal={true} />
              ) : currentSection.id === 'contact' ? (
                <ContactForm isVisible={true} />
              ) : (
              <div className="browser-project">
                <div className="project-icon">P</div>
                <h3 className="project-title">Portfolio</h3>
                <p className="project-description">Proyecto en desarrollo</p>
              </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const handleWindowControl = (action: 'close' | 'minimize' | 'maximize') => {
    switch (action) {
      case 'close':
        setIsNotebookClosed(true);
        // Reabrir después de la animación de cierre
        setTimeout(() => {
          setIsNotebookClosed(false);
        }, 600);
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
    const targetScroll = (index / (profileSections.length - 1)) * 
      (document.documentElement.scrollHeight - window.innerHeight);
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
  };

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
          const mobileMenu = document.querySelector('.mobile-menu') as HTMLElement;
          const mobileMenuButton = document.querySelector('.mobile-menu-button button') as HTMLElement;
          if (mobileMenu && mobileMenuButton) {
            mobileMenu.style.transform = 'translateX(100%)';
            mobileMenu.style.opacity = '0';
            // Actualizar el estado del menú (esto se maneja en el componente SimpleAnimations)
            setTimeout(() => {
              const event = new CustomEvent('closeMobileMenu');
              window.dispatchEvent(event);
            }, 300);
          }
        };
        marker.innerHTML = `
          <ChevronRightIcon class="mobile-progress-indicator-icon" />
          <span class="mobile-progress-dot-label">${section.title}</span>
        `;
        mobileMarkersContainer.appendChild(marker);
      });
    }
  }, [activeSection, profileSections]);

  return (
    <div className="portfolio-container" role="main" aria-label="Portfolio de Damian Nardini">
      <SkipLink />
      <NeuralNetworkBackground />
      
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
            id={`section-${section.id}`}
            aria-labelledby={`title-${section.id}`}
          >
            <div className="scrollable-text">
              <p className="subtitle" id={`subtitle-${section.id}`}>{section.subtitle}</p>
              <h1 className="main-title" id={`title-${section.id}`} data-text={section.title}>{section.title}</h1>
              {section.id === 'services' ? (
                <ServiceCards isVisible={true} />
              ) : section.id === 'contact' ? (
                <>
                  <div className="content-list" role="list">
                    {section.content.map((item, itemIndex) => (
                      <ListItemWithIcon 
                        key={itemIndex} 
                        text={item} 
                        index={itemIndex}
                        sectionId={section.id}
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
                        sectionId={section.id}
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