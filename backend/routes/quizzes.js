import express from "express";
import Quiz from "../models/Quiz.js";
import Certificate from "../models/Certificate.js";

const router = express.Router();

router.post("/add", async (req, res) => {
  try {
    const { courseId, title, questions } = req.body;

    const normalizedQuestions = questions.map((q) => ({
      question: String(q.question),
      options: q.options.map((opt) => String(opt)),
      correctAnswer: Number(q.correctAnswer),
    }));

    const quiz = new Quiz({ course: courseId, title, questions: normalizedQuestions });
    await quiz.save();
    res.json({ message: "Quiz created successfully", quiz });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/submit/:courseId/:userId", async (req, res) => {
  try {
    const { answers } = req.body;
    const { courseId, userId } = req.params;

    const quiz = await Quiz.findOne({ course: courseId });
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    const existingCert = await Certificate.findOne({ user: userId, course: courseId });
    if (existingCert) {
      return res.json({
        message: "Quiz already attempted",
        certificateId: existingCert._id,
        score: existingCert.score
      });
    }

    let correct = 0;
    quiz.questions.forEach((q, i) => {
      if (Number(answers[i]) === q.correctAnswer) correct++;
    });

    const percentage = quiz.questions.length > 0
      ? Math.round((correct / quiz.questions.length) * 100)
      : 0;

    const certificate = new Certificate({
      user: userId,
      course: courseId,
      score: percentage,
      issuedAt: new Date()
    });

    console.log("Saving certificate:", certificate);
    await certificate.save();
    console.log("Certificate saved with ID:", certificate._id);

    res.json({
      message: "Quiz submitted",
      score: percentage,
      certificateId: certificate._id
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate("course");
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });
    res.json({ message: "Quiz deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:courseId", async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ course: req.params.courseId });
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
