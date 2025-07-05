import { useState, useEffect, useCallback } from 'react';

interface UseScrollProgressOptions {
  throttleDelay?: number;
  sections?: number;
}

export const useScrollProgress = (options: UseScrollProgressOptions = {}) => {
  const { throttleDelay = 16, sections = 0 } = options;
  
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(-1);
  const [isScrolling, setIsScrolling] = useState(false);

  // Función throttled para actualizar el progreso
  const updateProgress = useCallback(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollTop / docHeight : 0;
    
    setScrollProgress(Math.min(progress, 1));
  }, []);

  // Función para detectar la sección activa
  const updateActiveSection = useCallback(() => {
    if (sections === 0) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const sectionHeight = windowHeight;
    
    const newActiveSection = Math.floor(scrollTop / sectionHeight);
    const clampedSection = Math.max(0, Math.min(newActiveSection, sections - 1));
    
    setActiveSection(clampedSection);
  }, [sections]);

  // Throttle function
  const throttle = useCallback((func: () => void, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    let lastExecTime = 0;
    
    return () => {
      const currentTime = Date.now();
      
      if (currentTime - lastExecTime > delay) {
        func();
        lastExecTime = currentTime;
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func();
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    };
  }, []);

  // Scroll handler throttled
  const handleScroll = useCallback(
    throttle(() => {
      setIsScrolling(true);
      updateProgress();
      updateActiveSection();
      
      // Reset scrolling state after a delay
      setTimeout(() => setIsScrolling(false), 150);
    }, throttleDelay),
    [throttle, updateProgress, updateActiveSection, throttleDelay]
  );

  // Función para hacer scroll a una sección específica
  const scrollToSection = useCallback((sectionIndex: number) => {
    const sectionHeight = window.innerHeight;
    const targetScroll = sectionIndex * sectionHeight;
    
    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth'
    });
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial calculation
    updateProgress();
    updateActiveSection();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll, updateProgress, updateActiveSection]);

  return {
    scrollProgress,
    activeSection,
    isScrolling,
    scrollToSection
  };
}; 