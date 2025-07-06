import React from 'react';
import { 
  CodeBracketIcon, 
  PaintBrushIcon, 
  BoltIcon, 
  LightBulbIcon,
  CpuChipIcon
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


  if (minimal) {
    return (
      <div className="services-minimal">
        <div className="services-minimal-grid">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div key={index} className="service-minimal-item">
                <IconComponent className="service-minimal-icon" />
                <div className="service-minimal-content">
                  <h3 className="service-minimal-title">{service.title}</h3>
                  <p className="service-minimal-description">{service.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={`services-showcase ${isVisible ? 'visible' : ''}`}>

    </div>
  );
};

export default ServiceCards; 