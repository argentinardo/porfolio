import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  // Función para mapear idiomas del navegador a idiomas soportados
  const mapBrowserLanguage = (browserLang: string): string => {
    const languageMap: { [key: string]: string } = {
      'es': 'es',
      'en': 'en',
      'ca': 'ca',
      'es-ES': 'es',
      'en-US': 'en',
      'en-GB': 'en',
      'ca-ES': 'ca'
    };
    return languageMap[browserLang] || 'es';
  };

  // Actualizar el idioma actual cuando cambie
  useEffect(() => {
    const handleLanguageChange = () => {
      setCurrentLanguage(i18n.language);
    };

    // Escuchar cambios de idioma
    i18n.on('languageChanged', handleLanguageChange);
    
    // Establecer el idioma inicial si no hay uno guardado
    if (!localStorage.getItem('i18nextLng')) {
      const browserLang = navigator.language;
      const defaultLang = mapBrowserLanguage(browserLang);
      i18n.changeLanguage(defaultLang);
    }

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setCurrentLanguage(lng);
  };

  return (
    <div className="language-selector">
      <button
        className={`lang-btn ${currentLanguage === 'es' ? 'active' : ''}`}
        onClick={() => changeLanguage('es')}
        aria-label="Español"
      >
        ES
      </button>
      <button
        className={`lang-btn ${currentLanguage === 'ca' ? 'active' : ''}`}
        onClick={() => changeLanguage('ca')}
        aria-label="Català"
      >
        CA
      </button>
      <button
        className={`lang-btn ${currentLanguage === 'en' ? 'active' : ''}`}
        onClick={() => changeLanguage('en')}
        aria-label="English"
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSelector;
