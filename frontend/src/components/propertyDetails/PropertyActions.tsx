import { PropertyDetails } from "@/src/types/propertyTypes";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import BidAlert from "./BidAlert";
import { useUser } from "../../hooks/useUser";
import { toast } from "../../hooks/use-toast";
import ConfirmActionAlert from "./ConfirmActionAlert";
import { AlertDialogAction } from "../ui/alert-dialog";

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

  const [orderReqLoading, setOrderReqLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [titleReqLoading, setTitleReqLoading] = useState(false);

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
          title: `❌ Error`,
          description: "Failed to order images",
          variant: "default",
        });
      }
    } finally {
      setOrderReqLoading(false);
      setTermsAccepted(false);
    }
  };

  const orderTitle = async () => {
    setTitleReqLoading(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/property/action`,
        {
          propertyId: property?._id,
          actionType: "titleRequest",
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
        title: "✅ Title order request sent successfully",
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
          description: "Failed to order title",
          variant: "default",
        });
      }
    } finally {
      setTitleReqLoading(false);
      setTermsAccepted(false);
    }
  };

  return (
    <div className="mb-8 flex flex-wrap gap-3 justify-center md:justify-start">
      {isThisPropertySaved ? (
        <>
          <Button
            onClick={unsaveProperty}
            variant={"outline"}
            className="border-2 border-[rgb(5,27,50)] px-8 py-4 text-lg font-semibold bg-white text-[rgb(5,27,50)]"
          >
            {saveLoading ? (
              <>
                Unsaving... <Loader2 className="ml-2 animate-spin" />
              </>
            ) : (
              "Unsave"
            )}
          </Button>
          <BidAlert propertyId={property?._id} address={property?.Address} />

          <ConfirmActionAlert
            triggerTitle={
              <Button
                variant="outline"
                className="border-2 border-[rgb(5,27,50)] px-8 py-4 text-lg font-semibold bg-white text-[rgb(5,27,50)]"
                disabled={orderReqLoading}
              >
                {orderReqLoading ? (
                  <>
                    Order Property Images
                    <Loader2 className="ml-2 animate-spin" />
                  </>
                ) : (
                  "Order Property Images"
                )}
              </Button>
            }
            reqLoading={orderReqLoading}
            dialogDescription={
              <>
                <p>
                  We collect external property images to eliminate a layer of
                  risk. This activity is intended to discovery major issues that
                  may result in a loss of the majority of the principal, such as
                  demolitions and holes in roofs. We will not enter private
                  property in order to collect information. Property image
                  orders are not refundable.
                </p>
                <br />
                <p>
                  By checking the box below, you verify your understanding that
                  external images cost $25 per property and will be added onto
                  your monthly invoice
                </p>
              </>
            }
            setTermsAccepted={setTermsAccepted}
            termsAccepted={termsAccepted}
            confirmButton={
              <AlertDialogAction
                disabled={orderReqLoading || !termsAccepted}
                onClick={orderImage}
                className="w-full md:w-auto ml-2"
              >
                Accept
              </AlertDialogAction>
            }
          />

          <ConfirmActionAlert
            triggerTitle={
              <Button
                variant="outline"
                disabled={titleReqLoading}
                className="border-2 border-[rgb(5,27,50)] px-8 py-4 text-lg font-semibold bg-white text-[rgb(5,27,50)]"
              >
                {titleReqLoading ? (
                  <>
                    Order Title
                    <Loader2 className="ml-2 animate-spin" />
                  </>
                ) : (
                  "Order Title"
                )}
              </Button>
            }
            reqLoading={titleReqLoading}
            dialogDescription={
              <>
                <p>
                  Title is ordered from ProTitle USA, a large and reputable
                  national provider. The 1416 Group is not responsible for any
                  mistakes made by this third-party provider. This title search
                  will provide the chain of title facts but will not provide a
                  formal title opinion; it is your responsibility to form your
                  own opinion based on the facts presented. All title searches
                  are two-owner title searches. The facts provided only cover
                  title events that have occurred during the two most recent
                  ownership periods. This is the recommended search period for
                  foreclosures. Title searches are not refundable.
                </p>
                <br />
                <p>
                  By checking the box below, you verify your understanding that
                  title in {`{county}`} county {`{state}`}, costs {`{price}`}
                  per property.
                </p>
              </>
            }
            setTermsAccepted={setTermsAccepted}
            termsAccepted={termsAccepted}
            confirmButton={
              <AlertDialogAction
                disabled={titleReqLoading || !termsAccepted}
                onClick={orderTitle}
                className="w-full md:w-auto ml-2"
              >
                Accept
              </AlertDialogAction>
            }
          />
        </>
      ) : (
        <Button
          variant="outline"
          onClick={saveProperty}
          className="border-2 border-[rgb(5,27,50)] px-8 py-4 text-lg font-semibold bg-white text-[rgb(5,27,50)]"
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
    </div>
  );
};

export default PropertyActions;
