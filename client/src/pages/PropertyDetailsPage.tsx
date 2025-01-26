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

const PropertyDetailsPage = () => {
  const [property, setProperty] = useState<PropertyDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const { propId } = useParams();
  const { loggedIn, user, setUser } = useUser();
  const [isThisPropertySaved, setIsThisPropertySaved] = useState(false);
  const [orderReqLoading, setOrderReqLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchProperty = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/property-details/${propId}`
      );
      setProperty(res.data.data);

      const isSaved =
        user?.savedProperties.includes(res.data.data._id) ?? false;
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

  if (loading) {
    <div>Loading</div>;
  }

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
    { label: "Lender Phone Number", value: property?.["Lender Phone"] },
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
        `${import.meta.env.VITE_API_BASE_URL}/property/save`,
        { propertyId: property?._id },
        { withCredentials: true }
      );

      setIsThisPropertySaved(true);
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
        `${import.meta.env.VITE_API_BASE_URL}/property/unsave`,
        { propertyId: property?._id },
        { withCredentials: true }
      );
      toast({
        title: "✅ Property saved successfully",
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
        `${import.meta.env.VITE_API_BASE_URL}/property/action`,
        {
          propertyId: property?._id,
          actionType: "imageRequest",
          address: property?.ADDRESS_FROM_INPUT,
          emailId: user?.emailId,
        },
        { withCredentials: true }
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
      // console.log(axiosError.message);
    } finally {
      setOrderReqLoading(false);
    }
  };

  return (
    <div className="md:m-20 m-8">
      <div className="md:flex my-3">
        <div className="w-32 h-32 bg-slate-300 rounded-md mx-auto md:mx-0"></div>
        <div className="md:mx-4">
          <div className="md:text-2xl text-xl font-semibold mb-2 p-0 md:text-left text-center">
            {property?.ADDRESS_FROM_INPUT}
          </div>
          <div className="flex flex-col">
            <Badge variant={"outline"} className="my-2 w-fit mx-auto md:mx-0">
              {property?.LAND_USE}
            </Badge>
            <Badge variant={"outline"} className="my-2 w-fit mx-auto md:mx-0">
              {property?.["Borrower Name(s)"]}
            </Badge>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full ">
        {propertyDetails.map((item, index) => (
          <div key={index} className="flex flex-col m-2 text-sm">
            <div className="font-semibold">{item.label}</div>
            <div className="mt-2 text-slate-600">{item.value || "-"}</div>
          </div>
        ))}
      </div>

      <div className="my-3">
        {isThisPropertySaved ? (
          <div className="my-2 ">
            <BidAlert
              propertyId={property?._id}
              address={property?.ADDRESS_FROM_INPUT}
            />
            {orderReqLoading ? (
              <Button variant={"outline"} disabled={true}>
                Order Property Images... <Loader2 className="animate-spin" />
              </Button>
            ) : (
              <Button variant={"outline"} className="mx-2" onClick={orderImage}>
                Order Property Images
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant={"outline"} className="mx-2">
                  ...
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={unsaveProperty}>
                  {saveLoading ? (
                    <>
                      Unsaving... <Loader2 className="animate-spin" />
                    </>
                  ) : (
                    "Unsave"
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <Button variant="outline" onClick={saveProperty}>
            {saveLoading ? (
              <>
                Saving... <Loader2 className="animate-spin" />
              </>
            ) : (
              "Save"
            )}
          </Button>
        )}
      </div>
      {property?.LATITUDE && property?.LONGITUDE ? (
        <div className="z-10">
          <MapComponent
            latitude={property?.LATITUDE}
            longitude={property?.LONGITUDE}
            zoom={12}
          />
        </div>
      ) : (
        <Loader2 className="animate-spin size-10" />
      )}
      <ActionHistoryTable propertyId={property?._id} />
    </div>
  );
};

export default PropertyDetailsPage;