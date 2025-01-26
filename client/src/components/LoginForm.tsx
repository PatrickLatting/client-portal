import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import logo from "../assets/1914Logo.png";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { useUser } from "../hooks/useUser";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const context = useUser();
  const { toast } = useToast();

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/login`,
        { emailId, password },
        { withCredentials: true }
      );
      context?.setLoggedIn(true);
      context?.setUser(res.data);
      navigate("/");
      toast({
        title: "✅ Login Successful",
        variant: "default",
      });
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        toast({
          title: "❌ Login Failed",
          description: err.response?.data || "An error occurred during login.",
          variant: "default",
        });
      } else {
        toast({
          title: "❌ Login Failed",
          description: "An unexpected error occurred.",
          variant: "default",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <div className="w-56 mx-auto my-10">
            <img src={logo} alt="" />
          </div>
          <CardTitle className="text-2xl text-center">Client Portal</CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  value={emailId}
                  id="email"
                  type="email"
                  placeholder="Enter mail address"
                  onChange={(e) => setEmailId(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <div className="relative">
                  <Input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full"
                onClick={(e) => {
                  e.preventDefault();
                  handleLogin();
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    Logging in...
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              <Link to="/sign-up" className="text-blue-500">
                Sign up
              </Link>
            </div>
            <div className="text-center text-blue-500">
              <Link
                to="/forgot-password"
                className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
              >
                Forgot your password?
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
