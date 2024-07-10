const mongoose = require("mongoose"); // Import Mongoose for MongoDB object modeling

// Define the schema for the User collection
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true, // Username is required
    unique: true, // Username must be unique
  },
  email: {
    type: String,
    required: true, // Email is required
    unique: true, // Email must be unique
  },
  password: {
    type: String,
    required: true, // Password is required
  },
  activities: [
    {
      type: mongoose.Schema.Types.ObjectId, // Reference to Activity model
      ref: "Activity", // Refers to the "Activity" collection
    },
  ],
});

// Create the User model based on the schema
const User = mongoose.model("User", userSchema);

module.exports = User; // Export the User model for use in other parts of the application
