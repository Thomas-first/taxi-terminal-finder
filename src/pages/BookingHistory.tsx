
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Calendar, 
  Search, 
  CreditCard, 
  Star, 
  MapPin, 
  Filter,
  Download,
  FileText,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";
import { Booking } from "@/components/map/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const BookingHistory = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Simulating API call to fetch booking history
    const fetchBookings = () => {
      setIsLoading(true);
      
      // Mocked bookings data
      setTimeout(() => {
        const mockBookings: Booking[] = [
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
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000),
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
            pickupLocation: [51.51, -0.1],
            destination: "Downtown Hotel",
            fare: 15.75,
            status: "scheduled",
            createdAt: new Date(),
            scheduledFor: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
            isShared: true,
            passengers: 1
          },
          {
            id: "booking-3",
            userId: "user-1",
            terminalId: 3,
            taxiId: 103,
            driverId: "driver-103",
            pickupLocation: [51.52, -0.11],
            destination: "Shopping Mall",
            fare: 12.25,
            status: "in-progress",
            createdAt: new Date(Date.now() - 30 * 60 * 1000),
            isShared: false,
            passengers: 2
          },
          {
            id: "booking-4",
            userId: "user-1",
            terminalId: 1,
            taxiId: 104,
            driverId: "driver-104",
            pickupLocation: [51.505, -0.09],
            destination: "Restaurant District",
            fare: 18.90,
            status: "completed",
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 25 * 60 * 1000),
            isShared: false,
            passengers: 4,
            rating: 3.0,
            feedback: "Driver took a longer route than necessary"
          },
          {
            id: "booking-5",
            userId: "user-1",
            terminalId: 4,
            taxiId: 105,
            driverId: "driver-105",
            pickupLocation: [51.53, -0.12],
            destination: "Concert Hall",
            fare: 22.00,
            status: "cancelled",
            createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
            isShared: false,
            passengers: 2
          }
        ];
        
        setBookings(mockBookings);
        setIsLoading(false);
      }, 1000);
    };
    
    fetchBookings();
  }, []);

  const handleBack = () => {
    navigate('/profile');
  };

  const filterBookings = () => {
    let filtered = [...bookings];
    
    // Apply status filter
    if (filter !== "all") {
      filtered = filtered.filter(booking => booking.status === filter);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(booking => 
        booking.destination.toLowerCase().includes(query) ||
        booking.id.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  };

  const getStatusBadgeColor = (status: string) => {
    switch(status) {
      case 'completed': return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      case 'scheduled': return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
      case 'in-progress': return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
      case 'cancelled': return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
    }
  };

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
  };

  const handleRateBooking = (booking: Booking) => {
    if (booking.rating) {
      toast({
        title: "Already Rated",
        description: "You've already rated this trip.",
      });
      return;
    }
    
    toast({
      title: "Rating Feature",
      description: "In a real app, this would open the rating UI.",
    });
  };

  const handleCancelBooking = (booking: Booking) => {
    toast({
      title: "Cancellation Feature",
      description: "In a real app, this would cancel your booking.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-md p-4">
        <div className="container mx-auto flex items-center">
          <Button variant="ghost" onClick={handleBack} className="mr-4">
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-bold">Booking History</h1>
        </div>
      </header>

      <main className="container mx-auto py-6 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="relative w-full md:w-auto flex-grow md:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search by destination or booking ID"
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Bookings</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Download size={16} />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Export as PDF</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Export as CSV</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {filterBookings().length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow">
                <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No bookings found</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                  {searchQuery || filter !== "all" 
                    ? "Try adjusting your filters to see more results." 
                    : "You don't have any taxi bookings yet. Book your first ride!"}
                </p>
                {(searchQuery || filter !== "all") && (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchQuery("");
                      setFilter("all");
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filterBookings().map((booking) => (
                  <Card key={booking.id} className="overflow-hidden">
                    <div className={`h-2 ${
                      booking.status === 'completed' ? 'bg-green-500' :
                      booking.status === 'scheduled' ? 'bg-blue-500' :
                      booking.status === 'in-progress' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`} />
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">{booking.destination}</CardTitle>
                          <CardDescription className="text-xs">
                            {booking.id}
                          </CardDescription>
                        </div>
                        <Badge className={getStatusBadgeColor(booking.status)}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500 dark:text-gray-400">Date</span>
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>
                              {booking.scheduledFor 
                                ? formatDateTime(booking.scheduledFor).split(',')[0]
                                : formatDateTime(booking.createdAt).split(',')[0]
                              }
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500 dark:text-gray-400">Time</span>
                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            <span>
                              {booking.scheduledFor 
                                ? formatDateTime(booking.scheduledFor).split(',')[1]
                                : formatDateTime(booking.createdAt).split(',')[1]
                              }
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500 dark:text-gray-400">Fare</span>
                          <div className="flex items-center gap-1">
                            <CreditCard size={14} />
                            <span>${booking.fare.toFixed(2)}</span>
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500 dark:text-gray-400">Shared</span>
                          <div className="flex items-center gap-1">
                            {booking.isShared ? (
                              <CheckCircle size={14} className="text-green-500" />
                            ) : (
                              <XCircle size={14} className="text-gray-500" />
                            )}
                            <span>{booking.isShared ? "Yes" : "No"}</span>
                          </div>
                        </div>
                      </div>
                      
                      {booking.rating && (
                        <div className="flex items-center mt-2 bg-yellow-50 dark:bg-yellow-900/20 p-1.5 rounded">
                          <Star size={14} className="text-yellow-500 mr-1" />
                          <span className="text-sm font-medium">{booking.rating.toFixed(1)}</span>
                          {booking.feedback && (
                            <span className="text-xs ml-2 truncate">{`"${booking.feedback}"`}</span>
                          )}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-between pt-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-8"
                        onClick={() => handleViewDetails(booking)}
                      >
                        Details
                      </Button>
                      
                      {booking.status === 'scheduled' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-8 border-red-200 text-red-700 hover:bg-red-50"
                          onClick={() => handleCancelBooking(booking)}
                        >
                          Cancel
                        </Button>
                      )}
                      
                      {booking.status === 'completed' && !booking.rating && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-8"
                          onClick={() => handleRateBooking(booking)}
                        >
                          Rate
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        <Dialog open={!!selectedBooking} onOpenChange={open => !open && setSelectedBooking(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Booking Details</DialogTitle>
              <DialogDescription>
                Complete information about your booking
              </DialogDescription>
            </DialogHeader>
            
            {selectedBooking && (
              <div className="space-y-4">
                <div className="bg-primary/10 p-3 rounded-md">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{selectedBooking.destination}</h3>
                    <Badge className={getStatusBadgeColor(selectedBooking.status)}>
                      {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Booking ID: {selectedBooking.id}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-gray-500">Pickup Terminal</p>
                    <p className="font-medium">Terminal #{selectedBooking.terminalId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Booking Date</p>
                    <p className="font-medium">{formatDateTime(selectedBooking.createdAt)}</p>
                  </div>
                  
                  {selectedBooking.scheduledFor && (
                    <>
                      <div>
                        <p className="text-xs text-gray-500">Scheduled For</p>
                        <p className="font-medium">{formatDateTime(selectedBooking.scheduledFor)}</p>
                      </div>
                      <div></div>
                    </>
                  )}
                  
                  {selectedBooking.completedAt && (
                    <>
                      <div>
                        <p className="text-xs text-gray-500">Completed At</p>
                        <p className="font-medium">{formatDateTime(selectedBooking.completedAt)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Journey Time</p>
                        <p className="font-medium">
                          {Math.round((selectedBooking.completedAt.getTime() - selectedBooking.createdAt.getTime()) / 60000)} min
                        </p>
                      </div>
                    </>
                  )}
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-gray-500">Fare</p>
                    <p className="font-medium">${selectedBooking.fare.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Payment Method</p>
                    <p className="font-medium">Credit Card (*4242)</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Passengers</p>
                    <p className="font-medium">{selectedBooking.passengers}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Shared Ride</p>
                    <p className="font-medium">{selectedBooking.isShared ? "Yes" : "No"}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="text-sm">
                  <p className="text-xs text-gray-500">Driver Information</p>
                  <div className="flex justify-between items-center">
                    <p className="font-medium">Driver #{selectedBooking.driverId}</p>
                    {selectedBooking.rating && (
                      <div className="flex items-center">
                        <Star size={14} className="text-yellow-500 mr-1" />
                        <span>{selectedBooking.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  {selectedBooking.feedback && (
                    <div className="bg-gray-50 dark:bg-gray-800 p-2 mt-2 rounded text-xs italic">
                      "{selectedBooking.feedback}"
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <DialogFooter className="sm:justify-between">
              {selectedBooking?.status === 'scheduled' && (
                <Button 
                  variant="destructive"
                  onClick={() => {
                    handleCancelBooking(selectedBooking);
                    setSelectedBooking(null);
                  }}
                >
                  Cancel Booking
                </Button>
              )}
              
              {selectedBooking?.status === 'completed' && !selectedBooking.rating && (
                <Button
                  onClick={() => {
                    handleRateBooking(selectedBooking);
                    setSelectedBooking(null);
                  }}
                >
                  Rate Trip
                </Button>
              )}
              
              <Button 
                variant="outline" 
                onClick={() => setSelectedBooking(null)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default BookingHistory;
