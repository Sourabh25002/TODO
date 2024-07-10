const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDB = require("./db"); // Function to connect to the database
const authRoutes = require("./routes/auth_routes"); // Import routes for authentication
const activityRoutes = require("./routes/activity_routes"); // Import routes for activities

const PORT = process.env.PORT || 5000; // Set the port number from environment variables or default to 5000

const app = express(); // Create an Express application

// Middleware Setup
app.use(bodyParser.json()); // Parse incoming request bodies in JSON format
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cookieParser()); // Parse cookies attached to the client request
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)

// connect mongodb to our node app.
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((x) => {
    console.log("Connected to Mongo!");
  })
  .catch((err) => {
    console.log("Error while connecting to Mongo");
  });

// connectDB(); // Connect to the database using the imported function

// Routes
app.get("/", (req, res) => {
  res.send("Hello, World!"); // Basic route for testing server connectivity
});

app.use("/auth", authRoutes); // Mount authentication routes under '/auth'
app.use("/activity", activityRoutes); // Mount activity routes under '/activity'

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`); // Log a message when the server starts listening
});
