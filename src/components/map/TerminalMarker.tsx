
import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { taxiIcon } from './MapIcons';
import { Terminal } from './types';

interface TerminalMarkerProps {
  terminal: Terminal;
}

const TerminalMarker: React.FC<TerminalMarkerProps> = ({ terminal }) => {
  return (
    <Marker 
      key={terminal.id} 
      position={terminal.coordinates} 
      icon={taxiIcon}
    >
      <Popup>
        <div className="p-1">
          <h3 className="font-bold text-base">{terminal.name}</h3>
          <p className="text-sm mt-1">Available taxis: {terminal.taxiCount}</p>
          <p className="text-sm mt-1">Destinations: {terminal.destinations.join(', ')}</p>
          <button 
            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
            onClick={() => window.showRoute(terminal.id)}
          >
            Show Route
          </button>
        </div>
      </Popup>
    </Marker>
  );
};

export default TerminalMarker;
