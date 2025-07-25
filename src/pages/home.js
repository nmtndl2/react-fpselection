import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/button";
import InputForm from "./inputForm";
import AddPlateTypeForm from "./plateType/addPlateType";
import AddPlateForm from "./plate/addPlate";
import AddPressForm from "./press/addPress";
import AddFeedPumpForm from "./feedPump/addFeddPump";
import AddSqPumpForm from "./sqPump/addSqPump";
import GetAllPlateTypes from "./plateType/getAllPlateTypes";
import DeletePlateTypes from "./plateType/deletePlateTypeList";

const Home = () => {
  const navigate = useNavigate();
  const [showInputForm, setShowInputForm] = useState(false);
  const [showAddPlateTypeForm, setShowAddPlateTypeForm] = useState(false);
  const [showAddPlateForm, setShowAddPlateForm] = useState(false);
  const [showAddPressForm, setShowAddPressForm] = useState(false);
  const [showAddFeedPumpForm, setShowAddFeedPumpForm] = useState(false);
  const [showAddSqPumpForm, setShowAddSqPumpForm] = useState(false);
  const [showGetAllPlateTypes, setShowGetAllPlateTypes] = useState(false);
  const [showDeletePlateTypes, setShowDeletePlateTypes] = useState(false);

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

  const toggleAddFeedPumpForm = () => {
    setShowAddFeedPumpForm(!showAddFeedPumpForm);
  };

  const toggleAddSqPumpForm = () => {
    setShowAddSqPumpForm(!showAddSqPumpForm);
  };

  const toggleGetAllPlateTypes = () => {
    setShowGetAllPlateTypes(!showGetAllPlateTypes);
  }

  const toggleDeletePlateTypes = () => {
    setShowDeletePlateTypes(!showDeletePlateTypes);
  }

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
        <span style={{ marginRight: "10px" }}></span>
        <Button label="Add Feed Pump" onClick={toggleAddFeedPumpForm} />
        <span style={{ marginRight: "10px" }}></span>
        <Button label="Add Squeezing Pump" onClick={toggleAddSqPumpForm} />
        <span style={{ marginRight: "10px" }}></span>
        <Button label="Get All Plate Types" onClick={toggleGetAllPlateTypes} />
        <span style={{ marginRight: "10px" }}></span>
        <Button label="Delete Plate Types" onClick={toggleDeletePlateTypes} />
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

      {showAddFeedPumpForm && (
        <div style={{ marginTop: "20px" }}>
          <AddFeedPumpForm />
        </div>
      )}

      {showAddSqPumpForm && (
        <div style={{ marginTop: "20px" }}>
          <AddSqPumpForm />
        </div>
      )}

      {showGetAllPlateTypes && (
        <div style={{ marginTop: "20px" }}>
          <GetAllPlateTypes />
        </div>
      )}

      {showDeletePlateTypes && (
        <div style={{ marginTop: "20px" }}>
          <DeletePlateTypes />
        </div>
      )}

    </div>
  );
};

export default Home;
