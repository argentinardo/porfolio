import React, { useState, useEffect, useRef } from 'react';
import { profileSections, socialLinks } from '../data/profileData';
import { FadeIn, SlideIn, NeuralNetworkBackground } from './SimpleAnimations';
import Tilt from './Tilt';
import '../styles/portfolio.css';

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

const PortfolioSimple: React.FC = () => {
  const [activeSection, setActiveSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevSectionRef = useRef<number>(0);

  useEffect(() => {
    if (prevSectionRef.current !== activeSection) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 1200);
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

  const renderWindowContent = () => {
    if (!currentSection.notebookContent) return null;

    const { type, code, language, url } = currentSection.notebookContent;

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
      case 'terminal':
        return (
          <div className={`window-base ${type}`}>
            {windowHeader}
            <pre className="code-content">
              <code>
                <AnimatedText 
                  text={code || ''} 
                  speed={30} 
                  className="animated-code"
                />
              </code>
            </pre>
          </div>
        );

      case 'browser':
        return (
          <div className="window-base browser">
            {windowHeader}
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
      <NeuralNetworkBackground />
      
      <div className="fixed-layout">
        <div className="content-grid">
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
                    <p className="content-item">{item}</p>
                  </SlideIn>
                ))}
              </div>
            </FadeIn>

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

          <Tilt options={{ max: 15, scale: 1.05, speed: 400, glare: true, 'max-glare': 0.5 }}>
            <div className="notebook-container">
              <div className={`notebook ${activeSection >= 0 ? 'active' : 'inactive'}`}>
                <div className="laptop-base"></div>
                <div className="laptop-keyboard">
                  <div className="keyboard-keys">
                    {Array.from({ length: 48 }).map((_, i) => (
                      <div key={i} className="key"></div>
                    ))}
                  </div>
                </div>
                <div className={`laptop-screen ${isAnimating ? 'screen-animating' : ''}`}>
                  <div className="screen-content">
                    {renderWindowContent()}
                  </div>
                  <div className="screen-reflection"></div>
                </div>
              </div>
            </div>
          </Tilt>
        </div>
      </div>

      {/* Espaciadores para el scroll */}
      {profileSections.map((_, index) => (
        <div key={index} style={{ height: '100vh' }} />
      ))}

      <div className="progress-indicators">
        {profileSections.map((_, index) => (
          <div
            key={index}
            className={`progress-dot ${index === activeSection ? 'active' : ''}`}
            onClick={() => scrollToSection(index)}
          />
        ))}
      </div>

      <div 
        className="progress-bar"
        style={{ transform: `scaleX(${scrollProgress})` }}
      />
    </div>
  );
};

export default PortfolioSimple; 