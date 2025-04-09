
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Clock, 
  CreditCard, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  FileText,
  MapPin,
  User,
  Calendar
} from "lucide-react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { User as UserType, Booking, Taxi } from "@/components/map/types";
import ReceiptGenerator from "@/components/bookings/ReceiptGenerator";
import TripAnalytics from "@/components/analytics/TripAnalytics";
import RealTimeTracking from "@/components/tracking/RealTimeTracking";
import FavoriteRoutes from "@/components/routes/FavoriteRoutes";

const BookingHistory = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserType | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [activeBookingId, setActiveBookingId] = useState<string | null>(null);
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
  
  // Sample taxi for tracking demo
  const sampleTaxi: Taxi = {
    id: 101,
    driverId: "driver-101",
    driverName: "John Driver",
    vehicleType: "Sedan",
    licensePlate: "TX1234",
    rating: 4.8,
    isAvailable: false,
    currentLocation: [51.500, -0.095],
    passengerCapacity: 4,
    features: ["WiFi", "Air Conditioning", "Child Seat"],
    languages: ["English", "Spanish"],
  };

  useEffect(() => {
    // Simulate loading user data
    setIsLoading(true);
    setTimeout(() => {
      // Create a mock user for demo purposes
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
            status: "completed" as const,
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
            status: "scheduled" as const,
            createdAt: new Date(),
            scheduledFor: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days in future
            isShared: true,
            passengers: 1
          },
          {
            id: "booking-3",
            userId: "user-1", 
            terminalId: 1,
            taxiId: 103,
            driverId: "driver-103",
            pickupLocation: [51.505, -0.09],
            destination: "Shopping Mall",
            fare: 15.25,
            status: "in-progress" as const,
            createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 min ago
            isShared: false,
            passengers: 2
          },
          {
            id: "booking-4",
            userId: "user-1", 
            terminalId: 3,
            taxiId: 104,
            driverId: "driver-104",
            pickupLocation: [51.505, -0.09],
            destination: "Business Park",
            fare: 18.50,
            status: "completed" as const,
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 25 * 60 * 1000), // 2 days ago + 25min
            isShared: false,
            passengers: 1,
            rating: 5,
            feedback: "Excellent service and clean car"
          },
          {
            id: "booking-5",
            userId: "user-1", 
            terminalId: 2,
            taxiId: 105,
            driverId: "driver-105",
            pickupLocation: [51.505, -0.09],
            destination: "Hospital",
            fare: 22.00,
            status: "cancelled" as const,
            createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
            isShared: false,
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
        frequentDestinations: ["Airport", "Downtown", "Shopping Mall"]
      };
      
      setUser(mockUser);
      setIsLoading(false);
      
      // Set an active booking (for tracking demo)
      const inProgressBooking = mockUser.bookingHistory.find(b => b.status === "in-progress");
      if (inProgressBooking) {
        setActiveBookingId(inProgressBooking.id);
      }
    }, 1000);
  }, []);
  
  const handleBack = () => {
    navigate('/');
  };
  
  const handleUpdate = (updatedUser: UserType) => {
    setUser(updatedUser);
  };
  
  const handleBookNow = (terminalId: number, destination: string) => {
    navigate(`/?terminal=${terminalId}&destination=${destination}`);
  };
  
  const filteredBookings = () => {
    if (!user) return [];
    
    return user.bookingHistory
      .filter(booking => {
        // Status filter
        if (statusFilter !== "all" && booking.status !== statusFilter) {
          return false;
        }
        
        // Date filter
        if (dateFilter === "today") {
          const today = new Date();
          const bookingDate = new Date(booking.createdAt);
          return (
            bookingDate.getDate() === today.getDate() &&
            bookingDate.getMonth() === today.getMonth() &&
            bookingDate.getFullYear() === today.getFullYear()
          );
        } else if (dateFilter === "week") {
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return new Date(booking.createdAt) >= weekAgo;
        } else if (dateFilter === "month") {
          const monthAgo = new Date();
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return new Date(booking.createdAt) >= monthAgo;
        }
        
        return true;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };
  
  // Pagination
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredBookings().length / itemsPerPage);
  const currentBookings = filteredBookings().slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      case "scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
    }
  };
  
  const getActiveBooking = () => {
    if (!user || !activeBookingId) return null;
    return user.bookingHistory.find(b => b.id === activeBookingId);
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
      <div className="container mx-auto p-4">
        <div className="text-center p-8">
          <User size={48} className="mx-auto text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold mb-2">User Not Found</h1>
          <p className="text-gray-500 mb-6">
            Could not load user profile information
          </p>
          <Button onClick={handleBack}>
            <ArrowLeft size={16} className="mr-2" />
            Back to Home
          </Button>
        </div>
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
              <Clock className="text-primary mr-2" size={24} />
              <h1 className="text-xl font-bold">Booking History</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-6 px-4">
        {getActiveBooking() && (
          <div className="mb-6">
            <RealTimeTracking 
              booking={getActiveBooking()!} 
              taxi={sampleTaxi}
            />
          </div>
        )}
        
        <Tabs defaultValue="bookings" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="bookings">Your Bookings</TabsTrigger>
            <TabsTrigger value="analytics">Trip Analytics</TabsTrigger>
            <TabsTrigger value="favorites">Favorite Routes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bookings" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Your Booking History</h2>
              <div className="flex gap-2">
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select
                  value={dateFilter}
                  onValueChange={setDateFilter}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Filter by date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {currentBookings.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium mb-2">No bookings found</h3>
                <p className="text-gray-500 mb-4">
                  {statusFilter !== "all" || dateFilter !== "all"
                    ? "Try changing your filters to see more results"
                    : "You don't have any booking history yet"}
                </p>
                <Button onClick={() => navigate('/')}>Book a Taxi Now</Button>
              </div>
            ) : (
              <>
                <Table>
                  <TableCaption>Your taxi booking history</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Destination</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Fare</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.destination}</TableCell>
                        <TableCell>
                          {booking.status === "scheduled" && booking.scheduledFor
                            ? formatDate(booking.scheduledFor)
                            : formatDate(booking.createdAt)}
                        </TableCell>
                        <TableCell>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>${booking.fare.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {booking.status === "completed" && (
                              <ReceiptGenerator booking={booking} />
                            )}
                            {booking.status === "in-progress" && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setActiveBookingId(booking.id)}
                              >
                                Track
                              </Button>
                            )}
                            {booking.status === "scheduled" && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-red-500"
                                onClick={() => {
                                  // In a real app, this would call an API to cancel the booking
                                  const updatedHistory = user.bookingHistory.map(b => 
                                    b.id === booking.id ? { ...b, status: "cancelled" } : b
                                  );
                                  setUser({
                                    ...user,
                                    bookingHistory: updatedHistory
                                  });
                                }}
                              >
                                Cancel
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                // Book same route again
                                navigate(`/?terminal=${booking.terminalId}&destination=${booking.destination}`);
                              }}
                            >
                              Book Again
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft size={16} />
                    </Button>
                    <span className="mx-4 flex items-center">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>
          
          <TabsContent value="analytics" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <TripAnalytics user={user} />
          </TabsContent>
          
          <TabsContent value="favorites" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <FavoriteRoutes 
              user={user} 
              terminals={terminals} 
              onSave={handleUpdate}
              onBookNow={handleBookNow}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default BookingHistory;
