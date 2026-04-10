import { Router } from "express";
import Land from "../models/Land.js";

const router = Router();

// GET /api/lands/:userId — Get all lands for a user
router.get("/:userId", async (req, res) => {
  try {
    const lands = await Land.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json({ lands });
  } catch (err) {
    console.error("Fetch lands error:", err);
    res.status(500).json({ error: "Failed to fetch lands." });
  }
});

// POST /api/lands — Create a new land
router.post("/", async (req, res) => {
  try {
    const { userId, name, points, areaSqM, currentCrop, status, history } = req.body;

    if (!userId || !name || !points) {
      return res.status(400).json({ error: "userId, name, and points are required." });
    }

    const land = await Land.create({
      userId,
      name,
      points,
      areaSqM: areaSqM || 0,
      currentCrop: currentCrop || "None",
      status: status || "Awaiting Crop",
      history: history || [],
    });

    res.status(201).json({ land });
  } catch (err) {
    console.error("Create land error:", err);
    res.status(500).json({ error: "Failed to create land." });
  }
});

// PUT /api/lands/:id — Update a land
router.put("/:id", async (req, res) => {
  try {
    const land = await Land.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!land) return res.status(404).json({ error: "Land not found." });

    res.json({ land });
  } catch (err) {
    console.error("Update land error:", err);
    res.status(500).json({ error: "Failed to update land." });
  }
});

// PUT /api/lands/:id/history — Append crop history entry
router.put("/:id/history", async (req, res) => {
  try {
    const { year, crop, status } = req.body;
    const land = await Land.findByIdAndUpdate(
      req.params.id,
      { $push: { history: { year, crop, status: status || "Harvested" } } },
      { new: true }
    );

    if (!land) return res.status(404).json({ error: "Land not found." });

    res.json({ land });
  } catch (err) {
    console.error("Add history error:", err);
    res.status(500).json({ error: "Failed to add history." });
  }
});

// DELETE /api/lands/:id — Delete a land
router.delete("/:id", async (req, res) => {
  try {
    const land = await Land.findByIdAndDelete(req.params.id);
    if (!land) return res.status(404).json({ error: "Land not found." });
    res.json({ message: "Land deleted." });
  } catch (err) {
    console.error("Delete land error:", err);
    res.status(500).json({ error: "Failed to delete land." });
  }
});

export default router;
