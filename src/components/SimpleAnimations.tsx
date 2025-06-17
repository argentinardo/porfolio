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
    const particleCount = 300;
    const synapseFormationDistance = 90;
    const synapseBreakDistance = synapseFormationDistance * 1.5;
    const PULSE_PIXELS_PER_FRAME = 2;
    const MAX_CHAIN_REACTION_DEPTH = 1;
    const MAGNETIC_FORCE = 0.08;
    const MAGNETIC_RADIUS = 120;
    const BASE_SPEED = 0.1;
    const MAX_PULSES_PER_NODE = 2;
    const REPULSION_FORCE = 0.2;
    const REPULSION_RADIUS = 60;
    const MIN_NODE_DISTANCE = 40;
    const RANDOM_MOVEMENT_FORCE = 0.02; // Fuerza del movimiento aleatorio
    const RANDOM_MOVEMENT_CHANGE = 0.1; // Probabilidad de cambio de dirección

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

      // --- 2. ACTUALIZAR POSICIONES ---
      particles.forEach((p1) => {
        // Aplicar movimiento aleatorio suave
        if (Math.random() < RANDOM_MOVEMENT_CHANGE) {
          const randomDir = getRandomDirection();
          p1.vx += randomDir.x * RANDOM_MOVEMENT_FORCE;
          p1.vy += randomDir.y * RANDOM_MOVEMENT_FORCE;
        }

        // Aplicar repulsión entre nodos cercanos
        particles.forEach((p2) => {
          if (p1.id !== p2.id) {
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const distance = Math.hypot(dx, dy);

            if (distance < REPULSION_RADIUS) {
              const repulsionForce = (1 - distance / REPULSION_RADIUS) * REPULSION_FORCE;
              const repulsionVx = (-dx / distance) * repulsionForce;
              const repulsionVy = (-dy / distance) * repulsionForce;

              p1.vx += repulsionVx;
              p1.vy += repulsionVy;
            }
          }
        });

        // Aplicar atracción magnética al mouse
        const dx = mouse.current.x - p1.x;
        const dy = mouse.current.y - p1.y;
        const distance = Math.hypot(dx, dy);

        if (distance < MAGNETIC_RADIUS) {
          const force = (1 - distance / MAGNETIC_RADIUS) * MAGNETIC_FORCE;
          p1.vx += (dx / distance) * force;
          p1.vy += (dy / distance) * force;
        }

        // Limitar la velocidad máxima
        const currentSpeed = Math.hypot(p1.vx, p1.vy);
        const maxSpeed = BASE_SPEED * 2;
        if (currentSpeed > maxSpeed) {
          p1.vx = (p1.vx / currentSpeed) * maxSpeed;
          p1.vy = (p1.vy / currentSpeed) * maxSpeed;
        }

        // Actualizar posición
        p1.x += p1.vx;
        p1.y += p1.vy;

        // Mantener los nodos dentro del canvas con rebote suave
        if (p1.x < 0) {
          p1.x = 0;
          p1.vx = Math.abs(p1.vx) * 0.5;
        } else if (p1.x > canvas.width) {
          p1.x = canvas.width;
          p1.vx = -Math.abs(p1.vx) * 0.5;
        }

        if (p1.y < 0) {
          p1.y = 0;
          p1.vy = Math.abs(p1.vy) * 0.5;
        } else if (p1.y > canvas.height) {
          p1.y = canvas.height;
          p1.vy = -Math.abs(p1.vy) * 0.5;
        }

        // Aplicar fricción suave
        p1.vx *= 0.99;
        p1.vy *= 0.99;
      });

      // --- 3. DIBUJAR CONEXIONES DE FONDO ---
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
      
      // --- 4. DIBUJAR BRILLOS DE CONEXIONES RECIENTES ---
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

      // --- 5. DIBUJAR PULSOS E INICIAR REACCIONES EN CADENA ---
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