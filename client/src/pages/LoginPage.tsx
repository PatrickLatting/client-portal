import { useEffect } from "react";
import { LoginForm } from "../components/LoginForm";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/house.jpeg";
import { useUser } from "../hooks/useUser";

const LoginPage = () => {
  const { loggedIn } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedIn) {
      navigate("/");
    }
  });

  return (
    <div
      className="min-h-svh w-full"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        imageRendering: '-webkit-optimize-contrast', // For Chrome/Safari
        WebkitBackfaceVisibility: 'hidden', // Prevents blurry edges during transforms
        MozBackfaceVisibility: 'hidden',
        backfaceVisibility: 'hidden',
        transform: 'translateZ(0)', // Forces GPU acceleration
        willChange: 'transform' // Hints browser to optimize for transforms
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