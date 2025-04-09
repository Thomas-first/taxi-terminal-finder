
import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { User, Booking } from "../map/types";
import { useToast } from "@/hooks/use-toast";
import {
  CreditCard,
  LogOut,
  MapPin,
  Settings,
  Star,
  Clock,
  Award,
  ChevronRight,
  Calendar,
  LucideIcon,
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface UserProfileProps {
  user: User;
  onLogout: () => void;
  onAddPaymentMethod: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onLogout, onAddPaymentMethod }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  // Format date for bookings
  const formatBookingDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Render a booking card
  const renderBookingCard = (booking: Booking) => {
    const isUpcoming = 
      booking.status === 'scheduled' || 
      booking.status === 'confirmed';
    
    const statusColors: Record<string, string> = {
      scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
      confirmed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
      'in-progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
      completed: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
    };

    return (
      <Card key={booking.id} className="mb-3">
        <CardHeader className="p-3 pb-0">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-sm">{booking.destination}</CardTitle>
              <CardDescription className="text-xs">
                {booking.scheduledFor 
                  ? formatBookingDate(booking.scheduledFor) 
                  : formatBookingDate(booking.createdAt)}
              </CardDescription>
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[booking.status]}`}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-3 pb-0 text-xs">
          <p className="flex items-center gap-1 mb-1">
            <CreditCard size={12} />
            ${booking.fare.toFixed(2)}
          </p>
          {booking.rating && (
            <p className="flex items-center gap-1">
              <Star size={12} className="text-yellow-500" />
              {booking.rating.toFixed(1)}
              {booking.feedback && ` - "${booking.feedback}"`}
            </p>
          )}
        </CardContent>
        <CardFooter className="p-3 pt-2 flex justify-end">
          {isUpcoming && (
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs h-7"
              onClick={() => {
                toast({
                  title: "Not implemented",
                  description: "Ride cancellation would go here",
                });
              }}
            >
              Cancel Ride
            </Button>
          )}
          {booking.status === 'completed' && !booking.rating && (
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs h-7"
              onClick={() => {
                toast({
                  title: "Not implemented",
                  description: "Rating UI would go here",
                });
              }}
            >
              Rate Ride
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  };

  // Define menu items
  interface MenuItem {
    label: string;
    icon: LucideIcon;
    onClick: () => void;
  }

  const menuItems: MenuItem[] = [
    {
      label: "Payment Methods",
      icon: CreditCard,
      onClick: onAddPaymentMethod,
    },
    {
      label: "Favorite Terminals",
      icon: MapPin,
      onClick: () => {
        toast({
          title: "Not implemented",
          description: "Favorite Terminals UI would go here",
        });
      },
    },
    {
      label: "Settings",
      icon: Settings,
      onClick: () => {
        toast({
          title: "Not implemented",
          description: "Settings UI would go here",
        });
      }
    },
    {
      label: "Logout",
      icon: LogOut,
      onClick: () => {
        onLogout();
        setIsOpen(false);
        toast({
          title: "Logged out",
          description: "You have been logged out successfully.",
        });
      }
    }
  ];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="rounded-full" size="sm">
          {user.name.split(' ').map(n => n[0]).join('')}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[90%] sm:max-w-md p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>{user.name}</SheetTitle>
          <SheetDescription>{user.email}</SheetDescription>
        </SheetHeader>

        <div className="p-4 border-b">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-sm">Loyalty Points</h3>
            <span className="flex items-center text-primary">
              <Award size={16} className="mr-1" />
              {user.loyaltyPoints} points
            </span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all" 
              style={{ width: `${Math.min(user.loyaltyPoints / 10, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {user.loyaltyPoints >= 100 
              ? "You've reached Silver status! Enjoy 5% off all rides." 
              : `${100 - user.loyaltyPoints} more points until Silver status`}
          </p>
        </div>

        <Tabs defaultValue="bookings" className="w-full overflow-hidden flex flex-col h-[calc(100vh-200px)]">
          <TabsList className="w-full justify-start px-4 pt-2">
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bookings" className="flex-1 overflow-auto p-4">
            {user.bookingHistory.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="mx-auto mb-2 text-gray-400" size={36} />
                <h3 className="font-medium">No bookings yet</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Your booking history will appear here
                </p>
              </div>
            ) : (
              <div>
                <h3 className="font-medium mb-2">Upcoming</h3>
                {user.bookingHistory
                  .filter(b => b.status === 'scheduled' || b.status === 'confirmed')
                  .map(renderBookingCard)}
                
                <h3 className="font-medium mb-2 mt-4">Past Rides</h3>
                {user.bookingHistory
                  .filter(b => b.status === 'completed' || b.status === 'cancelled')
                  .map(renderBookingCard)}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="account" className="flex-1 overflow-auto">
            <div className="divide-y">
              {menuItems.map((item, i) => (
                <div 
                  key={i} 
                  className="flex items-center justify-between p-4 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                  onClick={item.onClick}
                >
                  <div className="flex items-center">
                    <item.icon className="w-5 h-5 mr-3 text-gray-500" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default UserProfile;
