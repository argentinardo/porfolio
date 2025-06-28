import React, { useEffect, useRef, useState } from 'react';

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
  const [isNightMode, setIsNightMode] = useState(true);

  useEffect(() => {
    // Aplicar clase al body según el modo
    if (isNightMode) {
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // --- INTERFACES ---
    interface Particle {
      id: number;
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      hue: number;
      illumination: number;
      neighbors: number[];
      lastPulseTime: number;
      activePulses: number;
      value: number; // 0 o 1
      life: number; // Vida del nodo (0-1)
      maxLife: number; // Vida máxima en frames
      age: number; // Edad actual en frames
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
    const synapseBreakDistance = synapseFormationDistance * 2.5; // Distancia máxima antes de aplicar fuerza elástica
    const REPULSION_FORCE_GLOBAL = 0.8; // Fuerza de repulsión global entre nodos
    const TOLERANCE_FACTOR = 0.8; // Factor de tolerancia para irregularidad (0-1)
    const RANDOM_MOVEMENT_CHANCE = 0.02; // Probabilidad de cambio aleatorio de dirección
    const RANDOM_MOVEMENT_FORCE = 0.2; // Fuerza del movimiento aleatorio (reducida)
    const MIN_LIFE_FRAMES = 1800; // Vida mínima en frames (30 segundos a 60fps)
    const MAX_LIFE_FRAMES = 3600; // Vida máxima en frames (60 segundos a 60fps)
    const PULSE_PIXELS_PER_FRAME = 2;
    const MAX_CHAIN_REACTION_DEPTH = 3;
    const MAGNETIC_FORCE = 0.1; // Fuerza magnética reducida
    const MAGNETIC_RADIUS = 120;
    const BASE_SPEED = 0.1; // Velocidad base más lenta
    const MAX_PULSES_PER_NODE = 1;
    const REPULSION_FORCE = 1.5; // Fuerza de repulsión reducida
    const REPULSION_RADIUS = 3;
    const INERTIA = 0.95; // Factor de inercia más bajo para movimiento más lento
    const RESISTANCE = 0.98; // Factor de resistencia más alto para movimiento más lento

    // --- ESTADO ---
    const particles: Particle[] = [];
    const pulses: Pulse[] = [];
    const connectionGlows: ConnectionGlow[] = [];
    let animationFrameId: number;
    let minDistance: number; // Distancia mínima dinámica

    // Función para generar una dirección aleatoria normalizada
    const getRandomDirection = () => {
      const angle = Math.random() * Math.PI * 2;
      return {
        x: Math.cos(angle),
        y: Math.sin(angle)
      };
    };

    // Función para actualizar la distancia mínima basada en el alto de la pantalla
    const updateMinDistance = () => {
      minDistance = window.innerHeight * 0.1; // 10% del alto de la pantalla
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      updateMinDistance(); // Actualizar distancia mínima cuando cambie el tamaño
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const handleMouseMove = (event: MouseEvent) => {
      mouse.current.x = event.clientX;
      mouse.current.y = event.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Función para crear un nuevo nodo
    const createNewParticle = (id: number) => {
      const direction = getRandomDirection();
      const maxLife = Math.random() * (MAX_LIFE_FRAMES - MIN_LIFE_FRAMES) + MIN_LIFE_FRAMES;
      return {
        id: id,
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: direction.x * BASE_SPEED,
        vy: direction.y * BASE_SPEED,
        size: Math.random() * 0.5 + 2,
        hue: 220,
        illumination: 0,
        neighbors: [],
        lastPulseTime: 0,
        activePulses: 0,
        value: Math.round(Math.random()),
        life: 1, // Vida inicial al 100%
        maxLife: maxLife,
        age: 0
      };
    };

    // Inicializar partículas con dirección aleatoria fija
    for (let i = 0; i < particleCount; i++) {
      particles.push(createNewParticle(i));
    }

    const updateConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const distance = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          const areNeighbors = p1.neighbors.includes(j);

          if (areNeighbors && distance > synapseBreakDistance) {
            // Romper conexión normalmente
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

    const updateParticles = () => {
      // Actualizar vida y eliminar nodos muertos
      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        particle.age++;
        particle.life = 1 - (particle.age / particle.maxLife);
        
        // Si el nodo ha muerto por edad o tiene más de 5 conexiones, reemplazarlo
        if (particle.life <= 0 || particle.neighbors.length > 5) {
          // Eliminar todas las conexiones del nodo muerto
          particle.neighbors.forEach(neighborId => {
            const neighbor = particles[neighborId];
            if (neighbor) {
              neighbor.neighbors = neighbor.neighbors.filter(id => id !== particle.id);
            }
          });
          
          // Eliminar todos los pulsos que involucren al nodo muerto
          for (let j = pulses.length - 1; j >= 0; j--) {
            const pulse = pulses[j];
            if (pulse.source.id === particle.id || pulse.destination.id === particle.id) {
              pulses.splice(j, 1);
            }
          }
          
          // Reemplazar con un nuevo nodo
          particles[i] = createNewParticle(particle.id);
        }
      }

      particles.forEach((p1) => {
        // Velocidad base constante (sin cambios aleatorios)
        const baseVx = p1.vx / Math.hypot(p1.vx, p1.vy) * BASE_SPEED;
        const baseVy = p1.vy / Math.hypot(p1.vx, p1.vy) * BASE_SPEED;
        
        // Añadir movimiento aleatorio ocasional para romper patrones
        if (Math.random() < RANDOM_MOVEMENT_CHANCE) {
          const randomAngle = Math.random() * Math.PI * 2;
          const randomVx = Math.cos(randomAngle) * RANDOM_MOVEMENT_FORCE;
          const randomVy = Math.sin(randomAngle) * RANDOM_MOVEMENT_FORCE;
          p1.vx += randomVx;
          p1.vy += randomVy;
        }
        
        // Variables para acumular fuerzas de repulsión
        let totalRepulsionVx = 0;
        let totalRepulsionVy = 0;
        let hasRepulsion = false;
        
        // Aplicar repulsión global entre todos los nodos para mantener distancia mínima
        particles.forEach((p2) => {
          if (p1.id !== p2.id) {
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const distance = Math.hypot(dx, dy);

            if (distance < minDistance && distance > 0) {
              // Aplicar factor de tolerancia para irregularidad
              const tolerance = 1 + (Math.random() - 0.5) * TOLERANCE_FACTOR;
              const repulsionForce = Math.pow(1 - distance / minDistance, 2) * REPULSION_FORCE_GLOBAL * tolerance;
              const repulsionVx = (-dx / distance) * repulsionForce;
              const repulsionVy = (-dy / distance) * repulsionForce;

              totalRepulsionVx += repulsionVx;
              totalRepulsionVy += repulsionVy;
              hasRepulsion = true;
            }
          }
        });

        // Aplicar repulsión entre nodos cercanos (sistema original)
        particles.forEach((p2) => {
          if (p1.id !== p2.id) {
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const distance = Math.hypot(dx, dy);

            if (distance < REPULSION_RADIUS) {
              // Aplicar factor de tolerancia para irregularidad
              const tolerance = 1 + (Math.random() - 0.5) * TOLERANCE_FACTOR;
              const repulsionForce = Math.pow(1 - distance / REPULSION_RADIUS, 2) * REPULSION_FORCE * tolerance;
              const repulsionVx = (-dx / distance) * repulsionForce;
              const repulsionVy = (-dy / distance) * repulsionForce;

              totalRepulsionVx += repulsionVx;
              totalRepulsionVy += repulsionVy;
              hasRepulsion = true;
            }
          }
        });

        // Aplicar atracción magnética al mouse (esto puede cambiar la dirección)
        const dx = mouse.current.x - p1.x;
        const dy = mouse.current.y - p1.y;
        const distance = Math.hypot(dx, dy);

        if (distance < MAGNETIC_RADIUS) {
          // Aplicar factor de tolerancia para irregularidad en la atracción magnética
          const tolerance = 1 + (Math.random() - 0.5) * TOLERANCE_FACTOR;
          const force = (1 - distance / MAGNETIC_RADIUS) * MAGNETIC_FORCE * tolerance;
          p1.vx += (dx / distance) * force;
          p1.vy += (dy / distance) * force;
        } else if (hasRepulsion) {
          // Si hay repulsión pero no atracción magnética, cambiar dirección base
          const repulsionMagnitude = Math.hypot(totalRepulsionVx, totalRepulsionVy);
          if (repulsionMagnitude > 0) {
            // Aplicar factor de tolerancia para irregularidad en el cambio de dirección
            const tolerance = 1 + (Math.random() - 0.5) * TOLERANCE_FACTOR;
            
            // Normalizar la fuerza de repulsión y aplicarla como nueva dirección base
            const normalizedRepulsionVx = totalRepulsionVx / repulsionMagnitude * BASE_SPEED * tolerance;
            const normalizedRepulsionVy = totalRepulsionVy / repulsionMagnitude * BASE_SPEED * tolerance;
            
            // Cambiar la dirección base del nodo
            p1.vx = normalizedRepulsionVx;
            p1.vy = normalizedRepulsionVy;
          } else {
            // Si no hay repulsión, mantener la dirección base
            p1.vx = baseVx;
            p1.vy = baseVy;
          }
        } else {
          // Si no hay atracción magnética ni repulsión, mantener la dirección base
          p1.vx = baseVx;
          p1.vy = baseVy;
        }

        // Aplicar inercia y resistencia con factor de tolerancia
        const inertiaTolerance = 1 + (Math.random() - 0.5) * TOLERANCE_FACTOR * 0.5; // Menos tolerancia para inercia
        p1.vx *= INERTIA * RESISTANCE * inertiaTolerance;
        p1.vy *= INERTIA * RESISTANCE * inertiaTolerance;

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
      });
    };

    const updatePulses = () => {
      for (let i = pulses.length - 1; i >= 0; i--) {
        const pulse = pulses[i];
        pulse.progress += pulse.speed;

        if (pulse.progress >= 1) {
          const sourceNode = pulse.source;
          const destNode = pulse.destination;
          destNode.illumination = 1; // Máxima iluminación al recibir el pulso
          destNode.value = destNode.value === 0 ? 1 : 0;
          sourceNode.activePulses--;

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
          pulses.splice(i, 1);
        } else {
          const x = pulse.source.x + (pulse.destination.x - pulse.source.x) * pulse.progress;
          const y = pulse.source.y + (pulse.destination.y - pulse.source.y) * pulse.progress;
          ctx.beginPath();
          ctx.arc(x, y, 1.5, 0, Math.PI * 2);
          
          // Colores de pulsos según el modo
          if (isNightMode) {
            ctx.fillStyle = `hsla(180, 100%, 90%, 0.2)`;
          } else {
            ctx.fillStyle = `hsla(0, 0%, 30%, 0.6)`; // Gris oscuro para modo normal
          }
          
          ctx.fill();
        }
      }
    };

    const drawParticles = () => {
      particles.forEach(p => {
        ctx.beginPath();
        ctx.font = `${p.size * 5}px monospace`;
        // La opacidad disminuye con la vida del nodo
        const opacity = 0.3 + (p.life * 0.6); // Entre 0.3 y 0.9
        
        // Colores según el modo
        if (isNightMode) {
          ctx.fillStyle = `hsla(220, 100%, ${p.illumination > 0 ? '75%' : '60%'}, ${opacity})`;
        } else {
          ctx.fillStyle = `hsla(0, 0%, ${p.illumination > 0 ? '40%' : '30%'}, ${opacity})`;
        }
        
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.value.toString(), p.x, p.y);
        
        if (p.illumination > 0) {
          p.illumination -= 0.2;
        }
      });
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      
      // Limpiar canvas con color según el modo
      if (isNightMode) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      } else {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      updateConnections();
      updateParticles();
      updatePulses();

      // Dibujar conexiones de fondo
      particles.forEach(p => {
        p.neighbors.forEach(neighborId => {
          const neighbor = particles[neighborId];
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(neighbor.x, neighbor.y);
          
          // Colores según el modo
          if (isNightMode) {
            ctx.strokeStyle = `hsla(220, 100%, 80%, 0.08)`;
          } else {
            ctx.strokeStyle = `hsla(0, 0%, 40%, 0.3)`; // Gris oscuro para modo normal
          }
          
          ctx.lineWidth = 1;
          ctx.stroke();
        });
      });

      // Dibujar brillos de conexiones recientes
      for (let i = connectionGlows.length - 1; i >= 0; i--) {
        const glow = connectionGlows[i];
        glow.life -= 0.03;
        if (glow.life <= 0) {
          connectionGlows.splice(i, 1);
        } else {
          ctx.beginPath();
          ctx.moveTo(glow.source.x, glow.source.y);
          ctx.lineTo(glow.destination.x, glow.destination.y);
          
          // Colores según el modo
          if (isNightMode) {
            ctx.strokeStyle = `hsla(180, 100%, 90%, ${glow.life * 0.05})`;
            ctx.shadowColor = `hsl(180, 100%, 80%)`;
          } else {
            ctx.strokeStyle = `hsla(0, 0%, 50%, ${glow.life * 0.2})`; // Gris oscuro para modo normal
            ctx.shadowColor = `hsl(0, 0%, 30%)`;
          }
          
          ctx.lineWidth = 1;
          ctx.shadowBlur = 1 * glow.life;
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      }

      // Dibujar partículas (números)
      drawParticles();
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isNightMode]);

  return (
    <div style={{ position: 'relative' }}>
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
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 10,
        pointerEvents: 'auto'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '60px',
          height: '40px',
          borderRadius: '25px',
          background: isNightMode 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${isNightMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'}`,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          userSelect: 'none'
        }}
        onClick={() => setIsNightMode(!isNightMode)}
        >
          <div style={{
            position: 'relative',
            width: '48px',
            height: '24px',
            borderRadius: '12px',
            background: isNightMode ? '#3b82f6' : '#9ca3af',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}>
            <div style={{
              position: 'absolute',
              top: '2px',
              left: isNightMode ? '26px' : '2px',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: '#ffffff',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
              transition: 'all 0.3s ease',
              transform: isNightMode ? 'translateX(0)' : 'translateX(0)'
            }} />
            {/* Iconos dentro del switch */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '4px',
              transform: 'translateY(-50%)',
              fontSize: '12px',
              color: isNightMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.7)',
              transition: 'all 0.3s ease',
              filter: isNightMode ? 'none' : 'brightness(0.8)'
            }}>
              ☀️
            </div>
            <div style={{
              position: 'absolute',
              top: '50%',
              right: '4px',
              transform: 'translateY(-50%)',
              fontSize: '12px',
              color: isNightMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.9)',
              transition: 'all 0.3s ease',
              filter: isNightMode ? 'brightness(0.8)' : 'none'
            }}>
              🌙
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 