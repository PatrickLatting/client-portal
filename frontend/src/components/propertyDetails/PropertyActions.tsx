import { PropertyDetails } from "@/src/types/propertyTypes";
import axios from "axios";
import { useState } from "react";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { useUser } from "../../hooks/useUser";
import { toast } from "../../hooks/use-toast";

interface Props {
  property: PropertyDetails | null;
  isThisPropertySaved: boolean | undefined;
  setIsThisPropertySaved: React.Dispatch<React.SetStateAction<any>>;
}

const PropertyActions = ({
  property,
  isThisPropertySaved,
  setIsThisPropertySaved,
}: Props) => {
  const [saveLoading, setSaveLoading] = useState(false);
  const { user, setUser } = useUser();

  const saveProperty = async () => {
    if (!user) {
      toast({
        title: "❌ You must log in to save properties",
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

  return (
    <div className="mb-8 flex flex-wrap gap-3 justify-center md:justify-start">
      {isThisPropertySaved ? (
        <Button
          onClick={unsaveProperty}
          variant="outline"
          disabled={saveLoading}
          className="border-2 border-[rgb(5,27,50)] px-8 py-4 text-lg font-semibold bg-white text-[rgb(5,27,50)]"
        >
          {saveLoading ? (
            <>
              Unsaving... <Loader2 className="ml-2 animate-spin" />
            </>
          ) : (
            "Unsave Property"
          )}
        </Button>
      ) : (
        <Button
          onClick={saveProperty}
          variant="outline"
          disabled={saveLoading}
          className="border-2 border-[rgb(5,27,50)] px-8 py-4 text-lg font-semibold bg-white text-[rgb(5,27,50)]"
        >
          {saveLoading ? (
            <>
              Saving... <Loader2 className="ml-2 animate-spin" />
            </>
          ) : (
            "Save Property"
          )}
        </Button>
      )}
    </div>
  );
};

export default PropertyActions;