import React, { useState, useRef, useEffect } from 'react';
import { 
  CodeBracketIcon, 
  BoltIcon, 
  LightBulbIcon,
  CpuChipIcon,
  XMarkIcon,
  WrenchScrewdriverIcon
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
  const [selectedService, setSelectedService] = useState<ServiceCard | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const services: ServiceCard[] = [
    {
      title: "n8n",
      description: "Orquestación de procesos y flujos sin fricción con n8n",
      icon: BoltIcon,
      features: [
        "Workflows automatizados con n8n",
        "Integraciones con APIs y CRMs",
        "Conectores personalizados",
        "Monitoreo, logs y alertas"
      ]
    },
    {
      title: "LLM local",
      description: "Instalación y configuración de modelos LLM en tu infraestructura",
      icon: CpuChipIcon,
      features: [
        "Ollama / llama.cpp / LM Studio",
        "RAG con bases de datos locales",
        "Privacidad y seguridad on‑premise",
        "Afinado y evaluación de modelos"
      ]
    },
    {
      title: "Mantenimiento IA",
      description: "Planes de mantenimiento y soporte para flujos y modelos de IA",
      icon: WrenchScrewdriverIcon,
      features: [
        "Soporte mensual y SLA",
        "Actualización de flujos y dependencias",
        "Monitorización y optimización continua",
        "Backups y recuperación"
      ]
    },
    {
      title: "Asesoría IA",
      description: "Estrategia, auditoría y capacitación en IA aplicada",
      icon: LightBulbIcon,
      features: [
        "Identificación de casos de uso",
        "ROI y roadmap de adopción",
        "Mejores prácticas de prompts",
        "Workshops a medida"
      ]
    },
    {
      title: "Frontend",
      description: "Aplicaciones web modernas con React y TypeScript",
      icon: CodeBracketIcon,
      features: [
        "Componentes reutilizables",
        "TypeScript para código robusto",
        "Optimización de performance",
        "Testing y debugging"
      ]
    }
  ];


  // Cerrar modal al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setSelectedService(null);
      }
    };

    if (selectedService) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
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
          <div className="service-modal-overlay">
            <div className="service-modal" ref={modalRef}>
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
    <div className={`services-showcase ${isVisible ? 'visible' : ''}`}>

    </div>
  );
};

export default ServiceCards; 