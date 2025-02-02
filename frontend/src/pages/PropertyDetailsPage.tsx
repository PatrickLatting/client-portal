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
            ], // Add to savedProperties list
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
              (id) => id !== property?._id // Remove from savedProperties list
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
  console.log(property);
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
          title: `❌ Error`,
          description: "Failed to place bid",
          variant: "default",
        });
      }
    } finally {
      setOrderReqLoading(false);
    }
  };

  const propertyDetails = [
    { label: "Owner Name(s)", value: property?.OWNER_1_FULL_NAME },
    { label: "Original Loan Balance", value: property?.MORTGAGE_AMOUNT }, // This seems to repeat the same field, you might want to replace it with a different property
    { label: "2024 County Assessed Value", value: property?.ASSESSED_VALUE },
    { label: "Trustee", value: property?.["Law Firm Name"] },
    {
      label: "Trustee Phone Number",
      value: property?.["Attorney Phone Number"],
    },
    { label: "Lender", value: property?.["Lender Name"] },
    { label: "Lender Phone Number", value: property?.["Lender Phone Number"] },
    {
      label: "County Assessed Land Value",
      value: property?.ASSESSED_LAND_VALUE,
    },
    {
      label: "2024 County Assessed Improvement Value",
      value: property?.ASSESSED_IMPROVEMENT_VALUE,
    },
    { label: "Lot Acres", value: property?.LOT_ACRES },
    { label: "Square Feet", value: property?.SQUARE_FEET },
    { label: "Year Built", value: property?.YEAR_BUILT },
    { label: "Bedrooms", value: property?.BEDROOMS },
    { label: "Bathrooms", value: property?.BATHROOMS },
    { label: "Stories", value: property?.STORIES },
    { label: "HOA?", value: "-" }, // You might want to add a property for this
    { label: "Parcel Number", value: property?.["Parcel Number"] },
    { label: "Zoning", value: property?.ZONING },
    { label: "School District", value: property?.SCHOOL_DISCTRICT },
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
      <div className="space-y-6 mb-8">
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-center">
          {property?.Address}
        </h1>
        
        <div className="flex flex-wrap gap-3 justify-center">
          <Badge variant="outline" className="text-sm md:text-base px-4 py-1">
            {property?.LAND_USE}
          </Badge>
          <Badge variant="outline" className="text-sm md:text-base px-4 py-1">
            {property?.["Borrower Name(s)"]}
          </Badge>
        </div>
      </div>

      {/* Image Carousel Section */}
      <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
        <PropertyImageCarousel
          googleEarthUrl={property?.["Google Maps Image URL"]}
          googleMapsUrl={property?.["Google Earth Image URL"]}
          address={property?.Address}
        />
      </div>

      {/* Actions Section */}
      <div className="mb-8 flex flex-wrap gap-3 justify-center md:justify-start">
        {isThisPropertySaved ? (
          <>
            <BidAlert propertyId={property?._id} address={property?.Address} />
            <Button 
              variant="outline" 
              disabled={orderReqLoading}
              onClick={orderImage}
              className="w-full md:w-auto"
            >
              {orderReqLoading ? (
                <>Order Property Images... <Loader2 className="ml-2 animate-spin" /></>
              ) : (
                "Order Property Images"
              )}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-10">...</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={unsaveProperty}>
                  {saveLoading ? (
                    <>Unsaving... <Loader2 className="ml-2 animate-spin" /></>
                  ) : (
                    "Unsave"
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <Button 
            variant="outline" 
            onClick={saveProperty}
            className="w-full md:w-auto"
          >
            {saveLoading ? (
              <>Saving... <Loader2 className="ml-2 animate-spin" /></>
            ) : (
              "Save"
            )}
          </Button>
        )}
      </div>

      {/* Property Details Grid */}
      <div className="mb-8 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl md:text-2xl font-semibold mb-6">Property Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {propertyDetails.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="font-medium text-gray-700">{item.label}</div>
              <div className="text-gray-600">{item.value || "-"}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Map Section */}
      <div className="mb-8 bg-white rounded-lg shadow-lg overflow-hidden">
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

      {/* Action History Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <ActionHistoryTable propertyId={property?._id} />
      </div>
    </div>
  );
};

export default PropertyDetailsPage;