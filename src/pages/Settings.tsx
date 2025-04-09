import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Moon, Sun, BellRing, MapPin, CreditCard, Globe, Clock, Laptop } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "@/components/theme/ThemeProvider";

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);
  const [preferredPayment, setPreferredPayment] = useState("card");
  const [language, setLanguage] = useState("en");
  const [autoBooking, setAutoBooking] = useState(false);
  const [rideSharing, setRideSharing] = useState("ask");
  
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSaveSettings = () => {
    // In a real app, this would save to user settings in backend
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated.",
    });
  };

  const handleReset = () => {
    setTheme("system");
    setNotifications(true);
    setLocationSharing(true);
    setPreferredPayment("card");
    setLanguage("en");
    setAutoBooking(false);
    setRideSharing("ask");
    
    toast({
      title: "Settings Reset",
      description: "Your preferences have been reset to defaults.",
    });
  };

  const handleBack = () => {
    navigate('/profile');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-md p-4">
        <div className="container mx-auto flex items-center">
          <Button variant="ghost" onClick={handleBack} className="mr-4">
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-bold">Settings</h1>
        </div>
      </header>

      <main className="container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sun className="mr-2" size={18} />
                <Moon className="mr-2" size={18} />
                Appearance
              </CardTitle>
              <CardDescription>Customize how the app looks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label className="mb-2 block">Theme</Label>
                  <RadioGroup 
                    value={theme} 
                    onValueChange={(value: "light" | "dark" | "system") => setTheme(value)}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="light" id="light" />
                      <Label htmlFor="light" className="flex items-center">
                        <Sun className="mr-2 h-4 w-4" />
                        Light
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dark" id="dark" />
                      <Label htmlFor="dark" className="flex items-center">
                        <Moon className="mr-2 h-4 w-4" />
                        Dark
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="system" id="system" />
                      <Label htmlFor="system" className="flex items-center">
                        <Laptop className="mr-2 h-4 w-4" />
                        System
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="mt-6">
                  <Label htmlFor="language">Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger id="language" className="mt-1">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="zh">中文</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BellRing className="mr-2" size={18} />
                Notifications
              </CardTitle>
              <CardDescription>Manage notification settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications">Enable Notifications</Label>
                <Switch 
                  id="notifications" 
                  checked={notifications} 
                  onCheckedChange={setNotifications} 
                />
              </div>

              <Separator className="my-4" />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="booking-confirm" className="text-sm">Booking Confirmations</Label>
                  <Switch 
                    id="booking-confirm" 
                    checked={notifications} 
                    disabled={!notifications}
                    onCheckedChange={() => {}} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="driver-arrival" className="text-sm">Driver Arrival Alerts</Label>
                  <Switch 
                    id="driver-arrival" 
                    checked={notifications} 
                    disabled={!notifications}
                    onCheckedChange={() => {}} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="promo-offers" className="text-sm">Promotional Offers</Label>
                  <Switch 
                    id="promo-offers" 
                    checked={false} 
                    disabled={!notifications}
                    onCheckedChange={() => {}} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2" size={18} />
                Privacy & Location
              </CardTitle>
              <CardDescription>Manage location and privacy settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Label htmlFor="location-sharing">Share Location</Label>
                <Switch 
                  id="location-sharing" 
                  checked={locationSharing} 
                  onCheckedChange={setLocationSharing} 
                />
              </div>

              <div className="mt-6">
                <Label>Data Collection</Label>
                <RadioGroup 
                  defaultValue="minimal" 
                  className="mt-2 space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="minimal" id="minimal" />
                    <Label htmlFor="minimal" className="text-sm">Minimal (essential only)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="balanced" id="balanced" />
                    <Label htmlFor="balanced" className="text-sm">Balanced (improve recommendations)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="full" id="full" />
                    <Label htmlFor="full" className="text-sm">Full (all features and personalization)</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2" size={18} />
                Payment Preferences
              </CardTitle>
              <CardDescription>Set your preferred payment methods</CardDescription>
            </CardHeader>
            <CardContent>
              <Label htmlFor="payment-method">Default Payment Method</Label>
              <RadioGroup 
                value={preferredPayment}
                onValueChange={setPreferredPayment}
                className="mt-2 space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="text-sm">Credit Card</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="paypal" id="paypal" />
                  <Label htmlFor="paypal" className="text-sm">PayPal</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="applepay" id="applepay" />
                  <Label htmlFor="applepay" className="text-sm">Apple Pay</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="googlepay" id="googlepay" />
                  <Label htmlFor="googlepay" className="text-sm">Google Pay</Label>
                </div>
              </RadioGroup>

              <div className="mt-4 flex items-center justify-between">
                <Label htmlFor="auto-receipt" className="text-sm">Email Receipts Automatically</Label>
                <Switch 
                  id="auto-receipt" 
                  checked={true}
                  onCheckedChange={() => {}} 
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2" size={18} />
                Booking Preferences
              </CardTitle>
              <CardDescription>Customize your booking experience</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-booking">Auto-book for connected travel</Label>
                <Switch 
                  id="auto-booking" 
                  checked={autoBooking} 
                  onCheckedChange={setAutoBooking} 
                />
              </div>

              <div className="mt-6">
                <Label htmlFor="ride-sharing">Ride Sharing Preference</Label>
                <Select value={rideSharing} onValueChange={setRideSharing}>
                  <SelectTrigger id="ride-sharing" className="mt-1">
                    <SelectValue placeholder="Select preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="always">Always share rides</SelectItem>
                    <SelectItem value="never">Never share rides</SelectItem>
                    <SelectItem value="ask">Ask me each time</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="mt-4">
                <Label htmlFor="wait-time">Maximum Wait Time</Label>
                <Select defaultValue="15">
                  <SelectTrigger id="wait-time" className="mt-1">
                    <SelectValue placeholder="Select wait time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 minutes</SelectItem>
                    <SelectItem value="10">10 minutes</SelectItem>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="20">20 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="mr-2" size={18} />
                Travel Preferences
              </CardTitle>
              <CardDescription>Set your preferences for taxi rides</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="seat-position">Preferred Seat Position</Label>
                  <Select defaultValue="back-right">
                    <SelectTrigger id="seat-position" className="mt-1">
                      <SelectValue placeholder="Select seat position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="front">Front Seat</SelectItem>
                      <SelectItem value="back-left">Back Left</SelectItem>
                      <SelectItem value="back-right">Back Right</SelectItem>
                      <SelectItem value="back-middle">Back Middle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="luggage-size">Typical Luggage Size</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger id="luggage-size" className="mt-1">
                      <SelectValue placeholder="Select luggage size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Luggage</SelectItem>
                      <SelectItem value="small">Small Bag</SelectItem>
                      <SelectItem value="medium">Medium Suitcase</SelectItem>
                      <SelectItem value="large">Large Suitcase</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="temp-preference">Temperature Preference</Label>
                  <Select defaultValue="cool">
                    <SelectTrigger id="temp-preference" className="mt-1">
                      <SelectValue placeholder="Select temperature" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cool">Cool</SelectItem>
                      <SelectItem value="warm">Warm</SelectItem>
                      <SelectItem value="no-preference">No Preference</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="music-preference">Music Preference</Label>
                  <Select defaultValue="soft">
                    <SelectTrigger id="music-preference" className="mt-1">
                      <SelectValue placeholder="Select music preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quiet">No Music</SelectItem>
                      <SelectItem value="soft">Soft Background Music</SelectItem>
                      <SelectItem value="energetic">Energetic Music</SelectItem>
                      <SelectItem value="no-preference">No Preference</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="convo-preference">Conversation Preference</Label>
                  <Select defaultValue="quiet">
                    <SelectTrigger id="convo-preference" className="mt-1">
                      <SelectValue placeholder="Select conversation style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="chatty">Chatty</SelectItem>
                      <SelectItem value="quiet">Quiet</SelectItem>
                      <SelectItem value="no-preference">No Preference</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="min-rating">Minimum Driver Rating</Label>
                  <Select defaultValue="4">
                    <SelectTrigger id="min-rating" className="mt-1">
                      <SelectValue placeholder="Select minimum rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3.0+</SelectItem>
                      <SelectItem value="3.5">3.5+</SelectItem>
                      <SelectItem value="4">4.0+</SelectItem>
                      <SelectItem value="4.5">4.5+</SelectItem>
                      <SelectItem value="4.8">4.8+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={handleReset}>
            Reset to Defaults
          </Button>
          <Button onClick={handleSaveSettings}>
            Save Settings
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Settings;
