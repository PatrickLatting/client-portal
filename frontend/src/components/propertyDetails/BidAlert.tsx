import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import { useUser } from "../../hooks/useUser";

interface Props {
  propertyId: unknown;
  address?: string;
}

function BidAlert({ propertyId, address }: Props) {
  const { user, setUser } = useUser(); // Accessing user context
  const [bidReqLoading, setBidReqLoading] = useState(false);
  const [bidAmount, setBidAmount] = useState(3000);
  const [emailId, setEmailId] = useState(user?.emailId);
  const { toast } = useToast();

  const bidAction = async () => {
    setBidReqLoading(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/property/action`,
        { propertyId, actionType: "bid", bidAmount, emailId, address },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

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

      toast({
        title: "✅ Success",
        description: "Bid placed successfully",
        variant: "default",
      });
    } catch {
      toast({
        title: "❌ Error",
        description: "Failed to place bid",
        variant: "default",
      });
    } finally {
      setBidReqLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" disabled={bidReqLoading}>
          {bidReqLoading ? (
            <>
              Enter / Change Bid
              <Loader2 className="animate-spin" />
            </>
          ) : (
            "Enter / Change Bid"
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Enter bid</AlertDialogTitle>
          <AlertDialogDescription>
            <div className="grid gap-2 my-4 ">
              <Label className="text-left">
                Enter Maximum bid (enter 0 to cancel bid)
              </Label>
              <div className="relative">
                <Input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(Number(e.target.value))}
                  placeholder={"3000"}
                  required={true}
                />
              </div>
            </div>
            <div className="grid gap-2 my-4 text-left">
              <Label>Enter account email address*</Label>
              <div className="relative">
                <Input
                  type="email"
                  value={emailId}
                  onChange={(e) => setEmailId(e.target.value)}
                  placeholder={"Email Address"}
                  required={true}
                />
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={bidAction}>
            {bidReqLoading ? (
              <>
                Bidding <Loader2 className="animate-spin" />
              </>
            ) : (
              "Bid"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default BidAlert;
