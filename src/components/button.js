// src/components/Button.js
import React from "react";
import "../styles/button.css"; 
const Button = ({ label, onClick }) => {
  return <button onClick={onClick}>{label}</button>;
};
export default Button;
