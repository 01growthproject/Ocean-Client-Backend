import express from "express";
import {
  login,
  handleLogout,
  getCurrentUser,
  changePassword,
  getCurrentCredentials,
} from "../Controllers/userController.js";

const router = express.Router();

// Authentication routes
router.post("/login", login); // Login
router.post("/logout", handleLogout); // Logout
router.get("/me", getCurrentUser); // Get current user

// Password management
router.post("/change-password", changePassword); // Change static password
router.get("/current-credentials", getCurrentCredentials); // Get current credentials

export default router;
