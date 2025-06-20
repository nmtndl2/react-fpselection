import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Auth Pages
import Login from "../pages/auth/login";
import Register from "../pages/auth/register";

// Main Pages
import Home from "../pages/home";
import AboutUs from "../pages/extra/about";
import InputForm from "../pages/inputForm";

// Plate Type Pages
import AddPlateTypeForm from "../pages/plateType/addPlateType";
import GetAllPlateTypes from "../pages/plateType/getAllPlateTypes";
import DeletePlateTypes from "../pages/plateType/deletePlateTypeList";

// Plate/Press/Pump Pages
import AddPlateForm from "../pages/plate/addPlate";
import PlateManage from "../pages/plate/plateManage";
import UpdatePlate from "../pages/plate/updatePlate";
// Press Pages
import AddPressForm from "../pages/press/addPress";
import UpdatePress from "../pages/press/updatePress";
import PressManage from "../pages/press/pressManage";
import AddPressConfig from "../pages/press/addPressConfig";
// Feed Pump Pages
import AddFeedPumpForm from "../pages/feedPump/addFeddPump";
import UpdateFeedPump from "../pages/feedPump/updateFeedPump";
import ManageFeedPump from "../pages/feedPump/feedPumpManage";
// Sq Pump Pages
import AddSqPumpForm from "../pages/sqPump/addSqPump";
import UpdateSqPump from "../pages/sqPump/updateSqPump";
import ManageSqPump from "../pages/sqPump/manageSqPump";

// Authentication Check
const isAuthenticated = () => !!localStorage.getItem("token");

// Private Route Wrapper
const PrivateRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" replace />;
};

function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Private Routes */}
        <Route path="/" element={<PrivateRoute element={<Home />} />} />
        <Route path="/input-form" element={<PrivateRoute element={<InputForm />} />} />
        <Route path="/add-plate-type" element={<PrivateRoute element={<AddPlateTypeForm />} />} />
        <Route path="/add-plate" element={<PrivateRoute element={<AddPlateForm />} />} />
        <Route path="/plate-manage" element={<PrivateRoute element={<PlateManage />} />} />
        <Route path="/update-plate/:plateId" element={<PrivateRoute element={<UpdatePlate />} />} />
        <Route path="/add-press" element={<PrivateRoute element={<AddPressForm />} />} />
        <Route path="/update-press/:pressId" element={<PrivateRoute element={<UpdatePress />} />} />
        <Route path="/press-manage" element={<PrivateRoute element={<PressManage />} />} />
        <Route path="/add-press-config" element={<PrivateRoute element={<AddPressConfig />} />} />
        <Route path="/add-feed-pump" element={<PrivateRoute element={<AddFeedPumpForm />} />} />
        <Route path="/update-feed-pump/:id" element={<PrivateRoute element={<UpdateFeedPump />} />} />
        <Route path="/manage-feed-pump" element={<PrivateRoute element={<ManageFeedPump />} />} />
        <Route path="/add-sq-pump" element={<PrivateRoute element={<AddSqPumpForm />} />} />
        <Route path="/update-sq-pump/:id" element={<PrivateRoute element={<UpdateSqPump />} />} />
        <Route path="/manage-sq-pump" element={<PrivateRoute element={<ManageSqPump />} />} />
        <Route path="/get-all-plate-types" element={<PrivateRoute element={<GetAllPlateTypes />} />} />
        <Route path="/delete-plate-types" element={<PrivateRoute element={<DeletePlateTypes />} />} />

        {/* Optional Extra Page */}
        <Route path="/about" element={<PrivateRoute element={<AboutUs />} />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
