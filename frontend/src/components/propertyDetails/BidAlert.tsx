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
import { Checkbox } from "../ui/checkbox";

interface Props {
  propertyId: unknown;
  address?: string;
}

function BidAlert({ propertyId, address }: Props) {
  const { user, setUser } = useUser(); // Accessing user context
  const [bidReqLoading, setBidReqLoading] = useState(false);
  const [bidAmount, setBidAmount] = useState(3000);
  const [emailId, setEmailId] = useState(user?.emailId);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showBidDialog, setShowBidDialog] = useState(false);
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
      setShowBidDialog(false);
    }
  };

  const handleTermsAccepted = () => {
    setShowBidDialog(true);
  };

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            disabled={bidReqLoading}
            className="border-2 border-[rgb(5,27,50)] px-4 py-4 text-lg font-semibold bg-white text-[rgb(5,27,50)]"
          >
            {bidReqLoading ? (
              <>
                Enter / Change Bid
                <Loader2 className="ml-2 animate-spin" />
              </>
            ) : (
              "Enter / Change Bid"
            )}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Agree to continue</AlertDialogTitle>
            <AlertDialogDescription>
              <p>
                By submitting this bid, you are giving us permission to bid this
                amount of money on your behalf. If you have signed a POA with
                us, then you may end up owning this property. Bid carefully.
              </p>
              <br />
              <p>
                By checking the box below, you very that you have carefully read
                the pricing section in our engagement letter and agree to pay
                the amount specified if the property is successfully acquired.
                For properties acquired for less than one million dollars, this
                fee is 5%.
              </p>
              <br />
              <p>
                {" "}
                You may cancel your bid at any time, including on the day of the
                auction. Bids will not be considered complete until proof of
                funds has been provided.
              </p>
              <div className="flex items-center space-x-2 mt-4">
                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  onCheckedChange={(checked) =>
                    setTermsAccepted(checked as boolean)
                  }
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I accept the terms
                </label>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={!termsAccepted}
              onClick={handleTermsAccepted}
              className="w-full md:w-auto"
            >
              Accept
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showBidDialog} onOpenChange={setShowBidDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Enter bid</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="grid gap-2 my-4">
                <Label className="text-left">
                  Enter Maximum bid (enter 0 to cancel bid)
                </Label>
                <div className="relative">
                  <Input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                    placeholder="3000"
                    required
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
                    placeholder="Email Address"
                    required
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
                  Bidding <Loader2 className="ml-2 animate-spin" />
                </>
              ) : (
                "Bid"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default BidAlert;
