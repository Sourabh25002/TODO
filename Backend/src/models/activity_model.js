const mongoose = require("mongoose"); // Import Mongoose for MongoDB object modeling

// Define the schema for the Activity collection
const activitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Name of the activity is required
    },
    user: {
      type: mongoose.Schema.Types.ObjectId, // Reference to User model
      ref: "User", // Refers to the "User" collection
      required: true, // User ID is required
    },
    status: {
      type: String,
      enum: ["Ongoing", "Pending", "Paused", "Completed"], // Possible status values
      default: "Pending", // Default status when not specified
    },
    duration: {
      type: Number,
      default: 0, // Default duration is zero
      validate: {
        validator: function (v) {
          return v >= 0; // Custom validation to ensure duration is non-negative
        },
        message: (props) => `${props.value} must be a non-negative number!`, // Validation error message
      },
    },
    history: [
      {
        action: {
          type: String,
          enum: ["start", "pause", "resume", "end"], // Possible action types
          required: true, // Action type is required
        },
        timestamp: {
          type: Date,
          default: Date.now, // Default timestamp is current date/time
        },
      },
    ],
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

// Create the Activity model based on the schema
const Activity = mongoose.model("Activity", activitySchema);

module.exports = Activity; // Export the Activity model for use in other parts of the application
