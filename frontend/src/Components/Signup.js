import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { backendUrl } from "../utils/config";
import "./Signup.css"; // Import your CSS file for styling

const Signup = () => {
  const [username, setUsername] = useState(""); // State variable for username input
  const [email, setEmail] = useState(""); // State variable for email input
  const [password, setPassword] = useState(""); // State variable for password input
  const [error, setError] = useState(null); // State variable for error handling
  const navigate = useNavigate(); // Hook from React Router for navigation

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    try {
      // Send signup request to server
      const response = await fetch(`${backendUrl}auth/signup`, {
        method: "POST", // HTTP POST method for signup
        headers: {
          "Content-Type": "application/json", // JSON content type header
        },
        body: JSON.stringify({ username, email, password }), // Convert user input to JSON string
      });

      if (!response.ok) {
        const errorData = await response.json(); // Parse error response if not successful
        throw new Error(errorData.message || "Signup failed"); // Throw error if signup fails
      }

      const userData = await response.json(); // Parse successful response

      // Set user details in cookies (example)
      document.cookie = `userId=${userData.user._id}`;
      document.cookie = `userName=${userData.user.username}`;
      document.cookie = `userEmail=${userData.user.email}`;

      // Navigate to todo page on successful signup
      navigate("/todo");
    } catch (error) {
      setError(error.message); // Set error state if signup fails
    }
  };

  // JSX for rendering the signup form
  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-form">
        <h2>Signup</h2>
        {error && <p className="error-message">{error}</p>}{" "}
        {/* Display error message if there's an error */}
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required // Username input field with required attribute
          />
        </div>
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
          Signup
        </button>
        <button
          type="button"
          className="btn secondary"
          onClick={() => navigate("/")} // Button to navigate to login page
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Signup;
