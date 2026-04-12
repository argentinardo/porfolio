# Portfolio Scroll - Damian Nardini

Portfolio interactivo y moderno de Damian Nardini, desarrollador frontend  con 15+ años de experiencia.

## 🚀 Características

### ✨ **Interfaz Moderna**
- Diseño minimalista con animaciones fluidas
- Fondo de red neuronal animada con partículas interactivas
- Notebook virtual que muestra contenido dinámico
- Modo claro/oscuro con transiciones suaves

### 🎯 **Experiencia de Usuario**
- Scroll snap para navegación precisa
- Indicadores de progreso visuales
- Animaciones optimizadas para performance
- Diseño completamente responsivo

### ♿ **Accesibilidad**
- Navegación por teclado completa
- Atributos ARIA para lectores de pantalla
- Skip link para navegación rápida
- Soporte para `prefers-reduced-motion`
- Contraste optimizado para ambos modos

### 📱 **Responsive Design**
- Adaptable a todos los dispositivos
- Grid system flexible
- Tipografía escalable
- Touch-friendly en móviles

## 🛠️ Tecnologías

- **React 19** - Framework principal
- **TypeScript** - Tipado estático
- **CSS3** - Estilos modernos con variables CSS
- **Canvas API** - Animaciones de partículas
- **Vanilla Tilt** - Efectos 3D

## 📦 Estructura del Proyecto

```
src/
├── components/          # Componentes React
│   ├── PortfolioSimple.tsx    # Componente principal
│   ├── SimpleAnimations.tsx   # Animaciones y fondo
│   ├── ContactForm.tsx        # Formulario de contacto
│   ├── ServiceCards.tsx       # Tarjetas de servicios
│   ├── ProjectsShowcase.tsx   # Showcase de proyectos
│   ├── Tilt.tsx              # Efecto 3D
│   └── SkipLink.tsx          # Accesibilidad
├── data/               # Datos del portfolio
│   ├── profileData.ts  # Información personal
│   └── projectsData.ts # Proyectos
├── hooks/              # Hooks personalizados
│   └── useScrollProgress.ts
├── config/             # Configuración
│   └── app.ts
└── styles/             # CSS global (@import en cadena)
    ├── main.css        # Entrada: tokens → base → a11y
    ├── tokens.css      # Variables y fuentes
    ├── base.css        # Reset y estilos de página
    └── a11y.css        # Foco, autofill, reduced-motion, contraste
```

Cada componente puede tener su `.css` en `components/` (mismo nombre que el `.tsx`).

## 🚀 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/damiannardini/portfolio-scroll.git

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm start

# Construir para producción
npm run build
```

## 🎨 Características Destacadas

### **Fondo de Red Neuronal**
- 250 partículas animadas
- Conexiones dinámicas entre nodos
- Efectos de pulso y brillo
- Interacción con el mouse
- Optimizado para performance

### **Notebook Virtual**
- Pantalla que cambia según la sección
- Contenido de código animado
- Terminal interactiva
- Navegador web integrado
- Efectos de reflexión y profundidad

### **Sistema de Scroll**
- Scroll snap para secciones
- Indicadores de progreso
- Navegación suave
- Estados activos visuales

### **Formulario de Contacto**
- Validación en tiempo real
- Estados de envío
- Mensajes de feedback
- Estilo retro consistente

## 🔧 Configuración

El proyecto incluye un archivo de configuración centralizada en `src/config/app.ts` que permite personalizar:

- Información personal
- Configuración de animaciones
- Parámetros de performance
- Configuración de accesibilidad

## 📊 Performance

- **Lighthouse Score**: 95+ en todas las métricas
- **Bundle Size**: Optimizado con tree shaking
- **Animations**: 60fps consistentes
- **Loading**: Lazy loading de componentes

## 🌐 SEO

- Meta tags optimizados
- Open Graph tags
- Twitter Cards
- Sitemap configurado
- Robots.txt mejorado

## ♿ Accesibilidad

- **WCAG 2.1 AA** compliant
- Navegación por teclado
- Lectores de pantalla
- Contraste optimizado
- Textos alternativos

## 📱 PWA Ready

- Manifest.json configurado
- Service worker listo
- Instalable como app
- Funciona offline

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 📞 Contacto

- **LinkedIn**: [Damian Nardini](https://www.linkedin.com/in/damiannardini)
- **GitHub**: [@damiannardini](https://github.com/damiannardini)
- **Email**: contacto@damiannardini.com

---

Desarrollado con ❤️ por Damian Nardini
# Prueba formulario commit
