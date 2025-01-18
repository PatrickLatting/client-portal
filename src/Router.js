import React from 'react';
import { Routes, Route } from "react-router-dom";
import AboutUs from './pages/AboutUs';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';
import MyProperties from './pages/MyProperties';
import OrderHistory from './pages/OrderHistory';
import PropertyDetails from './pages/PropertyDetails';
import ResetPassword from './pages/ResetPassword';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import StateLaws from './pages/StateLaws';
import UserProfile from './pages/UserProfile';


const AppRouter = () => {
    return (
        <main>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/my-properties" element={<MyProperties />} />
                <Route path="/order-history" element={<OrderHistory />} />
                <Route path="/property/:id" element={<PropertyDetails />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/state-laws" element={<StateLaws />} />
                <Route path="/user-profile" element={<UserProfile />} />
            </Routes>
        </main>
    );
};

export default AppRouter;