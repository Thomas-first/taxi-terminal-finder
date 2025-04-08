
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useToast } from "@/hooks/use-toast";
import { MapProps, Terminal } from './types';
import LoadingIndicator from './LoadingIndicator';
import TerminalMarker from './TerminalMarker';
import UserLocationMarker from './UserLocationMarker';
import MapController from './MapController';
import { setupDefaultIcon } from './MapIcons';
import AdminButton from '../admin/AdminButton';

// Initialize default icon
setupDefaultIcon();

// Map Click Handler component
const MapClickHandler = ({ 
  isAdminMode, 
  onLocationSelect 
}: { 
  isAdminMode: boolean, 
  onLocationSelect: (lat: number, lng: number) => void 
}) => {
  const map = useMapEvents({
    click: (e) => {
      if (isAdminMode) {
        const { lat, lng } = e.latlng;
        onLocationSelect(lat, lng);
      }
    },
  });
  
  return null;
};

const Map: React.FC<MapProps> = ({ onMapLoaded, selectedTerminalId }) => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [terminals, setTerminals] = useState<Terminal[]>([]);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);
  const { toast } = useToast();

  // Function to load terminals from localStorage and demo data
  const loadTerminals = () => {
    // Try to get admin terminals from localStorage
    const adminTerminalsJson = localStorage.getItem('adminTerminals');
    const adminTerminals: Terminal[] = adminTerminalsJson 
      ? JSON.parse(adminTerminalsJson) 
      : [];
    
    // Example taxi terminals if we have a user location
    let demoTerminals: Terminal[] = [];
    
    if (userLocation) {
      const [latitude, longitude] = userLocation;
      demoTerminals = [
        {
          id: 1,
          name: "Central Taxi Terminal",
          coordinates: [latitude + 0.01, longitude + 0.01] as [number, number],
          taxiCount: 15,
          destinations: ["Downtown", "Airport", "Shopping Mall"],
          prices: [
            { destination: "Downtown", price: 12.50 },
            { destination: "Airport", price: 25.00 },
            { destination: "Shopping Mall", price: 15.75 }
          ]
        },
        {
          id: 2,
          name: "North Station Taxis",
          coordinates: [latitude - 0.008, longitude + 0.005] as [number, number],
          taxiCount: 8,
          destinations: ["City Center", "Beach", "University"],
          prices: [
            { destination: "City Center", price: 10.00 },
            { destination: "Beach", price: 18.50 },
            { destination: "University", price: 13.25 }
          ]
        },
        {
          id: 3,
          name: "East Terminal",
          coordinates: [latitude + 0.015, longitude - 0.007] as [number, number],
          taxiCount: 12,
          destinations: ["Hospital", "Business Park", "Stadium"],
          prices: [
            { destination: "Hospital", price: 9.75 },
            { destination: "Business Park", price: 14.50 },
            { destination: "Stadium", price: 22.00 }
          ]
        }
      ];
    }
    
    // Combine admin and demo terminals
    setTerminals([...adminTerminals, ...demoTerminals]);
  };

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userCoords: [number, number] = [latitude, longitude];
          setUserLocation(userCoords);
          
          // Load terminals now that we have the user location
          loadTerminals();
          
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
          loadTerminals();
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
      loadTerminals();
    }
  }, [onMapLoaded, toast]);

  // Reload terminals when Admin mode changes or a new terminal is added
  useEffect(() => {
    if (userLocation) {
      loadTerminals();
    }
  }, [isAdminMode, userLocation]);

  // Handle location selection
  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedLocation([lat, lng]);
  };

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

        {/* Map click handler for admin mode */}
        <MapClickHandler isAdminMode={isAdminMode} onLocationSelect={handleLocationSelect} />
        
        {/* Selected location marker for new terminal */}
        {isAdminMode && selectedLocation && (
          <TerminalMarker 
            terminal={{
              id: 0,
              name: "New Terminal Location",
              coordinates: selectedLocation,
              taxiCount: 0,
              destinations: []
            }} 
            isNew={true}
          />
        )}
      </MapContainer>

      {/* Admin controls */}
      <AdminButton 
        onAdminModeChange={setIsAdminMode} 
        onLocationSelect={handleLocationSelect}
        selectedLocation={selectedLocation}
      />
    </div>
  );
};

export default Map;
