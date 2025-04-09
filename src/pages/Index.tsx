
import { useState, useEffect } from "react";
import SearchBar from "@/components/SearchBar";
import Map from "@/components/Map";
import TerminalList from "@/components/TerminalList";
import FilterPanel from "@/components/FilterPanel";
import { Search, MapPin, Menu, X, MoonStar, Sun, User as UserIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AuthModal from "@/components/auth/AuthModal";
import UserProfile from "@/components/user/UserProfile";
import PaymentMethodForm from "@/components/payment/PaymentMethodForm";
import { User, PaymentMethod, Booking } from "@/components/map/types";

interface Terminal {
  id: number;
  name: string;
  distance: string;
  distanceValue: number;
  taxiCount: number;
  destinations: string[];
}

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedTerminalId, setSelectedTerminalId] = useState<number | undefined>(undefined);
  const { toast } = useToast();
  
  // Authentication and user state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Filter states
  const [maxDistance, setMaxDistance] = useState(5);
  const [distance, setDistance] = useState(5);
  const [minTaxiCount, setMinTaxiCount] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Load mock terminals data
  const [allTerminals] = useState<Terminal[]>([
    {
      id: 1,
      name: "Central Taxi Terminal",
      distance: "1.2 km",
      distanceValue: 1.2,
      taxiCount: 15,
      destinations: ["Downtown", "Airport", "Shopping Mall"]
    },
    {
      id: 2,
      name: "North Station Taxis",
      distance: "0.8 km",
      distanceValue: 0.8,
      taxiCount: 8,
      destinations: ["City Center", "Beach", "University"]
    },
    {
      id: 3,
      name: "East Terminal",
      distance: "1.5 km",
      distanceValue: 1.5,
      taxiCount: 12,
      destinations: ["Hospital", "Business Park", "Stadium"]
    },
    {
      id: 4,
      name: "South Gate Taxis",
      distance: "2.3 km",
      distanceValue: 2.3,
      taxiCount: 5,
      destinations: ["Residential Areas", "Schools", "Parks"]
    },
    {
      id: 5,
      name: "West End Cab Station",
      distance: "3.7 km",
      distanceValue: 3.7,
      taxiCount: 20,
      destinations: ["Convention Center", "Hotels", "Entertainment District"]
    }
  ]);
  
  // Apply filters to terminals
  const filteredTerminals = allTerminals.filter(terminal => 
    terminal.distanceValue <= distance && 
    terminal.taxiCount >= minTaxiCount
  );

  useEffect(() => {
    // Check for user's preferred color scheme
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
    
    // Demo: Load stored user from localStorage if available
    const storedUserJson = localStorage.getItem('demoUser');
    if (storedUserJson) {
      try {
        const user = JSON.parse(storedUserJson);
        setCurrentUser(user);
      } catch (e) {
        console.error("Error parsing stored user", e);
      }
    }
  }, []);

  // Handle login
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('demoUser', JSON.stringify(user));
  };

  // Handle registration
  const handleRegister = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('demoUser', JSON.stringify(user));
  };

  // Handle logout
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('demoUser');
  };

  // Handle adding a payment method
  const handleAddPaymentMethod = (paymentMethod: PaymentMethod) => {
    if (!currentUser) return;
    
    const updatedUser = {
      ...currentUser,
      paymentMethods: [...(currentUser.paymentMethods || []), paymentMethod]
    };
    
    // If this is the first payment method or marked as default, make it default
    if (!currentUser.paymentMethods || currentUser.paymentMethods.length === 0 || paymentMethod.isDefault) {
      updatedUser.paymentMethods = updatedUser.paymentMethods.map(pm => ({
        ...pm,
        isDefault: pm.id === paymentMethod.id
      }));
    }
    
    setCurrentUser(updatedUser);
    localStorage.setItem('demoUser', JSON.stringify(updatedUser));
  };

  // Handle search
  const handleSearch = (query: string) => {
    toast({
      title: "Search initiated",
      description: `Searching for "${query}"`,
    });
    console.log("Searching for:", query);
  };

  // Handle terminal selection
  const handleSelectTerminal = (terminal: Terminal) => {
    setSelectedTerminalId(terminal.id);
    toast({
      title: "Terminal selected",
      description: `You selected ${terminal.name}`,
    });
    
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
    setDarkMode(!darkMode);
  };

  return (
    <div className={`flex flex-col h-screen ${darkMode ? 'dark' : ''}`}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md p-4 z-30">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 mr-4 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors lg:hidden"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center">
              <MapPin className="text-taxi mr-2" size={24} />
              <h1 className="text-xl font-bold">Taxi Terminal Finder</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {currentUser ? (
              <UserProfile 
                user={currentUser} 
                onLogout={handleLogout} 
                onAddPaymentMethod={() => setIsPaymentModalOpen(true)} 
              />
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <UserIcon size={20} />
              </button>
            )}
            
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={20} /> : <MoonStar size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside 
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 w-full max-w-sm bg-gray-50 dark:bg-gray-900 transform transition-transform duration-300 ease-in-out fixed lg:relative z-40 h-[calc(100vh-64px)] shadow-lg lg:shadow-none`}
        >
          <div className="p-4">
            <SearchBar onSearch={handleSearch} />
            
            <div className="mt-4">
              <FilterPanel 
                maxDistance={maxDistance}
                distance={distance}
                setDistance={setDistance}
                minTaxiCount={minTaxiCount}
                setMinTaxiCount={setMinTaxiCount}
                isOpen={filtersOpen}
                setIsOpen={setFiltersOpen}
              />
            </div>
            
            <div className="mt-2">
              <TerminalList 
                terminals={filteredTerminals} 
                onSelectTerminal={handleSelectTerminal}
                selectedTerminalId={selectedTerminalId}
              />
            </div>
          </div>
        </aside>

        {/* Map */}
        <main className="flex-1 p-4 lg:p-6 z-20">
          <div className="h-full relative rounded-lg overflow-hidden shadow-xl">
            <Map 
              selectedTerminalId={selectedTerminalId} 
              user={currentUser || undefined}
            />
            
            {/* Mobile search button */}
            <div className="lg:hidden absolute bottom-4 right-4 z-30">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Open search"
              >
                <Search size={24} className="text-primary" />
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onOpenChange={setIsAuthModalOpen} 
        onLogin={handleLogin} 
        onRegister={handleRegister} 
      />

      {/* Payment Method Modal */}
      <PaymentMethodForm 
        isOpen={isPaymentModalOpen} 
        onOpenChange={setIsPaymentModalOpen} 
        onAddPaymentMethod={handleAddPaymentMethod} 
      />
    </div>
  );
};

export default Index;
