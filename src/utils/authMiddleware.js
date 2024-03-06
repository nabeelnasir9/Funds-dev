// middleware/authMiddleware.js

const jwt = require("jsonwebtoken");
import User from "../../src/models/userModel";

const authMiddleware = async (req, res, next) => {
  // Get the token from the request headers, query parameters, or cookies
  const token = req // Assuming the token is in the "Authorization" header

  try {
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    // Verify the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    // Check if the user exists in the database
    const user = await User.findById(decodedToken.userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Attach the user ID to the request object for later use
    decodedToken.userId = decodedToken.userId;
    return decodedToken.userId;
    // Call next() to pass control to the next middleware or route handler
  } catch (error) {
    // Handle authentication errors
    console.error("Authentication error:", error.message);
    return res.status(401).json({ error: "Authentication failed" });
  }
};

module.exports = authMiddleware;
