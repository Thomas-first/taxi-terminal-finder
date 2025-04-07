
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useToast } from "@/hooks/use-toast";

// This token would need to be replaced with your actual Mapbox token
const MAPBOX_TOKEN = "YOUR_MAPBOX_TOKEN";

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

const Map: React.FC<MapProps> = ({ onMapLoaded, selectedTerminalId }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapTokenInput, setMapTokenInput] = useState("");
  const [mapToken, setMapToken] = useState<string | null>(
    localStorage.getItem('mapbox_token') || MAPBOX_TOKEN
  );
  const [showTokenInput, setShowTokenInput] = useState(!localStorage.getItem('mapbox_token') && MAPBOX_TOKEN === "YOUR_MAPBOX_TOKEN");
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [terminals, setTerminals] = useState<Terminal[]>([]);
  const [routeDisplayed, setRouteDisplayed] = useState(false);
  const { toast } = useToast();

  // Effect to initialize the map
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
            const userCoords: [number, number] = [longitude, latitude];
            setUserLocation(userCoords);
            
            if (map.current) {
              map.current.flyTo({
                center: userCoords,
                zoom: 14,
                essential: true
              });

              // Add a marker for user's location
              new mapboxgl.Marker({ color: '#2563EB' })
                .setLngLat(userCoords)
                .addTo(map.current);

              // Example taxi terminals for demonstration
              // In a real app, these would come from your backend
              const demoTerminals = [
                {
                  id: 1,
                  name: "Central Taxi Terminal",
                  coordinates: [longitude + 0.01, latitude + 0.01] as [number, number],
                  taxiCount: 15,
                  destinations: ["Downtown", "Airport", "Shopping Mall"]
                },
                {
                  id: 2,
                  name: "North Station Taxis",
                  coordinates: [longitude - 0.008, latitude + 0.005] as [number, number],
                  taxiCount: 8,
                  destinations: ["City Center", "Beach", "University"]
                },
                {
                  id: 3,
                  name: "East Terminal",
                  coordinates: [longitude + 0.015, latitude - 0.007] as [number, number],
                  taxiCount: 12,
                  destinations: ["Hospital", "Business Park", "Stadium"]
                }
              ];

              setTerminals(demoTerminals);

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
                    <button 
                      class="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                      onclick="window.showRoute(${terminal.id})"
                    >
                      Show Route
                    </button>
                  `);

                new mapboxgl.Marker(el)
                  .setLngLat(terminal.coordinates)
                  .setPopup(popup)
                  .addTo(map.current!);
              });

              // Add a global function to handle route display
              window.showRoute = (terminalId: number) => {
                const selectedTerminal = demoTerminals.find(t => t.id === terminalId);
                if (selectedTerminal && userCoords) {
                  drawRoute(userCoords, selectedTerminal.coordinates);
                }
              };
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
        window.showRoute = () => {}; // Clear the global function
        map.current.remove();
      }
    };
  }, [mapToken, showTokenInput, onMapLoaded, toast]);

  // Effect to handle selected terminal from parent component
  useEffect(() => {
    if (selectedTerminalId && map.current && userLocation) {
      const selectedTerminal = terminals.find(t => t.id === selectedTerminalId);
      if (selectedTerminal) {
        drawRoute(userLocation, selectedTerminal.coordinates);
      }
    }
  }, [selectedTerminalId, userLocation, terminals]);

  // Function to draw a route between two points
  const drawRoute = async (start: [number, number], end: [number, number]) => {
    if (!map.current) return;

    // Remove previous route if it exists
    if (routeDisplayed && map.current.getSource('route')) {
      map.current.removeLayer('route');
      map.current.removeSource('route');
      setRouteDisplayed(false);
    }

    try {
      // Get directions from Mapbox
      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapToken}`
      );
      
      const json = await query.json();
      if (!json.routes || json.routes.length === 0) {
        throw new Error('No routes found');
      }
      
      const data = json.routes[0];
      const route = data.geometry.coordinates;
      
      if (map.current.getSource('route')) {
        (map.current.getSource('route') as mapboxgl.GeoJSONSource).setData({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: route
          }
        });
      } else {
        map.current.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: route
            }
          }
        });
        
        map.current.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#3887be',
            'line-width': 5,
            'line-opacity': 0.75
          }
        });
      }
      
      setRouteDisplayed(true);
      
      // Fit the map to show both points
      const bounds = new mapboxgl.LngLatBounds()
        .extend(start)
        .extend(end);
        
      map.current.fitBounds(bounds, {
        padding: 100,
        maxZoom: 15
      });
      
      // Display the distance and duration in a toast
      const distance = (data.distance / 1000).toFixed(1); // km
      const duration = Math.floor(data.duration / 60); // minutes
      
      toast({
        title: "Route Information",
        description: `Distance: ${distance} km • Approx. ${duration} min by car`,
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

// Add the global showRoute function type
declare global {
  interface Window {
    showRoute: (terminalId: number) => void;
  }
}

export default Map;
