import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/button";
import InputForm from "./inputForm";
import AddPlateTypeForm from "./plateType/addPlateType";
import AddPlateForm from "./plate/addPlate";
import AddPressForm from "./press/addPress";

const Home = () => {
  const navigate = useNavigate();
  const [showInputForm, setShowInputForm] = useState(false);
  const [showAddPlateTypeForm, setShowAddPlateTypeForm] = useState(false);
  const [showAddPlateForm, setShowAddPlateForm] = useState(false);
  const [showAddPressForm, setShowAddPressForm] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleInputForm = () => {
    setShowInputForm(!showInputForm);
  };

  const toggleAddPlateTypeForm = () => {
    setShowAddPlateTypeForm(!showAddPlateTypeForm);
  };

  const toggleAddPlateForm = () => {
    setShowAddPlateForm(!showAddPlateForm);
  };

  const toggleAddPressForm = () => {
    setShowAddPressForm(!showAddPressForm);
  };

  return (
    <div className="home-container">
      <h2>Welcome to Home Page!</h2>

      <div style={{ marginBottom: "20px" }}>
        <Button label="Logout" onClick={handleLogout} />
        <span style={{ marginRight: "10px" }}></span>
        <Button label="Open Input Form" onClick={toggleInputForm} />
        <span style={{ marginRight: "10px" }}></span>
        <Button label="Add Plate Type" onClick={toggleAddPlateTypeForm} />
        <span style={{ marginRight: "10px" }}></span>
        <Button label="Add Plate" onClick={toggleAddPlateForm} />
        <span style={{ marginRight: "10px" }}></span>
        <Button label="Add Press" onClick={toggleAddPressForm} />
      </div>

      {showInputForm && (
        <div style={{ marginTop: "20px" }}>
          <InputForm />
        </div>
      )}

      {showAddPlateTypeForm && (
        <div style={{ marginTop: "20px" }}>
          <AddPlateTypeForm />
        </div>
      )}

      {showAddPlateForm && (
        <div style={{ marginTop: "20px" }}>
          <AddPlateForm />
        </div>
      )}

      {showAddPressForm && (
        <div style={{ marginTop: "20px" }}>
          <AddPressForm />
        </div>
      )}

    </div>
  );
};

export default Home;
