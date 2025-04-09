
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { User, Terminal } from "../map/types";
import { 
  MapPin, 
  Heart, 
  Home, 
  Briefcase, 
  Plane, 
  ShoppingBag, 
  Plus, 
  Star, 
  Clock, 
  Trash2,
  Edit 
} from "lucide-react";

interface FavoriteRoutesProps {
  user: User;
  terminals: Terminal[];
  onSave: (user: User) => void;
  onBookNow?: (terminalId: number, destination: string) => void;
}

// Extended favorite destination with more details
interface FavoriteDestination {
  id: string;
  name: string;
  address: string;
  icon: "home" | "work" | "airport" | "shopping" | "other";
  terminalId: number;
  frequentlyUsed: boolean;
}

const FavoriteRoutes: React.FC<FavoriteRoutesProps> = ({ 
  user, 
  terminals,
  onSave,
  onBookNow
}) => {
  const [favorites, setFavorites] = useState<FavoriteDestination[]>([
    {
      id: "favorite-1",
      name: "Home",
      address: "123 Home Street",
      icon: "home",
      terminalId: 1,
      frequentlyUsed: true
    },
    {
      id: "favorite-2",
      name: "Work",
      address: "456 Office Avenue",
      icon: "work",
      terminalId: 2,
      frequentlyUsed: true
    },
    {
      id: "favorite-3",
      name: "Airport",
      address: "International Airport",
      icon: "airport",
      terminalId: 3,
      frequentlyUsed: false
    }
  ]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingFavorite, setEditingFavorite] = useState<FavoriteDestination | null>(null);
  const { toast } = useToast();
  
  const favoriteSchema = z.object({
    name: z.string().min(1, "Name is required"),
    address: z.string().min(1, "Address is required"),
    icon: z.enum(["home", "work", "airport", "shopping", "other"]),
    terminalId: z.number().min(1, "Please select a terminal")
  });
  
  const form = useForm<z.infer<typeof favoriteSchema>>({
    resolver: zodResolver(favoriteSchema),
    defaultValues: {
      name: "",
      address: "",
      icon: "other",
      terminalId: 0
    }
  });
  
  const handleEdit = (favorite: FavoriteDestination) => {
    setEditingFavorite(favorite);
    form.reset({
      name: favorite.name,
      address: favorite.address,
      icon: favorite.icon,
      terminalId: favorite.terminalId
    });
    setIsAddDialogOpen(true);
  };
  
  const handleDelete = (id: string) => {
    setFavorites(favorites.filter(f => f.id !== id));
    toast({
      title: "Favorite removed",
      description: "The location has been removed from your favorites.",
    });
  };
  
  const onSubmit = (values: z.infer<typeof favoriteSchema>) => {
    if (editingFavorite) {
      // Update existing favorite
      setFavorites(favorites.map(f => 
        f.id === editingFavorite.id 
          ? { ...values, id: f.id, frequentlyUsed: f.frequentlyUsed }
          : f
      ));
      
      toast({
        title: "Favorite updated",
        description: `${values.name} has been updated in your favorites.`,
      });
    } else {
      // Add new favorite
      const newFavorite: FavoriteDestination = {
        ...values,
        id: `favorite-${Date.now()}`,
        frequentlyUsed: false
      };
      
      setFavorites([...favorites, newFavorite]);
      
      toast({
        title: "Favorite added",
        description: `${values.name} has been added to your favorites.`,
      });
    }
    
    // Update user's frequent destinations
    const destinations = favorites.map(f => f.name);
    if (!destinations.includes(values.name)) {
      destinations.push(values.name);
    }
    
    onSave({
      ...user,
      frequentDestinations: destinations
    });
    
    form.reset();
    setIsAddDialogOpen(false);
    setEditingFavorite(null);
  };
  
  const handleBookNow = (terminalId: number, destination: string) => {
    if (onBookNow) {
      onBookNow(terminalId, destination);
    } else {
      toast({
        title: "Booking initiated",
        description: `Booking a taxi to ${destination}`,
      });
    }
  };
  
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "home":
        return <Home className="h-5 w-5" />;
      case "work":
        return <Briefcase className="h-5 w-5" />;
      case "airport":
        return <Plane className="h-5 w-5" />;
      case "shopping":
        return <ShoppingBag className="h-5 w-5" />;
      default:
        return <MapPin className="h-5 w-5" />;
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Favorite Destinations</CardTitle>
            <CardDescription>
              Your saved locations for quick booking
            </CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                size="sm" 
                onClick={() => {
                  setEditingFavorite(null);
                  form.reset({
                    name: "",
                    address: "",
                    icon: "other",
                    terminalId: terminals.length > 0 ? terminals[0].id : 0
                  });
                }}
              >
                <Plus size={16} className="mr-1" />
                Add Favorite
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingFavorite ? "Edit Favorite" : "Add New Favorite"}
                </DialogTitle>
                <DialogDescription>
                  {editingFavorite 
                    ? "Update your favorite destination details" 
                    : "Save a location for quick access in the future"}
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Home, Work, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Full address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="icon"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location Type</FormLabel>
                        <div className="flex gap-2 mt-2">
                          {[
                            { value: "home", icon: <Home /> },
                            { value: "work", icon: <Briefcase /> },
                            { value: "airport", icon: <Plane /> },
                            { value: "shopping", icon: <ShoppingBag /> },
                            { value: "other", icon: <MapPin /> }
                          ].map((option) => (
                            <Button
                              key={option.value}
                              type="button"
                              variant={field.value === option.value ? "default" : "outline"}
                              className="flex-1"
                              onClick={() => form.setValue("icon", option.value as any)}
                            >
                              {option.icon}
                            </Button>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="terminalId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Pickup Terminal</FormLabel>
                        <FormControl>
                          <select
                            className="w-full p-2 border rounded-md"
                            value={field.value}
                            onChange={(e) => form.setValue("terminalId", parseInt(e.target.value))}
                          >
                            <option value={0}>Select a terminal</option>
                            {terminals.map((terminal) => (
                              <option key={terminal.id} value={terminal.id}>
                                {terminal.name} ({terminal.taxiCount} taxis available)
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormDescription>
                          The terminal you usually want to start your journey from
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button type="submit">
                      {editingFavorite ? "Update Favorite" : "Add Favorite"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {favorites.length === 0 ? (
          <div className="text-center py-8 border rounded-lg">
            <Heart className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">You don't have any favorite destinations yet</p>
            <Button 
              variant="link" 
              onClick={() => setIsAddDialogOpen(true)}
              className="mt-2"
            >
              Add your first favorite
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {favorites.map((favorite) => (
              <div 
                key={favorite.id}
                className="border rounded-lg p-4 hover:border-primary transition-colors"
              >
                <div className="flex justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                      {getIconComponent(favorite.icon)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <h3 className="font-medium">{favorite.name}</h3>
                        {favorite.frequentlyUsed && (
                          <Star size={14} className="text-yellow-500" fill="currentColor" />
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{favorite.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEdit(favorite)}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDelete(favorite.id)}
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </Button>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm text-gray-500 flex items-center">
                    <Clock size={14} className="mr-1" />
                    {favorite.frequentlyUsed ? "Frequently used" : "Used occasionally"}
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => handleBookNow(favorite.terminalId, favorite.name)}
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-4">
        <p className="text-sm text-gray-500">
          You can also access your favorites during the booking process
        </p>
      </CardFooter>
    </Card>
  );
};

export default FavoriteRoutes;
