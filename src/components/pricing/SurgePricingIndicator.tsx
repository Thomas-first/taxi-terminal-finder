
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  CloudRain, 
  Calendar,
  HelpCircle
} from 'lucide-react';
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Terminal, SurgePricingParams } from '../map/types';

interface SurgePricingIndicatorProps {
  terminal: Terminal;
  onPricingUpdate?: (multiplier: number) => void;
}

const SurgePricingIndicator: React.FC<SurgePricingIndicatorProps> = ({ 
  terminal,
  onPricingUpdate
}) => {
  const [surgePricing, setSurgePricing] = useState<SurgePricingParams | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const calculateSurgePricing = async () => {
      setIsLoading(true);
      try {
        // If the global function is available, use it
        if (window.getSurgePricing) {
          const params = await window.getSurgePricing(terminal.id);
          setSurgePricing(params);
          
          // Calculate total multiplier
          const totalMultiplier = 
            params.baseMultiplier * 
            (1 + params.demandFactor) * 
            (1 + params.timeFactor) * 
            (1 + params.weatherFactor) * 
            (1 + params.specialEventFactor);
          
          // Round to 2 decimal places
          const roundedMultiplier = Math.round(totalMultiplier * 100) / 100;
          
          if (onPricingUpdate) {
            onPricingUpdate(roundedMultiplier);
          }
        } else {
          // Demo data if no API is available
          const mockParams: SurgePricingParams = {
            baseMultiplier: 1,
            demandFactor: Math.random() * 0.3, // 0-30% increase for demand
            timeFactor: getCurrentTimeFactor(),
            weatherFactor: Math.random() * 0.2, // 0-20% increase for weather
            specialEventFactor: Math.random() > 0.8 ? 0.15 : 0 // 20% chance of special event
          };
          
          setSurgePricing(mockParams);
          
          // Calculate total multiplier
          const totalMultiplier = 
            mockParams.baseMultiplier * 
            (1 + mockParams.demandFactor) * 
            (1 + mockParams.timeFactor) * 
            (1 + mockParams.weatherFactor) * 
            (1 + mockParams.specialEventFactor);
          
          // Round to 2 decimal places
          const roundedMultiplier = Math.round(totalMultiplier * 100) / 100;
          
          if (onPricingUpdate) {
            onPricingUpdate(roundedMultiplier);
          }
        }
      } catch (error) {
        console.error("Error calculating surge pricing:", error);
      } finally {
        setIsLoading(false);
      }
    };

    calculateSurgePricing();
    
    // Recalculate every 5 minutes
    const interval = setInterval(calculateSurgePricing, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [terminal.id, onPricingUpdate]);

  // Calculate time factor based on current hour
  const getCurrentTimeFactor = () => {
    const hour = new Date().getHours();
    // Rush hours: 7-9 AM and 5-7 PM
    if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
      return 0.25; // 25% increase during rush hours
    }
    // Late night: 11 PM - 5 AM
    if (hour >= 23 || hour <= 5) {
      return 0.20; // 20% increase during late night
    }
    return 0; // No increase during normal hours
  };

  // Calculate the total multiplier from all factors
  const calculateTotalMultiplier = () => {
    if (!surgePricing) return 1;
    
    return (
      surgePricing.baseMultiplier * 
      (1 + surgePricing.demandFactor) * 
      (1 + surgePricing.timeFactor) * 
      (1 + surgePricing.weatherFactor) * 
      (1 + surgePricing.specialEventFactor)
    );
  };

  const totalMultiplier = calculateTotalMultiplier();
  const isHigh = totalMultiplier > 1.5;
  const isMedium = totalMultiplier > 1.2 && totalMultiplier <= 1.5;
  const isLow = totalMultiplier <= 1.2 && totalMultiplier > 1;

  if (isLoading) {
    return (
      <div className="flex items-center text-sm">
        <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-5 w-20 rounded"></div>
      </div>
    );
  }

  if (totalMultiplier <= 1) {
    return (
      <div className="flex items-center text-sm text-green-600">
        <TrendingDown className="h-4 w-4 mr-1" />
        <span>Normal rates</span>
      </div>
    );
  }

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className={`flex items-center text-sm cursor-help ${
          isHigh ? 'text-red-600' : isMedium ? 'text-amber-600' : 'text-yellow-600'
        }`}>
          <TrendingUp className="h-4 w-4 mr-1" />
          <span>{totalMultiplier.toFixed(2)}x surge pricing</span>
          <HelpCircle className="h-3 w-3 ml-1 opacity-70" />
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-3">
        <h4 className="font-semibold mb-2">Surge Pricing Factors</h4>
        <div className="space-y-2 text-sm">
          {surgePricing?.demandFactor ? (
            <div className="flex justify-between items-center">
              <span className="flex items-center">
                <TrendingUp className="h-4 w-4 mr-1 text-red-500" />
                High demand
              </span>
              <span>+{Math.round(surgePricing.demandFactor * 100)}%</span>
            </div>
          ) : null}
          
          {surgePricing?.timeFactor ? (
            <div className="flex justify-between items-center">
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1 text-blue-500" />
                Time of day
              </span>
              <span>+{Math.round(surgePricing.timeFactor * 100)}%</span>
            </div>
          ) : null}
          
          {surgePricing?.weatherFactor ? (
            <div className="flex justify-between items-center">
              <span className="flex items-center">
                <CloudRain className="h-4 w-4 mr-1 text-blue-500" />
                Weather conditions
              </span>
              <span>+{Math.round(surgePricing.weatherFactor * 100)}%</span>
            </div>
          ) : null}
          
          {surgePricing?.specialEventFactor ? (
            <div className="flex justify-between items-center">
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-purple-500" />
                Special events
              </span>
              <span>+{Math.round(surgePricing.specialEventFactor * 100)}%</span>
            </div>
          ) : null}
          
          <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700 flex justify-between font-medium">
            <span>Total surge:</span>
            <span>{totalMultiplier.toFixed(2)}x</span>
          </div>
        </div>
        
        <p className="text-xs text-gray-500 mt-2">
          Prices fluctuate based on real-time demand, time of day, and other factors.
        </p>
      </HoverCardContent>
    </HoverCard>
  );
};

export default SurgePricingIndicator;
