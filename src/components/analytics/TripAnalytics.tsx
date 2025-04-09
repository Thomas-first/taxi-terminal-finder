
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { User, Booking } from "../map/types";

interface TripAnalyticsProps {
  user: User;
}

const TripAnalytics: React.FC<TripAnalyticsProps> = ({ user }) => {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');
  
  // Calculate analytics data from booking history
  const calculateData = () => {
    const bookings = user.bookingHistory.filter(b => b.status === 'completed');
    
    // Sort by date
    bookings.sort((a, b) => {
      const dateA = a.completedAt || a.createdAt;
      const dateB = b.completedAt || b.createdAt;
      return new Date(dateA).getTime() - new Date(dateB).getTime();
    });
    
    // Line chart data: spending over time
    const spendingData = generateSpendingData(bookings, period);
    
    // Bar chart data: most frequent destinations
    const destinationData = generateDestinationData(bookings);
    
    // Pie chart data: ride types
    const rideTypeData = generateRideTypeData(bookings);
    
    return { spendingData, destinationData, rideTypeData };
  };
  
  const generateSpendingData = (bookings: Booking[], period: 'week' | 'month' | 'year') => {
    const data: {name: string, amount: number}[] = [];
    
    if (bookings.length === 0) return data;
    
    const now = new Date();
    const periods = period === 'week' ? 7 : period === 'month' ? 30 : 12;
    const format = period === 'week' ? 'day' : period === 'month' ? 'day' : 'month';
    
    for (let i = periods - 1; i >= 0; i--) {
      const date = new Date();
      
      if (period === 'week') {
        date.setDate(now.getDate() - i);
      } else if (period === 'month') {
        date.setDate(now.getDate() - i);
      } else {
        date.setMonth(now.getMonth() - i);
      }
      
      const dateStr = format === 'day' 
        ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : date.toLocaleDateString('en-US', { month: 'short' });
      
      const periodBookings = bookings.filter(b => {
        const bookingDate = b.completedAt || b.createdAt;
        const bDate = new Date(bookingDate);
        
        if (period === 'week' || period === 'month') {
          return bDate.getDate() === date.getDate() && 
                 bDate.getMonth() === date.getMonth() && 
                 bDate.getFullYear() === date.getFullYear();
        } else {
          return bDate.getMonth() === date.getMonth() && 
                 bDate.getFullYear() === date.getFullYear();
        }
      });
      
      const amount = periodBookings.reduce((sum, b) => sum + b.fare, 0);
      data.push({ name: dateStr, amount });
    }
    
    return data;
  };
  
  const generateDestinationData = (bookings: Booking[]) => {
    const destinations: Record<string, number> = {};
    
    bookings.forEach(booking => {
      destinations[booking.destination] = (destinations[booking.destination] || 0) + 1;
    });
    
    return Object.entries(destinations)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };
  
  const generateRideTypeData = (bookings: Booking[]) => {
    const sharedRides = bookings.filter(b => b.isShared).length;
    const privateRides = bookings.length - sharedRides;
    
    return [
      { name: 'Private', value: privateRides },
      { name: 'Shared', value: sharedRides }
    ];
  };
  
  const { spendingData, destinationData, rideTypeData } = calculateData();
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Trip Analytics</CardTitle>
        <CardDescription>Visualize your ride history and spending patterns</CardDescription>
        <Tabs defaultValue="spending" className="mt-4">
          <TabsList className="mb-4">
            <TabsTrigger value="spending">Spending</TabsTrigger>
            <TabsTrigger value="destinations">Destinations</TabsTrigger>
            <TabsTrigger value="rideTypes">Ride Types</TabsTrigger>
          </TabsList>
          
          <TabsContent value="spending">
            <div className="mb-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Spending Over Time</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setPeriod('week')}
                    className={`px-2 py-1 text-xs rounded-md ${period === 'week' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
                  >
                    Week
                  </button>
                  <button 
                    onClick={() => setPeriod('month')}
                    className={`px-2 py-1 text-xs rounded-md ${period === 'month' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
                  >
                    Month
                  </button>
                  <button 
                    onClick={() => setPeriod('year')}
                    className={`px-2 py-1 text-xs rounded-md ${period === 'year' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
                  >
                    Year
                  </button>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={spendingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                  <Legend />
                  <Line type="monotone" dataKey="amount" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="destinations">
            <div>
              <h3 className="text-lg font-medium mb-4">Top Destinations</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={destinationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="rideTypes">
            <div>
              <h3 className="text-lg font-medium mb-4">Ride Types</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={rideTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {rideTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Rides']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardHeader>
      <CardContent>
        {user.bookingHistory.length === 0 ? (
          <p className="text-center py-8 text-gray-500">
            No booking history available. Take some rides to see your analytics!
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 border rounded-lg">
              <p className="text-3xl font-bold text-primary">
                {user.bookingHistory.filter(b => b.status === 'completed').length}
              </p>
              <p className="text-sm text-gray-500">Total Rides</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-3xl font-bold text-primary">
                ${user.bookingHistory
                  .filter(b => b.status === 'completed')
                  .reduce((sum, b) => sum + b.fare, 0)
                  .toFixed(2)}
              </p>
              <p className="text-sm text-gray-500">Total Spent</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-3xl font-bold text-primary">
                {user.loyaltyPoints}
              </p>
              <p className="text-sm text-gray-500">Loyalty Points</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TripAnalytics;
