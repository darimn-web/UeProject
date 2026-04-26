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
  const [isTierMenuOpen, setIsTierMenuOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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
      p.coordinates && 
      p.coordinates.length === 2 &&
      visibleBounds.contains(L.latLng(p.coordinates[0], p.coordinates[1]))
    );
  }, [filteredProjects, visibleBounds]);

  const handleBoundsChange = useCallback((bounds: L.LatLngBounds) => {
    setVisibleBounds(bounds);
  }, []);

  return (
    <div className="app-container">
      {/* Unified Control Menu - Top Left */}
      <div className={`control-menu-wrapper ${isTierMenuOpen ? 'open' : 'minimized'}`}>
        <button className="menu-toggle-btn tier-toggle" onClick={() => setIsTierMenuOpen(!isTierMenuOpen)}>
          {isTierMenuOpen ? 'Close Menu ×' : `${viewMode.toUpperCase()} ▾`}
        </button>
        {isTierMenuOpen && (
          <div className="menu-options">
            <button className={`sm-btn ${viewMode === 'important' ? 'active' : ''}`} onClick={() => {setViewMode('important'); setIsTierMenuOpen(false);}}>Important</button>
            <button className={`sm-btn ${viewMode === 'others' ? 'active' : ''}`} onClick={() => {setViewMode('others'); setIsTierMenuOpen(false);}}>Others</button>
            <button className={`sm-btn ${viewMode === 'little' ? 'active' : ''}`} onClick={() => {setViewMode('little'); setIsTierMenuOpen(false);}}>Little</button>
          </div>
        )}
      </div>

      {/* Expandable Filter Menu - Top Right */}
      <div className={`filter-menu-wrapper ${isFilterOpen ? 'open' : 'minimized'}`}>
        <button className="menu-toggle-btn filter-toggle" onClick={() => setIsFilterOpen(!isFilterOpen)}>
          {isFilterOpen ? 'Close ×' : 'Filters ☰'}
        </button>
        {isFilterOpen && (
          <div className="filter-options">
            {categories.map(cat => (
              <button 
                key={cat}
                className={`side-filter-btn sm-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => {setActiveCategory(cat); setIsFilterOpen(false);}}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
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
