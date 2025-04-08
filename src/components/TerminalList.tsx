
import { Car, MapPin, Clock, DollarSign, Navigation } from "lucide-react";

interface PriceInfo {
  destination: string;
  price: number;
}

interface Terminal {
  id: number;
  name: string;
  distance: string;
  distanceValue: number;
  taxiCount: number;
  destinations: string[];
  prices?: PriceInfo[];
}

interface TerminalListProps {
  terminals: Terminal[];
  onSelectTerminal: (terminal: Terminal) => void;
  selectedTerminalId?: number;
}

const TerminalList = ({ 
  terminals, 
  onSelectTerminal, 
  selectedTerminalId 
}: TerminalListProps) => {
  // Get price for a destination (Helper function)
  const getPriceForDestination = (terminal: Terminal, destination: string) => {
    if (!terminal.prices) return null;
    return terminal.prices.find(p => p.destination === destination);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 bg-primary text-white">
        <h2 className="font-bold text-xl">Nearby Terminals</h2>
      </div>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[50vh] overflow-y-auto">
        {terminals.length > 0 ? (
          terminals.map((terminal) => (
            <div
              key={terminal.id}
              className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                selectedTerminalId === terminal.id ? 'bg-blue-50 dark:bg-gray-600' : ''
              }`}
              onClick={() => onSelectTerminal(terminal)}
            >
              <div className="flex items-start">
                <div className="bg-taxi/20 p-2 rounded-full mr-3">
                  <Car className="h-5 w-5 text-taxi-dark" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{terminal.name}</h3>
                  <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                    <MapPin className="h-4 w-4 mr-1" />
                    <p>{terminal.distance} away</p>
                    <span className="mx-1">•</span>
                    <Clock className="h-4 w-4 mr-1" />
                    <p>Open now</p>
                  </div>
                  <div className="mt-2 flex items-center">
                    <div className="bg-green-100 dark:bg-green-800/30 text-green-800 dark:text-green-300 px-2 py-0.5 rounded text-xs font-medium">
                      {terminal.taxiCount} taxis available
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">DESTINATIONS & PRICING</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {terminal.destinations.map((dest, index) => {
                        const priceInfo = getPriceForDestination(terminal, dest);
                        return (
                          <div 
                            key={index}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-600 rounded text-xs flex items-center"
                          >
                            <span>{dest}</span>
                            {priceInfo && (
                              <span className="ml-1 flex items-center text-green-700 dark:text-green-400">
                                <DollarSign className="h-3 w-3 ml-1" />
                                {priceInfo.price.toFixed(2)}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            <p>No terminals found nearby</p>
            <p className="text-sm mt-2">Try expanding your search area</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TerminalList;
