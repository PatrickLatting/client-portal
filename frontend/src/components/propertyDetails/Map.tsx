// MapComponent.tsx
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useState, useEffect } from "react";

// Fix for default marker icons
delete (L.Icon.Default.prototype as unknown as { _getIconUrl: unknown })
  ._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MapComponentProps {
  latitude: number;
  longitude: number;
  zoom?: number;
}

const MapComponent = ({
  latitude,
  longitude,
  zoom = 13,
}: MapComponentProps) => {
  const [position, setPosition] = useState<[number, number]>([
    latitude,
    longitude,
  ]);

  useEffect(() => {
    setPosition([latitude, longitude]);
  }, [latitude, longitude]);

  return (
    <div className="h-96 w-full z-0">
      <MapContainer
        center={position}
        zoom={zoom}
        scrollWheelZoom={true}
        className="h-full w-full rounded-lg z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            Location: {latitude as number}, {longitude as number}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapComponent;
