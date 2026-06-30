import express from "express";
import Certificate from "../models/Certificate.js";

const router = express.Router();

router.get("/user/:userId", async (req, res) => {
  try {
    const certificates = await Certificate.find({ user: req.params.userId })
      .populate("user", "name email")
      .populate("course", "title");

    res.json(certificates);
  } catch (err) {
    res.status(500).json({ error: "Server error while fetching certificates" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    console.log("Fetching certificate with ID:", req.params.id);
    const certificate = await Certificate.findById(req.params.id)
      .populate("user", "name email")
      .populate("course", "title");

    console.log("Certificate found:", certificate);

    if (!certificate) return res.status(404).json({ error: "Certificate not found" });

    res.json(certificate);
  } catch (err) {
    console.error("Error fetching certificate:", err);
    res.status(500).json({ error: "Server error while fetching certificate" });
  }
});

export default router;
