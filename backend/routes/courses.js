import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import Course from "../models/Course.js";
import User from "../models/User.js";
import { verifyAdmin } from "../middleware/auth.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post("/add", verifyAdmin, upload.single("video"), async (req, res) => {
  try {
    let videoUrl = req.body.videoUrl || "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "video",
        folder: "lms_videos",
      });
      videoUrl = result.secure_url;
    }
    const { title, description, price } = req.body;
    const isPremium = price > 0;
    const course = new Course({ title, description, price, isPremium, videoUrl });
    await course.save();
    res.json({ message: "Course added successfully", course });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/edit/:id", verifyAdmin, async (req, res) => {
  try {
    const { title, description, price, videoUrl } = req.body;
    const isPremium = price > 0;
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { title, description, price, isPremium, videoUrl },
      { new: true }
    );
    if (!course) return res.status(404).json({ error: "Course not found" });
    res.json({ message: "Course updated successfully", course });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/delete/:id", verifyAdmin, async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ error: "Course not found" });
    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/enroll/:courseId/:userId", async (req, res) => {
  try {
    const { courseId, userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    
    if (user.enrolledCourses.includes(courseId)) {
      return res.status(400).json({ error: "Already enrolled in this course. Please unenroll first to re‑enroll." });
    }

    user.enrolledCourses.push(courseId);
    await user.save();

    res.json({ message: "Course enrolled successfully", enrolledCourses: user.enrolledCourses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/unenroll/:courseId/:userId", async (req, res) => {
  try {
    const { courseId, userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.enrolledCourses = user.enrolledCourses.filter(
      (id) => id.toString() !== courseId
    );
    await user.save();

    res.json({ message: "Course unenrolled successfully", enrolledCourses: user.enrolledCourses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/enrolled/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("enrolledCourses");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user.enrolledCourses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/recommendations/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("enrolledCourses");

    if (!user || user.enrolledCourses.length === 0) {
      const randomCourses = await Course.aggregate([{ $sample: { size: 3 } }]);
      return res.json(randomCourses);
    }

    const keywords = user.enrolledCourses.map(c => c.title.split(" ")[0]);
    const recommended = await Course.find({
      title: { $regex: keywords.join("|"), $options: "i" },
      _id: { $nin: user.enrolledCourses.map(c => c._id) }
    }).limit(3);

    if (recommended.length === 0) {
      const randomCourses = await Course.aggregate([{ $sample: { size: 3 } }]);
      return res.json(randomCourses);
    }

    res.json(recommended);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
