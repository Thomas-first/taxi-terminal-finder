
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useToast } from "@/hooks/use-toast";

// This token would need to be replaced with your actual Mapbox token
const MAPBOX_TOKEN = "YOUR_MAPBOX_TOKEN";

interface MapProps {
  onMapLoaded?: () => void;
}

const Map: React.FC<MapProps> = ({ onMapLoaded }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapTokenInput, setMapTokenInput] = useState("");
  const [mapToken, setMapToken] = useState<string | null>(
    localStorage.getItem('mapbox_token') || MAPBOX_TOKEN
  );
  const [showTokenInput, setShowTokenInput] = useState(!localStorage.getItem('mapbox_token') && MAPBOX_TOKEN === "YOUR_MAPBOX_TOKEN");
  const { toast } = useToast();

  useEffect(() => {
    if (showTokenInput || !mapToken || mapToken === "YOUR_MAPBOX_TOKEN") {
      return;
    }

    if (!mapContainer.current) return;

    mapboxgl.accessToken = mapToken;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [0, 0], // Will be updated when we get user location
        zoom: 2,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      map.current.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
      }));

      // Get user's location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { longitude, latitude } = position.coords;
            
            if (map.current) {
              map.current.flyTo({
                center: [longitude, latitude],
                zoom: 14,
                essential: true
              });

              // Add a marker for user's location
              new mapboxgl.Marker({ color: '#2563EB' })
                .setLngLat([longitude, latitude])
                .addTo(map.current);

              // Example taxi terminals for demonstration
              // In a real app, these would come from your backend
              const demoTerminals = [
                {
                  id: 1,
                  name: "Central Taxi Terminal",
                  coordinates: [longitude + 0.01, latitude + 0.01],
                  taxiCount: 15,
                  destinations: ["Downtown", "Airport", "Shopping Mall"]
                },
                {
                  id: 2,
                  name: "North Station Taxis",
                  coordinates: [longitude - 0.008, latitude + 0.005],
                  taxiCount: 8,
                  destinations: ["City Center", "Beach", "University"]
                },
                {
                  id: 3,
                  name: "East Terminal",
                  coordinates: [longitude + 0.015, latitude - 0.007],
                  taxiCount: 12,
                  destinations: ["Hospital", "Business Park", "Stadium"]
                }
              ];

              // Add markers for taxi terminals
              demoTerminals.forEach(terminal => {
                const el = document.createElement('div');
                el.className = 'flex items-center justify-center w-8 h-8 bg-taxi text-white font-bold rounded-full shadow-lg cursor-pointer hover:bg-taxi-dark transition-colors';
                el.innerHTML = '<span class="taxi-icon">🚕</span>';
                
                const popup = new mapboxgl.Popup({ offset: 25 })
                  .setHTML(`
                    <h3 class="font-bold text-base">${terminal.name}</h3>
                    <p class="text-sm mt-1">Available taxis: ${terminal.taxiCount}</p>
                    <p class="text-sm mt-1">Destinations: ${terminal.destinations.join(', ')}</p>
                    <button class="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors">View Details</button>
                  `);

                new mapboxgl.Marker(el)
                  .setLngLat(terminal.coordinates)
                  .setPopup(popup)
                  .addTo(map.current!);
              });
            }
          },
          (error) => {
            console.error("Error getting location:", error);
            toast({
              title: "Location Error",
              description: "Could not access your location. Please enable location services.",
              variant: "destructive",
            });
          }
        );
      }

      map.current.on('load', () => {
        if (onMapLoaded) onMapLoaded();
      });
    } catch (error) {
      console.error("Map initialization error:", error);
      toast({
        title: "Map Error",
        description: "There was an error loading the map. Please check your internet connection.",
        variant: "destructive",
      });
      setShowTokenInput(true);
    }

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [mapToken, showTokenInput, onMapLoaded, toast]);

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mapTokenInput.trim()) {
      localStorage.setItem('mapbox_token', mapTokenInput);
      setMapToken(mapTokenInput);
      setShowTokenInput(false);
      toast({
        title: "Success",
        description: "Map token saved successfully!",
      });
    } else {
      toast({
        title: "Error",
        description: "Please enter a valid Mapbox token.",
        variant: "destructive",
      });
    }
  };

  if (showTokenInput) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-center">Enter Mapbox Token</h2>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
            To use the map functionality, you need to provide a Mapbox token. You can get one for free at{" "}
            <a 
              href="https://account.mapbox.com/auth/signup/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Mapbox.com
            </a>
          </p>
          <form onSubmit={handleTokenSubmit}>
            <input
              type="text"
              value={mapTokenInput}
              onChange={(e) => setMapTokenInput(e.target.value)}
              placeholder="Enter your Mapbox token"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded mb-4"
              required
            />
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded hover:bg-primary/90 transition-colors"
            >
              Save Token
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <div ref={mapContainer} className="h-full w-full rounded-lg overflow-hidden" />;
};

export default Map;
