import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    roles: ["USER"],
  });

  const [message, setMessage] = useState({ text: "", type: "" });
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setMessage({ text: "Passwords do not match!", type: "error" });
      return;
    }

    try {
      const response = await fetch("http://localhost:8081/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          roles: formData.roles,
        }),
      });

      if (response.ok) {
        setMessage({
          text: "Registration successful! Redirecting to login...",
          type: "success",
        });

        // Redirect to Login after 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setMessage({ text: "Failed to register. Please try again.", type: "error" });
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage({
        text: "Something went wrong. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <div className="login-container">
      <h2>Register</h2>
      {/* Show success or error message */}
      {message.text && (
        <p className={`message ${message.type}`}>{message.text}</p>
      )}

      <form onSubmit={handleSubmit}>
        {/* Email Input */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        {/* Password Input */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        {/* Confirm Password Input */}
        <input
          type="password"
          name="confirmPassword"
          placeholder="Re-enter Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
