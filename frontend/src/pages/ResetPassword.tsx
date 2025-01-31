import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "../components/ui/alert";
import { Eye, EyeOff } from "react-feather";

const ResetPassword = () => {
  const { resetToken } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordReset = async () => {
    if (!resetToken || newPassword.length < 8) {
      setError("Invalid token or password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/reset-password/${resetToken}`,
        { newPassword },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setSuccess(true);
        setError("");
        setTimeout(() => navigate("/login"), 3000);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        // Handle Axios-specific error
        setError(
          err.response?.data?.error ||
            "An error occurred while resetting the password."
        );
      } else if (err instanceof Error) {
        // Handle generic Error
        setError(err.message || "An unknown error occurred.");
      } else {
        // Handle unknown type
        setError("An error occurred while resetting the password.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-5">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">Reset Password</CardTitle>
        </CardHeader>
        <CardContent>
          {success && (
            <Alert variant="default" className="mb-4">
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>
                Password reset successful! Redirecting...
              </AlertDescription>
            </Alert>
          )}
          {error && (
            <Alert className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handlePasswordReset();
            }}
          >
            <div className="mb-4">
              <label
                htmlFor="new-password"
                className="block text-sm font-medium"
              >
                New Password
              </label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  className="mt-1"
                  placeholder="Enter your new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-2 transform -translate-y-1/2"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <div className="mb-4">
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  className="mt-1"
                  placeholder="Confirm your new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-2 transform -translate-y-1/2"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full">
              Reset Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
