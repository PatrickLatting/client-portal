import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { PropertyDetails } from "../../types/propertyTypes";
import { Button } from "../ui/button";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Tooltip,
  CircleMarker,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import MarkerClusterGroup from 'react-leaflet-cluster';

// Separate component to fix marker icons
const SetupLeaflet: React.FC = () => {
  useEffect(() => {
    // Fix for default icon issues
    const defaultIcon = L.icon({
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    L.Marker.prototype.options.icon = defaultIcon;
  }, []);

  return null;
};

// Component to fit map bounds
const FitBounds: React.FC<{ properties: PropertyDetails[] }> = ({
  properties,
}) => {
  const map = useMap();

  useEffect(() => {
    if (properties.length === 0) return;

    try {
      // Use a sample of properties for determining bounds to improve performance
      const sampleSize = Math.min(properties.length, 1000);
      const sampleProperties = properties.slice(0, sampleSize);
      
      const bounds = L.latLngBounds(
        sampleProperties
          .filter((prop) => prop.Latitude && prop.Longitude)
          .map(
            (prop) =>
              [Number(prop.Latitude), Number(prop.Longitude)] as [
                number,
                number
              ]
          )
      );

      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    } catch (error) {
      console.error("Error fitting bounds:", error);
    }
  }, [map, properties]);

  return null;
};

// Map component for PropertyListingPage
const PropertyListingMap: React.FC<{
  properties: PropertyDetails[];
  totalCount: number;
  loading: boolean;
  onClose: () => void;
  onRefresh: () => void;
}> = ({ properties, totalCount, loading, onClose, onRefresh }) => {
  const navigate = useNavigate();
  const [mapReady, setMapReady] = useState(false);
  const [clusterRadius, setClusterRadius] = useState(80);

  // Filter valid properties with latitude and longitude
  const validProperties = useMemo(() => {
    const filtered = properties.filter(
      (prop) =>
        prop.Latitude &&
        prop.Longitude &&
        !isNaN(Number(prop.Latitude)) &&
        !isNaN(Number(prop.Longitude))
    );
    return filtered;
  }, [properties]);

  // Calculate center position if there are valid properties
  const center = useMemo(() => {
    return validProperties.length > 0
      ? ([
          Number(validProperties[0].Latitude),
          Number(validProperties[0].Longitude),
        ] as [number, number])
      : ([39.8283, -98.5795] as [number, number]); // Center of US as default
  }, [validProperties]);

  // Adjust cluster radius based on number of properties
  useEffect(() => {
    if (validProperties.length > 5000) {
      setClusterRadius(100);
    } else if (validProperties.length > 1000) {
      setClusterRadius(80);
    } else {
      setClusterRadius(60);
    }
  }, [validProperties.length]);

  useEffect(() => {
    // This effect runs after the component mounts
    setMapReady(true);
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full h-full max-w-7xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">
                Properties    { loading ? "" : `(${validProperties.length.toLocaleString()} found)`} 
              </h2>
              <div className="text-sm text-gray-500">
                
                {totalCount > validProperties.length && (
                  <p>
                    {(totalCount - validProperties.length).toLocaleString()} additional properties don't have valid coordinates
                  </p>
                )}
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={onRefresh} variant="outline" disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-current rounded-full border-t-transparent mr-2"></div>
                    Loading...
                  </>
                ) : (
                  "Refresh Map"
                )}
              </Button>
              <Button onClick={onClose} variant="outline">
                Close Map
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex-grow overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <p className="ml-4">Loading all properties...</p>
            </div>
          ) : validProperties.length > 0 ? (
            <MapContainer
              center={center}
              zoom={5}
              style={{ height: "100%", width: "100%" }}
            >
              <SetupLeaflet />
              <FitBounds properties={validProperties} />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {mapReady && (
                <MarkerClusterGroup
                  chunkedLoading
                  maxClusterRadius={clusterRadius}
                  spiderfyOnMaxZoom={true}
                >
                  {validProperties.map((property) => (
                    <Marker
                      key={property._id?.toString()}
                      position={[
                        Number(property.Latitude),
                        Number(property.Longitude),
                      ]}
                    >
                      {/* Tooltip shown on hover */}
                      {!('ontouchstart' in window) && (
                        <Tooltip direction="top" offset={[0, -20]} opacity={1}>
                          <div>
                            <h3 className="font-bold">{property.Address}</h3>
                            <p>
                              {property.State || ""}, {property.County || ""}
                            </p>
                            <p>{property["Property Type"] || ""}</p>
                            <p>
                              $
                              {property.Zestimate
                                ? Number(property.Zestimate).toLocaleString()
                                : "N/A"}
                            </p>
                          </div>
                        </Tooltip>
                      )}

                      {/* Popup shown on click */}
                      <Popup autoClose={false} closeOnClick={false}>
                        <div className="property-popup">
                          <h3 className="font-bold text-lg">{property.Address}</h3>
                          <div className="grid grid-cols-2 gap-2 my-2">
                            <div>
                              <p className="text-sm text-gray-500">Location</p>
                              <p>
                                {property.State || ""}, {property.County || ""}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Property Type</p>
                              <p>{property["Property Type"] || "N/A"}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Estimated Value</p>
                              <p>
                                $
                                {property.Zestimate
                                  ? Number(property.Zestimate).toLocaleString()
                                  : "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Year Built</p>
                              <p>{property["Year Built"] || "N/A"}</p>
                            </div>
                            {property["Foreclosure Sale Date"] && (
                              <div>
                                <p className="text-sm text-gray-500">Sale Date</p>
                                <p>{property["Foreclosure Sale Date"]}</p>
                              </div>
                            )}
                            {property["Principal Amount Owed"] && (
                              <div>
                                <p className="text-sm text-gray-500">Amount Owed</p>
                                <p>${Number(property["Principal Amount Owed"]).toLocaleString()}</p>
                              </div>
                            )}
                            {property.Bedrooms && (
                              <div>
                                <p className="text-sm text-gray-500">Beds/Baths</p>
                                <p>{property.Bedrooms} bd / {property.Bathrooms} ba</p>
                              </div>
                            )}
                            {property["Living Area (sq ft)"] && (
                              <div>
                                <p className="text-sm text-gray-500">Square Feet</p>
                                <p>{Number(property["Living Area (sq ft)"]).toLocaleString()} sq ft</p>
                              </div>
                            )}
                          </div>
                          <Link 
                            to={`/property-details/${property._id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block mt-2"
                          >
                            <Button
                              className="w-full"
                              size="sm"
                            >
                              View Full Details
                            </Button>
                          </Link>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MarkerClusterGroup>
              )}
            </MapContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="bg-white p-4 rounded shadow-lg">
                <p className="text-lg font-semibold text-center">
                  No properties with location data available
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyListingMap;