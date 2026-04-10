import mongoose from "mongoose";

const historyEntrySchema = new mongoose.Schema({
  year: { type: Number, required: true },
  crop: { type: String, required: true },
  status: { type: String, default: "Harvested" },
}, { _id: false });

const landSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  points: {
    type: [[Number]], // Array of [lat, lng] pairs
    required: true,
  },
  areaSqM: {
    type: Number,
    default: 0,
  },
  currentCrop: {
    type: String,
    default: "None",
  },
  status: {
    type: String,
    default: "Awaiting Crop",
  },
  lastMappedDate: {
    type: String,
    default: () =>
      new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
  },
  history: {
    type: [historyEntrySchema],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Land", landSchema);
