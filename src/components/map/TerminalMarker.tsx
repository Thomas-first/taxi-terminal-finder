
import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Terminal } from './types';

interface TerminalMarkerProps {
  terminal: Terminal;
  isSelected?: boolean;
  isNew?: boolean;
}

const TerminalMarker: React.FC<TerminalMarkerProps> = ({ terminal, isSelected, isNew }) => {
  // Create custom taxi icon
  const taxiIcon = L.divIcon({
    className: 'taxi-marker-icon',
    html: `<div class="w-8 h-8 ${isSelected ? 'bg-primary' : isNew ? 'bg-green-500' : 'bg-taxi'} text-black flex items-center justify-center rounded-full shadow-lg ${isSelected ? 'scale-125' : ''} transition-transform duration-200">${isNew ? '📍' : '🚕'}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });

  return (
    <Marker position={terminal.coordinates} icon={taxiIcon}>
      {!isNew && (
        <Popup className="taxi-popup">
          <div className="p-1">
            <h3 className="font-bold text-base">{terminal.name}</h3>
            <p className="text-sm mt-1">Available taxis: {terminal.taxiCount}</p>
            <p className="text-sm mt-1">Destinations: {terminal.destinations.join(', ')}</p>
            <button 
              className="mt-2 px-3 py-1 bg-primary text-white rounded text-sm hover:bg-primary/80 transition-colors"
              onClick={() => window.showRoute(terminal.id)}
            >
              Show Route
            </button>
          </div>
        </Popup>
      )}
    </Marker>
  );
};

export default TerminalMarker;
