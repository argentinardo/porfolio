import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="language-selector">
      <button
        className={`lang-btn ${i18n.language === 'es' ? 'active' : ''}`}
        onClick={() => changeLanguage('es')}
        aria-label="Español"
      >
        ES
      </button>
      <button
        className={`lang-btn ${i18n.language === 'en' ? 'active' : ''}`}
        onClick={() => changeLanguage('en')}
        aria-label="English"
      >
        EN
      </button>
      <button
        className={`lang-btn ${i18n.language === 'ca' ? 'active' : ''}`}
        onClick={() => changeLanguage('ca')}
        aria-label="Català"
      >
        CA
      </button>
    </div>
  );
};

export default LanguageSelector;
