
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Plus, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Terminal } from '../map/types';

interface AdminTerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMapClick: (lat: number, lng: number) => void;
  selectedLocation: [number, number] | null;
}

const AdminTerminalModal: React.FC<AdminTerminalModalProps> = ({
  isOpen,
  onClose,
  onMapClick,
  selectedLocation,
}) => {
  const [name, setName] = useState('');
  const [taxiCount, setTaxiCount] = useState(5);
  const [destinations, setDestinations] = useState<string[]>(['']);
  const { toast } = useToast();

  // Reset form when modal opens or location changes
  useEffect(() => {
    if (isOpen && selectedLocation) {
      setName('');
      setTaxiCount(5);
      setDestinations(['']);
    }
  }, [isOpen, selectedLocation]);

  const handleAddDestination = () => {
    setDestinations([...destinations, '']);
  };

  const handleRemoveDestination = (index: number) => {
    const newDestinations = [...destinations];
    newDestinations.splice(index, 1);
    setDestinations(newDestinations);
  };

  const handleDestinationChange = (index: number, value: string) => {
    const newDestinations = [...destinations];
    newDestinations[index] = value;
    setDestinations(newDestinations);
  };

  const handleSubmit = () => {
    if (!selectedLocation) {
      toast({
        title: "Error",
        description: "Please select a location on the map first",
        variant: "destructive",
      });
      return;
    }

    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Terminal name is required",
        variant: "destructive",
      });
      return;
    }

    // Filter out empty destinations
    const filteredDestinations = destinations.filter(d => d.trim() !== '');
    
    if (filteredDestinations.length === 0) {
      toast({
        title: "Error",
        description: "Add at least one destination",
        variant: "destructive",
      });
      return;
    }

    // Get existing terminals from localStorage
    const existingTerminalsJson = localStorage.getItem('adminTerminals');
    const existingTerminals: Terminal[] = existingTerminalsJson 
      ? JSON.parse(existingTerminalsJson) 
      : [];

    // Create new terminal
    const newTerminal: Terminal = {
      id: Date.now(), // Use timestamp as unique ID
      name: name.trim(),
      coordinates: selectedLocation,
      taxiCount,
      destinations: filteredDestinations,
    };

    // Add to existing terminals
    const updatedTerminals = [...existingTerminals, newTerminal];
    
    // Save to localStorage
    localStorage.setItem('adminTerminals', JSON.stringify(updatedTerminals));

    toast({
      title: "Success",
      description: `Terminal "${name}" has been added`,
    });

    // Close modal and reset form
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Add New Taxi Terminal</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Terminal Name</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="e.g., Central Station Taxis"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <div className="flex items-center gap-2">
              <Input 
                id="location" 
                value={selectedLocation ? `${selectedLocation[0].toFixed(6)}, ${selectedLocation[1].toFixed(6)}` : ''} 
                readOnly
                className="bg-muted"
              />
              <Button 
                size="sm" 
                type="button" 
                variant="outline"
                onClick={() => toast({
                  title: "Select Location",
                  description: "Click on the map to select the terminal location",
                })}
              >
                <MapPin className="h-4 w-4 mr-1" />
                Select
              </Button>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="taxiCount">Available Taxis</Label>
            <Input 
              id="taxiCount" 
              type="number" 
              min="1"
              max="50"
              value={taxiCount} 
              onChange={(e) => setTaxiCount(parseInt(e.target.value) || 1)} 
            />
          </div>
          
          <div className="grid gap-2">
            <Label>Destinations</Label>
            {destinations.map((destination, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input 
                  value={destination} 
                  onChange={(e) => handleDestinationChange(index, e.target.value)} 
                  placeholder="e.g., Airport, Downtown, etc."
                />
                {destinations.length > 1 && (
                  <Button 
                    size="icon" 
                    variant="outline" 
                    type="button" 
                    onClick={() => handleRemoveDestination(index)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleAddDestination}
              className="mt-1"
            >
              <Plus className="h-4 w-4 mr-1" /> 
              Add Destination
            </Button>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Add Terminal</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdminTerminalModal;
