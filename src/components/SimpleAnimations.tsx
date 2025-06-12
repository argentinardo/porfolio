import React, { useEffect, useRef } from 'react';

interface SimpleAnimationsProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export const FadeIn: React.FC<SimpleAnimationsProps> = ({ 
  children, 
  delay = 0, 
  duration = 600,
  className = '' 
}) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = `all ${duration}ms ease-out`;

    const timer = setTimeout(() => {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, duration]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
};

export const SlideIn: React.FC<SimpleAnimationsProps & { direction?: 'left' | 'right' }> = ({ 
  children, 
  delay = 0, 
  duration = 800,
  direction = 'left',
  className = '' 
}) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const translateX = direction === 'left' ? '-50px' : '50px';
    
    element.style.opacity = '0';
    element.style.transform = `translateX(${translateX})`;
    element.style.transition = `all ${duration}ms ease-out`;

    const timer = setTimeout(() => {
      element.style.opacity = '1';
      element.style.transform = 'translateX(0)';
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, duration, direction]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
};

// Componente para el fondo de red neuronal
export const NeuralNetworkBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const handleMouseMove = (event: MouseEvent) => {
      mouse.current.x = event.clientX;
      mouse.current.y = event.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // --- INTERFACES ---
    interface Particle {
      id: number;
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      hue: number;
      illumination: number; // 0 to 1
      neighbors: number[];
      lastPulseTime: number; // Para el cooldown
    }

    interface Pulse {
      source: Particle;
      destination: Particle;
      progress: number;
      speed: number;
      depth: number; // Para controlar la reacción en cadena
    }

    interface ConnectionGlow {
        source: Particle;
        destination: Particle;
        life: number; // Controls the fade out
    }

    // --- CONFIGURACIÓN ---
    const particleCount = 80;
    const synapseFormationDistance = 120;
    const synapseBreakDistance = synapseFormationDistance * 2;
    const PULSE_PIXELS_PER_FRAME = 2.5;
    const MAX_CHAIN_REACTION_DEPTH = 2;
    const MOUSE_INTERACTION_RADIUS = 60;
    const PULSE_COOLDOWN = 2500; // Cooldown aumentado a 2.5 segundos

    // --- ESTADO ---
    const particles: Particle[] = [];
    const pulses: Pulse[] = [];
    const connectionGlows: ConnectionGlow[] = [];
    let animationFrameId: number;

    // Inicializar partículas
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        id: i,
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.5,
        hue: 200 + Math.random() * 60,
        illumination: 0,
        neighbors: [],
        lastPulseTime: 0,
      });
    }

    const updateConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const distance = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          const areNeighbors = p1.neighbors.includes(j);

          if (areNeighbors && distance > synapseBreakDistance) {
            // Romper conexión
            p1.neighbors = p1.neighbors.filter(id => id !== j);
            p2.neighbors = p2.neighbors.filter(id => id !== i);
          } else if (!areNeighbors && distance < synapseFormationDistance) {
            // Formar conexión y crear brillo
            p1.neighbors.push(j);
            p2.neighbors.push(i);
            const exists = connectionGlows.some(g => (g.source === p1 && g.destination === p2) || (g.source === p2 && g.destination === p1));
            if (!exists) {
              connectionGlows.push({ source: p1, destination: p2, life: 1 });
            }
          }
        }
      }
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      const now = Date.now();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // --- 1. ACTUALIZAR CONEXIONES ---
      updateConnections();

      // --- 2. DIBUJAR CONEXIONES DE FONDO ---
      particles.forEach(p => {
        p.neighbors.forEach(neighborId => {
          const neighbor = particles[neighborId];
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(neighbor.x, neighbor.y);
          ctx.strokeStyle = `hsla(220, 100%, 80%, 0.1)`;
          ctx.stroke();
        });
      });
      
      // --- 3. DIBUJAR BRILLOS DE CONEXIONES RECIENTES ---
      for (let i = connectionGlows.length - 1; i >= 0; i--) {
        const glow = connectionGlows[i];
        glow.life -= 0.03;
        if (glow.life <= 0) {
            connectionGlows.splice(i, 1);
        } else {
            ctx.beginPath();
            ctx.moveTo(glow.source.x, glow.source.y);
            ctx.lineTo(glow.destination.x, glow.destination.y);
            // Brillo mucho más sutil
            ctx.strokeStyle = `hsla(180, 100%, 90%, ${glow.life * 0.25})`;
            ctx.lineWidth = 1;
            ctx.shadowColor = `hsl(180, 100%, 80%)`;
            ctx.shadowBlur = 3 * glow.life; // Resplandor muy reducido
            ctx.stroke();
            ctx.shadowBlur = 0;
        }
      }

      // --- 4. DIBUJAR PULSOS E INICIAR REACCIONES EN CADENA ---
      for (let i = pulses.length - 1; i >= 0; i--) {
        const pulse = pulses[i];
        pulse.progress += pulse.speed;

        if (pulse.progress >= 1) {
            const sourceNode = pulse.source;
            const destNode = pulse.destination;
            destNode.illumination = 1;
            pulses.splice(i, 1);

            // Iniciar reacción en cadena si no hemos alcanzado la profundidad máxima
            if (pulse.depth < MAX_CHAIN_REACTION_DEPTH) {
              const potentialTargets = destNode.neighbors.filter(id => id !== sourceNode.id);
              
              // Enviar un pulso a CADA ramificación
              potentialTargets.forEach(targetId => {
                const newTargetNode = particles[targetId];
                const distance = Math.hypot(destNode.x - newTargetNode.x, destNode.y - newTargetNode.y);
                if (distance > 0) {
                  pulses.push({
                    source: destNode,
                    destination: newTargetNode,
                    progress: 0,
                    speed: PULSE_PIXELS_PER_FRAME / distance,
                    depth: pulse.depth + 1,
                  });
                }
              });
            }
        } else {
            const x = pulse.source.x + (pulse.destination.x - pulse.source.x) * pulse.progress;
            const y = pulse.source.y + (pulse.destination.y - pulse.source.y) * pulse.progress;
            ctx.beginPath();
            ctx.arc(x, y, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(180, 100%, 90%, 0.2)`;
            ctx.fill();
        }
      }
      
      // --- 5. ACTUALIZAR PARTÍCULAS ---
      particles.forEach((p1) => {
        p1.x += p1.vx;
        p1.y += p1.vy;
        if (p1.x < 0 || p1.x > canvas.width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > canvas.height) p1.vy *= -1;

        // Iluminación de nodo más sutil
        if (p1.illumination > 0) p1.illumination -= 0.03;

        const currentSize = p1.size + p1.illumination * 1.5; // Menos crecimiento
        const opacity = 0.5 + p1.illumination * 0.4; // Menos opacidad
        
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p1.hue}, 100%, ${70 + p1.illumination * 15}%, ${opacity})`; // Menos brillo
        
        if (p1.illumination > 0) {
          ctx.shadowColor = `hsl(${p1.hue}, 100%, 70%)`;
          ctx.shadowBlur = 6 * p1.illumination; // Menos resplandor
        }
        
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // --- 6. CREAR NUEVOS PULSOS ---
      // Crear pulsos desde el mouse (con cooldown y probabilidad reducida)
      if (particles.length > 0) {
        particles.forEach(p => {
          const distanceToMouse = Math.hypot(p.x - mouse.current.x, p.y - mouse.current.y);
          
          if (distanceToMouse < MOUSE_INTERACTION_RADIUS && p.neighbors.length > 0 && (now - p.lastPulseTime > PULSE_COOLDOWN) && Math.random() < 0.04) { // Probabilidad muy reducida
            const destination = particles[p.neighbors[Math.floor(Math.random() * p.neighbors.length)]];
            const distance = Math.hypot(p.x - destination.x, p.y - destination.y);
            if (distance > 0) {
              p.lastPulseTime = now; // Registrar el tiempo del pulso
              pulses.push({
                source: p,
                destination: destination,
                progress: 0,
                speed: PULSE_PIXELS_PER_FRAME / distance,
                depth: 0,
              });
            }
          }
        });
      }

      // Crear pulsos aleatorios (con cooldown y probabilidad reducida)
      if (Math.random() < 0.0008) { // Probabilidad muy reducida
        const source = particles[Math.floor(Math.random() * particles.length)];
        if (source && source.neighbors.length > 0 && (now - source.lastPulseTime > PULSE_COOLDOWN)) {
          const destination = particles[source.neighbors[Math.floor(Math.random() * source.neighbors.length)]];
          const distance = Math.hypot(source.x - destination.x, source.y - destination.y);
          if (distance > 0) {
            source.lastPulseTime = now; // Registrar el tiempo del pulso
            pulses.push({
              source: source,
              destination: destination,
              progress: 0,
              speed: (PULSE_PIXELS_PER_FRAME * 0.8) / distance,
              depth: 0,
            });
          }
        }
      }
        
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="particles-canvas"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}; 