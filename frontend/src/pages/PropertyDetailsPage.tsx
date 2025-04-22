import { Suspense, useEffect, useState } from "react";
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
import ComparableMap from "../components/propertyListing/ComparableMap";
import { Button } from "../components/ui/button";
// import PropertyImageCarousel, { ImgCarousel } from "../components/ImgCarousel";

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
    if (!loggedIn) {
      navigate("/login");
    } else {
      fetchProperty();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveProperty = async () => {
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

  console.log("property", property);
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

  const orderImage = async () => {
    setOrderReqLoading(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/property/action`,
        {
          propertyId: property?._id,
          actionType: "imageRequest",
          address: property?.Address,
          emailId: user?.emailId,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast({
        title: "✅ Image order request sent successfully",
        variant: "default",
      });
      const updatedPropertiesActions = res.data.propertiesActions;
      setUser((prevUser) => {
        if (prevUser) {
          return {
            ...prevUser,
            propertiesActions: updatedPropertiesActions,
          };
        }
        return null;
      });
    } catch (err) {
      const axiosError = err as AxiosError;
      if (axiosError.response?.status === 400) {
        toast({
          title: "❌ Error",
          description: "Failed to place bid",
          variant: "default",
        });
      }
    } finally {
      setOrderReqLoading(false);
    }
  };

  // Break out the details into separate headings within one container
  const propertyDetailsSection = [
    {
      label: "Zillow low estimate",
      value:
        property?.["Zillow low estimate"] != null
          ? `$${Math.round(property["Zillow low estimate"]).toLocaleString()}`
          : "-",
    },
    {
      label: "Zillow high estimate",
      value:
        property?.["Zillow high estimate"] != null
          ? `$${Math.round(property["Zillow high estimate"]).toLocaleString()}`
          : "-",
    },
    {
      label: "Rent Zestimate",
      value:
        property?.["Rent Zestimate"] != null
          ? `$${Math.round(property["Rent Zestimate"]).toLocaleString()}`
          : "-",
    },
    {
      label: "Independent Valuation",
      value:
        property?.["Sale Comp Valuation by sq ft (median)"] != null
          ? `$${Math.round(
              property["Sale Comp Valuation by sq ft (median)"]
            ).toLocaleString()}`
          : "-",
    },
    { label: "Year Built", value: property?.["Year Built"] },
    { label: "Square Feet", value: property?.["Living Area (sq ft)"] },
    { label: "Bedrooms", value: property?.Bedrooms },
    { label: "Bathrooms", value: property?.Bathrooms },
    {
      label: "Lot Acres",
      value: property?.["Lot Size"]
        ? (Number(property["Lot Size"].replace(/[^\d.]/g, "")) / 43560).toFixed(
            2
          )
        : null,
    },
    {
      label: "Tax Amount",
      value: property?.["Annual Tax Amount"]
        ? new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
          }).format(Number(property["Annual Tax Amount"]))
        : "-",
    },
  ];

  const foreclosureDetailsSection = [
    {
      label: "Original Loan Balance",
      value:
        property?.["Principal Amount Owed"] !== undefined
          ? `$${Number(property["Principal Amount Owed"]).toLocaleString()}`
          : "Not Available",
    },
    { label: "Trustee", value: property?.["Law Firm Name"] ?? "Not Available" },
    { label: "Lender", value: property?.["Lender Name"] ?? "Not Available" },
    {
      label: "Foreclosure Sale Date",
      value: property?.["Foreclosure Sale Date"]
        ? new Date(property["Foreclosure Sale Date"]).toLocaleDateString(
            "en-US"
          )
        : "Not Available",
    },
    {
      label: "Date of Debt",
      value: property?.["Date of Debt"] ?? "Not Available",
    },
    {
      label: "Trustee Phone Number",
      value: property?.["Attorney Phone Number"] ?? "Not Available",
    },
    {
      label: "Lender Phone Number",
      value: property?.["Lender Phone Number"] ?? "Not Available",
    },

    {
      label: "Sale Location",
      value: property?.["Foreclosure Sale Location"] ?? "Not Available",
    },
  ];

  const ownershipDetailsSection = !property
    ? []
    : [
        { label: "Borrower Name(s)", value: property["Borrower Name(s)"] },
        {
          label: "Last Purchased",
          value: (() => {
            for (let i = 1; i <= 20; i++) {
              const event = (property as any)[`PRICE_HISTORY_EVENT_${i}`];
              if (event === "Sold") {
                return (property as any)[`PRICE_HISTORY_DATE_${i}`];
              }
            }
            return "Not Available";
          })(),
        },
        {
          label: "Years of Ownership",
          value: (() => {
            for (let i = 1; i <= 20; i++) {
              const event = (property as any)[`PRICE_HISTORY_EVENT_${i}`];
              const date = (property as any)[`PRICE_HISTORY_DATE_${i}`];
              if (event === "Sold" && date) {
                return Math.floor(
                  (new Date().getTime() - new Date(date).getTime()) /
                    (1000 * 60 * 60 * 24 * 365.25)
                );
              }
            }
            return "Not Available";
          })(),
        },
      ];

  if (loading) {
    return (
      <div className="flex justify-center w-full items-center h-screen">
        <ForeclosureSkeleton />
      </div>
    );
  }

  // Function to check if the property data is mostly empty
  const isPropertyDataIncomplete = (property: PropertyDetails | null) => {
    if (!property) return true;

    const importantFields = [
      property.Zestimate,
      property["Living Area (sq ft)"],
      property.Bedrooms,
      property.Bathrooms,
      property["Year Built"],
      property["Annual Tax Amount"],
    ];

    return importantFields.every(
      (value) =>
        !value ||
        String(value) === "N/A" ||
        String(value) === "-" ||
        String(value) === "Not Available"
    );
  };
  const toggleMapView = () => {
    setShowMap(!showMap);
  };
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header Section */}
      <div className="space-y-6 mb-20">
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-center">
          {property?.Address}
        </h1>
      </div>
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {/* Left column: Save Button (Actions) + Property Details */}
        <div className="md:w-1/3 space-y-4">
          <PropertyActions
            property={property}
            isThisPropertySaved={isThisPropertySaved}
            setIsThisPropertySaved={setIsThisPropertySaved}
          />

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

        {/* Right column: Image Carousel */}
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
                (image): image is { url: string; alt: string } => !!image.url
              )}
            />
          </div>
        </div>
      </div>

      {/* Combined Details Section in a single container */}
      <div className="mb-6 bg-white rounded-lg shadow-lg p-6 space-y-8">
        {/* Ownership Details Header & Grid */}
        <section>
          <h2 className="text-x1 md:text-2xl font-semibold mb-4">
            Ownership Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            {ownershipDetailsSection.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="font-medium text-blue-900">{item.label}</div>
                <div className="text-gray-700">{item.value || "-"}</div>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-t border-gray-200 my-4" />

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-4">
            Foreclosure Details
          </h2>
          <div className="grid grid-cols-4">
            {foreclosureDetailsSection.map((item, index) => {
              const isLastColumn = (index + 1) % 4 === 0;
              return (
                <div
                  key={index}
                  className={`p-4 ${
                    !isLastColumn ? "border-r border-gray-300" : ""
                  }`}
                >
                  <div className="font-medium text-blue-900">{item.label}</div>
                  <div className="text-gray-700">{item.value || "-"}</div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Sale and Assessment History Section */}
      {property && (
        <div className="mb-8 bg-white rounded-lg shadow-lg p-6 space-y-8">
          {/* Recent Sale History Table */}
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
                      const date =
                        property[
                          `PRICE_HISTORY_DATE_${i}` as keyof PropertyDetails
                        ];
                      const event =
                        property[
                          `PRICE_HISTORY_EVENT_${i}` as keyof PropertyDetails
                        ];
                      const price =
                        property[
                          `PRICE_HISTORY_PRICE_${i}` as keyof PropertyDetails
                        ];
                      const pricePerSqFt =
                        property[
                          `PRICE_HISTORY_PRICEPERSQUAREFOOT_${i}` as keyof PropertyDetails
                        ];

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

      {/* Map Section */}
      <section className="mb-8">
        {property?.Latitude && property?.Longitude ? (
          <div className="h-96 bg-white rounded-lg shadow-lg overflow-hidden">
            <MapComponent
              latitude={property.Latitude}
              longitude={property.Longitude}
              zoom={12}
            />
          </div>
        ) : (
          <div className="flex justify-center items-center h-96 bg-white rounded-lg shadow-lg">
            <Loader2 className="animate-spin w-8 h-8" />
          </div>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-xl md:text-2xl font-semibold mb-4">
          Valuation Metrics
        </h2>
        <table className="w-full text-left border-collapse">
          <tbody>
            {/* Sale Output Group */}
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

            {/* Third-party Group */}
            <tr className="bg-gray-200">
              <td className="px-4 py-2 font-semibold" colSpan={2}>
                Third-party
              </td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="px-4 py-2">Zillow rent valuation</td>
              <td className="px-4 py-2">
                {property?.["Zillow rent valuation"] !== undefined
                  ? `$${Number(property["Rent Zestimate"]).toLocaleString()}`
                  : " - "}
              </td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="px-4 py-2">Zillow low estimate</td>
              <td className="px-4 py-2">
                {property?.["Zillow low estimate"] !== undefined
                  ? `$${Number(
                      property["Zillow low estimate"]
                    ).toLocaleString()}`
                  : "N/A"}
              </td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="px-4 py-2">Zillow high estimate</td>
              <td className="px-4 py-2">
                {property?.["Zillow high estimate"] !== undefined
                  ? `$${Number(
                      property["Zillow high estimate"]
                    ).toLocaleString()}`
                  : "N/A"}
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="mb-16 flex flex-col gap-5">
       
        <div className="border p-6">
          <h2 className="text-xl md:text-2xl font-semibold mb-4">
            Comparable Sales
          </h2>

          <div className="flex items-center space-x-2  my-3 flex-1">
            <Button
              onClick={toggleMapView}
              className="h-12  w-full text-white py-3 px-4 rounded-md hover:bg-gray-800 transition-colors duration-200"
            >
              <MapIcon size={18} />
              <span>Explore Properties Comparable Sales on Map</span>
            </Button>
          </div>
          {showMap && (
            <>
              {property ? (
                <Suspense
                  fallback={
                    <div className="flex justify-center items-center h-96 bg-white rounded-lg shadow-lg">
                      <Loader2 className="animate-spin w-8 h-8 mr-2" />
                      <span>Loading map...</span>
                    </div>
                  }
                >
                  <ComparableMap
                  onClose={toggleMapView} 
                    property={property}
                    comparableProperties={(() => {
                      const comps = [];

                      // Extract comparable properties from the property data
                      for (let i = 0; i < 25; i++) {
                        const index = i + 1;
                        const sources = [
                          { prefix: "SALE_COMP", label: "SALE" },
                          { prefix: "REDFIN", label: "REDFIN" },
                        ];

                        for (const { prefix, label } of sources) {
                          const address = (property as any)[
                            `${prefix}_ADDRESS_${index}`
                          ];
                          const lat = (property as any)[
                            `${prefix}_LATITUDE_${index}`
                          ];
                          const lng = (property as any)[
                            `${prefix}_LONGITUDE_${index}`
                          ];
                          const dateSold = (property as any)[
                            `${prefix}_DATESOLD_${index}`
                          ];
                          const price = (property as any)[
                            `${prefix}_PRICE_${index}`
                          ];
                          const bedrooms = (property as any)[
                            `${prefix}_BEDROOMS_${index}`
                          ];
                          const bathrooms = (property as any)[
                            `${prefix}_BATHROOMS_${index}`
                          ];
                          const sqft = (property as any)[
                            `${prefix}_LIVINGAREA_${index}`
                          ];
                          const lotSize = (property as any)[
                            `${prefix}_LOTSIZE_${index}`
                          ];
                          const distance = (property as any)[
                            `${prefix}_DISTANCE_FROM_PROPERTY_${index}`
                          ];
                          const compScore = (property as any)[
                            `COMP_SCORE_${prefix}_${index}`
                          ];
                          const rawUrl = (property as any)[
                            `${prefix}_URL_${index}`
                          ] as string | undefined;
                          const compUrl =
                            prefix === "REDFIN" && rawUrl
                              ? `https://www.redfin.com${rawUrl}`
                              : rawUrl;

                          // Skip if no address or coordinates
                          if (!address || (!lat && !lng)) continue;

                          comps.push({
                            address,
                            lat: lat ? Number(lat) : undefined,
                            lng: lng ? Number(lng) : undefined,
                            dateSold,
                            price,
                            bedrooms,
                            bathrooms,
                            sqft,
                            lotSize,
                            distance: distance ? Number(distance) : undefined,
                            compScore,
                            compUrl,
                          });
                        }
                      }

                      return comps;
                    })()}
                  />
                </Suspense>
              ) : (
                <div className="flex justify-center items-center h-96 bg-white rounded-lg shadow-lg">
                  <Loader2 className="animate-spin w-8 h-8" />
                </div>
              )}
            </>
          )}

          <table className="w-full text-left border-collapse text-sm">
            <thead className="border-b border-gray-300">
              <tr>
                <th className="px-4 py-2 text-gray-700">Address</th>
                <th className="px-4 py-2 text-gray-700">Date Sold</th>
                <th className="px-4 py-2 text-gray-700">Price</th>
                <th className="px-4 py-2 text-gray-700">Sqft</th>
                <th className="px-4 py-2 text-gray-700">Bedrooms</th>
                <th className="px-4 py-2 text-gray-700">Bathrooms</th>
                <th className="px-4 py-2 text-gray-700">Lot Size</th>
                <th className="px-4 py-2 text-gray-700">Distance</th>
                <th className="px-4 py-2 text-gray-700">Comp Quality</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const comps = [];

                for (let i = 0; i < 25; i++) {
                  const index = i + 1;
                  const sources = [
                    {
                      prefix: "SALE_COMP",
                      label: "SALE",
                      scoreKey: `COMP_SCORE_SALE_COMP_${index}`,
                    },
                    {
                      prefix: "REDFIN",
                      label: "REDFIN",
                      scoreKey: `COMP_SCORE_REDFIN_${index}`,
                    },
                  ];

                  for (const { prefix, label, scoreKey } of sources) {
                    const address = (property as any)[
                      `${prefix}_ADDRESS_${index}`
                    ];
                    const dateSold = (property as any)[
                      `${prefix}_DATESOLD_${index}`
                    ];
                    const price = (property as any)[`${prefix}_PRICE_${index}`];
                    const bedrooms = (property as any)[
                      `${prefix}_BEDROOMS_${index}`
                    ];
                    const bathrooms = (property as any)[
                      `${prefix}_BATHROOMS_${index}`
                    ];
                    const sqft = (property as any)[
                      `${prefix}_LIVINGAREA_${index}`
                    ];
                    const lotSize = (property as any)[
                      `${prefix}_LOTSIZE_${index}`
                    ];
                    const distance = (property as any)[
                      `${prefix}_DISTANCE_FROM_PROPERTY_${index}`
                    ];
                    const compScore = (property as any)[scoreKey];
                    const rawUrl = (property as any)[
                      `${prefix}_URL_${index}`
                    ] as string | undefined;
                    const compUrl =
                      prefix === "REDFIN" && rawUrl
                        ? `https://www.redfin.com${rawUrl}`
                        : rawUrl;

                    if (!address && !price && !bedrooms && !bathrooms && !sqft)
                      continue;

                    comps.push({
                      key: `${label}_${index}`,
                      address,
                      dateSold,
                      price,
                      bedrooms,
                      bathrooms,
                      sqft,
                      lotSize,
                      distance: distance ? Number(distance) : Infinity,
                      compScore,
                      compScoreNumeric:
                        typeof compScore === "number" ? compScore : null,
                      compUrl,
                    });
                  }
                }

                comps.sort((a, b) => {
                  if (
                    a.compScoreNumeric !== null &&
                    b.compScoreNumeric !== null
                  ) {
                    return b.compScoreNumeric - a.compScoreNumeric;
                  }
                  if (a.compScoreNumeric !== null) return -1;
                  if (b.compScoreNumeric !== null) return 1;
                  return a.distance - b.distance;
                });

                return comps.map((row) => (
                  <tr key={row.key} className="border-b border-gray-200">
                    <td className="px-4 py-2">
                      <a
                        href={row.compUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        {String(row.address) || " - "}
                      </a>
                    </td>
                    <td className="px-4 py-2">
                      {typeof row.dateSold === "string" ||
                      typeof row.dateSold === "number"
                        ? new Date(row.dateSold).toLocaleDateString("en-US")
                        : "N/A"}
                    </td>
                    <td className="px-4 py-2">
                      {row.price
                        ? `$${Number(row.price).toLocaleString()}`
                        : " - "}
                    </td>
                    <td className="px-4 py-2">{row.sqft || " - "}</td>
                    <td className="px-4 py-2">
                      {String(row.bedrooms) || " - "}
                    </td>
                    <td className="px-4 py-2">
                      {String(row.bathrooms) || " - "}
                    </td>
                    <td className="px-4 py-2">
                      {row.lotSize
                        ? `${(Number(row.lotSize) / 43560).toFixed(2)}`
                        : " - "}
                    </td>
                    <td className="px-4 py-2">
                      {row.distance !== Infinity
                        ? row.distance.toFixed(2)
                        : " - "}
                    </td>
                    <td className="px-4 py-2">
                      {row.compScore !== undefined ? (
                        typeof row.compScore === "number" ? (
                          row.compScore.toFixed(2)
                        ) : (
                          <ul className="list-disc list-inside text-gray-700">
                            {String(row.compScore)
                              .split(",")
                              .map((reason, i) => (
                                <li key={i}>{reason.split(":")[0].trim()}</li>
                              ))}
                          </ul>
                        )
                      ) : (
                        " - "
                      )}
                    </td>
                  </tr>
                ));
              })()}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default PropertyDetailsPage;
