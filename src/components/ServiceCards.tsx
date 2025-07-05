import React from 'react';
import { 
  CodeBracketIcon, 
  PaintBrushIcon, 
  BoltIcon, 
  LightBulbIcon 
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
}

const ServiceCards: React.FC<ServiceCardsProps> = ({ isVisible }) => {
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

  const handleLearnMore = (service: ServiceCard) => {
    // Por ahora solo mostraremos un alert
    alert(`Servicio: ${service.title}\n\n${service.description}\n\nPrecio: ${service.price}\n\nCaracterísticas:\n${service.features.join('\n')}`);
  };

  return (
    <div className={`services-showcase ${isVisible ? 'visible' : ''}`}>
      <div className="services-grid" role="grid" aria-label="Servicios profesionales">
        {services.map((service, index) => {
          const IconComponent = service.icon;
          return (
          <article key={index} className="service-card" role="gridcell">
            <div className="service-header">
                <div className="service-icon" aria-hidden="true">
                  <IconComponent className="w-10 h-10" />
                </div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
            </div>
            
            <div className="service-features">
              <ul>
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex}>{feature}</li>
                ))}
              </ul>
            </div>
            
            <div className="service-footer">
              <div className="service-price">{service.price}</div>
              <button 
                className="learn-more-btn"
                onClick={() => handleLearnMore(service)}
                aria-label={`Saber más sobre ${service.title}`}
              >
                Saber más
              </button>
            </div>
          </article>
          );
        })}
      </div>
    </div>
  );
};

export default ServiceCards; 