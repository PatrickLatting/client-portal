import { Button } from "../ui/button";
import { useUser } from "../../hooks/useUser";
import { useToast } from "../../hooks/use-toast";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface Props {
  propertyId: unknown;
  address?: string;
  isThisPropertySaved: boolean | undefined;
  setIsThisPropertySaved: (saved: boolean) => void;
}

function BidAlert({ propertyId, address, isThisPropertySaved, setIsThisPropertySaved }: Props) {
  const { user, setUser } = useUser();
  const [saveLoading, setSaveLoading] = useState(false);
  const { toast } = useToast();

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
        { propertyId },
        { withCredentials: true }
      );

      setIsThisPropertySaved(true);
      setUser((prevUser) => {
        if (prevUser) {
          return {
            ...prevUser,
            savedProperties: [...prevUser.savedProperties, propertyId as string],
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
        { propertyId },
        { withCredentials: true }
      );

      setUser((prevUser) => {
        if (prevUser) {
          return {
            ...prevUser,
            savedProperties: prevUser.savedProperties.filter((id) => id !== propertyId),
          };
        }
        return prevUser;
      });

      setIsThisPropertySaved(false);
      toast({
        title: "✅ Property unsaved successfully",
        variant: "default",
      });
    } catch (err) {
      console.error("Error unsaving property:", err);
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      disabled={saveLoading}
      onClick={isThisPropertySaved ? unsaveProperty : saveProperty}
      className="border-2 border-[rgb(5,27,50)] px-4 py-4 text-lg font-semibold bg-white text-[rgb(5,27,50)]"
    >
      {saveLoading ? (
        <>
          {isThisPropertySaved ? "Unsaving" : "Saving"}{" "}
          <Loader2 className="ml-2 animate-spin" />
        </>
      ) : isThisPropertySaved ? (
        "Unsave Property"
      ) : (
        "Save Property"
      )}
    </Button>
  );
}

export default BidAlert;
