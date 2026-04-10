import { Router } from "express";
import User from "../models/User.js";

const router = Router();

// POST /api/users/login — Verify existing user by phone
router.post("/login", async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ error: "Phone number is required." });
    }

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({ error: "User not found. Please Sign Up first." });
    }

    res.json({ user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error during login." });
  }
});

// POST /api/users/signup — Create a new user
router.post("/signup", async (req, res) => {
  try {
    const { phone, name } = req.body;

    if (!phone || !name) {
      return res.status(400).json({ error: "Phone and name are required for Sign Up." });
    }

    // Check if user already exists
    let existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists. Please use Login." });
    }

    const user = await User.create({ phone, name });
    res.status(201).json({ user });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Server error during sign up." });
  }
});

// GET /api/users/:id — Get user profile
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found." });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: "Server error." });
  }
});

export default router;
