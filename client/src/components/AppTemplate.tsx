import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import { useEffect, useState } from "react";
import { useUser } from "../hooks/useUser";
import { Loader2 } from "lucide-react";
import ForeclosureSkeleton from "./ForeclosureSkeleton";

const AppTemplate = () => {
  const { setUser, setLoggedIn } = useUser();

  // Step 1: Create a loading state
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/profile/view`,
        { withCredentials: true }
      );
      setUser(res.data);
      setLoggedIn(true);
    } catch (err) {
      console.log("==>", err);
    } finally {
      setLoading(false); // Set loading to false once the request finishes
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div>
      {loading ? (
        <div className="flex justify-center w-full items-center h-screen">
          <ForeclosureSkeleton />
        </div>
      ) : (
        <>
          <Navbar />
          <Outlet />
        </>
      )}
    </div>
  );
};

export default AppTemplate;
