import React from 'react';
import { Marker } from 'react-leaflet';
import L from 'leaflet';
import type { Project } from '../types';

interface ProjectMarkerProps {
  project: Project;
  onClick: () => void;
}

const getCategoryColor = (category: string): string => {
  switch (category.toLowerCase()) {
    case 'infrastructure': return '#003399'; // EU Blue
    case 'culture': return '#FF9900'; // Orange
    case 'health': return '#E63946'; // Red
    case 'environment': return '#2D6A4F'; // Green
    case 'education': return '#9B5DE5'; // Purple
    default: return '#666666';
  }
};

const createCustomIcon = (category: string) => {
  const color = getCategoryColor(category);
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background-color: ${color};
      width: 24px;
      height: 24px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 2px solid white;
      box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
  });
};

const ProjectMarker: React.FC<ProjectMarkerProps> = ({ project, onClick }) => {
  const customIcon = createCustomIcon(project.category);

  return (
    <Marker 
      position={project.coordinates}
      icon={customIcon}
      eventHandlers={{
        click: onClick,
      }}
    />
  );
};

export default ProjectMarker;
