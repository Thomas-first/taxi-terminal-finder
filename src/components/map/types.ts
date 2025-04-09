
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
}

export interface UserPreferences {
  preferredPaymentMethod?: string;
  preferredVehicleType?: string;
  notificationsEnabled: boolean;
  darkModeEnabled: boolean;
  accessibilityNeeds?: string[];
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
  }
}
