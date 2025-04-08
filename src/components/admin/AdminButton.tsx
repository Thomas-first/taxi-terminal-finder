
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AdminTerminalModal from './AdminTerminalModal';

interface AdminButtonProps {
  onAdminModeChange: (isAdminMode: boolean) => void;
  onLocationSelect: (lat: number, lng: number) => void;
  selectedLocation: [number, number] | null;
}

const AdminButton: React.FC<AdminButtonProps> = ({ 
  onAdminModeChange, 
  onLocationSelect,
  selectedLocation 
}) => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const toggleAdminMode = () => {
    const newMode = !isAdminMode;
    setIsAdminMode(newMode);
    onAdminModeChange(newMode);
    
    if (newMode) {
      toast({
        title: "Admin Mode Activated",
        description: "Click on the map to add a new taxi terminal",
      });
    } else {
      toast({
        title: "Admin Mode Deactivated",
      });
    }
  };

  const openModal = () => {
    if (!selectedLocation) {
      toast({
        title: "Select Location",
        description: "Click on the map to select a location for the new terminal",
      });
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="fixed top-20 right-4 z-30 flex flex-col gap-2">
        <Button
          variant={isAdminMode ? "default" : "outline"}
          size="icon"
          onClick={toggleAdminMode}
          className="shadow-md"
        >
          <Settings className="h-[1.2rem] w-[1.2rem]" />
        </Button>
        
        {isAdminMode && (
          <Button
            variant="default"
            onClick={openModal}
            className="shadow-md"
          >
            Add Terminal
          </Button>
        )}
      </div>
      
      <AdminTerminalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onMapClick={onLocationSelect}
        selectedLocation={selectedLocation}
      />
    </>
  );
};

export default AdminButton;
