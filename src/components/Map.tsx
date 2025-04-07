
import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useToast } from "@/hooks/use-toast";

// Fix Leaflet icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 38],
  iconAnchor: [12, 38],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom taxi icon
const taxiIcon = L.divIcon({
  className: 'taxi-marker-icon',
  html: '<div class="w-8 h-8 bg-taxi text-black flex items-center justify-center rounded-full shadow-lg">🚕</div>',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

// Custom user icon
const userIcon = L.divIcon({
  className: 'user-marker-icon',
  html: '<div class="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full shadow-lg">👤</div>',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

interface MapProps {
  onMapLoaded?: () => void;
  selectedTerminalId?: number;
}

interface Terminal {
  id: number;
  name: string;
  coordinates: [number, number];
  taxiCount: number;
  destinations: string[];
}

// Component to handle map center updates and route display
const MapController = ({ userLocation, terminals, selectedTerminalId }: { 
  userLocation: [number, number], 
  terminals: Terminal[],
  selectedTerminalId?: number 
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

const Map: React.FC<MapProps> = ({ onMapLoaded, selectedTerminalId }) => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [terminals, setTerminals] = useState<Terminal[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userCoords: [number, number] = [latitude, longitude]; // Note: Leaflet uses [lat, lng] instead of [lng, lat]
          setUserLocation(userCoords);

          // Example taxi terminals for demonstration
          // In a real app, these would come from your backend
          const demoTerminals = [
            {
              id: 1,
              name: "Central Taxi Terminal",
              coordinates: [latitude + 0.01, longitude + 0.01] as [number, number],
              taxiCount: 15,
              destinations: ["Downtown", "Airport", "Shopping Mall"]
            },
            {
              id: 2,
              name: "North Station Taxis",
              coordinates: [latitude - 0.008, longitude + 0.005] as [number, number],
              taxiCount: 8,
              destinations: ["City Center", "Beach", "University"]
            },
            {
              id: 3,
              name: "East Terminal",
              coordinates: [latitude + 0.015, longitude - 0.007] as [number, number],
              taxiCount: 12,
              destinations: ["Hospital", "Business Park", "Stadium"]
            }
          ];

          setTerminals(demoTerminals);
          
          if (onMapLoaded) onMapLoaded();
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            title: "Location Error",
            description: "Could not access your location. Please enable location services.",
            variant: "destructive",
          });
          
          // Use a default location if user location is not available
          setUserLocation([51.505, -0.09]); // Default to London
        }
      );
    } else {
      toast({
        title: "Location Error",
        description: "Geolocation is not supported by your browser.",
        variant: "destructive",
      });
      
      // Use a default location if geolocation is not supported
      setUserLocation([51.505, -0.09]); // Default to London
    }
  }, [onMapLoaded, toast]);

  // If user location is not available yet, show loading
  if (!userLocation) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading map...</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Please allow location access</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full rounded-lg overflow-hidden">
      <MapContainer 
        center={userLocation} 
        zoom={14} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* User location marker */}
        <Marker position={userLocation} icon={userIcon}>
          <Popup>
            <div className="text-center">
              <strong>Your Location</strong>
            </div>
          </Popup>
        </Marker>
        
        {/* Terminal markers */}
        {terminals.map((terminal) => (
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
        ))}
        
        {/* Map controller for routes and centering */}
        {userLocation && terminals.length > 0 && (
          <MapController 
            userLocation={userLocation} 
            terminals={terminals} 
            selectedTerminalId={selectedTerminalId} 
          />
        )}
      </MapContainer>
    </div>
  );
};

// Add the global showRoute function type
declare global {
  interface Window {
    showRoute: (terminalId: number) => void;
  }
}

export default Map;
