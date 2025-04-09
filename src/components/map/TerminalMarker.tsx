import React, { useState } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Terminal, Taxi, Booking } from './types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, DollarSign, Star, Users, Car } from "lucide-react";
import SurgePricingIndicator from '../pricing/SurgePricingIndicator';
import DriverMatchingPanel from '../matching/DriverMatchingPanel';
import RideSharingOptions from '../sharing/RideSharingOptions';

interface TerminalMarkerProps {
  terminal: Terminal;
  isSelected?: boolean;
  isNew?: boolean;
  userLocation?: [number, number];
  onBookTaxi?: (destination: string, scheduled?: Date) => Promise<Booking>;
}

const TerminalMarker: React.FC<TerminalMarkerProps> = ({ 
  terminal, 
  isSelected, 
  isNew, 
  userLocation,
  onBookTaxi 
}) => {
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  const [showScheduler, setShowScheduler] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
  const [isBookingInProgress, setIsBookingInProgress] = useState(false);
  const [showDriverMatching, setShowDriverMatching] = useState(false);
  const [showRideSharing, setShowRideSharing] = useState(false);
  const [selectedTaxi, setSelectedTaxi] = useState<Taxi | null>(null);
  const { toast } = useToast();
  
  const taxiIcon = L.divIcon({
    className: 'taxi-marker-icon',
    html: `<div class="w-8 h-8 ${isSelected ? 'bg-primary' : isNew ? 'bg-green-500' : 'bg-taxi'} text-black flex items-center justify-center rounded-full shadow-lg ${isSelected ? 'scale-125' : ''} transition-transform duration-200">${isNew ? '📍' : '🚕'}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });

  const getPriceForDestination = (destination: string) => {
    if (!terminal.prices) return 'N/A';
    const priceInfo = terminal.prices.find(p => p.destination === destination);
    
    if (priceInfo && terminal.surgeMultiplier && terminal.surgeMultiplier > 1) {
      const basePrice = priceInfo.price;
      const surgePrice = basePrice * terminal.surgeMultiplier;
      return `$${surgePrice.toFixed(2)} (${terminal.surgeMultiplier}x surge)`;
    }
    
    return priceInfo ? `$${priceInfo.price.toFixed(2)}` : 'N/A';
  };

  const getDistanceFromUser = () => {
    if (!userLocation) return 'Unknown';
    
    const [lat1, lon1] = userLocation;
    const [lat2, lon2] = terminal.coordinates;
    
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return `${distance.toFixed(1)} km`;
  };

  const handleSelectDestination = (destination: string) => {
    setSelectedDestination(destination);
    window.showRoute(terminal.id);
  };

  const handleBookTaxi = async () => {
    if (!selectedDestination) return;
    
    if (terminal.rideSharingEnabled && !showRideSharing && !selectedTaxi) {
      setShowRideSharing(true);
      return;
    }
    
    if (terminal.availableTaxis && terminal.availableTaxis.length > 0 && !showDriverMatching && !selectedTaxi) {
      setShowDriverMatching(true);
      return;
    }
    
    setIsBookingInProgress(true);
    try {
      if (window.bookTaxi) {
        const booking = await window.bookTaxi(terminal.id, selectedDestination, scheduledDate || undefined);
        toast({
          title: scheduledDate ? "Taxi Scheduled" : "Taxi Booked",
          description: scheduledDate 
            ? `Your taxi to ${selectedDestination} is scheduled for ${scheduledDate.toLocaleString()}`
            : `Your taxi to ${selectedDestination} is on the way!`,
        });
        return booking;
      } else if (onBookTaxi) {
        const booking = await onBookTaxi(selectedDestination, scheduledDate || undefined);
        toast({
          title: scheduledDate ? "Taxi Scheduled" : "Taxi Booked",
          description: scheduledDate 
            ? `Your taxi to ${selectedDestination} is scheduled for ${scheduledDate.toLocaleString()}`
            : `Your taxi to ${selectedDestination} is on the way!`,
        });
        return booking;
      } else {
        toast({
          title: "Booking Simulation",
          description: `In a real app, we would now book a taxi to ${selectedDestination}${scheduledDate ? ' for ' + scheduledDate.toLocaleString() : ''}${selectedTaxi ? ' with driver ' + selectedTaxi.driverName : ''}`,
        });
      }
    } catch (error) {
      toast({
        title: "Booking Error",
        description: "There was a problem booking your taxi. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsBookingInProgress(false);
    }
  };

  const handleRideSharingSelect = async (sharingOption: any) => {
    try {
      toast({
        title: "Ride Sharing Selected",
        description: `You'll save ${sharingOption.potentialSavings}% by sharing this ride!`,
      });
      
      if (terminal.availableTaxis && terminal.availableTaxis.length > 0 && !selectedTaxi) {
        setShowRideSharing(false);
        setShowDriverMatching(true);
        return;
      }
      
      await handleBookTaxi();
    } catch (error) {
      console.error("Error selecting shared ride:", error);
      toast({
        title: "Error",
        description: "Could not book shared ride. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDriverSelect = (taxi: Taxi) => {
    setSelectedTaxi(taxi);
    setShowDriverMatching(false);
    
    setTimeout(() => {
      handleBookTaxi();
    }, 500);
  };

  const handleSurgePricingUpdate = (multiplier: number) => {
    console.log(`Surge pricing updated: ${multiplier}x`);
  };

  const renderTaxiDetails = (taxi: Taxi) => (
    <HoverCard key={taxi.id}>
      <HoverCardTrigger asChild>
        <Button size="sm" variant="ghost" className="flex items-center gap-1">
          <Car size={14} /> {taxi.vehicleType}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-64 p-3">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="font-semibold">{taxi.driverName}</span>
            <span className="flex items-center">
              <Star size={14} className="text-yellow-500 mr-1" />
              {taxi.rating.toFixed(1)}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            <p>License: {taxi.licensePlate}</p>
            <p className="flex items-center mt-1">
              <Users size={14} className="mr-1" /> {taxi.passengerCapacity} seats
            </p>
            {taxi.features.length > 0 && (
              <p className="mt-1">
                Features: {taxi.features.join(', ')}
              </p>
            )}
            {taxi.estimatedArrival && (
              <p className="mt-1 font-medium text-primary">
                ETA: {new Date(taxi.estimatedArrival).toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );

  return (
    <Marker position={terminal.coordinates} icon={taxiIcon}>
      {!isNew && (
        <Popup className="taxi-popup" minWidth={300}>
          <div className="p-2">
            <h3 className="font-bold text-base">{terminal.name}</h3>
            <div className="flex flex-wrap gap-2 mt-1 text-sm">
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                🚕 {terminal.taxiCount} taxis
              </span>
              {terminal.estimatedWaitTime && (
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                  ⏱️ {terminal.estimatedWaitTime} min wait
                </span>
              )}
              {userLocation && (
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                  📍 {getDistanceFromUser()}
                </span>
              )}
              {terminal.surgeMultiplier && terminal.surgeMultiplier > 1 && (
                <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 rounded-full">
                  🔥 {terminal.surgeMultiplier}x surge
                </span>
              )}
            </div>
            
            {terminal.surgeMultiplier === undefined && (
              <div className="mt-2">
                <SurgePricingIndicator 
                  terminal={terminal} 
                  onPricingUpdate={handleSurgePricingUpdate} 
                />
              </div>
            )}
            
            {terminal.availableTaxis && terminal.availableTaxis.length > 0 && !showDriverMatching && (
              <div className="mt-3">
                <h4 className="font-semibold text-sm">Available Taxis</h4>
                <div className="flex flex-wrap gap-1 mt-1">
                  {terminal.availableTaxis.slice(0, 3).map(renderTaxiDetails)}
                  {terminal.availableTaxis.length > 3 && (
                    <Button size="sm" variant="ghost">
                      +{terminal.availableTaxis.length - 3} more
                    </Button>
                  )}
                </div>
              </div>
            )}
            
            {terminal.destinations.length > 0 && !showDriverMatching && !showRideSharing && (
              <div className="mt-3">
                <h4 className="font-semibold text-sm">Destinations & Pricing</h4>
                <Table className="mt-1">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/3 py-2">Destination</TableHead>
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
                          <Button 
                            size="sm"
                            className="px-2 py-1 text-xs"
                            onClick={() => handleSelectDestination(destination)}
                          >
                            Book
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            
            {showDriverMatching && terminal.availableTaxis && terminal.availableTaxis.length > 0 && (
              <div className="mt-3">
                <DriverMatchingPanel 
                  availableTaxis={terminal.availableTaxis}
                  onDriverSelect={handleDriverSelect}
                />
              </div>
            )}
            
            {showRideSharing && userLocation && selectedDestination && (
              <div className="mt-3">
                <RideSharingOptions 
                  pickupLocation={userLocation}
                  destination={selectedDestination}
                  onShareSelect={handleRideSharingSelect}
                  onSkip={() => {
                    setShowRideSharing(false);
                    
                    if (terminal.availableTaxis && terminal.availableTaxis.length > 0) {
                      setShowDriverMatching(true);
                    } else {
                      handleBookTaxi();
                    }
                  }}
                />
              </div>
            )}
            
            {selectedDestination && !showDriverMatching && !showRideSharing && (
              <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-700 rounded">
                <h4 className="font-semibold text-sm">Booking Details</h4>
                <p className="text-sm mt-1">
                  <span className="font-medium">Destination:</span> {selectedDestination}
                </p>
                <p className="text-sm mt-1">
                  <span className="font-medium">Price:</span> {getPriceForDestination(selectedDestination)}
                </p>
                {userLocation && (
                  <p className="text-sm mt-1">
                    <span className="font-medium">Distance:</span> {getDistanceFromUser()}
                  </p>
                )}
                {selectedTaxi && (
                  <p className="text-sm mt-1">
                    <span className="font-medium">Driver:</span> {selectedTaxi.driverName} ({selectedTaxi.rating.toFixed(1)} ★)
                  </p>
                )}
                
                {!showScheduler ? (
                  <div className="flex gap-2 mt-3">
                    <Button 
                      size="sm"
                      className="flex-1"
                      onClick={handleBookTaxi}
                      disabled={isBookingInProgress}
                    >
                      Book Now
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setShowScheduler(true)}
                    >
                      Schedule
                    </Button>
                  </div>
                ) : (
                  <div className="mt-3 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-xs flex items-center gap-1"
                        onClick={() => {
                          const date = new Date();
                          date.setHours(date.getHours() + 1);
                          setScheduledDate(date);
                        }}
                      >
                        <Clock size={14} /> In 1 hour
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-xs flex items-center gap-1"
                        onClick={() => {
                          const date = new Date();
                          date.setHours(date.getHours() + 2);
                          setScheduledDate(date);
                        }}
                      >
                        <Clock size={14} /> In 2 hours
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-xs flex items-center gap-1"
                        onClick={() => {
                          const tomorrow = new Date();
                          tomorrow.setDate(tomorrow.getDate() + 1);
                          tomorrow.setHours(8, 0, 0, 0);
                          setScheduledDate(tomorrow);
                        }}
                      >
                        <Calendar size={14} /> Tomorrow 8AM
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-xs flex items-center gap-1"
                        onClick={() => {
                          const tomorrow = new Date();
                          tomorrow.setDate(tomorrow.getDate() + 1);
                          tomorrow.setHours(17, 0, 0, 0);
                          setScheduledDate(tomorrow);
                        }}
                      >
                        <Calendar size={14} /> Tomorrow 5PM
                      </Button>
                    </div>
                    
                    {scheduledDate && (
                      <p className="text-xs font-medium bg-primary/10 p-2 rounded">
                        Scheduled for: {scheduledDate.toLocaleString()}
                      </p>
                    )}
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm"
                        className="flex-1"
                        onClick={handleBookTaxi}
                        disabled={isBookingInProgress || !scheduledDate}
                      >
                        Confirm Schedule
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => {
                          setShowScheduler(false);
                          setScheduledDate(null);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </Popup>
      )}
    </Marker>
  );
};

export default TerminalMarker;
