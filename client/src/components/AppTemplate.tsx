import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import { useEffect } from "react";
import Footer from "./Footer";
import { useUser } from "../hooks/useUser";

const AppTemplate = () => {
  const { setUser, setLoggedIn } = useUser();

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
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div>
      <Navbar />
      <Outlet />
      {/* <Footer /> */}
    </div>
  );
};

export default AppTemplate;
