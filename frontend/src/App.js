import "./App.css"; // Import your global CSS file for styling
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom"; // Import necessary functions from React Router

import Login from "./Components/Login"; // Import the Login component
import Signup from "./Components/Signup"; // Import the Signup component
import Todo from "./Components/Todo"; // Import the Todo component

// Create a BrowserRouter instance with route configurations
const router = createBrowserRouter([
  {
    path: "/", // Route path for the Login page
    element: <Login />, // Render the Login component for this route
  },
  {
    path: "/signup", // Route path for the Signup page
    element: <Signup />, // Render the Signup component for this route
  },
  {
    path: "/todo", // Route path for the Todo page
    element: <Todo />, // Render the Todo component for this route
  },
]);

// Define the main App component
const App = () => {
  return (
    <>
      <RouterProvider router={router} />{" "}
      {/* Provide the router instance to RouterProvider */}
    </>
  );
};

export default App;
