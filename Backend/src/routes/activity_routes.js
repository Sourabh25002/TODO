const express = require("express"); // Import Express framework
const router = express.Router(); // Create a router instance
const Activity = require("../models/activity_model"); // Import Activity model for MongoDB operations

// Create a new activity
router.post("/", async (req, res) => {
  const { userId, name } = req.body; // Destructure userId and name from request body
  try {
    const activity = new Activity({ user: userId, name }); // Create new Activity instance
    await activity.save(); // Save activity to the database
    res.status(201).json(activity); // Respond with created activity in JSON format
  } catch (error) {
    res.status(500).json({ message: "Server error" }); // Handle server error
  }
});

// Get all activities for a user
router.get("/:userId", async (req, res) => {
  const { userId } = req.params; // Extract userId from request parameters
  try {
    const activities = await Activity.find({ user: userId }); // Find activities by user ID
    res.json(activities); // Respond with activities in JSON format
  } catch (error) {
    res.status(500).json({ message: "Server error" }); // Handle server error
  }
});

// Update an activity's status and duration
router.patch("/:id", async (req, res) => {
  const { action, duration } = req.body; // Destructure action and duration from request body

  try {
    let activity = await Activity.findById(req.params.id); // Find activity by ID

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" }); // Return error if activity not found
    }

    // Handle action updates
    if (action) {
      activity.history.push({ action }); // Add action to activity history
      if (action === "start") {
        activity.status = "Ongoing";
      } else if (action === "end") {
        activity.status = "Completed";
      } else if (action === "pause") {
        activity.status = "Paused";
      } else if (action === "resume") {
        activity.status = "Ongoing";
      }
    }

    // Update duration if provided and valid
    if (typeof duration !== "undefined" && !isNaN(duration)) {
      activity.duration = duration; // Update activity duration
    }

    await activity.save(); // Save updated activity

    res.json(activity); // Respond with updated activity in JSON format
  } catch (error) {
    console.error(error); // Log error to console
    res.status(500).json({ message: "Failed to update activity" }); // Handle server error
  }
});

// Delete an activity
router.delete("/:id", async (req, res) => {
  const { id } = req.params; // Extract activity ID from request parameters
  try {
    // Validate the id
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid activity ID" }); // Return error if ID is invalid
    }

    const activity = await Activity.findById(id); // Find activity by ID
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" }); // Return error if activity not found
    }

    await Activity.deleteOne({ _id: id }); // Delete activity from database
    res.json({ message: "Activity deleted" }); // Respond with deletion success message
  } catch (error) {
    console.error("Error deleting activity:", error); // Log error to console
    res.status(500).json({ message: "Server error", error: error.message }); // Handle server error
  }
});

// Show details of a completed activity
router.get("/:id/details", async (req, res) => {
  const { id } = req.params; // Extract activity ID from request parameters
  try {
    const activity = await Activity.findById(id); // Find activity by ID
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" }); // Return error if activity not found
    }

    // Extract relevant details from activity
    const details = {
      start: activity.history.find((entry) => entry.action === "start")
        ?.timestamp,
      end: activity.history.find((entry) => entry.action === "end")?.timestamp,
      duration: activity.duration,
      history: activity.history,
    };

    res.json(details); // Respond with activity details in JSON format
  } catch (error) {
    res.status(500).json({ message: "Server error" }); // Handle server error
  }
});

module.exports = router; // Export the router for use in Express application
