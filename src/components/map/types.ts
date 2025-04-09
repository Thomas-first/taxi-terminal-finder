
export interface Terminal {
  id: number;
  name: string;
  coordinates: [number, number];
  taxiCount: number;
  destinations: string[];
  prices?: { destination: string; price: number }[];
  // New fields for enhanced features
  availableTaxis?: Taxi[];
  realTimeTracking?: boolean;
  surgeMultiplier?: number; // For surge pricing
  estimatedWaitTime?: number; // In minutes
  rideSharingEnabled?: boolean; // For ride sharing feature
  integratedServices?: string[]; // For travel app integration
}

export interface Taxi {
  id: number;
  driverId: string;
  driverName: string;
  vehicleType: string;
  licensePlate: string;
  rating: number;
  isAvailable: boolean;
  currentLocation?: [number, number];
  destination?: string;
  estimatedArrival?: Date;
  passengerCapacity: number;
  features: string[]; // WiFi, child seat, etc.
  preferredRoutes?: string[]; // For driver-passenger matching
  acceptsSharing?: boolean; // For ride sharing
  languages?: string[]; // For enhanced matching
  currentPassengers?: number; // For ride sharing
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  paymentMethods?: PaymentMethod[];
  favoriteTerminals: number[];
  bookingHistory: Booking[];
  loyaltyPoints: number;
  preferences?: UserPreferences;
  // Enhanced profile features
  travelPreferences?: TravelPreferences; 
  frequentDestinations?: string[];
  language?: string;
  accessibilityNeeds?: string[];
  travelConnections?: TravelConnection[]; // For travel app integration
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'applepay' | 'googlepay';
  lastFour?: string;
  isDefault: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  terminalId: number;
  taxiId: number;
  driverId: string;
  pickupLocation: [number, number];
  destination: string;
  fare: number;
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: Date;
  scheduledFor?: Date;
  completedAt?: Date;
  isShared: boolean;
  passengers: number;
  rating?: number;
  feedback?: string;
  // New fields for enhanced features
  connectedTravelInfo?: TravelConnection; // For travel app integration
  matchScore?: number; // For driver-passenger matching
  originalFare?: number; // To show savings from ride sharing
  sharedWith?: string[]; // IDs of users sharing the ride
}

export interface UserPreferences {
  preferredPaymentMethod?: string;
  preferredVehicleType?: string;
  notificationsEnabled: boolean;
  darkModeEnabled: boolean;
  accessibilityNeeds?: string[];
  // Enhanced preferences
  preferredDriverLanguages?: string[];
  minimumDriverRating?: number;
  rideSharingPreference?: 'always' | 'never' | 'ask';
  maxWaitTime?: number; // in minutes
}

// New interfaces for enhanced features
export interface TravelPreferences {
  preferredSeatPosition?: 'front' | 'back-left' | 'back-right' | 'back-middle';
  luggageSize?: 'none' | 'small' | 'medium' | 'large';
  temperaturePreference?: 'cool' | 'warm' | 'no-preference';
  musicPreference?: 'quiet' | 'soft' | 'energetic' | 'no-preference';
  conversationPreference?: 'chatty' | 'quiet' | 'no-preference';
}

export interface TravelConnection {
  id: string;
  type: 'flight' | 'train' | 'bus';
  serviceProvider: string;
  confirmationCode: string;
  departureTime: Date;
  arrivalTime: Date;
  origin: string;
  destination: string;
  status?: 'on-time' | 'delayed' | 'cancelled';
  terminal?: string;
  gate?: string;
}

export interface SurgePricingParams {
  baseMultiplier: number;
  demandFactor: number;
  timeFactor: number;
  weatherFactor: number;
  specialEventFactor: number;
}

export interface RideSharingOption {
  id: string;
  originalBookingId: string;
  availableSeats: number;
  route: [number, number][]; // Array of coordinates forming the route
  pickupTime: Date;
  destination: string;
  potentialSavings: number; // in percentage
  detourTime: number; // in minutes
}

export interface MapProps {
  onMapLoaded?: () => void;
  selectedTerminalId?: number;
  user?: User;
}

// Add the global showRoute function type
declare global {
  interface Window {
    showRoute: (terminalId: number) => void;
    trackTaxi?: (taxiId: number) => void;
    bookTaxi?: (terminalId: number, destination: string, scheduled?: Date) => Promise<Booking>;
    getSurgePricing?: (terminalId: number, time?: Date) => Promise<SurgePricingParams>;
    findRideSharingOptions?: (origin: [number, number], destination: string) => Promise<RideSharingOption[]>;
    connectTravelApp?: (provider: string, authCode: string) => Promise<TravelConnection[]>;
  }
}
