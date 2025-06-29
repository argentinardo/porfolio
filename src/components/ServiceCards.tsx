import React from 'react';

interface ServiceCard {
  title: string;
  description: string;
  icon: string;
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
      icon: "⚛️",
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
      icon: "🎨",
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
      icon: "⚡",
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
      icon: "💡",
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
    // Aquí puedes agregar la lógica para abrir un modal o navegar a una página de detalles
    console.log(`Saber más sobre: ${service.title}`);
    // Por ahora solo mostraremos un alert
    alert(`Servicio: ${service.title}\n\n${service.description}\n\nPrecio: ${service.price}\n\nCaracterísticas:\n${service.features.join('\n')}`);
  };

  return (
    <div className={`services-showcase ${isVisible ? 'visible' : ''}`}>
      <div className="services-grid">
        {services.map((service, index) => (
          <div key={index} className="service-card">
            <div className="service-header">
              <div className="service-icon">{service.icon}</div>
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
              >
                Saber más
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceCards; 