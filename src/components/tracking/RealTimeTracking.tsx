
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  Phone, 
  MessageSquare, 
  ChevronDown, 
  ChevronUp,
  Star,
  Navigation 
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Booking, Taxi } from "../map/types";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { setupDefaultIcon } from '../map/MapIcons';
import L from 'leaflet';

// Initialize default icon
setupDefaultIcon();

interface RealTimeTrackingProps {
  booking: Booking;
  taxi?: Taxi;
  onViewDetails?: () => void;
}

interface AnimatedMarkerProps {
  positions: [number, number][];
  interval: number;
}

// Component to animate the taxi position on the map
const AnimatedMarker: React.FC<AnimatedMarkerProps> = ({ positions, interval }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const map = useMap();
  
  useEffect(() => {
    if (positions.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % positions.length;
        return newIndex;
      });
    }, interval);
    
    return () => clearInterval(timer);
  }, [positions, interval]);
  
  useEffect(() => {
    if (positions.length > 0) {
      map.panTo(positions[currentIndex]);
    }
  }, [currentIndex, map, positions]);
  
  if (positions.length === 0) return null;
  
  // Create a custom taxi icon
  const taxiIcon = L.divIcon({
    className: "custom-taxi-icon",
    html: `<div class="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
        <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
        <path d="M5 9l2 -4h8l2 4"></path>
        <path d="M5 9h12v4a4 4 0 0 1 -4 4h-4a4 4 0 0 1 -4 -4v-4z"></path>
      </svg>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
  
  return <Marker position={positions[currentIndex]} icon={taxiIcon}>
    <Popup>Your taxi is on the way!</Popup>
  </Marker>;
};

// Main component
const RealTimeTracking: React.FC<RealTimeTrackingProps> = ({ 
  booking, 
  taxi, 
  onViewDetails 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState(5);
  const [distance, setDistance] = useState(1.2);
  const { toast } = useToast();
  
  // Sample route for animation (would normally come from a routing service)
  const generateRoute = (): [number, number][] => {
    // Start from the taxi's current location or default
    const start = taxi?.currentLocation || [51.505, -0.09];
    // End at the booking's pickup location
    const end = booking.pickupLocation;
    
    // Create a linear path between start and end with intermediate points
    const steps = 10;
    const latStep = (end[0] - start[0]) / steps;
    const lngStep = (end[1] - start[1]) / steps;
    
    // Add a bit of randomness to each point to make it look more like a road
    const route: [number, number][] = [];
    for (let i = 0; i <= steps; i++) {
      const randomLat = (Math.random() - 0.5) * 0.002;
      const randomLng = (Math.random() - 0.5) * 0.002;
      
      route.push([
        start[0] + latStep * i + randomLat,
        start[1] + lngStep * i + randomLng
      ]);
    }
    
    // Make sure the last point is exactly the destination
    route[route.length - 1] = end;
    
    return route;
  };
  
  const routePositions = generateRoute();
  
  const handleContact = () => {
    toast({
      title: "Contact initiated",
      description: "Calling your driver...",
    });
  };
  
  const handleMessage = () => {
    toast({
      title: "Message",
      description: "Message system opened. Your driver will be notified.",
    });
  };
  
  // Countdown for arrival time
  useEffect(() => {
    if (estimatedTime <= 0) return;
    
    const timer = setInterval(() => {
      setEstimatedTime(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          toast({
            title: "Driver arrived",
            description: "Your taxi has arrived at the pickup location!",
          });
          return 0;
        }
        return prev - 1;
      });
      
      // Decrease distance as driver gets closer
      setDistance(prev => Math.max(0, prev - 0.2));
      
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, [estimatedTime, toast]);

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="bg-primary text-white rounded-t-lg">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Real-Time Driver Tracking</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-primary/90"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </Button>
        </div>
        <CardDescription className="text-white/80">
          Track your driver in real-time
        </CardDescription>
      </CardHeader>
      <CardContent className={`transition-all duration-300 ${isExpanded ? 'max-h-96' : 'max-h-0 overflow-hidden p-0'}`}>
        <div className="w-full h-64 bg-gray-100 rounded-lg mt-4 overflow-hidden">
          <MapContainer 
            center={booking.pickupLocation} 
            zoom={14} 
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Pickup location marker */}
            <Marker position={booking.pickupLocation}>
              <Popup>Pickup Location</Popup>
            </Marker>
            
            {/* Animated taxi position */}
            <AnimatedMarker positions={routePositions} interval={2000} />
          </MapContainer>
        </div>
        
        {taxi && (
          <div className="mt-4 p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="font-bold text-gray-600">{taxi.driverName.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-medium">{taxi.driverName}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Star size={14} className="text-yellow-500 mr-1" />
                    {taxi.rating.toFixed(1)} • {taxi.vehicleType}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handleMessage}>
                  <MessageSquare size={16} />
                </Button>
                <Button size="sm" variant="outline" onClick={handleContact}>
                  <Phone size={16} />
                </Button>
              </div>
            </div>
            
            <div className="mt-4 text-sm">
              <p><span className="font-medium">License Plate:</span> {taxi.licensePlate}</p>
              <p>
                <span className="font-medium">Features:</span> {taxi.features.join(", ")}
              </p>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="justify-between bg-gray-50 rounded-b-lg p-4">
        <div className="flex items-center">
          <Clock className="text-primary mr-2" size={20} />
          <div>
            <p className="text-sm font-medium">Estimated Arrival</p>
            <p className="text-lg font-bold">{estimatedTime} min</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <Navigation className="text-primary mr-2" size={20} />
          <div>
            <p className="text-sm font-medium">Distance</p>
            <p className="text-lg font-bold">{distance.toFixed(1)} km</p>
          </div>
        </div>
        
        {onViewDetails && (
          <Button variant="outline" size="sm" onClick={onViewDetails}>
            View Details
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default RealTimeTracking;
