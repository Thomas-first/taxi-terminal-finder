
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

// Sample data for charts
const dailyBookingsData = [
  { name: 'Mon', bookings: 42, revenue: 640 },
  { name: 'Tue', bookings: 38, revenue: 580 },
  { name: 'Wed', bookings: 45, revenue: 710 },
  { name: 'Thu', bookings: 55, revenue: 820 },
  { name: 'Fri', bookings: 70, revenue: 1050 },
  { name: 'Sat', bookings: 62, revenue: 930 },
  { name: 'Sun', bookings: 50, revenue: 750 }
];

const destinationData = [
  { name: 'Airport', value: 35 },
  { name: 'Downtown', value: 25 },
  { name: 'Shopping Mall', value: 15 },
  { name: 'Hotels', value: 10 },
  { name: 'Others', value: 15 }
];

const hourlyBookingsData = Array.from({ length: 24 }, (_, i) => {
  // Generate a realistic distribution with peaks at morning and evening commute times
  let bookings = 5;
  if (i >= 7 && i <= 9) bookings = 15 + Math.floor(Math.random() * 10); // Morning peak
  else if (i >= 16 && i <= 19) bookings = 18 + Math.floor(Math.random() * 10); // Evening peak
  else if (i >= 12 && i <= 14) bookings = 10 + Math.floor(Math.random() * 5); // Lunch time
  else if (i >= 22 || i <= 5) bookings = 2 + Math.floor(Math.random() * 4); // Late night/early morning
  else bookings = 5 + Math.floor(Math.random() * 5); // Other times
  
  return {
    hour: `${i}:00`,
    bookings,
  };
});

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AnalyticsDashboard: React.FC = () => {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold mb-6">Terminal Analytics Dashboard</h2>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <CardDescription>This week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">362</div>
            <p className="text-xs text-green-500 flex items-center">
              +12% from last week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <CardDescription>This week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$5,480</div>
            <p className="text-xs text-green-500 flex items-center">
              +8% from last week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Taxis</CardTitle>
            <CardDescription>Current</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-red-500 flex items-center">
              -2 from yesterday
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Daily Bookings Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Daily Bookings & Revenue</CardTitle>
            <CardDescription>Last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dailyBookingsData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="bookings" fill="#8884d8" name="Bookings" />
                  <Bar yAxisId="right" dataKey="revenue" fill="#82ca9d" name="Revenue ($)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Destination Distribution Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Popular Destinations</CardTitle>
            <CardDescription>Booking distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={destinationData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {destinationData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Hourly Bookings Chart */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Hourly Booking Distribution</CardTitle>
            <CardDescription>Average bookings by hour</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={hourlyBookingsData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="bookings" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
