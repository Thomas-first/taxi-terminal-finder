
import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { userIcon } from './MapIcons';

interface UserLocationMarkerProps {
  position: [number, number];
}

const UserLocationMarker: React.FC<UserLocationMarkerProps> = ({ position }) => {
  return (
    <Marker position={position} icon={userIcon}>
      <Popup>
        <div className="text-center">
          <strong>Your Location</strong>
        </div>
      </Popup>
    </Marker>
  );
};

export default UserLocationMarker;
