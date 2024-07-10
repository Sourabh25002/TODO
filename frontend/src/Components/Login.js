import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { backendUrl } from "../utils/config";
import "./Login.css"; // Import your CSS file for styling

const Login = () => {
  const [email, setEmail] = useState(""); // State variable for email input
  const [password, setPassword] = useState(""); // State variable for password input
  const [error, setError] = useState(null); // State variable for error handling
  const navigate = useNavigate(); // Hook from React Router for navigation

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    try {
      // Send login request to server
      const response = await fetch(`${backendUrl}auth/login`, {
        method: "POST", // HTTP POST method for login
        headers: {
          "Content-Type": "application/json", // JSON content type header
        },
        body: JSON.stringify({ email, password }), // Convert user input to JSON string
      });

      if (!response.ok) {
        const errorData = await response.json(); // Parse error response if not successful
        throw new Error(errorData.message || "Login failed"); // Throw error if login fails
      }

      const userData = await response.json(); // Parse successful response

      // Set user details in cookies (example)
      document.cookie = `userId=${userData.user._id}`;
      document.cookie = `userName=${userData.user.username}`;
      document.cookie = `userEmail=${userData.user.email}`;

      // Navigate to homepage or desired route on successful login
      navigate("/todo");
    } catch (error) {
      setError(error.message); // Set error state if login fails
    }
  };

  // JSX for rendering the login form
  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}{" "}
        {/* Display error message if there's an error */}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required // Email input field with required attribute
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required // Password input field with required attribute
          />
        </div>
        <button type="submit" className="btn">
          Login
        </button>
        <button
          type="button"
          className="btn secondary"
          onClick={() => navigate("/signup")} // Button to navigate to signup page
        >
          Signup
        </button>
      </form>
    </div>
  );
};

export default Login;
