
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Clock, 
  DollarSign, 
  Route, 
  ChevronRight,
  MapPin,
  AlertTriangle,
  Calendar
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { RideSharingOption, Booking } from '../map/types';
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface RideSharingOptionsProps {
  pickupLocation: [number, number];
  destination: string;
  onShareSelect: (sharingOption: RideSharingOption) => Promise<Booking | void>;
  onSkip: () => void;
}

const RideSharingOptions: React.FC<RideSharingOptionsProps> = ({
  pickupLocation,
  destination,
  onShareSelect,
  onSkip
}) => {
  const [sharingOptions, setSharingOptions] = useState<RideSharingOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSharingOptions = async () => {
      setIsLoading(true);
      try {
        if (window.findRideSharingOptions) {
          const options = await window.findRideSharingOptions(pickupLocation, destination);
          setSharingOptions(options);
        } else {
          // Create mock ride sharing options for demo
          setTimeout(() => {
            const mockOptions: RideSharingOption[] = [
              {
                id: 'share-1',
                originalBookingId: 'booking-1',
                availableSeats: 2,
                route: [pickupLocation, [pickupLocation[0] + 0.01, pickupLocation[1] + 0.01]],
                pickupTime: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
                destination: destination,
                potentialSavings: 25, // 25% savings
                detourTime: 3 // 3 minutes detour
              },
              {
                id: 'share-2',
                originalBookingId: 'booking-2',
                availableSeats: 1,
                route: [pickupLocation, [pickupLocation[0] - 0.01, pickupLocation[1] - 0.01]],
                pickupTime: new Date(Date.now() + 8 * 60 * 1000), // 8 minutes from now
                destination: destination,
                potentialSavings: 35, // 35% savings
                detourTime: 6 // 6 minutes detour
              }
            ];
            
            // Only add a third option 50% of the time to simulate variability
            if (Math.random() > 0.5) {
              mockOptions.push({
                id: 'share-3',
                originalBookingId: 'booking-3',
                availableSeats: 3,
                route: [pickupLocation, [pickupLocation[0] + 0.005, pickupLocation[1] - 0.008]],
                pickupTime: new Date(Date.now() + 12 * 60 * 1000), // 12 minutes from now
                destination: destination,
                potentialSavings: 40, // 40% savings
                detourTime: 8 // 8 minutes detour
              });
            }
            
            setSharingOptions(mockOptions);
          }, 1500); // Simulate API delay
        }
      } catch (error) {
        console.error("Error fetching ride sharing options:", error);
        toast({
          title: "Error",
          description: "Could not fetch ride sharing options. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSharingOptions();
  }, [pickupLocation, destination, toast]);

  const handleSelectOption = async (option: RideSharingOption) => {
    setSelectedOption(option.id);
    setIsProcessing(true);
    
    try {
      await onShareSelect(option);
      toast({
        title: "Ride Sharing Selected",
        description: `You'll save ${option.potentialSavings}% by sharing this ride!`,
      });
    } catch (error) {
      console.error("Error selecting ride share:", error);
      toast({
        title: "Error",
        description: "Could not book shared ride. Please try again.",
        variant: "destructive",
      });
      setSelectedOption(null);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <div>
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        {[1, 2].map((i) => (
          <div key={i} className="border rounded-lg p-4">
            <Skeleton className="h-5 w-4/5 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-4" />
            <div className="flex justify-between">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (sharingOptions.length === 0) {
    return (
      <div className="p-4 text-center">
        <Users className="mx-auto text-gray-400 mb-2" size={32} />
        <h3 className="font-medium text-lg mb-1">No sharing options</h3>
        <p className="text-gray-500 text-sm mb-4">
          There are no matching rides to share at this time
        </p>
        <Button onClick={onSkip}>Continue with Private Ride</Button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h3 className="font-medium text-lg">Ride Sharing Options</h3>
      <p className="text-sm text-gray-500 mb-4">
        Share your ride with others going in the same direction to save money
      </p>
      
      <div className="space-y-3">
        {sharingOptions.map((option) => (
          <div 
            key={option.id}
            className={`border rounded-lg p-3 transition-all ${
              selectedOption === option.id 
                ? 'border-primary bg-primary/5' 
                : 'hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            <div className="flex items-center mb-2">
              <div className="bg-green-100 dark:bg-green-800/30 text-green-800 dark:text-green-300 px-2 py-1 rounded text-xs font-medium flex items-center">
                <DollarSign className="h-3 w-3 mr-1" />
                Save {option.potentialSavings}%
              </div>
              <div className="ml-2 text-sm text-gray-500 flex items-center">
                <Users className="h-3 w-3 mr-1" />
                {option.availableSeats} {option.availableSeats === 1 ? 'seat' : 'seats'} available
              </div>
            </div>
            
            <div className="flex items-center text-sm mb-2">
              <Clock className="h-4 w-4 mr-1 text-gray-500" />
              <span>Pickup in {Math.round((option.pickupTime.getTime() - Date.now()) / 60000)} minutes</span>
              {option.detourTime > 0 && (
                <>
                  <span className="mx-1">•</span>
                  <AlertTriangle className="h-3 w-3 mr-1 text-yellow-500" />
                  <span className="text-yellow-700 dark:text-yellow-500">
                    {option.detourTime} min detour
                  </span>
                </>
              )}
            </div>
            
            <div className="flex justify-between mt-3">
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs flex items-center"
                onClick={() => {
                  toast({
                    title: "Route Preview",
                    description: "In a real app, this would show the shared route on the map",
                  });
                }}
              >
                <Route className="h-3 w-3 mr-1" />
                See Route
              </Button>
              
              <Button 
                size="sm"
                onClick={() => handleSelectOption(option)}
                disabled={isProcessing}
                className="text-xs"
              >
                {selectedOption === option.id && isProcessing 
                  ? "Processing..." 
                  : "Select"
                }
              </Button>
            </div>
          </div>
        ))}
        
        <div className="pt-2 text-center">
          <Button variant="ghost" onClick={onSkip} disabled={isProcessing}>
            Skip Sharing
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RideSharingOptions;
