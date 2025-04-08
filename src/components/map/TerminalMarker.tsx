
import React, { useState } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Terminal } from './types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface TerminalMarkerProps {
  terminal: Terminal;
  isSelected?: boolean;
  isNew?: boolean;
}

const TerminalMarker: React.FC<TerminalMarkerProps> = ({ terminal, isSelected, isNew }) => {
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  
  // Create custom taxi icon
  const taxiIcon = L.divIcon({
    className: 'taxi-marker-icon',
    html: `<div class="w-8 h-8 ${isSelected ? 'bg-primary' : isNew ? 'bg-green-500' : 'bg-taxi'} text-black flex items-center justify-center rounded-full shadow-lg ${isSelected ? 'scale-125' : ''} transition-transform duration-200">${isNew ? '📍' : '🚕'}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });

  // Get price for a specific destination
  const getPriceForDestination = (destination: string) => {
    if (!terminal.prices) return 'N/A';
    const priceInfo = terminal.prices.find(p => p.destination === destination);
    return priceInfo ? `$${priceInfo.price.toFixed(2)}` : 'N/A';
  };

  // Handle selecting a destination for booking
  const handleSelectDestination = (destination: string) => {
    setSelectedDestination(destination);
    window.showRoute(terminal.id);
  };

  return (
    <Marker position={terminal.coordinates} icon={taxiIcon}>
      {!isNew && (
        <Popup className="taxi-popup" minWidth={300}>
          <div className="p-2">
            <h3 className="font-bold text-base">{terminal.name}</h3>
            <p className="text-sm mt-1">Available taxis: {terminal.taxiCount}</p>
            
            {terminal.destinations.length > 0 && (
              <div className="mt-3">
                <h4 className="font-semibold text-sm">Destinations & Pricing</h4>
                <Table className="mt-1">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/2 py-2">Destination</TableHead>
                      <TableHead className="w-1/4 py-2">Price</TableHead>
                      <TableHead className="w-1/4 py-2"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {terminal.destinations.map((destination, index) => (
                      <TableRow key={index}>
                        <TableCell className="py-1">{destination}</TableCell>
                        <TableCell className="py-1">{getPriceForDestination(destination)}</TableCell>
                        <TableCell className="py-1">
                          <button 
                            className="px-2 py-1 bg-primary text-white rounded text-xs hover:bg-primary/80 transition-colors"
                            onClick={() => handleSelectDestination(destination)}
                          >
                            Book
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            
            {selectedDestination && (
              <div className="mt-3 p-2 bg-gray-100 dark:bg-gray-700 rounded">
                <p className="text-sm font-medium">Selected: {selectedDestination}</p>
                <p className="text-xs mt-1">Price: {getPriceForDestination(selectedDestination)}</p>
              </div>
            )}
          </div>
        </Popup>
      )}
    </Marker>
  );
};

export default TerminalMarker;
