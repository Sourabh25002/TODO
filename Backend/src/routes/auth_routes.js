const express = require("express"); // Import Express framework
const router = express.Router(); // Create a router instance
const User = require("../models/user_model"); // Import User model for MongoDB operations
const bcrypt = require("bcryptjs"); // Import bcrypt for password hashing

// Signup route
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body; // Destructure username, email, and password from request body
  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" }); // Return error if user with the same email exists
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // Generate a salted hash of the password

    // Create new user instance with hashed password
    const user = new User({ username, email, password: hashedPassword });

    // Save user to the database
    await user.save();

    // Set user details in cookies (optional)
    res.cookie("user", {
      _id: user._id,
      username: user.username,
      email: user.email,
    });

    // Send user details in response with success message
    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Signup error:", error); // Log signup error
    res.status(500).json({ message: "Server error" }); // Return server error response
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body; // Destructure email and password from request body
  try {
    const user = await User.findOne({ email }); // Find user by email in the database
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" }); // Return error if user not found
    }

    // Compare the password with stored hash
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" }); // Return error if password does not match
    }

    // Set user details in cookies (optional, depending on your use case)
    res.cookie("user", {
      _id: user._id,
      username: user.username,
      email: user.email,
    });

    // Send user details in response with success message
    res.json({
      message: "Logged in successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error); // Log login error
    res.status(500).json({ message: "Server error" }); // Return server error response
  }
});

module.exports = router; // Export the router for use in Express application
