
export interface Terminal {
  id: number;
  name: string;
  coordinates: [number, number];
  taxiCount: number;
  destinations: string[];
  prices?: { destination: string; price: number }[];
}

export interface MapProps {
  onMapLoaded?: () => void;
  selectedTerminalId?: number;
}

// Add the global showRoute function type
declare global {
  interface Window {
    showRoute: (terminalId: number) => void;
  }
}
