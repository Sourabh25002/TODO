import React, { useState, useEffect } from "react";
import { backendUrl } from "../utils/config";
import "./Todo.css";

const ToDo = () => {
  // State variables
  const [activities, setActivities] = useState([]); // Stores list of activities
  const [newActivity, setNewActivity] = useState(""); // Stores new activity input
  const [error, setError] = useState(null); // Stores error messages
  const [activeActivityId, setActiveActivityId] = useState(null); // Tracks active activity

  // Fetch activities on component mount
  useEffect(() => {
    fetchActivities();
  }, []);

  // Function to fetch activities from server
  const fetchActivities = async () => {
    try {
      const userId = getCookie("userId"); // Get userId from cookies
      const response = await fetch(`${backendUrl}activity/${userId}`); // Fetch activities for user
      const data = await response.json(); // Parse response JSON
      setActivities(data); // Update activities state
    } catch (error) {
      setError(error.message); // Set error state if fetch fails
    }
  };

  // Function to handle adding a new activity
  const handleAddActivity = async () => {
    try {
      const userId = getCookie("userId"); // Get userId from cookies
      const response = await fetch(`${backendUrl}activity`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, name: newActivity }), // Send new activity data to server
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add activity"); // Throw error if response not okay
      }

      const data = await response.json(); // Parse response JSON
      setActivities([...activities, data]); // Update activities state with new activity
      setNewActivity(""); // Clear input field
    } catch (error) {
      setError(error.message); // Set error state if adding activity fails
    }
  };

  // Function to get cookie by name
  const getCookie = (name) => {
    const value = `; ${document.cookie}`; // Get cookie string
    const parts = value.split(`; ${name}=`); // Split by cookie name
    if (parts.length === 2) return parts.pop().split(";").shift(); // Return cookie value
  };

  // Function to handle removing an activity
  const handleRemoveActivity = async (id) => {
    try {
      const response = await fetch(`${backendUrl}activity/${id}`, {
        method: "DELETE", // HTTP DELETE method to remove activity
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete activity"); // Throw error if response not okay
      }

      setActivities(activities.filter((activity) => activity._id !== id)); // Update activities state by filtering out removed activity

      // If removed activity was active, clear active state
      if (id === activeActivityId) {
        setActiveActivityId(null); // Clear activeActivityId state
      }
    } catch (error) {
      setError(error.message); // Set error state if removing activity fails
    }
  };

  // Function to handle starting an activity
  const handleStartActivity = async (id) => {
    // If there is an active activity, prevent starting another one
    if (activeActivityId) {
      return;
    }

    try {
      const response = await fetch(`${backendUrl}activity/${id}`, {
        method: "PATCH", // HTTP PATCH method to update activity
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "start" }), // Request body with action start
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to start activity"); // Throw error if response not okay
      }

      setActiveActivityId(id); // Set active activity id
      fetchActivities(); // Refresh activity list
    } catch (error) {
      setError(error.message); // Set error state if starting activity fails
    }
  };

  // Function to handle ending an activity
  const handleEndActivity = async (id, elapsedTime) => {
    try {
      const response = await fetch(`${backendUrl}activity/${id}`, {
        method: "PATCH", // HTTP PATCH method to update activity
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "end", duration: elapsedTime }), // Request body with action end and duration
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to end activity"); // Throw error if response not okay
      }

      setActiveActivityId(null); // Clear activeActivityId state
      fetchActivities(); // Refresh activity list
    } catch (error) {
      setError(error.message); // Set error state if ending activity fails
    }
  };

  // Function to handle pausing an activity
  const handlePauseActivity = async (id, elapsedTime) => {
    try {
      const response = await fetch(`${backendUrl}activity/${id}`, {
        method: "PATCH", // HTTP PATCH method to update activity
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "pause", duration: elapsedTime }), // Request body with action pause and duration
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to pause activity"); // Throw error if response not okay
      }

      setActiveActivityId(null); // Clear activeActivityId state
      fetchActivities(); // Refresh activity list after pause
    } catch (error) {
      setError(error.message); // Set error state if pausing activity fails
    }
  };

  // Function to handle resuming an activity
  const handleResumeActivity = async (id) => {
    // If there is an active activity, prevent resuming another one
    if (activeActivityId) {
      return;
    }

    try {
      const response = await fetch(`${backendUrl}activity/${id}`, {
        method: "PATCH", // HTTP PATCH method to update activity
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "resume" }), // Request body with action resume
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to resume activity"); // Throw error if response not okay
      }

      setActiveActivityId(id); // Set active activity id
      fetchActivities(); // Refresh activity list
    } catch (error) {
      setError(error.message); // Set error state if resuming activity fails
    }
  };

  // JSX for rendering Todo component
  return (
    <div className="todo-container">
      <h2>ToDo List</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="add-activity">
        <input
          type="text"
          value={newActivity}
          onChange={(e) => setNewActivity(e.target.value)}
          placeholder="New activity"
        />
        <button onClick={handleAddActivity}>Add</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Serial Number</th>
            <th>Activity Name</th>
            <th>Activity Duration</th>
            <th>Actions</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity, index) => (
            <Activity
              key={activity._id}
              index={index}
              activity={activity}
              setActivities={setActivities}
              setError={setError}
              fetchActivities={fetchActivities}
              activeActivityId={activeActivityId}
              onStart={handleStartActivity}
              onEnd={handleEndActivity}
              onPause={handlePauseActivity}
              onResume={handleResumeActivity}
              handleRemoveActivity={handleRemoveActivity}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Component to render each activity
const Activity = ({
  activity,
  index,
  onStart,
  onEnd,
  onPause,
  onResume,
  handleRemoveActivity,
}) => {
  // State variables for activity
  const [elapsedTime, setElapsedTime] = useState(activity.duration || 0); // Stores elapsed time
  const [timerRunning, setTimerRunning] = useState(false); // Tracks timer running state
  const [intervalId, setIntervalId] = useState(null); // Stores interval ID
  const [expanded, setExpanded] = useState(false); // Tracks expanded state
  const [details, setDetails] = useState(null); // Stores activity details

  // Effect hook to start/stop timer based on activity status
  useEffect(() => {
    if (activity.status === "Ongoing") {
      startTimer();
    } else {
      stopTimer();
    }
  }, [activity.status]);

  // Function to start the timer
  const startTimer = () => {
    if (!timerRunning) {
      const interval = setInterval(() => {
        setElapsedTime((prevElapsedTime) => prevElapsedTime + 1);
      }, 1000);
      setTimerRunning(true);
      setIntervalId(interval);
    }
  };

  // Function to stop the timer
  const stopTimer = () => {
    clearInterval(intervalId);
    setTimerRunning(false);
  };

  // Function to handle action based on activity status
  const handleAction = () => {
    switch (activity.status) {
      case "Pending":
        onStart(activity._id);
        break;
      case "Ongoing":
        onEnd(activity._id, elapsedTime);
        break;
      case "Paused":
        onResume(activity._id);
        break;
      default:
        break;
    }
  };

  // Function to fetch and show activity details
  const handleShowDetails = async () => {
    try {
      const response = await fetch(
        `${backendUrl}activity/${activity._id}/details`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch activity details");
      }
      const detailsData = await response.json();
      setDetails(detailsData);
      setExpanded(true);
    } catch (error) {
      console.error("Error fetching activity details:", error.message);
    }
  };

  // Function to hide activity details
  const handleHideDetails = () => {
    setExpanded(false);
  };

  // Function to handle pausing an activity
  const handlePause = () => {
    onPause(activity._id, elapsedTime);
    stopTimer();
  };

  // Function to handle removing an activity
  const handleRemove = () => {
    handleRemoveActivity(activity._id);
  };

  // Function to format duration in hh:mm:ss format
  const formatDuration = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  // JSX for rendering each activity row
  return (
    <>
      <tr>
        <td>{index + 1}</td>
        <td>{activity.name}</td>
        <td>{formatDuration(elapsedTime)}</td>
        <td>
          {activity.status !== "Completed" ? (
            <>
              {activity.status === "Pending" && (
                <button onClick={handleAction}>Start</button>
              )}
              {activity.status === "Ongoing" && (
                <>
                  <button onClick={handlePause}>Pause</button>
                  <button onClick={handleAction}>End</button>
                </>
              )}
              {activity.status === "Paused" && (
                <button onClick={handleAction}>Resume</button>
              )}
            </>
          ) : (
            <button onClick={expanded ? handleHideDetails : handleShowDetails}>
              {expanded ? "Show Less" : "Show Details"}
            </button>
          )}
          <button onClick={handleRemove}>Remove</button>
        </td>
        <td>{activity.status}</td>
      </tr>

      {/* Expanded row for displaying details */}
      {expanded && details && (
        <tr>
          <td colSpan="5">
            {/* Detailed information */}
            <p>Start Time: {new Date(details.start).toLocaleString()}</p>
            <p>End Time: {new Date(details.end).toLocaleString()}</p>
            <p>Total Duration: {formatDuration(details.duration)}</p>
            {/* Render additional details as needed */}
          </td>
        </tr>
      )}
    </>
  );
};

export default ToDo;
