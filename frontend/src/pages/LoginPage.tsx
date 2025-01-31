import { useEffect, useState } from "react";
import { LoginForm } from "../components/LoginForm";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { Loader2 } from "lucide-react";
import backgroundImage from "../assets/house.jpeg";

const LoginPage = () => {
  const { loggedIn } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (loggedIn) {
      navigate("/");
      setTimeout(() => setLoading(false), 2000);
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <Loader2 className="animate-spin" />;
  }

  return (
    <div
      className="min-h-svh w-full"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        imageRendering: "-webkit-optimize-contrast",
        WebkitBackfaceVisibility: "hidden",
        MozBackfaceVisibility: "hidden",
        backfaceVisibility: "hidden",
        transform: "translateZ(0)",
        willChange: "transform",
      }}
    >
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 ">
        <div className="w-full max-w-sm">
          <LoginForm className="shadow-2xl" />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
