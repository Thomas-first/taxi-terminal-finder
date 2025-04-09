
import React, { useState } from 'react';
import { 
  Plane, 
  Train, 
  Bus, 
  Calendar, 
  Clock, 
  LinkIcon,
  Plus,
  ExternalLink,
  Check,
  AlertCircle,
  ChevronRight,
  MapPin
} from 'lucide-react';
import { TravelConnection, User } from '../map/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TravelConnectionsProps {
  user: User;
  onConnectionAdd?: (connection: TravelConnection) => void;
}

const TravelConnections: React.FC<TravelConnectionsProps> = ({ 
  user,
  onConnectionAdd
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [provider, setProvider] = useState<string>("");
  const [authCode, setAuthCode] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const connectToTravelApp = async () => {
    setIsConnecting(true);
    try {
      if (window.connectTravelApp) {
        const connections = await window.connectTravelApp(provider, authCode);
        if (connections.length > 0 && onConnectionAdd) {
          connections.forEach(connection => onConnectionAdd(connection));
        }
        toast({
          title: "Connected Successfully",
          description: `Linked ${connections.length} trips from ${provider}`,
        });
      } else {
        // Demo mode - create a mock connection
        setTimeout(() => {
          const mockConnection: TravelConnection = {
            id: `travel-${Date.now()}`,
            type: provider.toLowerCase().includes('air') ? 'flight' : 
                  provider.toLowerCase().includes('train') ? 'train' : 'bus',
            serviceProvider: provider,
            confirmationCode: authCode || 'DEMO123',
            departureTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // tomorrow
            arrivalTime: new Date(Date.now() + 25 * 60 * 60 * 1000), // tomorrow + 1h
            origin: "City Airport",
            destination: "Downtown Terminal",
            status: 'on-time',
            terminal: "Terminal A",
            gate: "Gate 12",
          };
          
          if (onConnectionAdd) {
            onConnectionAdd(mockConnection);
          }
          
          toast({
            title: "Connected Successfully",
            description: `Linked your ${provider} trip`,
          });
        }, 1500);
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error connecting travel app:", error);
      toast({
        title: "Connection Failed",
        description: "Could not connect to travel service. Please check your information and try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'flight':
        return <Plane className="h-4 w-4" />;
      case 'train':
        return <Train className="h-4 w-4" />;
      case 'bus':
        return <Bus className="h-4 w-4" />;
      default:
        return <LinkIcon className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'on-time':
        return "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400";
      case 'delayed':
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400";
      case 'cancelled':
        return "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const bookTaxiForConnection = (connection: TravelConnection) => {
    toast({
      title: "Taxi Booking",
      description: `In a real app, this would open the booking form for your ${connection.type} arrival`,
    });
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-lg">Travel Connections</h3>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              <span>Add</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Connect Travel Service</DialogTitle>
              <DialogDescription>
                Link your travel bookings to automatically arrange taxi pickups
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Service Provider</label>
                <Select value={provider} onValueChange={setProvider}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="American Airlines">American Airlines</SelectItem>
                    <SelectItem value="Delta Airlines">Delta Airlines</SelectItem>
                    <SelectItem value="United Airlines">United Airlines</SelectItem>
                    <SelectItem value="Amtrak">Amtrak</SelectItem>
                    <SelectItem value="Eurostar">Eurostar</SelectItem>
                    <SelectItem value="Greyhound">Greyhound</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Confirmation Code</label>
                <Input 
                  placeholder="Enter your booking reference" 
                  value={authCode} 
                  onChange={(e) => setAuthCode(e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  For demo purposes, any code will work
                </p>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                onClick={connectToTravelApp} 
                disabled={isConnecting || !provider}
              >
                {isConnecting ? "Connecting..." : "Connect"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {(!user.travelConnections || user.travelConnections.length === 0) ? (
        <div className="text-center py-6">
          <Calendar className="mx-auto mb-2 text-gray-400" size={32} />
          <h4 className="font-medium">No travel connections</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Connect your flight or train bookings to arrange taxi pickups
          </p>
          <Button 
            variant="outline" 
            onClick={() => setIsDialogOpen(true)}
            className="mx-auto"
          >
            Connect a Service
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {user.travelConnections?.map((connection) => (
            <div 
              key={connection.id}
              className="border rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded mr-3">
                    {getIcon(connection.type)}
                  </div>
                  <div>
                    <h4 className="font-medium">{connection.serviceProvider}</h4>
                    <p className="text-sm text-gray-500">
                      {connection.confirmationCode}
                    </p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(connection.status)}`}>
                  {connection.status || 'Scheduled'}
                </div>
              </div>
              
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-xs text-gray-500">Departure</p>
                  <p className="font-medium">{formatDateTime(connection.departureTime)}</p>
                  <div className="flex items-center mt-1">
                    <MapPin className="h-3 w-3 mr-1 text-gray-500" />
                    <span>{connection.origin}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Arrival</p>
                  <p className="font-medium">{formatDateTime(connection.arrivalTime)}</p>
                  <div className="flex items-center mt-1">
                    <MapPin className="h-3 w-3 mr-1 text-gray-500" />
                    <span>{connection.destination}</span>
                  </div>
                </div>
              </div>
              
              {connection.terminal && (
                <div className="mt-2 text-xs flex items-center text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <span>{connection.terminal}</span>
                    {connection.gate && (
                      <>
                        <ChevronRight className="h-3 w-3 mx-1" />
                        <span>{connection.gate}</span>
                      </>
                    )}
                  </div>
                </div>
              )}
              
              <div className="mt-3 flex justify-end">
                <Button 
                  size="sm"
                  onClick={() => bookTaxiForConnection(connection)}
                  className="text-xs"
                >
                  Book Taxi for Arrival
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TravelConnections;
