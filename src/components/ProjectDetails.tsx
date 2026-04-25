import React from 'react';
import type { Project } from '../types';

interface ProjectDetailsProps {
  project: Project;
  onClose: () => void;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project, onClose }) => {
  return (
    <div className={`details-panel ${project ? 'active' : ''}`}>
      <button className="close-btn" onClick={onClose}>&times;</button>
      {project && (
        <>
          <h2>{project.popular_name || project.name}</h2>
          <div className="project-info-item">
            <span className="tag">{project.category}</span>
            <span className="tag year-tag">Funded in {project.year}</span>
          </div>
          
          <div className="project-info-item">
            <label>How the EU helped</label>
            <p>{project.description}</p>
          </div>

          <div className="project-info-item">
            <label>Key Impact</label>
            <p>{project.impact}</p>
          </div>

          <div className="project-info-item" style={{ display: 'flex', gap: '20px' }}>
            <div>
              <label>Total Budget</label>
              <p>{project.budget}</p>
            </div>
            <div>
              <label>EU Contribution</label>
              <p style={{ color: '#003399', fontWeight: 'bold' }}>{project.eu_contribution}</p>
            </div>
          </div>

          {project.official_link && (
            <div className="project-info-item" style={{ marginTop: '24px', borderTop: '1px solid #eee', paddingTop: '16px' }}>
              <a 
                href={project.official_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="eu-link"
              >
                View Official Project Documentation →
              </a>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProjectDetails;
