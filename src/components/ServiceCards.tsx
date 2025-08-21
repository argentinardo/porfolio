import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  CodeBracketIcon, 
  CpuChipIcon,
  XMarkIcon,
  WrenchScrewdriverIcon,
  // Nuevos iconos más profesionales
  CogIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

interface ServiceCard {
  title: string;
  description: string;
  icon: React.ElementType;
  features: string[];
}

interface ServiceCardsProps {
  isVisible: boolean;
  minimal?: boolean;
}

const ServiceCards: React.FC<ServiceCardsProps> = ({ isVisible, minimal = false }) => {
  const { t } = useTranslation();
  const [selectedService, setSelectedService] = useState<ServiceCard | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const servicesData = t('services.items', { returnObjects: true }) as Array<{
    title: string;
    description: string;
    features: string[];
    icon: string;
  }>;
  
  const iconMap: { [key: string]: React.ElementType } = {
    CogIcon,
    CpuChipIcon,
    WrenchScrewdriverIcon,
    AcademicCapIcon,
    CodeBracketIcon
  };

  const services: ServiceCard[] = servicesData.map(service => ({
    ...service,
    icon: iconMap[service.icon] || CodeBracketIcon
  }));


  // Cerrar modal al hacer click fuera o presionar Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setSelectedService(null);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedService(null);
      }
    };

    if (selectedService) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [selectedService]);

  if (minimal) {
    return (
      <div className="services-minimal">
        <div className="services-minimal-grid">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div 
                key={index} 
                className="service-minimal-item"
                style={{ cursor: 'default' }}
              >
                <IconComponent className="service-minimal-icon" />
                <div className="service-minimal-content">
                  <h3 className="service-minimal-title">{service.title}</h3>
                  <p className="service-minimal-description">{service.description}</p>
                  <div>
                    <button 
                      className="service-consult-btn"
                      onClick={() => {
                        try {
                          localStorage.setItem('contactPrefill', JSON.stringify({
                            subject: `${service.title}`
                          }));
                        } catch {}
                        const contactSection = document.getElementById('section-contact');
                        if (contactSection) {
                          contactSection.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                    >
                      Consultar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal para servicio seleccionado */}
        {selectedService && (
          <div className="service-modal-overlay" onClick={() => setSelectedService(null)}>
            <div className="service-modal" ref={modalRef} onClick={(e) => e.stopPropagation()}>
              <div className="service-modal-header">
                <div className="service-modal-title-section">
                  <div className="service-modal-icon">
                    {React.createElement(selectedService.icon)}
                  </div>
                  <h2 className="service-modal-title">{selectedService.title}</h2>
                </div>
                <button 
                  className="service-modal-close"
                  onClick={() => setSelectedService(null)}
                  aria-label="Cerrar modal"
                >
                  <XMarkIcon />
                </button>
              </div>
              <div className="service-modal-content">
                <p className="service-modal-description">{selectedService.description}</p>
                <div className="service-modal-features">
                  <h4>Características:</h4>
                  <ul>
                    {selectedService.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
                <div className="service-modal-actions">
                  <button 
                    className="service-modal-contact-btn"
                    onClick={() => {
                      setSelectedService(null);
                      // Prefill y scroll a la sección de contacto
                      try {
                        localStorage.setItem('contactPrefill', JSON.stringify({
                          subject: `${selectedService.title}`
                        }));
                      } catch {}
                      const contactSection = document.getElementById('section-contact');
                      if (contactSection) {
                        contactSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    Estoy interesado en este servicio
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className={`services-showcase ${isVisible ? 'visible' : ''}`}>
        <div className="services-grid">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div 
                key={index} 
                className="service-card"
                onClick={() => setSelectedService(service)}
              >
                <div className="service-header">
                  <div className="service-icon">
                    <IconComponent />
                  </div>
                  <h3 className="service-title">{service.title}</h3>
                  
                </div>
                <p className="service-description">{service.description}</p>
                <div className="service-features">
                  <ul>
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex}>{feature}</li>
                    ))}
                  </ul>
                </div>
                <div className="service-footer">
                  <button className="learn-more-btn">
                    {t('services.learnMore')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal para servicio seleccionado - Renderizado fuera del contenedor */}
      {selectedService && (
        <div className="service-modal-overlay" onClick={() => setSelectedService(null)}>
          <div className="service-modal" ref={modalRef} onClick={(e) => e.stopPropagation()}>
            <div className="service-modal-header">
              <div className="service-modal-title-section">
                <div className="service-modal-icon">
                  {React.createElement(selectedService.icon)}
                </div>
                <h2 className="service-modal-title">{selectedService.title}</h2>
              </div>
              <button 
                className="service-modal-close"
                onClick={() => setSelectedService(null)}
                aria-label="Cerrar modal"
              >
                <XMarkIcon />
              </button>
            </div>
            <div className="service-modal-content">
              <p className="service-modal-description">{selectedService.description}</p>
              <div className="service-modal-features">
                <h4>Características:</h4>
                <ul>
                  {selectedService.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
              <div className="service-modal-actions">
                <button 
                  className="service-modal-contact-btn"
                  onClick={() => {
                    setSelectedService(null);
                    // Prefill y scroll a la sección de contacto
                    try {
                      localStorage.setItem('contactPrefill', JSON.stringify({
                        subject: `${selectedService.title}`
                      }));
                    } catch {}
                    const contactSection = document.getElementById('section-contact');
                    if (contactSection) {
                      contactSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  {t('services.interestedInService')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ServiceCards; 