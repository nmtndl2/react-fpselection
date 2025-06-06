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
import GetAllPlateTypes from "../pages/plateType/getAllPlateTypes";
import DeletePlateTypes from "../pages/plateType/deletePlateTypeList";


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
        <Route path="/input/add-plate-type" element={<PrivateRoute element={<AddPlateTypeForm />} />} />
        <Route path="/input/add-plate" element={<PrivateRoute element={<AddPlateForm />} />} />
        <Route path="/input/add-press" element={<PrivateRoute element={<AddPressForm />} />} />
        <Route path="/input/add-feed-pump" element={<PrivateRoute element={<AddFeedPumpForm />} />} />
        <Route path="/input/add-sq-pump" element={<PrivateRoute element={<AddSqPumpForm />} />} />
        <Route path="/getall-platetypes" element={<PrivateRoute element={<GetAllPlateTypes />} />} />
        <Route path="/delete-platetypes" element={<PrivateRoute element={<DeletePlateTypes />} />} />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
