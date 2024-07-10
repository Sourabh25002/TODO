const mongoose = require("mongoose"); // Import the Mongoose library for MongoDB interactions

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      // Attempt to connect to MongoDB using the provided URI from environment variables
      useNewUrlParser: true, // Use the new URL parser
      useUnifiedTopology: true, // Use the new server discovery and monitoring engine
    });
    console.log("MongoDB connected"); // Log message upon successful connection
  } catch (error) {
    console.error("MongoDB connection error:", error); // Log error message if connection fails
    process.exit(1); // Exit the Node.js process with a non-zero status code indicating failure
  }
};

module.exports = connectDB; // Export the connectDB function to be used in other parts of the application
