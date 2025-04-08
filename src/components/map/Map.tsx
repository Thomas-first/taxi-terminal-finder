
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useToast } from "@/hooks/use-toast";
import { MapProps, Terminal } from './types';
import LoadingIndicator from './LoadingIndicator';
import TerminalMarker from './TerminalMarker';
import UserLocationMarker from './UserLocationMarker';
import MapController from './MapController';
import { setupDefaultIcon } from './MapIcons';

// Initialize default icon
setupDefaultIcon();

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
    return <LoadingIndicator />;
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
        <UserLocationMarker position={userLocation} />
        
        {/* Terminal markers */}
        {terminals.map((terminal) => (
          <TerminalMarker 
            key={terminal.id} 
            terminal={terminal} 
            isSelected={terminal.id === selectedTerminalId}
          />
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

export default Map;
