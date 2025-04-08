
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
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [routeInfo, setRouteInfo] = useState<{distance: string, duration: string} | null>(null);
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
        fetchRoute(userLocation, selectedTerminal.coordinates);
      }
    } else {
      // Clear route if no terminal is selected
      setRoute([]);
      setRouteInfo(null);
    }
  }, [selectedTerminalId, userLocation, terminals]);
  
  // Fetch route using OSRM API
  const fetchRoute = async (start: [number, number], end: [number, number]) => {
    setIsLoadingRoute(true);
    try {
      // OSRM API expects coordinates as [longitude, latitude]
      const startCoord = `${start[1]},${start[0]}`;
      const endCoord = `${end[1]},${end[0]}`;
      
      // Using the OSRM demo server - in production, you might want to use your own or a commercial service
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${startCoord};${endCoord}?overview=full&geometries=geojson`
      );
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      
      if (data.routes && data.routes.length > 0) {
        // Extract the coordinates from the GeoJSON response
        const routeCoordinates = data.routes[0].geometry.coordinates.map(
          (coord: [number, number]) => [coord[1], coord[0]] as [number, number]
        );
        
        setRoute(routeCoordinates);
        
        // Fit bounds to show the route
        const bounds = L.latLngBounds(
          routeCoordinates.map(coord => L.latLng(coord[0], coord[1]))
        );
        map.fitBounds(bounds, { padding: [100, 100] });
        
        // Calculate route info
        const distance = (data.routes[0].distance / 1000).toFixed(1); // km
        const duration = Math.round(data.routes[0].duration / 60); // minutes
        
        const routeInfoData = {
          distance: `${distance} km`,
          duration: `${duration} min`
        };
        
        setRouteInfo(routeInfoData);
        
        toast({
          title: "Route Information",
          description: `Distance: ${distance} km • Approx. ${duration} min by car`,
        });
      } else {
        throw new Error('No routes found');
      }
    } catch (error) {
      console.error('Error calculating route:', error);
      toast({
        title: "Route Error",
        description: "Could not calculate route to this terminal. Using straight line instead.",
        variant: "destructive",
      });
      
      // Fallback to straight line if routing fails
      const straightLineRoute = [start, end];
      setRoute(straightLineRoute);
      
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
      
      const routeInfoData = {
        distance: `${distance.toFixed(1)} km (straight line)`,
        duration: `~${estimatedMinutes} min (estimate)`
      };
      
      setRouteInfo(routeInfoData);
    }
    setIsLoadingRoute(false);
  };
  
  // Provide global function to show route
  useEffect(() => {
    window.showRoute = (terminalId: number) => {
      const selectedTerminal = terminals.find(t => t.id === terminalId);
      if (selectedTerminal && userLocation) {
        fetchRoute(userLocation, selectedTerminal.coordinates);
      }
    };
    
    return () => {
      window.showRoute = () => {}; // Clear global function on unmount
    };
  }, [terminals, userLocation]);
  
  return (
    <>
      {isLoadingRoute && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow z-50">
          <div className="flex items-center space-x-2">
            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
            <span className="text-sm">Calculating route...</span>
          </div>
        </div>
      )}
      
      {routeInfo && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow z-50">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className="font-medium">🚕</span>
              <span className="ml-1 text-sm">{routeInfo.distance}</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium">⏱️</span>
              <span className="ml-1 text-sm">{routeInfo.duration}</span>
            </div>
          </div>
        </div>
      )}
      
      {route.length > 0 && (
        <Polyline 
          positions={route} 
          color="#3887be" 
          weight={5} 
          opacity={0.7} 
          lineCap="round"
          lineJoin="round"
        />
      )}
    </>
  );
};

export default MapController;
