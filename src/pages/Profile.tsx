
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, User, Clock, Settings as SettingsIcon, CreditCard, Heart, BarChart } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EnhancedUserProfileSettings from "@/components/user/EnhancedUserProfileSettings";
import TravelConnections from "@/components/travel/TravelConnections";
import { User as UserType, TravelConnection, Terminal } from "@/components/map/types";
import PaymentMethodManager from "@/components/payment/PaymentMethodManager";
import TripAnalytics from "@/components/analytics/TripAnalytics";
import FavoriteRoutes from "@/components/routes/FavoriteRoutes";

const Profile = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Sample terminals for favorite routes
  const terminals = [
    {
      id: 1,
      name: "Central Taxi Terminal",
      coordinates: [51.505, -0.09] as [number, number],
      taxiCount: 15,
      destinations: ["Downtown", "Airport", "Shopping Mall"]
    },
    {
      id: 2,
      name: "North Station Taxis",
      coordinates: [51.515, -0.08] as [number, number],
      taxiCount: 8,
      destinations: ["City Center", "Beach", "University"]
    },
    {
      id: 3,
      name: "East Terminal",
      coordinates: [51.510, -0.07] as [number, number],
      taxiCount: 12,
      destinations: ["Hospital", "Business Park", "Stadium"]
    }
  ];

  useEffect(() => {
    // Simulate loading user data
    const loadUser = () => {
      setIsLoading(true);
      
      // Create a mock user for demo purposes
      setTimeout(() => {
        const mockUser: UserType = {
          id: "user-1",
          email: "demo@example.com",
          name: "Demo User",
          phone: "+1 555-123-4567",
          paymentMethods: [
            {
              id: "payment-1",
              type: "card",
              lastFour: "4242",
              isDefault: true
            }
          ],
          favoriteTerminals: [1, 3],
          bookingHistory: [
            {
              id: "booking-1",
              userId: "user-1",
              terminalId: 1,
              taxiId: 101,
              driverId: "driver-101",
              pickupLocation: [51.505, -0.09],
              destination: "Airport",
              fare: 25.50,
              status: "completed",
              createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
              completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000), // 1 week ago + 30min
              isShared: false,
              passengers: 1,
              rating: 4.5,
              feedback: "Great ride, very professional driver"
            },
            {
              id: "booking-2",
              userId: "user-1", 
              terminalId: 2,
              taxiId: 102,
              driverId: "driver-102",
              pickupLocation: [51.505, -0.09],
              destination: "Downtown",
              fare: 12.75,
              status: "scheduled",
              createdAt: new Date(),
              scheduledFor: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days in future
              isShared: true,
              passengers: 1
            }
          ],
          loyaltyPoints: 75,
          preferences: {
            preferredPaymentMethod: "payment-1",
            preferredVehicleType: "Sedan",
            notificationsEnabled: true,
            darkModeEnabled: false,
            preferredDriverLanguages: ["English", "Spanish"],
            minimumDriverRating: 4,
            rideSharingPreference: "ask",
            maxWaitTime: 15
          },
          travelPreferences: {
            preferredSeatPosition: "back-right",
            luggageSize: "medium",
            temperaturePreference: "cool",
            musicPreference: "soft",
            conversationPreference: "quiet"
          },
          language: "en",
          frequentDestinations: ["Airport", "Downtown", "Shopping Mall"],
          accessibilityNeeds: [],
          travelConnections: [
            {
              id: "travel-1",
              type: "flight",
              serviceProvider: "United Airlines",
              confirmationCode: "UA12345",
              departureTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
              arrivalTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // 2 weeks + 3h
              origin: "San Francisco Airport",
              destination: "New York JFK",
              status: "on-time",
              terminal: "Terminal 1",
              gate: "Gate 22"
            }
          ]
        };
        
        setUser(mockUser);
        setIsLoading(false);
      }, 1000);
    };
    
    loadUser();
  }, []);

  const handleSaveProfile = (updatedUser: UserType) => {
    setUser(updatedUser);
    toast({
      title: "Profile Updated",
      description: "Your profile settings have been saved.",
    });
  };

  const handleAddTravelConnection = (connection: TravelConnection) => {
    if (user) {
      const connections = user.travelConnections || [];
      setUser({
        ...user,
        travelConnections: [...connections, connection]
      });
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleBookNow = (terminalId: number, destination: string) => {
    navigate(`/?terminal=${terminalId}&destination=${destination}`);
  };

  const navigateToSettings = () => {
    navigate('/settings');
  };

  const navigateToBookingHistory = () => {
    navigate('/booking-history');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center h-screen p-4">
        <User size={48} className="text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold mb-2">User Not Found</h1>
        <p className="text-gray-500 mb-6 text-center">
          Could not load user profile information
        </p>
        <Button onClick={handleBack}>
          <ArrowLeft size={16} className="mr-2" />
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-md p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" onClick={handleBack} className="mr-4">
              <ArrowLeft size={16} className="mr-2" />
              Back
            </Button>
            <div className="flex items-center">
              <User className="text-primary mr-2" size={24} />
              <h1 className="text-xl font-bold">User Profile</h1>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={navigateToBookingHistory} className="flex items-center gap-1">
              <Clock size={16} />
              <span className="hidden sm:inline">Bookings</span>
            </Button>
            <Button variant="outline" size="sm" onClick={navigateToSettings} className="flex items-center gap-1">
              <SettingsIcon size={16} />
              <span className="hidden sm:inline">Settings</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-6 px-4">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="profile">Profile Settings</TabsTrigger>
            <TabsTrigger value="payments">Payment Methods</TabsTrigger>
            <TabsTrigger value="travel">Travel Connections</TabsTrigger>
            <TabsTrigger value="favorites">Favorite Routes</TabsTrigger>
            <TabsTrigger value="analytics">Trip Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <EnhancedUserProfileSettings 
              user={user} 
              onSave={handleSaveProfile} 
            />
          </TabsContent>
          
          <TabsContent value="payments" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <PaymentMethodManager
              user={user}
              onSave={handleSaveProfile}
            />
          </TabsContent>
          
          <TabsContent value="travel" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <TravelConnections 
              user={user} 
              onConnectionAdd={handleAddTravelConnection} 
            />
          </TabsContent>
          
          <TabsContent value="favorites" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <FavoriteRoutes
              user={user}
              terminals={terminals}
              onSave={handleSaveProfile}
              onBookNow={handleBookNow}
            />
          </TabsContent>
          
          <TabsContent value="analytics" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <TripAnalytics user={user} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Profile;
