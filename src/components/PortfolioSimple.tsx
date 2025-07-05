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
  ChevronRightIcon
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
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isNotebookElevated, setIsNotebookElevated] = useState(false);
  const prevSectionRef = useRef<number>(0);
  const notebookContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prevSectionRef.current !== activeSection) {
      setIsAnimating(true);
      
      // Actualizar el contenido en el medio de la animación (cuando se abre)
      const contentTimer = setTimeout(() => {
        setDisplaySection(activeSection);
      }, 600);
      
      // Terminar la animación
      const animationTimer = setTimeout(() => {
        setIsAnimating(false);
      }, 1200);
      
      return () => {
        clearTimeout(contentTimer);
        clearTimeout(animationTimer);
      };
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
      
      setScrollProgress(progress);
      
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

    const { type, code, language } = currentSection.notebookContent;

    const windowHeader = (
      <div className="editor-header">
        <div className="window-controls">
          <div className="control-btn red"></div>
          <div className="control-btn yellow"></div>
          <div className="control-btn green"></div>
        </div>
        <span className="editor-filename">
          {type === 'terminal' ? 'Terminal' : `${currentSection.id}.${language}`}
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
                <ProjectsShowcase isVisible={true} />
              ) : currentSection.id === 'services' ? (
                <ServiceCards isVisible={true} />
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

  const scrollToSection = (index: number) => {
    const targetScroll = (index / (profileSections.length - 1)) * 
      (document.documentElement.scrollHeight - window.innerHeight);
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
  };

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
            <div className={`notebook ${activeSection >= 0 ? 'active' : 'inactive'}`}>
              <div className="laptop-base"></div>
              <div className={`laptop-screen ${isAnimating ? 'screen-animating' : ''}`}>
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
              <h1 className="main-title" id={`title-${section.id}`}>{section.title}</h1>
              {section.id === 'services' ? (
                <ServiceCards isVisible={true} />
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
            {index === activeSection && (
              <ChevronRightIcon className="progress-indicator-icon" />
            )}
            <span className="progress-dot-label">{section.title}</span>
          </button>
        ))}
      </nav>

      <div 
        className="progress-bar"
        style={{ transform: `scaleX(${scrollProgress})` }}
        aria-label={`Progreso de navegación: ${Math.round(scrollProgress * 100)}%`}
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
};

export default PortfolioSimple; 