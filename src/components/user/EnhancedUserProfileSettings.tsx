
import React, { useState } from 'react';
import { 
  User, 
  Car, 
  Thermometer, 
  Music, 
  MessageSquare, 
  Languages, 
  Star,
  Clock,
  Users,
  Save
} from 'lucide-react';
import { User as UserType, TravelPreferences, UserPreferences } from '../map/types';
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

interface EnhancedUserProfileSettingsProps {
  user: UserType;
  onSave: (updatedUser: UserType) => void;
}

const EnhancedUserProfileSettings: React.FC<EnhancedUserProfileSettingsProps> = ({ 
  user,
  onSave
}) => {
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    preferences: UserPreferences;
    travelPreferences: TravelPreferences;
    language: string;
    frequentDestinations: string[];
    accessibilityNeeds: string[];
  }>({
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    preferences: user.preferences || {
      preferredPaymentMethod: '',
      preferredVehicleType: '',
      notificationsEnabled: true,
      darkModeEnabled: false,
      preferredDriverLanguages: [],
      minimumDriverRating: 4,
      rideSharingPreference: 'ask',
      maxWaitTime: 10
    },
    travelPreferences: user.travelPreferences || {
      preferredSeatPosition: 'back-right',
      luggageSize: 'medium',
      temperaturePreference: 'no-preference',
      musicPreference: 'no-preference',
      conversationPreference: 'no-preference'
    },
    language: user.language || 'en',
    frequentDestinations: user.frequentDestinations || [],
    accessibilityNeeds: user.accessibilityNeeds || []
  });
  
  const [newDestination, setNewDestination] = useState('');
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePreferenceChange = (key: keyof UserPreferences, value: any) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }));
  };

  const handleTravelPreferenceChange = (key: keyof TravelPreferences, value: any) => {
    setFormData(prev => ({
      ...prev,
      travelPreferences: {
        ...prev.travelPreferences,
        [key]: value
      }
    }));
  };

  const handleToggleAccessibilityNeed = (need: string) => {
    setFormData(prev => {
      const current = [...prev.accessibilityNeeds];
      if (current.includes(need)) {
        return {
          ...prev,
          accessibilityNeeds: current.filter(n => n !== need)
        };
      } else {
        return {
          ...prev,
          accessibilityNeeds: [...current, need]
        };
      }
    });
  };

  const handleAddDestination = () => {
    if (newDestination.trim() && !formData.frequentDestinations.includes(newDestination.trim())) {
      setFormData(prev => ({
        ...prev,
        frequentDestinations: [...prev.frequentDestinations, newDestination.trim()]
      }));
      setNewDestination('');
    }
  };

  const handleRemoveDestination = (destination: string) => {
    setFormData(prev => ({
      ...prev,
      frequentDestinations: prev.frequentDestinations.filter(d => d !== destination)
    }));
  };

  const handleSave = () => {
    const updatedUser: UserType = {
      ...user,
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      preferences: formData.preferences,
      travelPreferences: formData.travelPreferences,
      language: formData.language,
      frequentDestinations: formData.frequentDestinations,
      accessibilityNeeds: formData.accessibilityNeeds
    };
    
    onSave(updatedUser);
    
    toast({
      title: "Profile Updated",
      description: "Your profile settings have been saved successfully.",
    });
  };

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-xl font-bold">Profile Settings</h2>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="basicInfo">
          <AccordionTrigger className="text-lg font-medium">
            <div className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              <span>Basic Information</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange} 
                placeholder="Your full name" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                value={formData.email} 
                onChange={handleInputChange} 
                placeholder="your.email@example.com" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                name="phone" 
                value={formData.phone} 
                onChange={handleInputChange} 
                placeholder="Your phone number" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="language">Preferred Language</Label>
              <Select 
                value={formData.language} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}
              >
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="zh">Chinese</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="ridePreferences">
          <AccordionTrigger className="text-lg font-medium">
            <div className="flex items-center">
              <Car className="mr-2 h-5 w-5" />
              <span>Ride Preferences</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="vehicleType">Preferred Vehicle Type</Label>
              <Select 
                value={formData.preferences.preferredVehicleType || ''} 
                onValueChange={(value) => handlePreferenceChange('preferredVehicleType', value)}
              >
                <SelectTrigger id="vehicleType">
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No preference</SelectItem>
                  <SelectItem value="Sedan">Sedan</SelectItem>
                  <SelectItem value="SUV">SUV</SelectItem>
                  <SelectItem value="Van">Van</SelectItem>
                  <SelectItem value="Luxury">Luxury</SelectItem>
                  <SelectItem value="Electric">Electric</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Minimum Driver Rating</Label>
              <div className="flex items-center gap-2">
                <Slider 
                  value={[formData.preferences.minimumDriverRating || 0]} 
                  onValueChange={(value) => handlePreferenceChange('minimumDriverRating', value[0])} 
                  max={5} 
                  step={0.5} 
                />
                <span className="flex items-center min-w-[60px] font-medium">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  {formData.preferences.minimumDriverRating || 0}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Maximum Wait Time (minutes)</Label>
              <div className="flex items-center gap-2">
                <Slider 
                  value={[formData.preferences.maxWaitTime || 10]} 
                  onValueChange={(value) => handlePreferenceChange('maxWaitTime', value[0])} 
                  max={30} 
                  step={1} 
                />
                <span className="flex items-center min-w-[60px] font-medium">
                  <Clock className="h-4 w-4 mr-1" />
                  {formData.preferences.maxWaitTime || 10}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Ride Sharing Preference</Label>
              <RadioGroup 
                value={formData.preferences.rideSharingPreference || 'ask'} 
                onValueChange={(value: 'always' | 'never' | 'ask') => handlePreferenceChange('rideSharingPreference', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="always" id="always" />
                  <Label htmlFor="always">Always allow</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="never" id="never" />
                  <Label htmlFor="never">Never allow</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ask" id="ask" />
                  <Label htmlFor="ask">Ask each time</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label>Notifications</Label>
              <div className="flex items-center justify-between">
                <span className="text-sm">Enable ride notifications</span>
                <Switch 
                  checked={formData.preferences.notificationsEnabled} 
                  onCheckedChange={(checked) => handlePreferenceChange('notificationsEnabled', checked)} 
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="travelComfort">
          <AccordionTrigger className="text-lg font-medium">
            <div className="flex items-center">
              <Thermometer className="mr-2 h-5 w-5" />
              <span>Comfort Preferences</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Preferred Seat Position</Label>
              <RadioGroup 
                value={formData.travelPreferences.preferredSeatPosition || 'back-right'} 
                onValueChange={(value: 'front' | 'back-left' | 'back-right' | 'back-middle') => 
                  handleTravelPreferenceChange('preferredSeatPosition', value)
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="front" id="front" />
                  <Label htmlFor="front">Front passenger</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="back-left" id="back-left" />
                  <Label htmlFor="back-left">Back seat (left)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="back-right" id="back-right" />
                  <Label htmlFor="back-right">Back seat (right)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="back-middle" id="back-middle" />
                  <Label htmlFor="back-middle">Back seat (middle)</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label>Luggage Size</Label>
              <Select 
                value={formData.travelPreferences.luggageSize || 'medium'} 
                onValueChange={(value: 'none' | 'small' | 'medium' | 'large') => 
                  handleTravelPreferenceChange('luggageSize', value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select luggage size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No luggage</SelectItem>
                  <SelectItem value="small">Small (backpack/briefcase)</SelectItem>
                  <SelectItem value="medium">Medium (carry-on)</SelectItem>
                  <SelectItem value="large">Large (checked bag)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Temperature Preference</Label>
              <Select 
                value={formData.travelPreferences.temperaturePreference || 'no-preference'} 
                onValueChange={(value: 'cool' | 'warm' | 'no-preference') => 
                  handleTravelPreferenceChange('temperaturePreference', value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select temperature" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cool">Cool</SelectItem>
                  <SelectItem value="warm">Warm</SelectItem>
                  <SelectItem value="no-preference">No preference</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Music Preference</Label>
              <Select 
                value={formData.travelPreferences.musicPreference || 'no-preference'} 
                onValueChange={(value: 'quiet' | 'soft' | 'energetic' | 'no-preference') => 
                  handleTravelPreferenceChange('musicPreference', value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select music preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quiet">Quiet ride (no music)</SelectItem>
                  <SelectItem value="soft">Soft background music</SelectItem>
                  <SelectItem value="energetic">Energetic music</SelectItem>
                  <SelectItem value="no-preference">No preference</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Conversation Preference</Label>
              <Select 
                value={formData.travelPreferences.conversationPreference || 'no-preference'} 
                onValueChange={(value: 'chatty' | 'quiet' | 'no-preference') => 
                  handleTravelPreferenceChange('conversationPreference', value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select conversation preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="chatty">Chatty (enjoy conversation)</SelectItem>
                  <SelectItem value="quiet">Quiet ride (minimal talking)</SelectItem>
                  <SelectItem value="no-preference">No preference</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="frequentDestinations">
          <AccordionTrigger className="text-lg font-medium">
            <div className="flex items-center">
              <Star className="mr-2 h-5 w-5" />
              <span>Frequent Destinations</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Input 
                  placeholder="Add a frequent destination" 
                  value={newDestination} 
                  onChange={(e) => setNewDestination(e.target.value)} 
                />
              </div>
              <Button onClick={handleAddDestination} type="button">Add</Button>
            </div>
            
            <div className="space-y-2">
              {formData.frequentDestinations.length === 0 ? (
                <p className="text-sm text-gray-500">No frequent destinations added yet</p>
              ) : (
                <div className="space-y-2">
                  {formData.frequentDestinations.map((destination, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-2 rounded">
                      <span>{destination}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveDestination(destination)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="accessibility">
          <AccordionTrigger className="text-lg font-medium">
            <div className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              <span>Accessibility Needs</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <div className="space-y-2">
              {['Wheelchair accessible', 'Service animal friendly', 'Visual assistance', 'Hearing assistance', 'Extra time for boarding', 'Low-step vehicle'].map((need) => (
                <div key={need} className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id={need.replace(/\s+/g, '-').toLowerCase()} 
                    checked={formData.accessibilityNeeds.includes(need)} 
                    onChange={() => handleToggleAccessibilityNeed(need)} 
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor={need.replace(/\s+/g, '-').toLowerCase()}>{need}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <div className="pt-4 flex justify-end">
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Profile Settings
        </Button>
      </div>
    </div>
  );
};

export default EnhancedUserProfileSettings;
