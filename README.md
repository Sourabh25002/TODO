# ToDo Activity List Application

Welcome to the ToDo Activity List Application! This application is designed to help users manage their daily activities efficiently. It provides functionalities for creating, updating, and monitoring activities, ensuring a seamless user experience across devices.

# Features:
 
* Authentication: Secure signup and login functionalities using bcrypt for password hashing and JWT for authentication tokens.
* ToDo List Management: Users can add, remove, and manage their activities.
* Activity Actions: Each activity supports actions such as Start, End, Resume, and Pause.
* Activity Constraints: Only one activity can be active at a time to maintain clarity and focus.
* Real-time Updates: Activities update in real-time, displaying ongoing durations formatted as HH:MM

# Frontend Layout

Presented in a responsive table format with columns for Serial Number, Activity Name, Duration, Actions, and Status (Ongoing, Pending, Completed).
Database Integration

MongoDB Atlas is used to store user data and activity details, ensuring robust data management and activity history tracking.
Activity Details

Once completed, activities display detailed information including start time, end time, and action history.

# Technologies Used
* Frontend: React.js, React Router, Axios, JS Cookie
* Backend: Node.js, Express.js, MongoDB (mongoose), bcryptjs, dotenv
* Deployment: Deployment-ready configuration for both frontend and backend applications.
  
# Installation

* git clone <repository-url>
* cd frontend
* npm install
* cd ../backend
* npm install
* Set up environment variables: Create a .env file in the backend directory and define PORT and MONGO_URI variables.
* Start the frontend and backend servers:

Frontend: npm run start in the frontend directory
Backend: npm start in the backend directory

# Usage

* Navigate to the application URL.
* Register or login to access the ToDo list.
* Add activities and manage them using the provided action buttons.
* Track ongoing activities and view detailed activity history as needed.

# Future Enhancements
* Implement notifications for activity updates and reminders.
* Enhance UI/UX with additional themes and customization options.
* Integrate more sophisticated analytics and reporting features.
  
# Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your enhancements.

# License

This project is licensed under the ISC License. See the LICENSE file for more details.
