import React, { useState } from "react";
import axios from "axios";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useToast } from "../hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: "❌ Error",
        description: "Please enter a valid email address.",
        variant: "default",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/forgot-password`,
        {
          emailId: email,
        }
      );

      toast({
        title: "✅ Success",
        description:
          response?.data ||
          "Password reset link sent to your email. Redirecting",
        variant: "default",
      });

      setTimeout(() => navigate("/"), 3000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle Axios-specific error with response
        toast({
          title: "❌ Error",
          description: error.response?.data || "Something went wrong.",
          variant: "default",
        });
      } else if (error instanceof Error) {
        // Handle generic JavaScript error
        toast({
          title: "❌ Error",
          description: error.message || "Something went wrong.",
          variant: "default",
        });
      } else {
        // Handle unknown error type
        toast({
          title: "❌ Error",
          description: "An unknown error occurred.",
          variant: "default",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-5">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  Sending... <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
