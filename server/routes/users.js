import { Router } from "express";
import User from "../models/User.js";

const router = Router();

// POST /api/users/login — Find or create user by phone
router.post("/login", async (req, res) => {
  try {
    const { phone, name } = req.body;

    if (!phone || !name) {
      return res.status(400).json({ error: "Phone and name are required." });
    }

    // Find existing user or create new one
    let user = await User.findOne({ phone });

    if (!user) {
      user = await User.create({ phone, name });
    } else {
      // Update name if changed
      if (user.name !== name) {
        user.name = name;
        await user.save();
      }
    }

    res.json({ user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error during login." });
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
