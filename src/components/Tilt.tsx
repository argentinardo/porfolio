import React, { useEffect, useRef } from 'react';
import VanillaTilt, { TiltOptions } from 'vanilla-tilt';

interface TiltProps {
  options: TiltOptions;
  children: React.ReactNode;
  className?: string;
}

const Tilt: React.FC<TiltProps> = ({ options, children, className }) => {
  const tiltRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tiltNode = tiltRef.current;
    if (tiltNode) {
      VanillaTilt.init(tiltNode, options);
    }
    return () => {
      if (tiltNode && (tiltNode as any).vanillaTilt) {
        (tiltNode as any).vanillaTilt.destroy();
      }
    };
  }, [options]);

  return (
    <div ref={tiltRef} className={className}>
      {children}
    </div>
  );
};

export default Tilt; 