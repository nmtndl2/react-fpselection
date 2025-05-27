import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/login";
import Register from "../pages/auth/register";
import Home from "../pages/home";
import AboutUs from "../pages/extra/about";
import InputForm from "../pages/inputForm";
import AddPlateTypeForm from "../pages/plateType/addPlateType";
import AddPlateForm from "../pages/plate/addPlate";
import AddPressForm from "../pages/press/addPress";
import AddFeedPumpForm from "../pages/feedPump/addFeddPump";
import AddSqPumpForm from "../pages/sqPump/addSqPump";


// const isAuthenticated = () => {
//   return localStorage.getItem("token") !== null;
// };

export const isAuthenticated = () => !!localStorage.getItem("token");

// Protect routes using PrivateRoute
const PrivateRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/" element={<PrivateRoute element={<Home />} />} />
        <Route path="/home" element={<PrivateRoute element={<Home />} />} />
        <Route path="/about" element={<PrivateRoute element={<AboutUs />} />} />

        {/* Input Form Route */}
        <Route path="/input" element={<PrivateRoute element={<InputForm />} />} />
        <Route path="/input" element={<PrivateRoute element={<AddPlateTypeForm />} />} />
        <Route path="/input" element={<PrivateRoute element={<AddPlateForm />} />} />
        <Route path="/input" element={<PrivateRoute element={<AddPressForm />} />} />
        <Route path="/input" element={<PrivateRoute element={<AddFeedPumpForm />} />} />
        <Route path="/input" element={<PrivateRoute element={<AddSqPumpForm />} />} />


        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
