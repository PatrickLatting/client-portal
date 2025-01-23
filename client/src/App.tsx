import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppTemplate from "./components/AppTemplate";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import { createContext, useState } from "react";
import PropertyListingPage from "./pages/PropertyListingPage";
import SignupPage from "./pages/SignupPage";
import AboutPage from "./pages/AboutPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { ToastProvider } from "./components/ui/toast";
import { Toaster } from "./components/ui/toaster";
import PropertyDetailsPage from "./pages/PropertyDetailsPage";

interface User {
  _id: string;
  name: string;
  emailId: string;
  password: string;
  organization: string;
  occupation: string;
  other: string;
  howDidYouHearAboutUs: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface UserContextType {
  loggedIn: boolean;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ loggedIn, setLoggedIn, user, setUser }}>
      <ToastProvider>
        <Toaster />
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<AppTemplate />}>
              <Route
                path="/"
                element={loggedIn ? <PropertyListingPage /> : <HomePage />}
              />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/sign-up" element={<SignupPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/reset-password/:resetToken"
                element={<ResetPassword />}
              />
              <Route
                path="/property-details/:propertyId"
                element={<PropertyDetailsPage />}
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </UserContext.Provider>
  );
}

export { UserContext };
export default App;
