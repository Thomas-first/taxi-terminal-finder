
import React, { useState, useEffect } from 'react';
import { 
  User, 
  Star, 
  MessageSquare, 
  Shield, 
  ThumbsUp, 
  Languages,
  Car,
  Award
} from 'lucide-react';
import { Taxi, UserPreferences } from '../map/types';
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface DriverMatchingPanelProps {
  availableTaxis: Taxi[];
  userPreferences?: UserPreferences;
  onDriverSelect: (taxi: Taxi) => void;
}

const DriverMatchingPanel: React.FC<DriverMatchingPanelProps> = ({
  availableTaxis,
  userPreferences,
  onDriverSelect
}) => {
  const [rankedDrivers, setRankedDrivers] = useState<Array<Taxi & { matchScore: number }>>([]);
  const [selectedDriverId, setSelectedDriverId] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Sort and rank drivers based on user preferences
    const rankDrivers = () => {
      const ranked = availableTaxis
        .filter(taxi => taxi.isAvailable)
        .map(taxi => {
          // Start with a base score of 70
          let matchScore = 70;
          
          // Add up to 20 points based on driver rating (0-5 scale)
          matchScore += (taxi.rating / 5) * 20;
          
          // Check for preference matches if we have user preferences
          if (userPreferences) {
            // Match preferred vehicle type (up to 5 points)
            if (userPreferences.preferredVehicleType === taxi.vehicleType) {
              matchScore += 5;
            }
            
            // Match minimum driver rating (up to 5 points)
            if (userPreferences.minimumDriverRating && taxi.rating >= userPreferences.minimumDriverRating) {
              matchScore += 5;
            }
            
            // Match language preferences (up to 5 points)
            if (userPreferences.preferredDriverLanguages && taxi.languages) {
              const languageMatches = userPreferences.preferredDriverLanguages.filter(
                lang => taxi.languages?.includes(lang)
              );
              if (languageMatches.length > 0) {
                matchScore += Math.min(languageMatches.length * 2, 5);
              }
            }
          }
          
          // Cap the score at 100
          matchScore = Math.min(Math.round(matchScore), 100);
          
          return {
            ...taxi,
            matchScore
          };
        })
        .sort((a, b) => b.matchScore - a.matchScore); // Sort by match score (highest first)
      
      setRankedDrivers(ranked);
    };
    
    rankDrivers();
  }, [availableTaxis, userPreferences]);

  const handleSelectDriver = (taxi: Taxi & { matchScore: number }) => {
    setSelectedDriverId(taxi.id);
    onDriverSelect(taxi);
    
    toast({
      title: "Driver Selected",
      description: `You've been matched with ${taxi.driverName} (${taxi.matchScore}% match)`,
    });
  };

  const getMatchLabel = (score: number) => {
    if (score >= 90) return "Excellent Match";
    if (score >= 80) return "Great Match";
    if (score >= 70) return "Good Match";
    return "Fair Match";
  };

  const getMatchColor = (score: number) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 80) return "bg-green-400";
    if (score >= 70) return "bg-yellow-400";
    return "bg-yellow-300";
  };

  if (rankedDrivers.length === 0) {
    return (
      <div className="p-4 text-center">
        <Car className="mx-auto text-gray-400 mb-2" size={32} />
        <h3 className="font-medium text-lg mb-1">No drivers available</h3>
        <p className="text-gray-500 text-sm">
          Please try again in a few minutes or choose another terminal
        </p>
      </div>
    );
  }

  return (
    <div className="p-2 space-y-3">
      <h3 className="font-medium text-lg">Driver Matches</h3>
      <p className="text-sm text-gray-500">
        Drivers ranked by compatibility with your preferences
      </p>
      
      <div className="space-y-3 mt-3">
        {rankedDrivers.map((taxi) => (
          <div 
            key={taxi.id}
            className={`p-3 rounded-lg border transition-all ${
              selectedDriverId === taxi.id 
                ? 'border-primary bg-primary/5' 
                : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full mr-3">
                  <User className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </div>
                <div>
                  <h4 className="font-medium">{taxi.driverName}</h4>
                  <div className="flex items-center text-sm text-gray-500">
                    <Star className="h-3 w-3 text-yellow-500 mr-1" />
                    <span>{taxi.rating.toFixed(1)}</span>
                    <span className="mx-1">•</span>
                    <span>{taxi.vehicleType}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  {getMatchLabel(taxi.matchScore)}
                </div>
              </div>
            </div>
            
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span>Match Score</span>
                <span>{taxi.matchScore}%</span>
              </div>
              <Progress value={taxi.matchScore} className={getMatchColor(taxi.matchScore)} />
            </div>
            
            <div className="mt-2 flex flex-wrap gap-1">
              {taxi.features.map((feature, idx) => (
                <Badge variant="outline" key={idx} className="text-xs">
                  {feature}
                </Badge>
              ))}
              {taxi.languages && taxi.languages.map((lang, idx) => (
                <Badge variant="outline" key={`lang-${idx}`} className="flex items-center text-xs">
                  <Languages className="h-3 w-3 mr-1" /> {lang}
                </Badge>
              ))}
            </div>
            
            <div className="mt-3 flex justify-end">
              <Button 
                size="sm"
                onClick={() => handleSelectDriver(taxi)}
                disabled={selectedDriverId === taxi.id}
              >
                {selectedDriverId === taxi.id ? 'Selected' : 'Select Driver'}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DriverMatchingPanel;
