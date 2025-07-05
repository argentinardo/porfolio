import React from 'react';

interface SkipLinkProps {
  targetId?: string;
  children?: React.ReactNode;
}

export const SkipLink: React.FC<SkipLinkProps> = ({ 
  targetId = 'main-content', 
  children = 'Saltar al contenido principal' 
}) => {
  return (
    <a
      href={`#${targetId}`}
      className="skip-link"
      aria-label={children as string}
    >
      {children}
    </a>
  );
}; 