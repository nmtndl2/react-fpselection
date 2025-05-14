import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/login";
import Register from "../pages/register";
import Home from "../pages/home";
import AboutUs from "../pages/about";
import InputForm from "../pages/inputForm";

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

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
