import { Suspense, useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { Badge } from "../components/ui/badge";
import { Loader2, MapIcon } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import ActionHistoryTable from "../components/propertyDetails/ActionHistoryTable";
import { useUser } from "../hooks/useUser";
import MapComponent from "../components/propertyDetails/Map";
import { PropertyDetails } from "../types/propertyTypes";
import ForeclosureSkeleton from "../components/ForeclosureSkeleton";
import PropertyImageCarousel from "../components/ImgCarousel";
import PropertyActions from "../components/propertyDetails/PropertyActions";
import { Button } from "../components/ui/button";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from "react-leaflet";

const PropertyDetailsPage = () => {
  const [property, setProperty] = useState<PropertyDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const { propId } = useParams();
  const { loggedIn, user, setUser } = useUser();
  const [isThisPropertySaved, setIsThisPropertySaved] = useState<
    boolean | undefined
  >();
  const [orderReqLoading, setOrderReqLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchProperty = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/property-details/${propId}`
      );
      setProperty(res.data.data);

      const isSaved = user?.savedProperties.includes(res.data.data._id);
      setIsThisPropertySaved(isSaved);

      setLoading(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.log({ error: err.message });
      } else {
        console.log({ error: "An unknown error occurred" });
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperty();
  }, []);

  const propertyDetailsSection = useMemo(() => {
    if (!property) return [];
    return [
      { label: "Zestimate", value: property["Zestimate"] ? `$${Number(property["Zestimate"]).toLocaleString()}` : null },
      { label: "Rent Zestimate", value: property["Rent Zestimate"] ? `$${Number(property["Rent Zestimate"]).toLocaleString()}` : null },
      { label: "Bedrooms", value: property.Bedrooms },
      { label: "Bathrooms", value: property.Bathrooms },
      { label: "Square Feet", value: property["Living Area (sq ft)"] },
      { label: "Lot Size", value: property["Lot Size"] },
      { label: "Year Built", value: property["Year Built"] },
      { label: "Property Type", value: property["Property Type"] },
      { label: "Owner Name", value: property["Borrower Name(s)"] },
      { label: "Law Firm", value: property["Attorney Name"] },
      { label: "County", value: property["County"] },
      { label: "Property Type", value: property["Property Type"] },
    ];
  }, [property]);

  const foreclosureDetailsSection = useMemo(() => {
    if (!property) return [];
    return [
      { label: "Foreclosure Status", value: (property as any)["matched_Foreclosure Status"], blurIfLoggedOut: true },
      { label: "Opening Bid", value: (property as any)["matched_Current Bid"], blurIfLoggedOut: true },
      { label: "Auction Date", value: (property as any)["Foreclosure Sale Date"] },
      { label: "Foreclosure Sale Location", value: (property as any)["Foreclosure Sale Location"] },
      { label: "Lender Name", value: (property as any)["Lender Name"] },
      { label: "Lender Phone Number", value: (property as any)["Lender Phone Number"] },
      { label: "Attorney Name", value: (property as any)["Attorney Name"] },
      { label: "Attorney Phone Number", value: (property as any)["Attorney Phone Number"] },
      { label: "Original Debt Amount", value: (property as any)["Principal Amount Owed"] ? `$${Number(property["Principal Amount Owed"]).toLocaleString()}` : null },
      { label: "Loan Origination Date", value: (property as any)["Date of Debt"] },

      
      
    ];
  }, [property]);

  const allComps = useMemo(() => {
    if (!property) return [];
    const comps: Array<{
      key: string;
      address: string;
      dateSold?: string | Date;
      price?: number | string;
      bedrooms?: number | string;
      bathrooms?: number | string;
      sqft?: number | string;
      lotSize?: number | string;
      distance?: number;
      compScore?: number | string;
      compScoreNumeric?: number | null;
      compUrl?: string;
      lat?: number;
      lng?: number;
    }> = [];

    for (let i = 0; i < 25; i++) {
      const index = i + 1;
      for (const { prefix, scoreKey } of [
        { prefix: "SALE_COMP", scoreKey: `COMP_SCORE_SALE_COMP_${index}` },
        { prefix: "REDFIN", scoreKey: `COMP_SCORE_REDFIN_${index}` },
      ] as const) {
        const address = (property as any)[`${prefix}_ADDRESS_${index}`];
        if (!address) continue;

        const compScore = (property as any)[scoreKey];
        if (compScore === "Duplicate - already included in list") {
          continue;
        }

        const lat = (property as any)[`${prefix}_LATITUDE_${index}`];
        const lng = (property as any)[`${prefix}_LONGITUDE_${index}`];
        const dateSoldRaw = (property as any)[`${prefix}_DATESOLD_${index}`];
        const formattedDateSold =
          typeof dateSoldRaw === "number" ? new Date(dateSoldRaw) : dateSoldRaw;
        const price = (property as any)[`${prefix}_PRICE_${index}`];
        const bedrooms = (property as any)[`${prefix}_BEDROOMS_${index}`];
        const bathrooms = (property as any)[`${prefix}_BATHROOMS_${index}`];
        const sqft = (property as any)[`${prefix}_LIVINGAREA_${index}`];
        const lotSize = (property as any)[`${prefix}_LOTSIZE_${index}`];
        const distanceRaw = (property as any)[`${prefix}_DISTANCE_FROM_PROPERTY_${index}`];
        const distance = distanceRaw ? Number(distanceRaw) : undefined;

        const rawUrl = (property as any)[`${prefix}_URL_${index}`] as string | undefined;
        const zillowLink = prefix === "SALE_COMP"
          ? (property as any)[`SALE_COMP_ZILLOW_LINK_${index}`] as string | undefined
          : undefined;
        const compUrl = prefix === "REDFIN" && rawUrl
          ? `https://www.redfin.com${rawUrl}`
          : zillowLink;

        comps.push({
          key: `${prefix}_${index}`,
          address,
          lat: lat ? Number(lat) : undefined,
          lng: lng ? Number(lng) : undefined,
          dateSold: formattedDateSold,
          price,
          bedrooms,
          bathrooms,
          sqft,
          lotSize,
          distance,
          compScore,
          compScoreNumeric: typeof compScore === "number" ? compScore : null,
          compUrl,
        });
      }
    }

    comps.sort((a, b) => {
      if (a.compScoreNumeric != null && b.compScoreNumeric != null) {
        return b.compScoreNumeric - a.compScoreNumeric;
      }
      if (a.compScoreNumeric != null) return -1;
      if (b.compScoreNumeric != null) return 1;
      return (a.distance ?? Infinity) - (b.distance ?? Infinity);
    });

    return comps;
  }, [property]);

  const mapComps = loggedIn ? allComps : allComps.slice(0, 3);

  const saveProperty = async () => {
    if (!loggedIn) {
      toast({
        title: "⚠️ You must log in to save properties",
        variant: "default",
      });
      return;
    }

    setSaveLoading(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/property/save`,
        { propertyId: property?._id },
        { withCredentials: true }
      );
      setIsThisPropertySaved(true);
      setUser((prevUser) => {
        if (prevUser) {
          return {
            ...prevUser,
            savedProperties: [
              ...prevUser.savedProperties,
              property?._id as string,
            ],
          };
        }
        return prevUser;
      });
    } catch (err) {
      console.error("Error saving property:", err);
    } finally {
      setSaveLoading(false);
    }
  };

  const unsaveProperty = async () => {
    setSaveLoading(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/property/unsave`,
        { propertyId: property?._id },
        { withCredentials: true }
      );
      setUser((prevUser) => {
        if (prevUser) {
          return {
            ...prevUser,
            savedProperties: prevUser.savedProperties.filter(
              (id) => id !== property?._id
            ),
          };
        }
        return prevUser;
      });
      toast({
        title: "✅ Property unsaved successfully",
        variant: "default",
      });
      setIsThisPropertySaved(false);
    } catch (err) {
      console.error("Error unsaving property:", err);
    } finally {
      setSaveLoading(false);
    }
  };

  const comparablePropertyIconNumeric = new L.Icon({
    iconUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='41' viewBox='0 0 25 41'%3E%3Cpath fill='%2316A34A' stroke='%23fff' stroke-width='1.5' d='M12.5 1C6.148 1 1 6.148 1 12.5C1 18.852 12.5 40 12.5 40S24 18.852 24 12.5C24 6.148 18.852 1 12.5 1Z'/%3E%3Ccircle fill='%23fff' cx='12.5' cy='12.5' r='5'/%3E%3C/svg%3E",
    iconSize: [25, 41],
    iconAnchor: [12.5, 41],
    popupAnchor: [0, -41],
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    shadowSize: [41, 41],
    shadowAnchor: [12, 41],
  });

  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });

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

  const comparablePropertyIcon = new L.Icon({
    iconUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='41' viewBox='0 0 25 41'%3E%3Cpath fill='%231E3A8A' stroke='%23fff' stroke-width='1.5' d='M12.5 1C6.148 1 1 6.148 1 12.5C1 18.852 12.5 40 12.5 40S24 18.852 24 12.5C24 6.148 18.852 1 12.5 1Z'/%3E%3Ccircle fill='%23fff' cx='12.5' cy='12.5' r='5'/%3E%3C/svg%3E",
    iconSize: [25, 41],
    iconAnchor: [12.5, 41],
    popupAnchor: [0, -41],
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    shadowSize: [41, 41],
    shadowAnchor: [12, 41],
  });

  const FitBounds = ({ mainProperty, comparableProperties }: { mainProperty: any; comparableProperties: any[] }) => {
    const map = useMap();
    useEffect(() => {
      if (!mainProperty && comparableProperties.length === 0) return;
      const points: [number, number][] = [];
      if (mainProperty) points.push([mainProperty.lat, mainProperty.lng]);
      comparableProperties.forEach(comp => comp.lat && comp.lng && points.push([comp.lat, comp.lng]));
      if (points.length === 1) map.setView(points[0], 15);
      else if (points.length > 1) map.fitBounds(L.latLngBounds(points), { padding: [50, 50] });
    }, [map, mainProperty, comparableProperties]);
    return null;
  };

  const toggleMapView = () => {
    setShowMap(!showMap);
  };

  return (
    <><div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="space-y-6 mb-20">
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-center">
          {property?.Address}
        </h1>
      </div>
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="md:w-1/3 space-y-4">
          <PropertyActions
            property={property}
            isThisPropertySaved={isThisPropertySaved}
            setIsThisPropertySaved={setIsThisPropertySaved} />

          <section>
            <h2 className="text-xl md:text-2xl font-semibold mb-4">
              Property Details
            </h2>
            {propertyDetailsSection.every((item) => !item.value) ? (
              <div className="text-center text-gray-700 text-lg py-6">
                We're sorry, but information is not available for this property.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {propertyDetailsSection.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="font-medium text-blue-900">
                      {item.label}
                    </div>
                    <div className="text-gray-700">{item.value || "-"}</div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="md:w-2/3">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <PropertyImageCarousel
              images={[
                {
                  url: property?.zillow_image_1,
                  alt: `Zillow image 1 of ${property?.Address}`,
                },
                {
                  url: property?.zillow_image_2,
                  alt: `Zillow image 2 of ${property?.Address}`,
                },
                {
                  url: property?.zillow_image_3,
                  alt: `Zillow image 3 of ${property?.Address}`,
                },
                {
                  url: property?.zillow_image_4,
                  alt: `Zillow image 4 of ${property?.Address}`,
                },
                {
                  url: property?.zillow_image_5,
                  alt: `Zillow image 5 of ${property?.Address}`,
                },
                {
                  url: property?.zillow_image_6,
                  alt: `Zillow image 6 of ${property?.Address}`,
                },
                {
                  url: property?.zillow_image_7,
                  alt: `Zillow image 7 of ${property?.Address}`,
                },
                {
                  url: property?.zillow_image_8,
                  alt: `Zillow image 8 of ${property?.Address}`,
                },
                {
                  url: property?.zillow_image_9,
                  alt: `Zillow image 9 of ${property?.Address}`,
                },
                {
                  url: property?.zillow_image_10,
                  alt: `Zillow image 10 of ${property?.Address}`,
                },
                {
                  url: property?.zillow_image_11,
                  alt: `Zillow image 11 of ${property?.Address}`,
                },
                {
                  url: property?.zillow_image_12,
                  alt: `Zillow image 12 of ${property?.Address}`,
                },
                {
                  url: property?.zillow_image_13,
                  alt: `Zillow image 13 of ${property?.Address}`,
                },
                {
                  url: property?.zillow_image_14,
                  alt: `Zillow image 14 of ${property?.Address}`,
                },
                {
                  url: property?.zillow_image_15,
                  alt: `Zillow image 15 of ${property?.Address}`,
                },
                {
                  url: property?.zillow_image_16,
                  alt: `Zillow image 16 of ${property?.Address}`,
                },
                {
                  url: property?.zillow_image_17,
                  alt: `Zillow image 17 of ${property?.Address}`,
                },
                {
                  url: property?.zillow_image_18,
                  alt: `Zillow image 18 of ${property?.Address}`,
                },
                {
                  url: property?.zillow_image_19,
                  alt: `Zillow image 19 of ${property?.Address}`,
                },
                {
                  url: property?.zillow_image_20,
                  alt: `Zillow image 20 of ${property?.Address}`,
                },
                {
                  url: property?.["Google Maps Image URL"],
                  alt: `Street view of ${property?.Address}`,
                },
                {
                  url: property?.["Google Earth Image URL"],
                  alt: `Satellite view of ${property?.Address}`,
                },
              ].filter(
                (image): image is { url: string; alt: string; } => !!image.url
              )} />
          </div>
        </div>
      </div>

      <div className="mb-6 bg-white rounded-lg shadow-lg p-6 space-y-8">

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-4">
            Foreclosure Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {foreclosureDetailsSection.map((item, index) => {
              const shouldBlur = item.blurIfLoggedOut && !loggedIn;

              return (
                <div
                  key={index}
                  className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
                >
                  <div className="font-medium text-blue-900 mb-1.5">
                    {item.label}
                  </div>
                  <div className="text-gray-700">
                    {shouldBlur ? `Log in to view ${item.label} data` : (item.value || "-")}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {property && (
        <div className="mb-8 bg-white rounded-lg shadow-lg p-6 space-y-8">
          <section>
            <h2 className="text-xl md:text-2xl font-semibold mb-4">
              Sale History
            </h2>
            {!property ? (
              <div className="text-center text-gray-700 text-lg py-6">
                We're sorry, but recent sale history information is not
                available.
              </div>
            ) : !property?.PRICE_HISTORY_DATE_1 ? (
              <div className="text-center text-gray-700 text-lg py-6">
                We're sorry, but recent sale history information is not
                available.
              </div>
            ) : (
              <section>
                <table className="w-full text-left border-collapse">
                  <thead className="border-b border-gray-300">
                    <tr>
                      <th className="px-4 py-2">Date</th>
                      <th className="px-4 py-2">Event</th>
                      <th className="px-4 py-2">Price</th>
                      <th className="px-4 py-2">Price/SqFt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4, 5].map((i) => {
                      const date = property[`PRICE_HISTORY_DATE_${i}` as keyof PropertyDetails];
                      const event = property[`PRICE_HISTORY_EVENT_${i}` as keyof PropertyDetails];
                      const price = property[`PRICE_HISTORY_PRICE_${i}` as keyof PropertyDetails];
                      const pricePerSqFt = property[`PRICE_HISTORY_PRICEPERSQUAREFOOT_${i}` as keyof PropertyDetails];

                      if (!date && !event && !price && !pricePerSqFt)
                        return null;

                      return (
                        <tr key={i} className="border-b border-gray-200">
                          <td className="px-4 py-2">{String(date) || "N/A"}</td>
                          <td className="px-4 py-2">
                            {String(event) || "N/A"}
                          </td>
                          <td className="px-4 py-2">
                            {price
                              ? `$${Number(price).toLocaleString()}`
                              : "N/A"}
                          </td>
                          <td className="px-4 py-2">
                            {pricePerSqFt
                              ? `$${Number(pricePerSqFt).toLocaleString()}`
                              : "N/A"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </section>
            )}
          </section>
        </div>
      )}

      

      <section className="mt-8">
        <h2 className="text-xl md:text-2xl font-semibold mb-4">
          Valuation Metrics
        </h2>
        <table className="w-full text-left border-collapse">
          <tbody>
            <tr className="bg-gray-200">
              <td className="px-4 py-2 font-semibold" colSpan={2}>
                Sale Output
              </td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="px-4 py-2">
                Sale Comp Valuation by sq ft (median)
              </td>
              <td className="px-4 py-2">
                {property?.["Sale Comp Valuation by sq ft (median)"] !==
                  undefined
                  ? `$${Number(
                    property["Sale Comp Valuation by sq ft (median)"]
                  ).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                  : "N/A"}
              </td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="px-4 py-2">Sale Comp Valuation by sq ft (mean)</td>
              <td className="px-4 py-2">
                {property?.["Sale Comp Valuation by sq ft (mean)"] !== undefined
                  ? `$${Number(
                    property["Sale Comp Valuation by sq ft (mean)"]
                  ).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                  : "N/A"}
              </td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="px-4 py-2">Sale Comp Valuation by bed (median)</td>
              <td className="px-4 py-2">
                {property?.["Sale Comp Valuation by bed (median)"] !== undefined
                  ? `$${Number(
                    property["Sale Comp Valuation by bed (median)"]
                  ).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                  : "N/A"}
              </td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="px-4 py-2">Sale Comp Valuation by bed (mean)</td>
              <td className="px-4 py-2">
                {property?.["Sale Comp Valuation by bed (mean)"] !== undefined
                  ? `$${Number(
                    property["Sale Comp Valuation by bed (mean)"]
                  ).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                  : "N/A"}
              </td>
            </tr>

            <tr className="bg-gray-200">
              <td className="px-4 py-2 font-semibold" colSpan={2}>
                Third-party
              </td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="px-4 py-2">Zillow rent valuation</td>
              <td className="px-4 py-2">
                {property?.["Zillow rent valuation"] !== undefined
                  ? `$${Number(property["Zillow rent valuation"]).toLocaleString()}`
                  : "N/A"}
              </td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="px-4 py-2">Zillow low estimate</td>
              <td className="px-4 py-2">
                {property?.["Zillow low estimate"] !== undefined
                  ? `$${Number(property["Zillow low estimate"]).toLocaleString()}`
                  : "N/A"}
              </td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="px-4 py-2">Zillow high estimate</td>
              <td className="px-4 py-2">
                {property?.["Zillow high estimate"] !== undefined
                  ? `$${Number(property["Zillow high estimate"]).toLocaleString()}`
                  : "N/A"}
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      
      <section className="mb-8">
        {property?.Latitude !== undefined && property?.Longitude !== undefined && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden p-6">
            <h2 className="text-xl font-bold mb-4">Comparable Sales Map View</h2>
            <div className="w-full" style={{ height: "600px" }}>
              <MapContainer center={[property.Latitude, property.Longitude]} zoom={12} style={{ height: "100%", width: "100%" }}>
                <FitBounds mainProperty={{ lat: property.Latitude, lng: property.Longitude }} comparableProperties={mapComps} />
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[property.Latitude, property.Longitude]} icon={mainPropertyIcon}>
                  <Popup>{property.Address}</Popup>
                </Marker>
                {mapComps
                  .filter((comp) => comp.lat !== undefined && comp.lng !== undefined)
                  .map((comp, index) => {
                    const isNumeric = typeof comp.compScore === "number";
                    const markerIcon = isNumeric ? comparablePropertyIconNumeric : comparablePropertyIcon;
                    const detailsUrl = comp.compUrl;

                    return (
                      <Marker
                        key={`comp-${index}`}
                        position={[comp.lat as number, comp.lng as number]}
                        icon={markerIcon}
                        eventHandlers={{
                          click: (e) => {
                            // On mobile, show tooltip instead of popup
                            if (window.innerWidth < 768) {
                              e.target.openTooltip();
                              setTimeout(() => e.target.closeTooltip(), 3000);
                            }
                          }
                        }}
                      >
                        {window.innerWidth < 768 ? (
                          <Tooltip>
                            <div>
                              <strong>{comp.address}</strong><br />
                              {comp.price && `$${Number(comp.price).toLocaleString()}`}<br />
                              {comp.bedrooms && comp.bathrooms && `${comp.bedrooms} bed, ${comp.bathrooms} bath`}
                            </div>
                          </Tooltip>
                        ) : (
                          <Popup>
                            <div className="p-2 max-w-md">
                              <h3 className={`font-bold ${isNumeric ? "text-green-600" : "text-blue-600"}`}>
                                {detailsUrl ? (
                                  <a href={detailsUrl} target="_blank" rel="noopener noreferrer" className="underline">
                                    {comp.address}
                                  </a>
                                ) : (
                                  comp.address
                                )}
                              </h3>
                              {comp.dateSold && (
                                <p><span className="font-medium">Date Sold:</span> {new Date(comp.dateSold).toLocaleDateString("en-US")}</p>
                              )}
                              {comp.price && (
                                <p><span className="font-medium">Price:</span> ${Number(comp.price).toLocaleString()}</p>
                              )}
                              <div className="flex flex-wrap gap-2 my-2">
                                {comp.bedrooms && <span>{comp.bedrooms} bed</span>}
                                {comp.bathrooms && <span>{comp.bathrooms} bath</span>}
                                {comp.sqft && <span>{comp.sqft} sqft</span>}
                              </div>
                              {comp.distance != null && (
                                <p><span className="font-medium">Distance:</span> {typeof comp.distance === "number" ? comp.distance.toFixed(2) : comp.distance} miles</p>
                              )}
                              {comp.compScore != null && (
                                <div className="mt-2">
                                  <p className="font-medium">Comp Quality:</p>
                                  {isNumeric ? (
                                    <p>{typeof comp.compScore === "number" ? comp.compScore.toFixed(2) : comp.compScore}</p>
                                  ) : (
                                    <ul className="list-disc list-inside text-gray-700 text-sm">
                                      {String(comp.compScore).replace(/00:00:00/g, "").split(",").map((reason, i) => (
                                        <li key={i}>{reason.trim()}</li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                              )}
                            </div>
                          </Popup>
                        )}
                      </Marker>
                    );
                  })}
              </MapContainer>
            </div>
          </div>
        )}
      </section>

    </div>
    <div>
    <section className="mb-16 flex flex-col gap-5">
    <div className="border p-6 bg-white rounded-lg shadow-lg w-full max-w-screen-xl mx-auto" style={{ width: '1500px' }}>
    <h2 className="text-xl md:text-2xl font-semibold mb-2">
      Comparable Sales
    </h2>
    {property?.Comp_quality_score && (
      <div className="text-gray-600 mb-4">
        Average Comp Quality Score: {property.Comp_quality_score.toFixed(2)}
      </div>
    )}

    {showMap && (
  <Suspense
    fallback={
      <div className="flex justify-center items-center h-96 bg-white rounded-lg shadow-lg">
        <Loader2 className="animate-spin w-8 h-8 mr-2" />
        <span>Loading map...</span>
      </div>
    }
  >
    <section className="mb-8">
      {property?.Latitude !== undefined && property?.Longitude !== undefined && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden p-6">
          <h2 className="text-xl font-bold mb-4">Comparable Sales Map View</h2>
          <div className="w-full" style={{ height: "600px" }}>
            <MapContainer center={[property.Latitude, property.Longitude]} zoom={12} style={{ height: "100%", width: "100%" }}>
              <FitBounds mainProperty={{ lat: property.Latitude, lng: property.Longitude }} comparableProperties={mapComps} />
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[property.Latitude, property.Longitude]} icon={mainPropertyIcon}>
                <Popup>{property.Address}</Popup>
              </Marker>
              {mapComps
                .filter((comp) => comp.lat !== undefined && comp.lng !== undefined)
                .map((comp, index) => {
                  const isNumeric = typeof comp.compScore === "number";
                  const markerIcon = isNumeric ? comparablePropertyIconNumeric : comparablePropertyIcon;
                  const detailsUrl = comp.compUrl;

                  return (
                    <Marker
                      key={`comp-${index}`}
                      position={[comp.lat as number, comp.lng as number]}
                      icon={markerIcon}
                      eventHandlers={{
                        click: (e) => {
                          // On mobile, show tooltip instead of popup
                          if (window.innerWidth < 768) {
                            e.target.openTooltip();
                            setTimeout(() => e.target.closeTooltip(), 3000);
                          }
                        }
                      }}
                    >
                      {window.innerWidth < 768 ? (
                        <Tooltip>
                          <div>
                            <strong>{comp.address}</strong><br />
                            {comp.price && `$${Number(comp.price).toLocaleString()}`}<br />
                            {comp.bedrooms && comp.bathrooms && `${comp.bedrooms} bed, ${comp.bathrooms} bath`}
                          </div>
                        </Tooltip>
                      ) : (
                        <Popup>
                          <div className="p-2 max-w-md">
                            <h3 className={`font-bold ${isNumeric ? "text-green-600" : "text-blue-600"}`}>
                              {detailsUrl ? (
                                <a
                                  href={detailsUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="underline"
                                >
                                  {comp.address}
                                </a>
                              ) : (
                                comp.address
                              )}
                            </h3>

                            {comp.dateSold && (
                              <p><span className="font-medium">Date Sold:</span> {new Date(comp.dateSold).toLocaleDateString("en-US")}</p>
                            )}

                            {comp.price && (
                              <p><span className="font-medium">Price:</span> ${Number(comp.price).toLocaleString()}</p>
                            )}

                            <div className="flex flex-wrap gap-2 my-2">
                              {comp.bedrooms && <span>{comp.bedrooms} bed</span>}
                              {comp.bathrooms && <span>{comp.bathrooms} bath</span>}
                              {comp.sqft && <span>{comp.sqft} sqft</span>}
                            </div>

                            {comp.distance != null && (
                              <p><span className="font-medium">Distance:</span> {typeof comp.distance === "number" ? comp.distance.toFixed(2) : comp.distance} miles</p>
                            )}

                            {comp.compScore != null && (
                              <div className="mt-2">
                                <p className="font-medium">Comp Quality:</p>
                                {isNumeric ? (
                                  <p>{typeof comp.compScore === "number" ? comp.compScore.toFixed(2) : comp.compScore}</p>
                                ) : (
                                  <ul className="list-disc list-inside text-gray-700 text-sm">
                                    {String(comp.compScore).replace(/00:00:00/g, "").split(",").map((reason, i) => (
                                      <li key={i}>{reason.trim()}</li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            )}
                          </div>
                        </Popup>
                      )}
                    </Marker>
                  );
                })}
            </MapContainer>
          </div>
        </div>
      )}
    </section>
  </Suspense>
)}

<div className="overflow-x-auto w-full max-w-screen-xl mx-auto">
  <table className="min-w-full table-auto text-left text-sm divide-y divide-gray-200">
    <thead className="bg-gray-50">
      <tr>
        <th className="px-4 py-2">Address</th>
        <th className="px-4 py-2">Date Sold</th>
        <th className="px-4 py-2">Price</th>
        <th className="px-4 py-2">Sqft</th>
        <th className="px-4 py-2">Bedrooms</th>
        <th className="px-4 py-2">Bathrooms</th>
        <th className="px-4 py-2">Distance</th>
        <th className="px-4 py-2">Comp Quality</th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {allComps.map((row, idx) => (
        <tr
          key={row.key}
          className={!loggedIn && idx >= 3 ? "blur-sm pointer-events-none" : ""}
        >
          <td className="px-4 py-2">
            {row.compUrl ? (
              <a
                href={row.compUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                {row.address}
              </a>
            ) : (
              row.address
            )}
          </td>
          <td className="px-4 py-2">
            {row.dateSold
              ? new Date(row.dateSold).toLocaleDateString("en-US")
              : "N/A"}
          </td>
          <td className="px-4 py-2">
            {row.price ? `$${Number(row.price).toLocaleString()}` : "-"}
          </td>
          <td className="px-4 py-2">{row.sqft ?? "-"}</td>
          <td className="px-4 py-2">{row.bedrooms ?? "-"}</td>
          <td className="px-4 py-2">{row.bathrooms ?? "-"}</td>
          <td className="px-4 py-2">
            {row.distance != null ? row.distance.toFixed(2) : "-"}
          </td>
          <td className="px-4 py-2 align-top">
            {typeof row.compScore === "number" ? (
              row.compScore.toFixed(2)
            ) : row.compScore ? (
              <ul className="list-disc list-inside text-gray-700 text-sm">
                {String(row.compScore)
                  .replace(/00:00:00/g, "")
                  .split(",")
                  .map((reason, i) => (
                    <li key={i}>{reason.trim()}</li>
                  ))}
              </ul>
            ) : (
              "-"
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>



  </div>
</section>

</div>
</>
);
};
export default PropertyDetailsPage;