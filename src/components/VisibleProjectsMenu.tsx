import React, { useState } from 'react';
import type { Project } from '../types';
import { parseBudget } from '../utils';

interface VisibleProjectsMenuProps {
  projects: Project[];
}

const VisibleProjectsMenu: React.FC<VisibleProjectsMenuProps> = ({ projects }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const totalBudget = projects.reduce((sum, p) => sum + parseBudget(p.budget), 0);

  return (
    <div className={`visible-projects-menu ${isMinimized ? 'minimized' : ''}`}>
      <div className="menu-header">
        <div className="header-top">
          <h3>Visible Projects ({projects.length})</h3>
          <button 
            className="toggle-min-btn" 
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? '□' : '−'}
          </button>
        </div>
        {!isMinimized && (
          <div className="total-budget">
            Total: €{(totalBudget > 1000 ? totalBudget / 1000 : totalBudget).toFixed(2)} {totalBudget > 1000 ? 'Billion' : 'Million'}
          </div>
        )}
      </div>
      
      {!isMinimized && (
        <div className="projects-list">
          {projects.length === 0 ? (
            <p className="no-projects">No projects in view</p>
          ) : (
            projects.map(p => (
              <div key={p.id} className="project-list-item">
                <span className="p-name">{p.popular_name || p.name}</span>
                <span className="p-budget">{p.budget}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default VisibleProjectsMenu;
