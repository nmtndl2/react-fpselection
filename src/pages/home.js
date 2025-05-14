import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/button";
import InputForm from "./inputForm"; // adjust path if needed

const Home = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false); // state to toggle form

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleShowForm = () => {
    setShowForm(true);
  };

  return (
    <div className="home-container">
      <h2>Welcome to Home Page!</h2>

      <div style={{ marginBottom: "20px" }}>
         <Button label="Logout" onClick={handleLogout} />
         <span style={{ marginRight: "10px" }}></span>
        <Button label="Open Input Form" onClick={handleShowForm} />
      </div>

      {showForm && (
        <div style={{ marginTop: "20px" }}>
          <InputForm />
        </div>
      )}
    </div>
  );
};

export default Home;
