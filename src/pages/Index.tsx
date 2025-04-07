
import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import Map from "@/components/Map";
import TerminalList from "@/components/TerminalList";
import { Search, MapPin, Menu, X, MoonStar, Sun } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Terminal {
  id: number;
  name: string;
  distance: string;
  taxiCount: number;
  destinations: string[];
}

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const { toast } = useToast();

  // Demo data - in a real app, this would come from an API
  const [terminals] = useState<Terminal[]>([
    {
      id: 1,
      name: "Central Taxi Terminal",
      distance: "1.2 km",
      taxiCount: 15,
      destinations: ["Downtown", "Airport", "Shopping Mall"]
    },
    {
      id: 2,
      name: "North Station Taxis",
      distance: "0.8 km",
      taxiCount: 8,
      destinations: ["City Center", "Beach", "University"]
    },
    {
      id: 3,
      name: "East Terminal",
      distance: "1.5 km",
      taxiCount: 12,
      destinations: ["Hospital", "Business Park", "Stadium"]
    }
  ]);

  const handleSearch = (query: string) => {
    toast({
      title: "Search initiated",
      description: `Searching for "${query}"`,
    });
    // In a real app, this would trigger an API call
    console.log("Searching for:", query);
  };

  const handleSelectTerminal = (terminal: Terminal) => {
    toast({
      title: "Terminal selected",
      description: `You selected ${terminal.name}`,
    });
    // In a real app, this would update the map focus
    console.log("Selected terminal:", terminal);
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
      <header className="bg-white dark:bg-gray-800 shadow-md p-4 z-10">
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
          } lg:translate-x-0 w-full max-w-sm bg-gray-50 dark:bg-gray-900 transform transition-transform duration-300 ease-in-out absolute lg:relative z-20 h-[calc(100vh-64px)] shadow-lg lg:shadow-none`}
        >
          <div className="p-4">
            <SearchBar onSearch={handleSearch} />
            
            <div className="mt-6">
              <TerminalList 
                terminals={terminals} 
                onSelectTerminal={handleSelectTerminal} 
              />
            </div>
          </div>
        </aside>

        {/* Map */}
        <main className="flex-1 p-4 lg:p-6">
          <div className="h-full relative rounded-lg overflow-hidden shadow-xl">
            <Map />
            
            {/* Mobile search button */}
            <div className="lg:hidden absolute bottom-4 right-4">
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
