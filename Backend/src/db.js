const mongoose = require("mongoose"); // Import the Mongoose library for MongoDB interactions

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    console.log("MongoDB URI:", mongoURI); // Log MongoDB URI
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB; // Export the connectDB function to be used in other parts of the application
