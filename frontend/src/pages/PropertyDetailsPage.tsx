import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { Badge } from "../components/ui/badge";
import { Loader2 } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import ActionHistoryTable from "../components/propertyDetails/ActionHistoryTable";
import { useUser } from "../hooks/useUser";
import MapComponent from "../components/propertyDetails/Map";
import { PropertyDetails } from "../types/propertyTypes";
import ForeclosureSkeleton from "../components/ForeclosureSkeleton";
import PropertyImageCarousel from "../components/ImgCarousel";
import PropertyActions from "../components/propertyDetails/PropertyActions";
// import PropertyImageCarousel, { ImgCarousel } from "../components/ImgCarousel";

const PropertyDetailsPage = () => {
  const [property, setProperty] = useState<PropertyDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
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
    { label: "Estimated Value", value: property?.ESTIMATED_VALUE },
    { label: "Square Feet", value: property?.SQUARE_FEET },
    { label: "Bedrooms", value: property?.BEDROOMS },
    { label: "Bathrooms", value: property?.BATHROOMS },
    { label: "Stories", value: property?.STORIES },
    { label: "Lot Acres", value: property?.LOT_ACRES },
    { label: "Year Built", value: property?.YEAR_BUILT },
    { label: "Effective Year Built", value: property?.YEAR_BUILT },
    { label: "Tax Amount", value: property?.TAX_YEAR_1},
  ];

  const foreclosureDetailsSection = [
    {
      label: "Original Loan Balance",
      value: property?.["Principal Amount Owed"] ?? "Not Available",
    },
    { label: "Trustee", value: property?.["Law Firm Name"] ?? "Not Available" },
    { label: "Lender", value: property?.["Lender Name"] ?? "Not Available" },
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
      label: "Foreclosure Sale Date",
      value: property?.["Foreclosure Sale Date"] ?? "Not Available",
    },
  ];

  const ownershipDetailsSection = [
    { label: "Borrower Name(s)", value: property?.["Borrower Name(s)"] },
    { label: "Owner Occupied?", value: property?.OWNER_OCCUPANCY ? "Yes" : "No" },
    { label: "Last Purchased", value: property?.SALE_DATE_1 },
    {
      label: "Years of Ownership",
      value: property?.SALE_DATE_1
        ? Math.floor(
            (new Date().getTime() - new Date(property.SALE_DATE_1).getTime()) /
              (1000 * 60 * 60 * 24 * 365.25)
          )
        : "Not Available",
    },
  ];
console.log(property);
  if (loading) {
    return (
      <div className="flex justify-center w-full items-center h-screen">
        <ForeclosureSkeleton />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header Section */}
      <div className="space-y-6 mb-20">
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-center">
          {property?.Address}
        </h1>

        <div className="flex flex-wrap gap-3 justify-center">
          <Badge variant="outline" className="text-sm md:text-base px-4 py-1">
            {property?.LAND_USE}
          </Badge>
          <Badge variant="outline" className="text-sm md:text-base px-4 py-1">
            {property?.["Foreclosure Sale Date"] || "No Sale Date Available"}
          </Badge>
          <Badge variant="outline" className="text-sm md:text-base px-4 py-1">
            {property?.["Parcel Number"] || "No Sale Date Available"}
          </Badge>
        </div>
      </div>

      {/* Actions Section */}
      <PropertyActions
        property={property}
        isThisPropertySaved={isThisPropertySaved}
        setIsThisPropertySaved={setIsThisPropertySaved}
      />

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

        {/* Property Details Header & Grid */}
        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-4">
            Property Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
            {propertyDetailsSection.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="font-medium text-blue-900">{item.label}</div>
                <div className="text-gray-700">{item.value || "-"}</div>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-t border-gray-200 my-4" />

        {/* Foreclosure Details Header & Grid */}
        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-4">
            Foreclosure Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3">
            {foreclosureDetailsSection.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="font-medium text-blue-900">{item.label}</div>
                <div className="text-gray-700">{item.value || "-"}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Sale and Assessment History Section */}
      {property && (
        <div className="mb-8 bg-white rounded-lg shadow-lg p-6 space-y-8">
          {/* Recent Sale History Table */}
<section>
  <h2 className="text-xl md:text-2xl font-semibold mb-4">
    Recent Sale History
  </h2>
  <table className="w-full text-left border-collapse">
    <thead className="border-b border-gray-300">
      <tr>
      </tr>
    </thead>
    <tbody>
      <tr className="border-b border-gray-200">
        {[
          property?.SALE_DATE_1,
          property?.SALE_DATE_2,
          property?.SALE_DATE_3,
          property?.SALE_DATE_4,
          property?.SALE_DATE_5,
        ].map((saleDate, index) => (
          <td key={index} className="px-4 py-2">{saleDate || "N/A"}</td>
        ))}
      </tr>
      <tr className="border-b border-gray-200">
        {[
          property?.AMOUNT_1,
          property?.AMOUNT_2,
          property?.AMOUNT_3,
          property?.AMOUNT_4,
          property?.AMOUNT_5,
        ].map((amount, index) => (
          <td key={index} className="px-4 py-2">
            {amount
              ? new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(Number(amount))
              : "N/A"}
          </td>
        ))}
      </tr>
    </tbody>
  </table>
</section>


          {/* Recent Assessment History Table (Horizontal Layout) */}
          <section>
            <h2 className="text-xl md:text-2xl font-semibold mb-4">
              Recent Assessment History
            </h2>

            {property && (
              <table className="w-full text-left border-collapse">
                <thead className="border-b border-gray-300">
                  <tr>
                    {[
                      property.TAX_YEAR_1,
                      property.TAX_YEAR_2,
                      property.TAX_YEAR_3,
                      property.TAX_YEAR_4,
                      property.TAX_YEAR_5,
                    ].map((year, index) => (
                      <th key={index} className="px-4 py-2 text-gray-700">
                        {year || "N/A"}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    {[
                      property.ASSESSED_VALUE_1,
                      property.ASSESSED_VALUE_2,
                      property.ASSESSED_VALUE_3,
                      property.ASSESSED_VALUE_4,
                      property.ASSESSED_VALUE_5,
                    ].map((value, index) => (
                      <td key={index} className="px-4 py-2">
                        {value
                          ? new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                            }).format(Number(value))
                          : "N/A"}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            )}
          </section>
        </div>
      )}

      {/* Image Carousel & Map Section Combined */}
      <div className="mb-8 bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row gap-4">
        {/* Image Carousel (Left) */}
        <div className="w-full md:w-1/2 rounded-lg overflow-hidden">
          <PropertyImageCarousel
            googleEarthUrl={property?.["Google Earth Image URL"]}
            googleMapsUrl={property?.["Google Maps Image URL"]}
            address={property?.Address}
          />
        </div>

        {/* Map (Right) */}
        <div className="w-full md:w-1/2 rounded-lg overflow-hidden">
          {property?.LATITUDE && property?.LONGITUDE ? (
            <div className="h-96">
              <MapComponent
                latitude={property.LATITUDE}
                longitude={property.LONGITUDE}
                zoom={12}
              />
            </div>
          ) : (
            <div className="flex justify-center items-center h-96">
              <Loader2 className="animate-spin w-8 h-8" />
            </div>
          )}
        </div>
      </div>

    {/* Comparable Properties Table */}
<section>
  <h2 className="text-xl md:text-2xl font-semibold mb-4">Comparable Properties</h2>
  <table className="w-full text-left border-collapse">
    <thead className="border-b border-gray-300">
      <tr>
        <th className="px-4 py-2 text-gray-700">Address</th>
        <th className="px-4 py-2 text-gray-700">Price</th>
        <th className="px-4 py-2 text-gray-700">Bedrooms</th>
        <th className="px-4 py-2 text-gray-700">Bathrooms</th>
        <th className="px-4 py-2 text-gray-700">Lot Size (Acres)</th>
        <th className="px-4 py-2 text-gray-700">Sqft</th>
        <th className="px-4 py-2 text-gray-700">Year Built</th>
        <th className="px-4 py-2 text-gray-700">Distance (mi)</th>
        <th className="px-4 py-2 text-gray-700">Listing Type</th>
        <th className="px-4 py-2 text-gray-700">Last Seen</th>
        <th className="px-4 py-2 text-gray-700">Days on Market</th>
      </tr>
    </thead>
    <tbody>
      {Array.from({ length: 10 }, (_, i) => {
        const index = i + 1; // 1-based index
        return (
          <tr key={index} className="border-b border-gray-200">
            <td className="px-4 py-2">{String(property?.[`COMPARABLE_FORMATTEDADDRESS_${index}` as keyof PropertyDetails] ?? "N/A")}</td>
            <td className="px-4 py-2">
              {property?.[`COMPARABLE_PRICE_${index}` as keyof PropertyDetails]
                ? `$${Math.round(Number(property[`COMPARABLE_PRICE_${index}` as keyof PropertyDetails])).toLocaleString()}`
                : "N/A"}
            </td>
            <td className="px-4 py-2">{String(property?.[`COMPARABLE_BEDROOMS_${index}` as keyof PropertyDetails] ?? "N/A")}</td>
            <td className="px-4 py-2">{String(property?.[`COMPARABLE_BATHROOMS_${index}` as keyof PropertyDetails] ?? "N/A")}</td>
            <td className="px-4 py-2">
              {property?.[`COMPARABLE_LOTSIZE_${index}` as keyof PropertyDetails]
                ? (Number(property[`COMPARABLE_LOTSIZE_${index}` as keyof PropertyDetails]) / 43560).toFixed(2)
                : "N/A"}
            </td>
            <td className="px-4 py-2">{String(property?.[`COMPARABLE_SQUAREFOOTAGE_${index}` as keyof PropertyDetails] ?? "N/A")}</td>
            <td className="px-4 py-2">{String(property?.[`COMPARABLE_YEARBUILT_${index}` as keyof PropertyDetails] ?? "N/A")}</td>
            <td className="px-4 py-2">{String(property?.[`COMPARABLE_DISTANCE_${index}` as keyof PropertyDetails] ?? "N/A")}</td>
            <td className="px-4 py-2">{String(property?.[`COMPARABLE_LISTINGTYPE_${index}` as keyof PropertyDetails] ?? "N/A")}</td>
            <td className="px-4 py-2">{String(property?.[`COMPARABLE_LASTSEENDATE_${index}` as keyof PropertyDetails] ?? "N/A")}</td>
            <td className="px-4 py-2">{String(property?.[`COMPARABLE_DAYSONMARKET_${index}` as keyof PropertyDetails] ?? "N/A")}</td>
          </tr>
        );
      })}
    </tbody>
  </table>
</section>



      {/* Action History Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <ActionHistoryTable propertyId={property?._id} />
      </div>
    </div>
  );
};

export default PropertyDetailsPage;
