
import { Car } from "lucide-react";

interface Terminal {
  id: number;
  name: string;
  distance: string;
  taxiCount: number;
  destinations: string[];
}

interface TerminalListProps {
  terminals: Terminal[];
  onSelectTerminal: (terminal: Terminal) => void;
}

const TerminalList = ({ terminals, onSelectTerminal }: TerminalListProps) => {
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
              className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
              onClick={() => onSelectTerminal(terminal)}
            >
              <div className="flex items-start">
                <div className="bg-taxi/20 p-2 rounded-full mr-3">
                  <Car className="h-5 w-5 text-taxi-dark" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{terminal.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {terminal.distance} away • {terminal.taxiCount} taxis available
                  </p>
                  <div className="mt-2">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">DESTINATIONS</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {terminal.destinations.map((dest, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-600 rounded text-xs"
                        >
                          {dest}
                        </span>
                      ))}
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
