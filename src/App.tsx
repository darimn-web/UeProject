import React, { useState, useMemo, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import './App.css';
import importantProjects from './data/projects.json';
import otherProjects from './data/others.json';
import littleProjects from './data/little_projects.json';
import type { Project } from './types';
import MapContainer from './components/MapContainer';
import ProjectDetails from './components/ProjectDetails';
import VisibleProjectsMenu from './components/VisibleProjectsMenu';

// Fix for default marker icons
// @ts-ignore
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
  const [viewMode, setViewMode] = useState<'important' | 'others' | 'little'>('important');
  const [visibleBounds, setVisibleBounds] = useState<L.LatLngBounds | null>(null);

  const currentDataset = useMemo(() => {
    if (viewMode === 'important') return importantProjects as Project[];
    if (viewMode === 'others') return otherProjects as Project[];
    return littleProjects as Project[];
  }, [viewMode]);

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All') return currentDataset;
    return currentDataset.filter(p => p.category === activeCategory);
  }, [activeCategory, currentDataset]);

  const visibleProjects = useMemo(() => {
    if (!visibleBounds) return [];
    return filteredProjects.filter(p => 
      visibleBounds.contains(L.latLng(p.coordinates[0], p.coordinates[1]))
    );
  }, [filteredProjects, visibleBounds]);

  const handleBoundsChange = useCallback((bounds: L.LatLngBounds) => {
    setVisibleBounds(bounds);
  }, []);

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

      <div className="button-controls">
        <button 
          className="big-red-button main-toggle"
          onClick={() => {
            if (viewMode === 'important') setViewMode('others');
            else setViewMode('important');
            setSelectedProject(null);
            setActiveCategory('All');
          }}
        >
          {viewMode === 'important' ? 'Others' : 'Important'}
        </button>

        <button 
          className={`big-red-button little-projects-btn ${viewMode === 'little' ? 'active' : ''}`}
          onClick={() => {
            setViewMode('little');
            setSelectedProject(null);
            setActiveCategory('All');
          }}
        >
          Little Projects
        </button>
      </div>

      <VisibleProjectsMenu projects={visibleProjects} />

      <MapContainer 
        projects={filteredProjects}
        onProjectSelect={setSelectedProject}
        selectedProject={selectedProject}
        onBoundsChange={handleBoundsChange}
      />

      <ProjectDetails 
        project={selectedProject as Project} 
        onClose={() => setSelectedProject(null)} 
      />
    </div>
  );
};

export default App;
