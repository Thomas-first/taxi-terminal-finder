
import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Toggle } from "@/components/ui/toggle";
import { 
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";

interface FilterPanelProps {
  maxDistance: number;
  distance: number;
  setDistance: (value: number) => void;
  minTaxiCount: number;
  setMinTaxiCount: (value: number) => void;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const FilterPanel = ({
  maxDistance,
  distance,
  setDistance,
  minTaxiCount,
  setMinTaxiCount,
  isOpen,
  setIsOpen
}: FilterPanelProps) => {
  const handleDistanceChange = (value: number[]) => {
    setDistance(value[0]);
  };

  const toggleTaxiFilter = (taxiCount: number) => {
    setMinTaxiCount(minTaxiCount === taxiCount ? 0 : taxiCount);
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full bg-white dark:bg-gray-800 rounded-lg shadow mb-4">
      <div className="p-3 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <Filter className="h-4 w-4 mr-2 text-primary" />
          <h3 className="font-medium">Filters</h3>
        </div>
        <CollapsibleTrigger asChild>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </CollapsibleTrigger>
      </div>
      
      <CollapsibleContent>
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Maximum Distance: {distance.toFixed(1)} km
            </label>
            <Slider
              defaultValue={[distance]}
              max={maxDistance}
              min={0.1}
              step={0.1}
              onValueChange={handleDistanceChange}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Minimum Taxis Available
            </label>
            <div className="flex space-x-2">
              <Toggle 
                pressed={minTaxiCount === 5} 
                onPressedChange={() => toggleTaxiFilter(5)} 
                className="px-3 py-1 text-sm"
              >
                5+
              </Toggle>
              <Toggle 
                pressed={minTaxiCount === 10} 
                onPressedChange={() => toggleTaxiFilter(10)} 
                className="px-3 py-1 text-sm"
              >
                10+
              </Toggle>
              <Toggle 
                pressed={minTaxiCount === 15} 
                onPressedChange={() => toggleTaxiFilter(15)} 
                className="px-3 py-1 text-sm"
              >
                15+
              </Toggle>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default FilterPanel;
