import jwt from "jsonwebtoken";
import User from "../Models/userModel.js";

// ============ STATIC CREDENTIALS ============
let STATIC_USERNAME = "OceanOverseas";
let STATIC_PASSWORD = "ocean@2626";
// =============================================

// Simple Login with Static Credentials
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required",
      });
    }

    // Check against static credentials
    if (username !== STATIC_USERNAME || password !== STATIC_PASSWORD) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    // Find existing user OR create if doesn't exist
    let user = await User.findOne({ username });

    if (!user) {
      try {
        user = await User.create({
          name: "Admin User",
          username: STATIC_USERNAME,
          password: STATIC_PASSWORD,
          email: "admin@oceanoverseas.com",
        });
      } catch (createError) {
        // If duplicate email error, just find and use existing user
        if (createError.code === 11000 && createError.keyPattern?.email) {
          user = await User.findOne({ email: "admin@oceanoverseas.com" });
        } else {
          throw createError;
        }
      }
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET || "your_super_secret_jwt_key_change_this",
      { expiresIn: "12h" },
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Logout Handler
export const handleLogout = async (req, res) => {
  try {
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Change Static Password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, newUsername } = req.body;

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
      });
    }

    // Check current password
    if (currentPassword !== STATIC_PASSWORD) {
      return res.status(401).json({
        message: "Current password is incorrect",
      });
    }

    // Update password
    STATIC_PASSWORD = newPassword;

    // Optionally update username
    if (newUsername && newUsername.trim()) {
      STATIC_USERNAME = newUsername;
    }

    return res.status(200).json({
      message: "Password changed successfully",
      username: STATIC_USERNAME,
      password: STATIC_PASSWORD,
    });
  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get Current Credentials (for testing)
export const getCurrentCredentials = async (req, res) => {
  try {
    return res.status(200).json({
      username: STATIC_USERNAME,
      password: STATIC_PASSWORD,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Optional: Get Current User
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user?.id; // From JWT middleware

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Get current user error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
