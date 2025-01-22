import { useContext, useEffect } from "react";
import SignupForm from "../components/SignupForm";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const { loggedIn } = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (loggedIn) {
      navigate("/");
    }
  });

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignupForm />
      </div>
    </div>
  );
};

export default SignupPage;
