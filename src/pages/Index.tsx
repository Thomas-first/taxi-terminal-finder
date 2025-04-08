
import { useState, useEffect } from "react";
import SearchBar from "@/components/SearchBar";
import Map from "@/components/Map";
import TerminalList from "@/components/TerminalList";
import FilterPanel from "@/components/FilterPanel";
import { Search, MapPin, Menu, X, MoonStar, Sun } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Terminal {
  id: number;
  name: string;
  distance: string;
  distanceValue: number; // Add numeric distance for filtering
  taxiCount: number;
  destinations: string[];
}

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedTerminalId, setSelectedTerminalId] = useState<number | undefined>(undefined);
  const { toast } = useToast();
  
  // Filter states
  const [maxDistance, setMaxDistance] = useState(5); // 5km max by default
  const [distance, setDistance] = useState(5);
  const [minTaxiCount, setMinTaxiCount] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Demo data - in a real app, this would come from an API
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
  }, []);

  const handleSearch = (query: string) => {
    toast({
      title: "Search initiated",
      description: `Searching for "${query}"`,
    });
    // In a real app, this would trigger an API call
    console.log("Searching for:", query);
  };

  const handleSelectTerminal = (terminal: Terminal) => {
    setSelectedTerminalId(terminal.id);
    toast({
      title: "Terminal selected",
      description: `You selected ${terminal.name}`,
    });
    // In a mobile view, close the sidebar after selection
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

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
          
          <div className="flex items-center">
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
            <Map selectedTerminalId={selectedTerminalId} />
            
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
    </div>
  );
};

export default Index;
