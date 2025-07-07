import React, { useState, useRef, useEffect } from 'react';
import { 
  CodeBracketIcon, 
  PaintBrushIcon, 
  BoltIcon, 
  LightBulbIcon,
  CpuChipIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface ServiceCard {
  title: string;
  description: string;
  icon: React.ElementType;
  features: string[];
  price: string;
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
      title: "Desarrollo Frontend",
      description: "Aplicaciones web modernas con React y TypeScript",
      icon: CodeBracketIcon,
      features: [
        "Componentes reutilizables",
        "TypeScript para código robusto",
        "Optimización de performance",
        "Testing y debugging"
      ],
      price: "Desde $50/hora"
    },
    {
      title: "Diseño UI/UX",
      description: "Interfaces intuitivas y experiencias memorables",
      icon: PaintBrushIcon,
      features: [
        "Diseño responsivo",
        "Prototipado interactivo",
        "Accesibilidad web",
        "Animaciones fluidas"
      ],
      price: "Desde $45/hora"
    },
    {
      title: "Optimización Web",
      description: "Mejora de velocidad y posicionamiento SEO",
      icon: BoltIcon,
      features: [
        "Optimización de Core Web Vitals",
        "SEO técnico avanzado",
        "Análisis de performance",
        "Monitoreo continuo"
      ],
      price: "Desde $40/hora"
    },
    {
      title: "Inteligencia Artificial",
      description: "Implementación de IA en entornos locales",
      icon: CpuChipIcon,
      features: [
        "Integración de modelos LLM",
        "APIs de inteligencia artificial",
        "Automatización con IA",
        "Despliegue local seguro"
      ],
      price: "Desde $65/hora"
    },
    {
      title: "Consultoría Técnica",
      description: "Asesoramiento experto para tu proyecto",
      icon: LightBulbIcon,
      features: [
        "Arquitectura frontend",
        "Revisión de código",
        "Mentoring de equipos",
        "Migración de tecnologías"
      ],
      price: "Desde $60/hora"
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
                onClick={() => setSelectedService(service)}
                style={{ cursor: 'pointer' }}
              >
                <IconComponent className="service-minimal-icon" />
                <div className="service-minimal-content">
                  <h3 className="service-minimal-title">{service.title}</h3>
                  <p className="service-minimal-description">{service.description}</p>
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
                      // Scroll a la sección de contacto
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