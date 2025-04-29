import React, { useEffect, useState } from "react";
import { PropertyDetails } from "../../types/propertyTypes";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "../ui/button";

// Fix the Leaflet icon issue with TypeScript
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Create a custom icon for the main property (highlighted in red)
const mainPropertyIcon = new L.Icon({
  iconUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='41' viewBox='0 0 25 41'%3E%3Cpath fill='%23e53e3e' stroke='%23fff' stroke-width='1.5' d='M12.5 1C6.148 1 1 6.148 1 12.5C1 18.852 12.5 40 12.5 40S24 18.852 24 12.5C24 6.148 18.852 1 12.5 1Z'/%3E%3Ccircle fill='%23fff' cx='12.5' cy='12.5' r='5'/%3E%3C/svg%3E",
  iconSize: [25, 41],
  iconAnchor: [12.5, 41],
  popupAnchor: [0, -41],
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
  shadowAnchor: [12, 41],
  className: "main-property-marker",
});

// Create a custom icon for comparable properties (blue)
const comparablePropertyIcon = new L.Icon({
  iconUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='41' viewBox='0 0 25 41'%3E%3Cpath fill='%233182ce' stroke='%23fff' stroke-width='1.5' d='M12.5 1C6.148 1 1 6.148 1 12.5C1 18.852 12.5 40 12.5 40S24 18.852 24 12.5C24 6.148 18.852 1 12.5 1Z'/%3E%3Ccircle fill='%23fff' cx='12.5' cy='12.5' r='5'/%3E%3C/svg%3E",
  iconSize: [25, 41],
  iconAnchor: [12.5, 41],
  popupAnchor: [0, -41],
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
  shadowAnchor: [12, 41],
});

interface PropertyPosition {
  lat: number;
  lng: number;
}

interface CompProperty {
  address: string;
  lat?: number;
  lng?: number;
  price?: number | string;
  bedrooms?: string | number;
  bathrooms?: string | number;
  sqft?: string | number;
  lotSize?: string | number;
  dateSold?: string | Date;
  distance?: number;
  compScore?: number | string;
  compUrl?: string;
  zillowLink?: string; // Added property
}

interface FitBoundsProps {
  mainProperty: PropertyPosition | null;
  comparableProperties: CompProperty[];
}

// Component to fit map bounds
const FitBounds: React.FC<FitBoundsProps> = ({ mainProperty, comparableProperties }) => {
  const map = useMap();

  useEffect(() => {
    try {
      if (!mainProperty && comparableProperties.length === 0) {
        return;
      }

      // Create bounds with all properties
      const points: [number, number][] = [];
      
      if (mainProperty) {
        points.push([mainProperty.lat, mainProperty.lng]);
      }
      
      comparableProperties.forEach(comp => {
        if (comp.lat !== undefined && comp.lng !== undefined) {
          points.push([comp.lat, comp.lng]);
        }
      });

      if (points.length === 0) return;
      
      if (points.length === 1) {
        // If only one property, center on it with closer zoom
        map.setView(points[0], 15);
        return;
      }

      const bounds = L.latLngBounds(points);

      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50] });
      } else if (mainProperty) {
        // Fallback if bounds aren't valid
        map.setView([mainProperty.lat, mainProperty.lng], 14);
      }
    } catch (error) {
      console.error("Error fitting bounds:", error);
      // Fallback to centering on main property if available
      if (mainProperty) {
        map.setView([mainProperty.lat, mainProperty.lng], 14);
      }
    }
  }, [map, mainProperty, comparableProperties]);

  return null;
};

// Legend component
const MapLegend: React.FC = () => {
  return (
    <div className="leaflet-bottom leaflet-left">
      <div className="leaflet-control leaflet-bar bg-white p-3 m-3 rounded shadow-md">
        <h4 className="font-bold mb-2">Map Legend</h4>
        <div className="flex items-center mb-1">
          <div className="w-4 h-4 mr-2 rounded-full bg-red-600"></div>
          <span>Current Property</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 mr-2 rounded-full bg-blue-600"></div>
          <span>Comparable Sales</span>
        </div>
      </div>
    </div>
  );
};

interface ComparableMapProps {
  property: PropertyDetails | null;
  comparableProperties: CompProperty[];
  onClose: () => void;
}

// Main Map Component
const ComparableMap: React.FC<ComparableMapProps> = ({ 
  property, 
  comparableProperties, 
  onClose 
}) => {
  // Filter comparables with valid coordinates
  const validComps = comparableProperties.filter(
    (comp) =>
      comp.lat !== undefined &&
      comp.lng !== undefined &&
      !isNaN(Number(comp.lat)) &&
      !isNaN(Number(comp.lng))
  );

  // Check if main property has valid coordinates
  const hasMainPropertyCoords =
    property?.Latitude !== undefined &&
    property?.Longitude !== undefined &&
    !isNaN(Number(property.Latitude)) &&
    !isNaN(Number(property.Longitude));

  // Determine map center
  const mainPropertyPosition = hasMainPropertyCoords && property
    ? { lat: Number(property.Latitude), lng: Number(property.Longitude) }
    : null;

  // If no coordinates are available, show a message
  if (!mainPropertyPosition && validComps.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Map View</h2>
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
          <p className="text-lg text-center py-12">
            Location data is not available for this property or its comparables.
          </p>
        </div>
      </div>
    );
  }

  // If only comparable properties have coordinates, use the first one as center
  const center =
    mainPropertyPosition ||
    (validComps.length > 0 && validComps[0].lat !== undefined && validComps[0].lng !== undefined
      ? { lat: validComps[0].lat, lng: validComps[0].lng }
      : { lat: 39.8283, lng: -98.5795 }); // Default to center of US

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full h-full max-w-7xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Comparable Sales Map View</h2>
          <div className="flex items-center">
            <div className="hidden md:flex items-center mr-6">
              <div className="w-4 h-4 mr-2 rounded-full bg-red-600"></div>
              <span className="mr-4">Current Property</span>
              <div className="w-4 h-4 mr-2 rounded-full bg-blue-600"></div>
              <span>Comparable Sales</span>
            </div>
            <Button onClick={onClose} variant="outline">
              Close Map
            </Button>
          </div>
        </div>

        <div className="flex-grow overflow-hidden relative">
          <MapContainer
            center={[center.lat, center.lng]}
            zoom={12}
            style={{ height: "100%", width: "100%" }}
          >
            {/* Fit bounds to show all properties */}
            <FitBounds
              mainProperty={mainPropertyPosition}
              comparableProperties={validComps}
            />

            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Main property marker */}
            {mainPropertyPosition && (
              <Marker
                position={[mainPropertyPosition.lat, mainPropertyPosition.lng]}
                icon={mainPropertyIcon}
              >
                <Popup>
                  <div className="p-2 max-w-xs">
                    <h3 className="font-bold text-red-600 text-lg">
                      Current Property
                    </h3>
                    <p className="font-medium">{property?.Address}</p>
                    <div className="my-2">
                      <p>
                        {property?.Bedrooms || "-"} bed · {property?.Bathrooms || "-"} bath · {property?.["Living Area (sq ft)"] || "-"} sqft
                      </p>
                      {property?.["Year Built"] && (
                        <p>Year Built: {property["Year Built"]}</p>
                      )}
                    </div>
                    <div className="border-t pt-2 mt-2">
                      {property?.Zestimate && (
                        <p>
                          <span className="font-medium">Zestimate:</span> $
                          {Number(property.Zestimate).toLocaleString()}
                        </p>
                      )}
                      {property?.["Sale Comp Valuation by sq ft (median)"] && (
                        <p>
                          <span className="font-medium">Comp Valuation:</span> $
                          {Number(
                            property["Sale Comp Valuation by sq ft (median)"]
                          ).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Comparable property markers */}
            {validComps.map((comp, index) => (
              <Marker
                key={`comp-${index}`}
                position={[comp.lat as number, comp.lng as number]}
                icon={comparablePropertyIcon}
              >
                <Popup>
                  <div className="p-2 max-w-xs">
                    <h3 className="font-bold text-blue-600">{comp.address}</h3>
                    {comp.dateSold && (
                      <p>
                        <span className="font-medium">Date Sold:</span>{" "}
                        {typeof comp.dateSold === "string"
                          ? new Date(comp.dateSold).toLocaleDateString("en-US")
                          : "N/A"}
                      </p>
                    )}
                    {comp.price && (
                      <p>
                        <span className="font-medium">Price:</span> ${Number(comp.price).toLocaleString()}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 my-2">
                      {comp.bedrooms && <span>{comp.bedrooms} bed</span>}
                      {comp.bathrooms && <span>{comp.bathrooms} bath</span>}
                      {comp.sqft && <span>{comp.sqft} sqft</span>}
                    </div>
                    {comp.distance !== undefined && (
                      <p>
                        <span className="font-medium">Distance:</span> {Number(comp.distance).toFixed(2)} miles
                      </p>
                    )}
                    {comp.compScore && (
                      <p>
                        <span className="font-medium">Comp Score:</span>{" "}
                        {typeof comp.compScore === "number"
                          ? comp.compScore.toFixed(2)
                          : "N/A"}
                      </p>
                    )}

                    {comp.compUrl && (
                      <Button
                        size="sm"
                        className="mt-2 w-full"
                        onClick={() => window.open(comp.compUrl, "_blank")}
                      >
                        View Details
                      </Button>
                    )}
                    {(() => {
                    const detailsUrl = comp.zillowLink ?? comp.compUrl;
                    return detailsUrl ? (
                      <Button
                        size="sm"
                        className="mt-2 w-full"
                        onClick={() => window.open(detailsUrl, "_blank")}
                      >
                        View Details
                      </Button>
                    ) : null;
                  })()}

                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Legend for mobile (only visible on mobile) */}
            <div className="md:hidden">
              <MapLegend />
            </div>
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default ComparableMap;