import { useContext, useEffect, useState } from "react";
import SignupForm from "../components/SignupForm";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const SignupPage = () => {
  const { loggedIn } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
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
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignupForm />
      </div>
    </div>
  );
};

export default SignupPage;
