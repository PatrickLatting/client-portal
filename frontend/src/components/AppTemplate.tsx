import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import { useEffect, useState } from "react";
import { useUser } from "../hooks/useUser";
import ForeclosureSkeleton from "./ForeclosureSkeleton";

const AppTemplate = () => {
  const { setUser, setLoggedIn } = useUser();

  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/profile/view`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setUser(res.data);
      setLoggedIn(true);
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error("An unknown error occurred");
      }
    } finally {
      setLoading(false);
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
