import React, { useState } from 'react';
import { projects, projectCategories, Project } from '../data/projectsData';

interface PersonalGame {
  id: string;
  title: string;
  year: string;
  description: string;
  technologies: string[];
  gameUrl: string;
}

interface ProjectsShowcaseProps {
  isVisible: boolean;
  minimal?: boolean;
  onPlayGame?: (gameUrl: string, gameTitle: string) => void;
}

const personalGames: PersonalGame[] = [
  {
    id: 'mecano-game',
    title: 'Mecano Game',
    year: '2025',
    description: 'Juego web interactivo desarrollado con JavaScript vanilla. Una experiencia de juego mecánico con física y animaciones fluidas.',
    technologies: ['JavaScript', 'HTML5', 'CSS3'],
    gameUrl: 'https://mecano-game.netlify.app'
  },
  {
    id: 'run-ninja-run',
    title: 'Run Ninja Run',
    year: '2025',
    description: 'Desarrollo integral de un juego hecho con Pixi.js y TypeScript, asistido con inteligencia artificial. Juego de plataformas con mecánicas dinámicas.',
    technologies: ['Pixi.js', 'TypeScript', 'AI-Assisted'],
    gameUrl: 'https://upit.com/@argentinardo/play/iS4sHgHhbG'
  }
];

const ProjectsShowcase: React.FC<ProjectsShowcaseProps> = ({ isVisible, minimal = false, onPlayGame }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  const categories = [
    { id: 'all', name: 'Todos los Proyectos' },
    ...Object.entries(projectCategories).map(([key, name]) => ({ id: key, name }))
  ];

  if (!isVisible) return null;

  if (minimal) {
    return (
      <div className="projects-minimal">
        <h2 className="projects-minimal-title">Proyectos Personales</h2>
        {personalGames.map((game) => (
          <div key={game.id} className="project-minimal-card" data-id={game.id}>
            <div className="project-minimal-header">
              <h3 className="project-minimal-title">{game.title}</h3>
              <span className="project-minimal-year">{game.year}</span>
            </div>
            <p className="project-minimal-description">
              {game.description}
            </p>
            <div className="project-minimal-tech">
              {game.technologies.map((tech) => (
                <span key={tech} className="tech-tag">{tech}</span>
              ))}
            </div>
            <div className="project-minimal-links">
              {onPlayGame ? (
                <button 
                  onClick={() => onPlayGame(game.gameUrl, game.title)}
                  className="project-minimal-link"
                  type="button"
                >
                  🎮 Jugar Demo
                </button>
              ) : (
                <a 
                  href={game.gameUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="project-minimal-link"
                >
                  🌐 Jugar Demo
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="projects-showcase">
      {/* Filtros de categorías */}
      <div className="project-filters" role="tablist" aria-label="Filtrar proyectos por categoría">
        {categories.map(category => (
          <button
            key={category.id}
            className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
            role="tab"
            aria-selected={selectedCategory === category.id}
            aria-controls="projects-grid"
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Grid de proyectos */}
      <div className="projects-grid" id="projects-grid" role="tabpanel" aria-label="Lista de proyectos">
        {filteredProjects.map(project => (
          <article
            key={project.id}
            className="project-card"
            onClick={() => setSelectedProject(project)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setSelectedProject(project);
              }
            }}
            tabIndex={0}
            role="button"
            aria-label={`Ver detalles de ${project.title}`}
          >
            <div className="project-header">
              <h3 className="project-title">{project.title}</h3>
              <span className="project-year">{project.year}</span>
            </div>
            
            <p className="project-description">{project.description}</p>
            
            <div className="project-technologies" aria-label="Tecnologías utilizadas">
              {project.technologies.slice(0, 3).map(tech => (
                <span key={tech} className="tech-tag">{tech}</span>
              ))}
              {project.technologies.length > 3 && (
                <span className="tech-tag more">+{project.technologies.length - 3}</span>
              )}
            </div>

            <div className="project-category">
              <span className="category-badge">{projectCategories[project.category]}</span>
            </div>
          </article>
        ))}
      </div>

      {/* Modal de proyecto detallado */}
      {selectedProject && (
        <div 
          className="project-modal-overlay" 
          onClick={() => setSelectedProject(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <div className="project-modal" onClick={e => e.stopPropagation()}>
            <button 
              className="modal-close"
              onClick={() => setSelectedProject(null)}
              aria-label="Cerrar modal"
            >
              ×
            </button>
            
            <div className="modal-content">
              <div className="modal-header">
                <h2 id="modal-title">{selectedProject.title}</h2>
                <span className="modal-year">{selectedProject.year}</span>
              </div>
              
              <p className="modal-description" id="modal-description">{selectedProject.description}</p>
              
              <div className="modal-technologies">
                <h4>Tecnologías utilizadas:</h4>
                <div className="tech-list" role="list">
                  {selectedProject.technologies.map(tech => (
                    <span key={tech} className="tech-item" role="listitem">{tech}</span>
                  ))}
                </div>
              </div>
              
              <div className="modal-links">
                {selectedProject.liveUrl && (
                  <a 
                    href={selectedProject.liveUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="modal-link live"
                    aria-label={`Ver demo de ${selectedProject.title}`}
                  >
                    🌐 Ver Demo
                  </a>
                )}
                {selectedProject.githubUrl && (
                  <a 
                    href={selectedProject.githubUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="modal-link github"
                    aria-label={`Ver código de ${selectedProject.title} en GitHub`}
                  >
                    📁 Ver Código
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsShowcase; 