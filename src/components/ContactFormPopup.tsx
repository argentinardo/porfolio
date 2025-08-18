import React, { useEffect, useState } from 'react';
import { XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import ContactForm from './ContactForm';
import { useTranslation } from 'react-i18next';

interface ContactFormPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactFormPopup: React.FC<ContactFormPopupProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [isSuccess, setIsSuccess] = useState(false);
  // Prevenir scroll del body cuando el popup está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Cerrar con Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Resetear estado de éxito cuando se abre el popup
  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
    }
  }, [isOpen]);

  const handleFormSuccess = () => {
    setIsSuccess(true);
  };

  if (!isOpen) return null;

  return (
    <div className="contact-form-popup-overlay">
      <div className="contact-form-popup">
        {/* Header del popup */}
        <div className="popup-header">
          <h2 className="popup-title">
            {isSuccess ? t('contact.form.success') : t('contact.title', 'Contacto')}
          </h2>
          <button
            className="popup-close-btn"
            onClick={onClose}
            aria-label="Cerrar formulario"
          >
            <XMarkIcon className="close-icon" />
          </button>
        </div>

        {/* Contenido del popup */}
        <div className="popup-content">
          {isSuccess ? (
            <div className="success-message">
              <CheckCircleIcon className="success-icon" />
              <h3 className="success-title">{t('contact.form.success')}</h3>
              <p className="success-description">
                {t('contact.form.successDescription', 'Gracias por contactarme. Te responderé lo antes posible.')}
              </p>
              <button
                className="success-close-btn"
                onClick={onClose}
              >
                {t('common.close', 'Cerrar')}
              </button>
            </div>
          ) : (
            <ContactForm 
              isVisible={true} 
              onSuccess={handleFormSuccess}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactFormPopup;
