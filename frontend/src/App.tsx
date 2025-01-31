import { HashRouter, Route, Routes } from "react-router-dom";  // Changed from BrowserRouter
import AppTemplate from "./components/AppTemplate";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import { createContext, lazy, Suspense, useState } from "react";
import PropertyListingPage from "./pages/PropertyListingPage";
import SignupPage from "./pages/SignupPage";
import AboutPage from "./pages/AboutPage";
import { ToastProvider } from "./components/ui/toast";
import { Toaster } from "./components/ui/toaster";
import { IUser } from "./types/user";
import StateLawPage from "./pages/StateLawPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ForeclosureSkeleton from "./components/ForeclosureSkeleton";

const PropertyDetailsPage = lazy(() => import("./pages/PropertyDetailsPage"));
const SavedPropertiesPage = lazy(() => import("./pages/SavedPropertiesPage"));
const OrderHistory = lazy(() => import("./pages/OrderHistory"));

interface UserContextType {
  loggedIn: boolean;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  user: IUser | null;
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);
  

  return (
    <UserContext.Provider value={{ loggedIn, setLoggedIn, user, setUser }}>
      <ToastProvider>
        <Toaster />
        <HashRouter>  {/* Changed from BrowserRouter and removed basename */}
          <Routes>
            <Route path="/" element={<AppTemplate />}>
              <Route
                index
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
                path="/property-details/:propId"
                element={
                  <Suspense
                    fallback={
                      <div className="flex justify-center w-full items-center h-screen">
                        <ForeclosureSkeleton />
                      </div>
                    }
                  >
                    <PropertyDetailsPage />
                  </Suspense>
                }
              />
              <Route
                path="/my-properties"
                element={
                  <Suspense
                    fallback={
                      <div className="flex justify-center w-full items-center h-screen">
                        <ForeclosureSkeleton />
                      </div>
                    }
                  >
                    <SavedPropertiesPage />
                  </Suspense>
                }
              />
              <Route
                path="/order-history"
                element={
                  <Suspense
                    fallback={
                      <div className="flex justify-center w-full items-center h-screen">
                        <ForeclosureSkeleton />
                      </div>
                    }
                  >
                    <OrderHistory />
                  </Suspense>
                }
              />
              <Route
                path="/state-laws"
                element={
                  <Suspense
                    fallback={
                      <div className="flex justify-center w-full items-center h-screen">
                        <ForeclosureSkeleton />
                      </div>
                    }
                  >
                    <StateLawPage />
                  </Suspense>
                }
              />
            </Route>
          </Routes>
        </HashRouter>
      </ToastProvider>
    </UserContext.Provider>
  );
}

export { UserContext };
export default App;