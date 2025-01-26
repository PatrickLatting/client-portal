import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import axios from "axios";
import InputField from "../components/InputField";
import { useToast } from "../hooks/use-toast";
import { useNavigate } from "react-router-dom";

function SignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [occupation, setOccupation] = useState("");
  const [ifOther, setIfOther] = useState("");
  const [emailId, setEmailId] = useState("");
  const [howDidYouHearAboutUs, setHowDidYouHearAboutUs] = useState("");
  const [password, setPassword] = useState("");

  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/signup`,
        {
          name,
          organization,
          occupation: occupation.toLowerCase(),
          other: ifOther,
          emailId,
          howDidYouHearAboutUs,
          password,
        },
        { withCredentials: true }
      );
      toast({
        title: "✅ Success!",
        description: "Your signup was successful.",
        variant: "default",
      });
      navigate("/login");
    } catch (err) {
      console.log("==>", err);
      if (axios.isAxiosError(err)) {
        // Safely access Axios-specific properties
        const errorMessage =
          err.response?.data || "Something went wrong. Please try again.";
        toast({
          title: "❌ Error",
          description: errorMessage,
          variant: "default",
        });
      } else if (err instanceof Error) {
        // Handle non-Axios errors
        toast({
          title: "❌ Error",
          description: err.message || "An unknown error occurred.",
          variant: "default",
        });
      } else {
        // Handle unknown error type
        toast({
          title: "❌ Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "default",
        });
      }
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-4xl">Tell us about You</CardTitle>
          <CardDescription>We'll be in contact shortly.</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <InputField
                label="Name *"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <InputField
                label="Organization (if applicable)"
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
              />

              <Select
                onValueChange={(e) => setOccupation(e)}
                value={occupation}
              >
                <SelectTrigger className="mt-0">
                  <SelectValue placeholder="What do you do? *" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Broker">Broker</SelectItem>
                  <SelectItem value="Institutional Investor">
                    Institutional Investor
                  </SelectItem>
                  <SelectItem value="Professional Flipper">
                    Professional Flipper
                  </SelectItem>
                  <SelectItem value="other">other</SelectItem>
                </SelectContent>
              </Select>

              <InputField
                label="If 'Other', what?"
                type="text"
                value={ifOther}
                onChange={(e) => setIfOther(e.target.value)}
                required={occupation === "other"} // Required only if "other" is selected
              />

              <InputField
                label="What's the best email to follow up with? *"
                type="email"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
                required
              />

              <InputField
                label="How did you hear about us?"
                type="text"
                value={howDidYouHearAboutUs}
                onChange={(e) => setHowDidYouHearAboutUs(e.target.value)}
                required
              />

              <InputField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                showPassword={false}
              />

              <Button
                type="submit"
                className="w-full"
                onClick={(e) => {
                  e.preventDefault();
                  handleSignup();
                }}
              >
                Submit
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
export default SignupForm;
