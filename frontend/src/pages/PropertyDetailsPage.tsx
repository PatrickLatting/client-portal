import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import BidAlert from "../components/propertyDetails/BidAlert";
import { useToast } from "../hooks/use-toast";
import ActionHistoryTable from "../components/propertyDetails/ActionHistoryTable";
import { useUser } from "../hooks/useUser";
import MapComponent from "../components/propertyDetails/Map";
import { PropertyDetails } from "../types/propertyTypes";
import ForeclosureSkeleton from "../components/ForeclosureSkeleton";
import PropertyImageCarousel from "../components/ImgCarousel";
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
    { label: "Effective Year Built", value: property?.EFFECTIVE_YEAR_BUILT },
    { label: "HOA?", value: property?.HOA_PRESENT === 1 ? "Yes" : "No" },
    { label: "Tax Amount", value: property?.["TAX_AMOUNT"] },
    { label: "Zoning", value: property?.ZONING },
    { label: "School District", value: property?.SCHOOL_DISCTRICT },
  ];

  const foreclosureDetailsSection = [
    { label: "Original Loan Balance", value: property?.["Principal Amount Owed"] ?? "Not Available" },
    { label: "Trustee", value: property?.["Law Firm Name"] ?? "Not Available"},
    { label: "Lender", value: property?.["Lender Name"] ?? "Not Available"},
    { label: "Date of Debt", value: property?.["Date of Debt"] ?? "Not Available"},
    { label: "Trustee Phone Number", value: property?.["Attorney Phone Number"] ?? "Not Available"},
    { label: "Lender Phone Number", value: property?.["Lender Phone Number"] ?? "Not Available"},
    { label: "Foreclosure Sale Date", value: property?.["Foreclosure Sale Date"] ?? "Not Available"},
    
  ];
  
  const ownershipDetailsSection = [
    { label: "Owner Name(s)", value: property?.OWNER_1_FULL_NAME },
    { label: "Properties Owned", value: property?.PROPERTIES_OWNED },
    { label: "Occupancy", value: property?.OWNER_OCCUPANCY },
    { label: "Last Purchased", value: property?.SALE_DATE_1 },
    { 
      label: "Years of Ownership", 
      value: property?.SALE_DATE_1 
          ? Math.floor((new Date().getTime() - new Date(property.SALE_DATE_1).getTime()) / (1000 * 60 * 60 * 24 * 365.25)) 
          : "Not Available"
  }
  ];

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
<div className="mb-8 flex flex-wrap gap-4 justify-start">
  {/* Save/Unsave Button */}
  {isThisPropertySaved ? (
    <Button
      variant="outline"
      onClick={unsaveProperty}
      className="border-2 border-[rgb(5,27,50)] px-8 py-4 text-lg font-semibold bg-white text-[rgb(5,27,50)]"
      disabled={saveLoading}
    >
      {saveLoading ? (
        <>
          Unsaving... <Loader2 className="ml-2 animate-spin" />
        </>
      ) : (
        "Unsave"
      )}
    </Button>
  ) : (
    <Button
      variant="outline"
      onClick={saveProperty}
      className="border-2 border-[rgb(5,27,50)] px-8 py-4 text-lg font-semibold bg-white text-[rgb(5,27,50)]"
      disabled={saveLoading}
    >
      {saveLoading ? (
        <>
          Saving... <Loader2 className="ml-2 animate-spin" />
        </>
      ) : (
        "Save"
      )}
    </Button>
  )}

  {/* Order Property Images Button */}
  <Button
    variant="outline"
    onClick={orderImage}
    className="border-2 border-[rgb(5,27,50)] px-8 py-4 text-lg font-semibold bg-white text-[rgb(5,27,50)]"
    disabled={orderReqLoading}
  >
    {orderReqLoading ? (
      <>
        Ordering... <Loader2 className="ml-2 animate-spin" />
      </>
    ) : (
      "Order Property Images"
    )}
  </Button>

  {/* Enter / Change Bid Button */}
  <BidAlert propertyId={property?._id} address={property?.Address} />
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

      

      {/* Image Carousel & Map Section Combined */}
<div className="mb-8 bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row gap-4">
  {/* Image Carousel (Left) */}
  <div className="w-full md:w-1/2 rounded-lg overflow-hidden">
    <PropertyImageCarousel
      googleEarthUrl={property?.["Google Maps Image URL"]}
      googleMapsUrl={property?.["Google Earth Image URL"]}
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


      {/* Action History Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <ActionHistoryTable propertyId={property?._id} />
      </div>
    </div>
  );
};

export default PropertyDetailsPage;
