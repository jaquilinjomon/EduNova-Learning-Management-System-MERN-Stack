import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, default: 0 },
  isPremium: { type: Boolean, default: false },
  videoUrl: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Course", courseSchema);
