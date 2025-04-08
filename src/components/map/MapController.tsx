
import React, { useEffect, useState } from 'react';
import { useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { useToast } from "@/hooks/use-toast";
import { Terminal } from './types';

interface MapControllerProps {
  userLocation: [number, number];
  terminals: Terminal[];
  selectedTerminalId?: number;
}

const MapController: React.FC<MapControllerProps> = ({ 
  userLocation, 
  terminals, 
  selectedTerminalId 
}) => {
  const map = useMap();
  const [route, setRoute] = useState<[number, number][]>([]);
  const { toast } = useToast();
  
  // Center map on user location initially
  useEffect(() => {
    if (userLocation) {
      map.setView(userLocation, 14);
    }
  }, [map, userLocation]);
  
  // Handle selected terminal and route calculation
  useEffect(() => {
    if (selectedTerminalId && userLocation) {
      const selectedTerminal = terminals.find(t => t.id === selectedTerminalId);
      if (selectedTerminal) {
        calculateRoute(userLocation, selectedTerminal.coordinates);
      }
    } else {
      // Clear route if no terminal is selected
      setRoute([]);
    }
  }, [selectedTerminalId, userLocation, terminals]);
  
  // Calculate route (simplified for demo - in a real app, use a routing API)
  const calculateRoute = async (start: [number, number], end: [number, number]) => {
    try {
      // Simulate route calculation with straight line for demo
      // In a real app, use OSRM, GraphHopper, or other routing API
      const route = [start, end];
      setRoute(route);
      
      // Fit bounds to show both points
      const bounds = L.latLngBounds([
        L.latLng(start[0], start[1]),
        L.latLng(end[0], end[1])
      ]);
      map.fitBounds(bounds, { padding: [100, 100] });
      
      // Calculate straight-line distance and estimated duration
      const distance = map.distance(
        L.latLng(start[0], start[1]),
        L.latLng(end[0], end[1])
      ) / 1000; // Convert to km
      
      const estimatedMinutes = Math.round((distance / 30) * 60); // Assuming 30 km/h average speed
      
      // Show toast with route info
      toast({
        title: "Route Information",
        description: `Distance: ${distance.toFixed(1)} km • Approx. ${estimatedMinutes} min by car`,
      });
    } catch (error) {
      console.error('Error calculating route:', error);
      toast({
        title: "Route Error",
        description: "Could not calculate route to this terminal.",
        variant: "destructive",
      });
    }
  };
  
  // Provide global function to show route
  useEffect(() => {
    window.showRoute = (terminalId: number) => {
      const selectedTerminal = terminals.find(t => t.id === terminalId);
      if (selectedTerminal && userLocation) {
        calculateRoute(userLocation, selectedTerminal.coordinates);
      }
    };
    
    return () => {
      window.showRoute = () => {}; // Clear global function on unmount
    };
  }, [terminals, userLocation]);
  
  return (
    <>
      {route.length > 0 && (
        <Polyline 
          positions={route} 
          color="#3887be" 
          weight={5} 
          opacity={0.7} 
        />
      )}
    </>
  );
};

export default MapController;
