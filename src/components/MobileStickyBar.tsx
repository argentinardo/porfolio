import React, { useState, useEffect } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { ProfileSection } from '../data/profileData';

interface MobileStickyBarProps {
  activeSection: number;
  onMenuToggle: (isOpen: boolean) => void;
  isMenuOpen: boolean;
  isVisible: boolean;
  sections: ProfileSection[];
}

const MobileStickyBar: React.FC<MobileStickyBarProps> = ({ 
  activeSection, 
  onMenuToggle, 
  isMenuOpen,
  isVisible,
  sections
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

  const currentSection = sections[activeSection];

  // Obtener el título de la sección actual
  const getSectionTitle = () => {
    if (!currentSection) return t('navigation.home');
    
    // Usar directamente el título de la sección actual que ya está traducido
    return currentSection.title;
  };

  return (
    <div className={`mobile-sticky-bar ${isVisible ? 'visible' : ''}`}>
      <div className="sticky-bar-content">
        {/* Nombre de la sección actual */}
        <div className="section-title">
          <span className="section-name">
            {getSectionTitle()}
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
