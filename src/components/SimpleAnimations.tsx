import React, { useEffect, useRef, useState } from 'react';
import { SunIcon, MoonIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';


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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        z: number; // Profundidad en el eje Z (0 = fondo, 1 = frente)
        vx: number;
        vy: number;
        vz: number; // Velocidad en el eje Z
        size: number;
        hue: number;
        illumination: number;
        neighbors: number[];
        lastPulseTime: number;
        activePulses: number;
        value: number; // Contador que se incrementa hasta 1
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
    // Calcular número de partículas basado en el tamaño de la pantalla
    const getParticleCount = () => {
      const screenArea = window.innerWidth * window.innerHeight;
      const baseParticleCount = 250;
      
      // Reducir partículas en pantallas pequeñas
      if (screenArea < 500000) { // Pantallas muy pequeñas (< 500k píxeles)
        return Math.floor(baseParticleCount * 0.3); // 30% de las partículas
      } else if (screenArea < 1000000) { // Pantallas pequeñas (< 1M píxeles)
        return Math.floor(baseParticleCount * 0.5); // 50% de las partículas
      } else if (screenArea < 2000000) { // Pantallas medianas (< 2M píxeles)
        return Math.floor(baseParticleCount * 0.7); // 70% de las partículas
      } else {
        return baseParticleCount; // Pantallas grandes, usar todas las partículas
      }
    };
    
    const particleCount = getParticleCount();
    
    // Calcular parámetros adaptativos basados en el tamaño de la pantalla
    const getAdaptiveParams = () => {
      const screenArea = window.innerWidth * window.innerHeight;
      const scaleFactor = Math.min(1, screenArea / (1920 * 1080)); // Factor de escala basado en Full HD
      
      return {
        synapseFormationDistance: Math.max(60, Math.floor(90 * scaleFactor)),
        synapseBreakDistance: Math.max(120, Math.floor(225 * scaleFactor)),
        mouseInfluenceRadius: Math.max(100, Math.floor(150 * scaleFactor)),
        connectionPullRadius: Math.max(50, Math.floor(80 * scaleFactor)),
        maxPulsesPerNode: screenArea < 500000 ? 1 : 2, // Menos pulsos en pantallas pequeñas
        pulsePixelsPerFrame: screenArea < 500000 ? 1.5 : 2, // Pulsos más lentos en pantallas pequeñas
        baseSpeed: screenArea < 500000 ? 0.04 : 0.05, // Movimiento más lento en pantallas pequeñas
      };
    };
    
    const adaptiveParams = getAdaptiveParams();
    const synapseFormationDistance = adaptiveParams.synapseFormationDistance;
    const synapseBreakDistance = adaptiveParams.synapseBreakDistance;
    const REPULSION_FORCE_GLOBAL = 0.8;
    const TOLERANCE_FACTOR = 0.8;
    const RANDOM_MOVEMENT_CHANCE = 0.005; // Reducir movimiento aleatorio
    const RANDOM_MOVEMENT_FORCE = 0.2;
    const MIN_LIFE_FRAMES = 3600; // Duplicar la vida mínima
    const MAX_LIFE_FRAMES = 7200; // Duplicar la vida máxima
    const PULSE_PIXELS_PER_FRAME = adaptiveParams.pulsePixelsPerFrame;
    const MAX_CHAIN_REACTION_DEPTH = 3;
    const BASE_SPEED = adaptiveParams.baseSpeed;
    const MAX_PULSES_PER_NODE = adaptiveParams.maxPulsesPerNode;
    const REPULSION_FORCE = 1.5;
    const REPULSION_RADIUS = 3;
    const INERTIA = 0.95;
    const RESISTANCE = 0.98;
    const MOUSE_INFLUENCE_RADIUS = adaptiveParams.mouseInfluenceRadius;
    const CONNECTION_PULL_FORCE = 0.02;
    const CONNECTION_PULL_RADIUS = adaptiveParams.connectionPullRadius;

    // --- ESTADO ---
    const particles: Particle[] = [];
    const pulses: Pulse[] = [];
    const connectionGlows: ConnectionGlow[] = [];
    let animationFrameId: number = 0;
    let minDistance: number = 0; // Distancia mínima dinámica
    let nodesToSpawn = 0; // Contador de nodos por aparecer
    let spawnTimer = 0; // Timer para spawn progresivo
    const SPAWN_INTERVAL = 150; // Intervalo entre spawns (ms) - más lento
    const MAX_NODES_TO_SPAWN = Math.min(30, Math.max(5, Math.floor(particleCount * 0.1))); // Menos nodos por spawn
    let breathingTime = 0; // Para el efecto de respiración

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
      
      // Recalcular parámetros adaptativos si es necesario
      const newParticleCount = getParticleCount();
      if (newParticleCount !== particleCount) {
        // Si el número de partículas cambió significativamente, reinicializar
        particles.length = 0;
        pulses.length = 0;
        connectionGlows.length = 0;
        nodesToSpawn = newParticleCount;
        spawnTimer = 0;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const handleMouseMove = (event: MouseEvent) => {
      mouse.current.x = event.clientX;
      mouse.current.y = event.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Función para encontrar el nodo más cercano al cursor
    const findNodeAtPosition = (x: number, y: number) => {
      let closestNode = null;
      let closestDistance = Infinity;
      
      particles.forEach(particle => {
        const distance = Math.hypot(x - particle.x, y - particle.y);
        // Considerar el tamaño del nodo para la detección
        const nodeRadius = particle.size * (0.7 + particle.value * 0.3) * 8; // Radio basado en el tamaño del nodo
        
        if (distance <= nodeRadius && distance < closestDistance) {
          closestDistance = distance;
          closestNode = particle;
        }
      });
      
      return closestNode;
    };

    // Función para emitir pulsos desde un nodo
    const emitPulsesFromNode = (sourceNode: Particle) => {
      // Emitir pulsos a todos los vecinos
      sourceNode.neighbors.forEach(neighborId => {
        const neighbor = particles[neighborId];
        if (neighbor) {
          const distance = Math.hypot(sourceNode.x - neighbor.x, sourceNode.y - neighbor.y);
          if (distance > 0) {
            pulses.push({
              source: sourceNode,
              destination: neighbor,
              progress: 0,
              speed: PULSE_PIXELS_PER_FRAME / distance,
              depth: 0,
            });
          }
        }
      });
      
      // Añadir efecto de iluminación al nodo clickeado
      sourceNode.illumination = 1;
    };

    const handleMouseClick = (event: MouseEvent) => {
      const clickedNode = findNodeAtPosition(event.clientX, event.clientY);
      if (clickedNode) {
        emitPulsesFromNode(clickedNode);
      }
    };
    window.addEventListener('click', handleMouseClick);



    // Función para crear un nuevo nodo
    const createNewParticle = (id: number) => {
      const direction = getRandomDirection();
      const maxLife = Math.random() * (MAX_LIFE_FRAMES - MIN_LIFE_FRAMES) + MIN_LIFE_FRAMES;
      return {
        id: id,
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random(),
        vx: direction.x * BASE_SPEED,
        vy: direction.y * BASE_SPEED,
        vz: 0,
        size: Math.random() * 0.5 + 2,
        hue: 220,
        illumination: 0,
        neighbors: [],
        lastPulseTime: 0,
        activePulses: 0,
        value: Math.random(), // Valor aleatorio entre 0 y 1 al inicio
        life: 1, // Vida inicial al 100%
        maxLife: maxLife,
        age: 0
      };
    };

    // Inicializar nodos progresivamente
    const initializeProgressiveSpawn = () => {
      nodesToSpawn = particleCount;
      spawnTimer = 0;
    };

    // Función para spawn progresivo de nodos
    const spawnNodes = () => {
      if (nodesToSpawn > 0) {
        const nodesThisFrame = Math.min(MAX_NODES_TO_SPAWN, nodesToSpawn);
        for (let i = 0; i < nodesThisFrame; i++) {
          const newId = particleCount - nodesToSpawn + i;
          particles.push(createNewParticle(newId));
        }
        nodesToSpawn -= nodesThisFrame;
      }
    };

    // Inicializar spawn progresivo
    initializeProgressiveSpawn();

    const updateConnections = () => {
      // Optimización: limitar el número de conexiones por nodo en pantallas pequeñas
      const maxConnectionsPerNode = window.innerWidth * window.innerHeight < 500000 ? 3 : 5;
      
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        
        // Saltar si ya tiene demasiadas conexiones
        if (p1.neighbors.length >= maxConnectionsPerNode) continue;
        
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          
          // Saltar si ya tiene demasiadas conexiones
          if (p2.neighbors.length >= maxConnectionsPerNode) continue;
          
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

      // Asegurar que todos los nodos tengan al menos una conexión
      for (let i = 0; i < particles.length; i++) {
        const node = particles[i];
        if (node.neighbors.length === 0) {
          // Encontrar el nodo más cercano que no esté conectado
          let closestIndex = -1;
          let closestDistance = Infinity;
          
          for (let j = 0; j < particles.length; j++) {
            if (i !== j && particles[j].neighbors.length < maxConnectionsPerNode) {
              const distance = Math.hypot(node.x - particles[j].x, node.y - particles[j].y);
              if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = j;
              }
            }
          }
          
          // Conectar con el nodo más cercano
          if (closestIndex !== -1) {
            node.neighbors.push(closestIndex);
            particles[closestIndex].neighbors.push(i);
            
            // Crear brillo para la nueva conexión
            connectionGlows.push({ source: node, destination: particles[closestIndex], life: 1 });
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
        
        // Si el nodo ha muerto por edad o tiene demasiadas conexiones, reemplazarlo
        const maxConnectionsForReplacement = window.innerWidth * window.innerHeight < 500000 ? 6 : 8;
        if (particle.life <= 0 || particle.neighbors.length > maxConnectionsForReplacement) {
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

        // Aplicar efecto de ondas de profundidad
        applyDepthWaveEffect(p1);

        // Efecto 3D: acercar nodos conectados al nodo que está siendo agrandado por el mouse
        const dx = mouse.current.x - p1.x;
        const dy = mouse.current.y - p1.y;
        const mouseDistance = Math.hypot(dx, dy);
        
        if (mouseDistance < CONNECTION_PULL_RADIUS) {
          const mouseInfluence = Math.max(0, 1 - (mouseDistance / CONNECTION_PULL_RADIUS));
          
          // Si este nodo está siendo afectado por el mouse, atraer a sus vecinos
          if (mouseDistance < MOUSE_INFLUENCE_RADIUS) {
            p1.neighbors.forEach(neighborId => {
              const neighbor = particles[neighborId];
              if (neighbor) {
                const neighborDx = p1.x - neighbor.x;
                const neighborDy = p1.y - neighbor.y;
                const neighborDistance = Math.hypot(neighborDx, neighborDy);
                
                if (neighborDistance > 0) {
                  // Calcular fuerza de atracción basada en la influencia del mouse
                  const pullForce = mouseInfluence * CONNECTION_PULL_FORCE;
                                     const targetDistance = Math.max(neighborDistance * 1.0, neighborDistance * 0.85); // Reducir distancia entre 85% y 100%
                  const currentDistance = neighborDistance;
                  
                  if (currentDistance > targetDistance) {
                    const moveDistance = (currentDistance - targetDistance) * pullForce;
                    const moveRatio = moveDistance / currentDistance;
                    
                    // Mover el vecino hacia este nodo
                    neighbor.x += neighborDx * moveRatio;
                    neighbor.y += neighborDy * moveRatio;
                  }
                }
              }
            });
          }
        }

        // Manejar repulsión
        if (hasRepulsion) {
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
          // Si no hay repulsión, mantener la dirección base
          p1.vx = baseVx;
          p1.vy = baseVy;
        }

        // Aplicar inercia y resistencia con factor de tolerancia
        const inertiaTolerance = 1 + (Math.random() - 0.5) * TOLERANCE_FACTOR * 0.5; // Menos tolerancia para inercia
        p1.vx *= INERTIA * RESISTANCE * inertiaTolerance;
        p1.vy *= INERTIA * RESISTANCE * inertiaTolerance;
        p1.vz *= INERTIA * RESISTANCE * inertiaTolerance; // Aplicar inercia también al eje Z

        // Actualizar posición
        p1.x += p1.vx;
        p1.y += p1.vy;
        p1.z += p1.vz; // Actualizar posición Z

        // Limitar la profundidad Z entre 0 y 1
        p1.z = Math.max(0, Math.min(1, p1.z));

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
      // Optimización: limitar el número total de pulsos en pantallas pequeñas
      const maxTotalPulses = window.innerWidth * window.innerHeight < 500000 ? 20 : 50;
      
      for (let i = pulses.length - 1; i >= 0; i--) {
        const pulse = pulses[i];
        pulse.progress += pulse.speed;

        if (pulse.progress >= 1) {
          const sourceNode = pulse.source;
          const destNode = pulse.destination;
          destNode.illumination = 0.6; // Aumentar iluminación al recibir el pulso
          
          // Incrementar el contador hasta 1, luego resetear
          if (destNode.value < 1) {
            destNode.value += 0.1; // Incrementar en pasos de 0.1 (0, 0.1, 0.2, 0.3, ..., 1)
            if (destNode.value > 1) destNode.value = 1; // Limitar a 1
          } else {
            destNode.value = 0; // Resetear a 0 si ya está en 1
          }
          
          sourceNode.activePulses--;

          if (pulse.depth < MAX_CHAIN_REACTION_DEPTH && pulses.length < maxTotalPulses) {
            const potentialTargets = destNode.neighbors.filter(id => id !== sourceNode.id);
            const maxNewPulses = Math.min(3, MAX_PULSES_PER_NODE - destNode.activePulses);
            
            if (maxNewPulses > 0) {
              const selectedTargets = potentialTargets
                .sort(() => Math.random() - 0.5)
                .slice(0, maxNewPulses);
              
              selectedTargets.forEach(targetId => {
                const newTargetNode = particles[targetId];
                const distance = Math.hypot(destNode.x - newTargetNode.x, destNode.y - newTargetNode.y);
                if (distance > 0 && pulses.length < maxTotalPulses) {
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
          
          // Colores de pulsos ajustados - más contraste en modo oscuro
          if (isNightMode) {
            ctx.fillStyle = `hsla(160, 40%, 75%, 0.15)`; // Aumentar saturación y opacidad
          } else {
            ctx.fillStyle = `hsla(0, 0%, 75%, 0.15)`; // Mantener sutil en modo claro
          }
          
          ctx.fill();
        }
      }
    };

    const updateDepthWaves = () => {
      // Función vacía ya que no usamos ondas de profundidad
    };

    const applyDepthWaveEffect = (particle: Particle) => {
      // Función vacía ya que no aplicamos efectos de ondas
    };

    const drawParticles = () => {
      // Ordenar partículas por profundidad Z para dibujar las más lejanas primero
      const sortedParticles = [...particles].sort((a, b) => a.z - b.z);
      
      // Actualizar tiempo de respiración
      breathingTime += 0.02;
      
      sortedParticles.forEach((p, index) => {
        ctx.beginPath();
        
        // Efecto de respiración: variación sutil de opacidad (no afecta tamaño)
        const breathingPhase = breathingTime + (index * 0.1); // Fase diferente para cada nodo
        
        // Calcular tamaño base basado ÚNICAMENTE en el valor del nodo
        const valueSizeMultiplier = 0.5 + (p.value * 0.5); // El valor afecta el tamaño (0.5x a 1.0x) - 0 = más pequeño, 1 = más grande
        const baseSize = p.size * valueSizeMultiplier; // Solo el valor del nodo determina el tamaño
        
        // Tamaño de fuente basado ÚNICAMENTE en el valor del nodo
        const numberFontSize = Math.max(baseSize * 5.5, 9); // Tamaño intermedio
        ctx.font = `${numberFontSize}px monospace`;
        
        // Calcular opacidad basada en profundidad Z + respiración + valor del nodo
        const baseOpacity = isNightMode ? 0.15 : 0.15;
        const depthOpacity = p.z * 0.3; // Nodos más adelante son más opacos
        const lifeOpacity = p.life * (isNightMode ? 0.25 : 0.25);
        const valueOpacity = p.value * 0.2; // Nodos con valores más altos son más opacos
        const breathingOpacity = Math.sin(breathingPhase) * 0.05; // Variación sutil de opacidad
        const totalOpacity = baseOpacity + depthOpacity + lifeOpacity + valueOpacity + breathingOpacity;
        
        // Colores ajustados con efecto de profundidad, respiración y valor del nodo
        if (isNightMode) {
          const baseBrightness = p.illumination > 0 ? 66 : 65; // Efecto de color más sutil cuando está iluminado
          const valueBrightness = p.value * 15; // Nodos con valores más altos son más brillantes
          const brightness = Math.min(85, baseBrightness + valueBrightness); // Limitar brillo máximo
          const saturation = 30 + (p.z * 20) + (Math.sin(breathingPhase) * 10) + (p.value * 20); // Saturación variable + valor
          ctx.fillStyle = `hsla(160, ${saturation}%, ${brightness}%, ${totalOpacity})`;
        } else {
          const baseBrightness = p.illumination > 0 ? 66 : 65; // Efecto de color más sutil cuando está iluminado
          const valueBrightness = p.value * 10; // Nodos con valores más altos son más brillantes
          const brightness = Math.min(85, baseBrightness + valueBrightness); // Limitar brillo máximo
          ctx.fillStyle = `hsla(0, 0%, ${brightness}%, ${totalOpacity})`;
        }
        
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Mostrar el valor del contador redondeado a 1 decimal
        const displayValue = Math.round(p.value * 10) / 10;
        ctx.fillText(displayValue.toString(), p.x, p.y);
        
        // Efecto de brillo más visible
        if (p.illumination > 0.3) {
          ctx.shadowColor = isNightMode ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.08)';
          ctx.shadowBlur = p.illumination * 2;
          ctx.fillText(displayValue.toString(), p.x, p.y);
          ctx.shadowBlur = 0;
        }
        
        if (p.illumination > 0) {
          p.illumination -= 0.15; // Decay más lento para que dure más el efecto
        }
      });
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      
      // Limpiar canvas con color según el modo
      if (isNightMode) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      } else {
        ctx.fillStyle = '#f8fafc'; // Gris muy claro en lugar de blanco puro
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Spawn progresivo de nodos
      spawnTimer++;
      if (spawnTimer >= SPAWN_INTERVAL / 16.67) { // 16.67ms = 60fps
        spawnNodes();
        spawnTimer = 0;
      }

      // Solo actualizar si hay nodos
      if (particles.length > 0) {
        updateConnections();
        updateParticles();
        updatePulses();
        updateDepthWaves();

        // Dibujar conexiones de fondo con efecto de profundidad
        particles.forEach(p => {
          p.neighbors.forEach(neighborId => {
            const neighbor = particles[neighborId];
            
            // Calcular profundidad promedio de la conexión
            const avgZ = (p.z + neighbor.z) / 2;
            
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(neighbor.x, neighbor.y);
            
            // Opacidad basada en profundidad
            const connectionOpacity = 0.08 + (avgZ * 0.12); // Conexiones más adelante son más visibles
            
                    // Colores de conexiones ajustados con efecto de profundidad
        if (isNightMode) {
          const saturation = 25 + (avgZ * 15);
          ctx.strokeStyle = `hsla(160, ${saturation}%, 70%, ${connectionOpacity})`;
        } else {
          ctx.strokeStyle = `hsla(0, 0%, 70%, ${connectionOpacity})`;
        }
            
            // Grosor de línea basado en profundidad
            ctx.lineWidth = 0.5 + (avgZ * 1.5);
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
            
            // Colores de brillos ajustados - más contraste en modo oscuro
            if (isNightMode) {
              ctx.strokeStyle = `hsla(160, 35%, 75%, ${glow.life * 0.04})`; // Aumentar opacidad y saturación
              ctx.shadowColor = `hsla(160, 30%, 70%, 0.2)`; // Sombra más visible
            } else {
              ctx.strokeStyle = `hsla(0, 0%, 75%, ${glow.life * 0.08})`; // Mantener sutil en modo claro
              ctx.shadowColor = `hsla(0, 0%, 70%, 0.05)`; // Sombra sutil
            }
            
            ctx.lineWidth = 1;
            ctx.shadowBlur = isNightMode ? 1 * glow.life : 0.5 * glow.life; // Más blur en modo oscuro
            ctx.stroke();
            ctx.shadowBlur = 0;
          }
        }

        // Dibujar partículas (números)
        drawParticles();
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Event listener para cerrar el menú móvil
    const handleCloseMobileMenu = () => {
      setIsMobileMenuOpen(false);
    };

    window.addEventListener('closeMobileMenu', handleCloseMobileMenu);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleMouseClick);
      window.removeEventListener('closeMobileMenu', handleCloseMobileMenu);
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
          pointerEvents: 'auto',
          zIndex: 0,
          cursor: 'crosshair',
        }}
      />
      
      {/* Switch de día/noche para desktop */}
      <div className="desktop-controls" style={{
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
            background: isNightMode ? '#10b981' : '#9ca3af',
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
              color: isNightMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.7)',
              transition: 'all 0.3s ease',
              filter: isNightMode ? 'none' : 'brightness(0.8)',
              width: '12px',
              height: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <SunIcon />
            </div>
            <div style={{
              position: 'absolute',
              top: '50%',
              right: '4px',
              transform: 'translateY(-50%)',
              color: isNightMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.9)',
              transition: 'all 0.3s ease',
              filter: isNightMode ? 'brightness(0.8)' : 'none',
              width: '12px',
              height: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <MoonIcon />
            </div>
          </div>
        </div>
      </div>

      {/* Botón de menú móvil */}
      <div className="mobile-menu-button" style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 15,
        pointerEvents: 'auto',
        display: 'none'
      }}>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: isNightMode 
              ? 'rgba(255, 255, 255, 0.1)' 
              : 'rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${isNightMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'}`,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isNightMode ? '#ffffff' : '#000000'
          }}
        >
          {isMobileMenuOpen ? <XMarkIcon width={24} height={24} /> : <Bars3Icon width={24} height={24} />}
        </button>
      </div>

      {/* Menú móvil desplegable */}
      <div className="mobile-menu" style={{
        position: 'fixed',
        top: '80px',
        right: '20px',
        zIndex: 14,
        pointerEvents: 'auto',
        display: 'none',
        flexDirection: 'column',
        gap: '1rem',
        padding: '1.5rem',
        background: isNightMode 
          ? 'rgba(17, 24, 39, 0.8)' 
          : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(15px)',
        borderRadius: '1rem',
        border: `1px solid ${isNightMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(0, 0, 0, 0.1)'}`,
        minWidth: '250px',
        transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'all 0.3s ease',
        opacity: isMobileMenuOpen ? 1 : 0
      }}>
        {/* Switch de día/noche para móvil */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.5rem 0'
        }}>
          <span style={{
            color: isNightMode ? '#ffffff' : '#000000',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            {isNightMode ? 'Modo Oscuro' : 'Modo Claro'}
          </span>
          <div style={{
            position: 'relative',
            width: '48px',
            height: '24px',
            borderRadius: '12px',
            background: isNightMode ? '#10b981' : '#9ca3af',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onClick={() => setIsNightMode(!isNightMode)}
          >
            <div style={{
              position: 'absolute',
              top: '2px',
              left: isNightMode ? '26px' : '2px',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: '#ffffff',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
              transition: 'all 0.3s ease'
            }} />
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '4px',
              transform: 'translateY(-50%)',
              color: isNightMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.7)',
              transition: 'all 0.3s ease',
              filter: isNightMode ? 'none' : 'brightness(0.8)',
              width: '12px',
              height: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <SunIcon />
            </div>
            <div style={{
              position: 'absolute',
              top: '50%',
              right: '4px',
              transform: 'translateY(-50%)',
              color: isNightMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.9)',
              transition: 'all 0.3s ease',
              filter: isNightMode ? 'brightness(0.8)' : 'none',
              width: '12px',
              height: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <MoonIcon />
            </div>
          </div>
        </div>

        {/* Separador */}
        <div style={{
          height: '1px',
          background: isNightMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(0, 0, 0, 0.1)',
          margin: '0.5rem 0'
        }} />

        {/* Marcadores de navegación para móvil */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          <span style={{
            color: isNightMode ? '#ffffff' : '#000000',
            fontSize: '0.875rem',
            fontWeight: '600',
            marginBottom: '0.5rem'
          }}>
            Navegación
          </span>
          {/* Aquí se insertarán los marcadores dinámicamente */}
          <div id="mobile-navigation-markers">
            {/* Los marcadores se agregarán aquí desde el componente principal */}
          </div>
        </div>
      </div>
    </div>
  );
}; 