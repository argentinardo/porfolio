import React, { useState, useEffect } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { profileSections } from '../data/profileData';

interface MobileStickyBarProps {
  activeSection: number;
  onMenuToggle: (isOpen: boolean) => void;
  isMenuOpen: boolean;
}

const MobileStickyBar: React.FC<MobileStickyBarProps> = ({ 
  activeSection, 
  onMenuToggle, 
  isMenuOpen 
}) => {
  const { t } = useTranslation();
  const [isNightMode, setIsNightMode] = useState(true);

  useEffect(() => {
    // Detectar el modo actual del body
    const checkNightMode = () => {
      setIsNightMode(!document.body.classList.contains('light-mode'));
    };
    
    checkNightMode();
    
    // Observar cambios en las clases del body
    const observer = new MutationObserver(checkNightMode);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  const currentSection = profileSections[activeSection];

  return (
    <div className="mobile-sticky-bar">
      <div className="sticky-bar-content">
        {/* Nombre de la sección actual */}
        <div className="section-title">
          <span className="section-name">
            {currentSection?.title || t('navigation.home')}
          </span>
        </div>

        {/* Botón del menú hamburguesa */}
        <button
          className="mobile-menu-toggle"
          onClick={() => onMenuToggle(!isMenuOpen)}
          aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          {isMenuOpen ? (
            <XMarkIcon className="menu-icon" />
          ) : (
            <Bars3Icon className="menu-icon" />
          )}
        </button>
      </div>
    </div>
  );
};

export default MobileStickyBar;
