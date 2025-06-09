import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/button";

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="home-container">
      <h2>Welcome to Home Page!</h2>

      <div style={{ marginBottom: "20px" }}>
        <Button label="Logout" onClick={handleLogout} />
        <span style={{ marginRight: "10px" }}></span>
        <Button label="Open Input Form" onClick={() => window.open("/input-form", "_blank")} />
        <span style={{ marginRight: "10px" }}></span>
        <Button label="Add Plate Type" onClick={() => window.open("/add-plate-type", "_blank")} />
        <span style={{ marginRight: "10px" }}></span>
        <Button label="Add Plate" onClick={() => window.open("/add-plate", "_blank")} />
        <span style={{ marginRight: "10px" }}></span>
        <Button label="Plate Manage" onClick={() => window.open("/plate-manage", "_blank")} />
        <span style={{ marginRight: "10px" }}></span>
        <Button label="Update Plate" onClick={() => window.open("/update-plate", "_blank")} />
        <span style={{ marginRight: "10px" }}></span>
        <Button label="Add Press" onClick={() => window.open("/add-press", "_blank")} />
        <span style={{ marginRight: "10px" }}></span>
        <Button label="Add Feed Pump" onClick={() => window.open("/add-feed-pump", "_blank")} />
        <span style={{ marginRight: "10px" }}></span>
        <Button label="Add Squeezing Pump" onClick={() => window.open("/add-sq-pump", "_blank")} />
        <span style={{ marginRight: "10px" }}></span>
        <Button label="Get All Plate Types" onClick={() => window.open("/get-all-plate-types", "_blank")} />
        <span style={{ marginRight: "10px" }}></span>
        <Button label="Delete Plate Types" onClick={() => window.open("/delete-plate-types", "_blank")} />
      </div>
    </div>
  );
};

export default Home;
