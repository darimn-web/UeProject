import React, { useMemo, useEffect } from 'react';
import { MapContainer as LeafletMap, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import type { Project } from '../types';
import ProjectMarker from './ProjectMarker';

interface MapContainerProps {
  projects: Project[];
  onProjectSelect: (project: Project) => void;
  selectedProject: Project | null;
  onBoundsChange?: (bounds: L.LatLngBounds) => void;
}

const createClusterCustomIcon = (cluster: L.MarkerCluster) => {
  const count = cluster.getChildCount();
  let size: 'small' | 'medium' | 'large' = 'small';
  let pixels = 40;

  if (count > 50) {
    size = 'medium';
    pixels = 50;
  }
  if (count > 200) {
    size = 'large';
    pixels = 65;
  }

  return L.divIcon({
    html: `<div class="cluster-dot ${size}"><span>${count}</span></div>`,
    className: 'custom-marker-cluster',
    iconSize: L.point(pixels, pixels, true),
  });
};

const MapEvents: React.FC<{ onBoundsChange?: (bounds: L.LatLngBounds) => void }> = ({ onBoundsChange }) => {
  useMapEvents({
    moveend: (e) => {
      if (onBoundsChange) {
        onBoundsChange(e.target.getBounds());
      }
    },
    zoomend: (e) => {
      if (onBoundsChange) {
        onBoundsChange(e.target.getBounds());
      }
    },
  });
  return null;
};

const RecenterMap: React.FC<{ coords: [number, number] }> = ({ coords }) => {
  const map = useMap();
  
  useEffect(() => {
    if (coords) {
      map.setView(coords, map.getZoom(), {
        animate: true,
        duration: 1
      });
    }
  }, [coords, map]);

  return null;
};

const MapContainer: React.FC<MapContainerProps> = ({ projects, onProjectSelect, selectedProject, onBoundsChange }) => {
  const romaniaCenter: [number, number] = [45.9432, 24.9668];

  const markers = useMemo(() => {
    return projects.map((project) => (
      <ProjectMarker 
        key={project.id} 
        project={project} 
        onClick={() => onProjectSelect(project)}
      />
    ));
  }, [projects, onProjectSelect]);

  return (
    <div className="map-wrapper">
      <LeafletMap 
        center={romaniaCenter} 
        zoom={7} 
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapEvents onBoundsChange={onBoundsChange} />
        
        <MarkerClusterGroup
          chunkedLoading
          zoomToBoundsOnClick={true}
          iconCreateFunction={createClusterCustomIcon}
          showCoverageOnHover={false}
        >
          {markers}
        </MarkerClusterGroup>

        {selectedProject && <RecenterMap coords={selectedProject.coordinates} />}
      </LeafletMap>
    </div>
  );
};

export default MapContainer;
