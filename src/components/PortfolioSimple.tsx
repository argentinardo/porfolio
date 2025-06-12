import React, { useState, useEffect, useRef } from 'react';
import { profileSections, socialLinks } from '../data/profileData';
import { FadeIn, SlideIn, NeuralNetworkBackground } from './SimpleAnimations';
import Tilt from './Tilt';
import '../styles/portfolio.css';

const PortfolioSimple: React.FC = () => {
  const [activeSection, setActiveSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevSectionRef = useRef<number>(0);

  useEffect(() => {
    if (prevSectionRef.current !== activeSection) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 1200); // Duración de la animación
      return () => clearTimeout(timer);
    }
    prevSectionRef.current = activeSection;
  }, [activeSection]);

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

  const currentSection = profileSections[activeSection];

  const getNotebookContent = () => {
    if (!currentSection.notebookContent) return null;

    const { type, code, language, url } = currentSection.notebookContent;

    switch (type) {
      case 'code':
        return (
          <div className="code-editor">
            <div className="editor-header">
              <div className="window-controls">
                <div className="control-btn red"></div>
                <div className="control-btn yellow"></div>
                <div className="control-btn green"></div>
              </div>
              <span className="editor-filename">
                {currentSection.id}.{language}
              </span>
            </div>
            <pre className="code-content">
              <code>{code}</code>
            </pre>
          </div>
        );

      case 'terminal':
        return (
          <div className="terminal">
            <div className="editor-header">
              <div className="window-controls">
                <div className="control-btn red"></div>
                <div className="control-btn yellow"></div>
                <div className="control-btn green"></div>
              </div>
              <span className="editor-filename">Terminal</span>
            </div>
            <pre className="code-content">
              <code>{code}</code>
            </pre>
          </div>
        );

      case 'browser':
        return (
          <div className="browser">
            <div className="editor-header">
              <div className="window-controls">
                <div className="control-btn red"></div>
                <div className="control-btn yellow"></div>
                <div className="control-btn green"></div>
              </div>
              <div className="address-bar">{url}</div>
            </div>
            <div className="browser-content">
              <div className="browser-project">
                <div className="project-icon">P</div>
                <h3 className="project-title">Portfolio</h3>
                <p className="project-description">Proyecto en desarrollo</p>
              </div>
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
    <div className="portfolio-container">
      {/* Fondo de partículas */}
      <NeuralNetworkBackground />
      
      {/* Layout fijo */}
      <div className="fixed-layout">
        <div className="content-grid">
          {/* Lado izquierdo - Contenido */}
          <div className="content-section" key={activeSection}>
            <FadeIn delay={100}>
              <p className="subtitle">{currentSection.subtitle}</p>
            </FadeIn>
            
            <FadeIn delay={200}>
              <h1 className="main-title">{currentSection.title}</h1>
            </FadeIn>
            
            <FadeIn delay={400}>
              <div className="content-list">
                {currentSection.content.map((item, index) => (
                  <SlideIn key={index} delay={500 + index * 100}>
                    <p className="content-item">
                      {item}
                    </p>
                  </SlideIn>
                ))}
              </div>
            </FadeIn>

            {/* Enlaces sociales en la última sección */}
            {activeSection === profileSections.length - 1 && (
              <FadeIn delay={800}>
                <div className="social-links">
                  <a
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link primary"
                  >
                    LinkedIn
                  </a>
                  <a
                    href={socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link secondary"
                  >
                    GitHub
                  </a>
                </div>
              </FadeIn>
            )}
          </div>

          {/* Lado derecho - Notebook */}
          <Tilt options={{ max: 15, scale: 1.05, speed: 400, glare: true, 'max-glare': 0.5 }}>
            <div className="notebook-container">
              <div className={`notebook ${activeSection >= 0 ? 'active' : 'inactive'}`}>
                {/* Base del laptop */}
                <div className="laptop-base"></div>
                
                {/* Teclado */}
                <div className="laptop-keyboard">
                  <div className="keyboard-keys">
                    {Array.from({ length: 48 }).map((_, i) => (
                      <div key={i} className="key"></div>
                    ))}
                  </div>
                </div>
                
                {/* Pantalla */}
                <div className={`laptop-screen ${isAnimating ? 'screen-animating' : ''}`}>
                  <div className="screen-content">
                    {getNotebookContent()}
                  </div>
                  <div className="screen-reflection"></div>
                </div>
              </div>
            </div>
          </Tilt>
        </div>
      </div>

      {/* Secciones de scroll */}
      <div className="scroll-sections">
        {profileSections.map((section, index) => (
          <div key={section.id} className="scroll-section">
            <div className="scroll-placeholder">
              <h2>{section.title}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* Indicadores de progreso */}
      <div className="progress-indicators">
        {profileSections.map((_, index) => (
          <div
            key={index}
            className={`progress-dot ${index === activeSection ? 'active' : ''}`}
            onClick={() => scrollToSection(index)}
          />
        ))}
      </div>

      {/* Barra de progreso */}
      <div 
        className="progress-bar"
        style={{ transform: `scaleX(${scrollProgress})` }}
      />
    </div>
  );
};

export default PortfolioSimple; 