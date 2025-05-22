import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    try {
      const response = await fetch("http://localhost:8081/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const token = await response.text();
        localStorage.setItem("token", token);
        setMessage({
          text: "Login successful! Redirecting...",
          type: "success",
        });

        // Redirect to Home after a short delay
        setTimeout(() => {
          navigate("/home");
        }, 1500);
      } else {
        setMessage({ text: "Invalid email or password.", type: "error" });
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
    <div className="login-page">
      <div className="login-container">
        <h2>Login</h2>
        {/* Show success or error message */}
        {message.text && (
          <p className={`message ${message.type}`}>{message.text}</p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>
        </form>

        {/* New User Registration Button */}
        <div className="register-link">
          <p>
            New User? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
