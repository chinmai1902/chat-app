import jwt from "jsonwebtoken";
import User from "../models/User.js";

// middleware

export const protectRoute = (req, res, next) => {
  const token = req.headers.token;
  console.log("Incoming token:", token); // Debug

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};
