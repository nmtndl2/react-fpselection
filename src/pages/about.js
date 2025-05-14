import React from "react";
import { useNavigate } from "react-router-dom";

const AboutUs = () => {
  const navigate = useNavigate();

  // Logout and redirect to login
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="about-container">
      <h2>About Us</h2>
      <p>This is the About Us page.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default AboutUs;
