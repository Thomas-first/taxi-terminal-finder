
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix Leaflet default icon
export const setupDefaultIcon = () => {
  const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 38],
    iconAnchor: [12, 38],
  });
  
  L.Marker.prototype.options.icon = DefaultIcon;
};

// Custom taxi icon
export const taxiIcon = L.divIcon({
  className: 'taxi-marker-icon',
  html: '<div class="w-8 h-8 bg-taxi text-black flex items-center justify-center rounded-full shadow-lg">🚕</div>',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

// Custom user icon
export const userIcon = L.divIcon({
  className: 'user-marker-icon',
  html: '<div class="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full shadow-lg">👤</div>',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});
