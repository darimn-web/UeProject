import React, { useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import './App.css';
import projectsData from './data/projects.json';
import type { Project } from './types';
import MapContainer from './components/MapContainer';
import ProjectDetails from './components/ProjectDetails';

// Fix for default marker icons in Leaflet with Webpack/Vite
// @ts-expect-error: Leaflet's Default.prototype._getIconUrl is not recognized by TS but needs deletion for custom icon setup
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const categories = ['All', 'Infrastructure', 'Culture', 'Health', 'Environment', 'Education'];

const App: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All') return projectsData as Project[];
    return (projectsData as Project[]).filter(p => p.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="app-container">
      <div className="filter-bar">
        {categories.map(cat => (
          <button 
            key={cat}
            className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => {
              setActiveCategory(cat);
              setSelectedProject(null);
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <MapContainer 
        projects={filteredProjects}
        onProjectSelect={setSelectedProject}
        selectedProject={selectedProject}
      />

      <ProjectDetails 
        project={selectedProject as Project} 
        onClose={() => setSelectedProject(null)} 
      />
    </div>
  );
};

export default App;
