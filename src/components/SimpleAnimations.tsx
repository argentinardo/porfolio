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
      activePulses: number; // Contador de pulsos activos
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
    const particleCount = 200;
    const synapseFormationDistance = 90;
    const synapseBreakDistance = synapseFormationDistance * 2;
    const PULSE_PIXELS_PER_FRAME = 2;
    const MAX_CHAIN_REACTION_DEPTH = 1;
    const MAGNETIC_FORCE = 0.8;
    const MAGNETIC_RADIUS =120;
    const BASE_SPEED = 0.1;
    const MAX_PULSES_PER_NODE = 2;

    // --- ESTADO ---
    const particles: Particle[] = [];
    const pulses: Pulse[] = [];
    const connectionGlows: ConnectionGlow[] = [];
    let animationFrameId: number;

    // Función para generar una dirección aleatoria normalizada
    const getRandomDirection = () => {
      const angle = Math.random() * Math.PI * 2;
      return {
        x: Math.cos(angle),
        y: Math.sin(angle)
      };
    };

    // Inicializar partículas
    for (let i = 0; i < particleCount; i++) {
      const direction = getRandomDirection();
      particles.push({
        id: i,
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: direction.x * BASE_SPEED,
        vy: direction.y * BASE_SPEED,
        size: Math.random() * 1.5 + 0.5,
        hue: 200 + Math.random() * 60,
        illumination: 0,
        neighbors: [],
        lastPulseTime: 0,
        activePulses: 0,
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
              // Generar pulso cuando se crea un nuevo enlace
              const distance = Math.hypot(p1.x - p2.x, p1.y - p2.y);
              if (distance > 0) {
                pulses.push({
                  source: p1,
                  destination: p2,
                  progress: 0,
                  speed: PULSE_PIXELS_PER_FRAME / distance,
                  depth: 0,
                });
              }
            }
          }
        }
      }
    };

    const animate = () => {
      if (!ctx || !canvas) return;
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
            ctx.strokeStyle = `hsla(180, 100%, 90%, ${glow.life * 0.25})`;
            ctx.lineWidth = 1;
            ctx.shadowColor = `hsl(180, 100%, 80%)`;
            ctx.shadowBlur = 3 * glow.life;
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
            sourceNode.activePulses--;
            pulses.splice(i, 1);

            if (pulse.depth < MAX_CHAIN_REACTION_DEPTH) {
              const potentialTargets = destNode.neighbors.filter(id => id !== sourceNode.id);
              const maxNewPulses = Math.min(3, MAX_PULSES_PER_NODE - destNode.activePulses);
              if (maxNewPulses > 0) {
                const selectedTargets = potentialTargets
                  .sort(() => Math.random() - 0.5)
                  .slice(0, maxNewPulses);
                
                selectedTargets.forEach(targetId => {
                  const newTargetNode = particles[targetId];
                  const distance = Math.hypot(destNode.x - newTargetNode.x, destNode.y - newTargetNode.y);
                  if (distance > 0) {
                    destNode.activePulses++;
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
        // Calcular distancia al mouse
        const dx = mouse.current.x - p1.x;
        const dy = mouse.current.y - p1.y;
        const distanceToMouse = Math.hypot(dx, dy);

        // Aplicar fuerza magnética si está dentro del radio
        if (distanceToMouse < MAGNETIC_RADIUS) {
          const force = (1 - distanceToMouse / MAGNETIC_RADIUS) * MAGNETIC_FORCE;
          const magneticVx = (dx / distanceToMouse) * force;
          const magneticVy = (dy / distanceToMouse) * force;
          
          p1.vx = p1.vx + magneticVx;
          p1.vy = p1.vy + magneticVy;
          
          const currentSpeed = Math.hypot(p1.vx, p1.vy);
          if (currentSpeed > 0) {
            p1.vx = (p1.vx / currentSpeed) * BASE_SPEED;
            p1.vy = (p1.vy / currentSpeed) * BASE_SPEED;
          }
        }

        // Actualizar posición
        p1.x += p1.vx;
        p1.y += p1.vy;

        // Rebotar en los bordes
        if (p1.x < 0) {
          p1.x = 0;
          p1.vx = Math.abs(p1.vx);
        } else if (p1.x > canvas.width) {
          p1.x = canvas.width;
          p1.vx = -Math.abs(p1.vx);
        }
        if (p1.y < 0) {
          p1.y = 0;
          p1.vy = Math.abs(p1.vy);
        } else if (p1.y > canvas.height) {
          p1.y = canvas.height;
          p1.vy = -Math.abs(p1.vy);
        }

        // Iluminación de nodo más sutil
        if (p1.illumination > 0) p1.illumination -= 0.03;

        const currentSize = p1.size + p1.illumination * 1.5;
        const opacity = 0.5 + p1.illumination * 0.4;
        
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p1.hue}, 100%, ${70 + p1.illumination * 15}%, ${opacity})`;
        
        if (p1.illumination > 0) {
          ctx.shadowColor = `hsl(${p1.hue}, 100%, 70%)`;
          ctx.shadowBlur = 6 * p1.illumination;
        }
        
        ctx.fill();
        ctx.shadowBlur = 0;
      });
        
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