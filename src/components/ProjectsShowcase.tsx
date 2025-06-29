import React, { useState } from 'react';
import { projects, projectCategories, Project } from '../data/projectsData';

interface ProjectsShowcaseProps {
  isVisible: boolean;
}

const ProjectsShowcase: React.FC<ProjectsShowcaseProps> = ({ isVisible }) => {
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

  return (
    <div className="projects-showcase">
      {/* Filtros de categorías */}
      <div className="project-filters">
        {categories.map(category => (
          <button
            key={category.id}
            className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Grid de proyectos */}
      <div className="projects-grid">
        {filteredProjects.map(project => (
          <div
            key={project.id}
            className="project-card"
            onClick={() => setSelectedProject(project)}
          >
            <div className="project-header">
              <h3 className="project-title">{project.title}</h3>
              <span className="project-year">{project.year}</span>
            </div>
            
            <p className="project-description">{project.description}</p>
            
            <div className="project-technologies">
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
          </div>
        ))}
      </div>

      {/* Modal de proyecto detallado */}
      {selectedProject && (
        <div className="project-modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="project-modal" onClick={e => e.stopPropagation()}>
            <button 
              className="modal-close"
              onClick={() => setSelectedProject(null)}
            >
              ×
            </button>
            
            <div className="modal-content">
              <div className="modal-header">
                <h2>{selectedProject.title}</h2>
                <span className="modal-year">{selectedProject.year}</span>
              </div>
              
              <p className="modal-description">{selectedProject.description}</p>
              
              <div className="modal-technologies">
                <h4>Tecnologías utilizadas:</h4>
                <div className="tech-list">
                  {selectedProject.technologies.map(tech => (
                    <span key={tech} className="tech-item">{tech}</span>
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