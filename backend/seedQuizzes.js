import mongoose from "mongoose";
import Quiz from "./models/Quiz.js"; 


mongoose.connect("mongodb://127.0.0.1:27017/lmsDB");

const quizzes = [
  {
    course: "6a3a27bfb0d572716e4989ac", 
    title: "HTML Basics Quiz",
    questions: [
      {
        question: "What does HTML stand for?",
        options: ["HyperText Markup Language", "HighText Machine Language", "Hyperlinks and Text Markup Language"],
        correctAnswer: 0,
      },
      {
        question: "Which tag is used to create a hyperlink?",
        options: ["<a>", "<link>", "<href>"],
        correctAnswer: 0,
      },
      {
        question: "Which tag defines the largest heading?",
        options: ["<h6>", "<h1>", "<head>"],
        correctAnswer: 1,
      },
      {
        question: "Which tag is used to insert an image?",
        options: ["<img>", "<src>", "<picture>"],
        correctAnswer: 0,
      },
    ],
  },
  {
    course: "6a3a2829b0d572716e4989ad", 
    title: "JavaScript Basics Quiz",
    questions: [
      {
        question: "Which keyword declares a variable?",
        options: ["var", "let", "const"],
        correctAnswer: 0,
      },
      {
        question: "Which event occurs when a user clicks an element?",
        options: ["onmouseover", "onclick", "onchange"],
        correctAnswer: 1,
      },
      {
        question: "Which symbol is used for strict equality?",
        options: ["==", "===", "="],
        correctAnswer: 1,
      },
      {
        question: "Which function is used to print to console?",
        options: ["print()", "console.log()", "log.print()"],
        correctAnswer: 1,
      },
    ],
  },
  {
    course: "6a3a2868b0d572716e4989ae", 
    title: "CSS Basics Quiz",
    questions: [
      {
        question: "Which property sets the background color?",
        options: ["color", "background-color", "bgcolor"],
        correctAnswer: 1,
      },
      {
        question: "Which selector targets an element by ID?",
        options: [".classname", "#idname", "element"],
        correctAnswer: 1,
      },
      {
        question: "Which property controls text size?",
        options: ["font-size", "text-size", "size"],
        correctAnswer: 0,
      },
      {
        question: "Which property makes text bold?",
        options: ["font-weight", "bold", "text-bold"],
        correctAnswer: 0,
      },
    ],
  },
  {
    course: "6a3a28aab0d572716e4989af", 
    title: "Python Basics Quiz",
    questions: [
      {
        question: "Which keyword defines a function in Python?",
        options: ["func", "def", "function"],
        correctAnswer: 1,
      },
      {
        question: "Python is case-sensitive?",
        options: ["Yes", "No", "Sometimes"],
        correctAnswer: 0,
      },
      {
        question: "Which operator is used for exponentiation?",
        options: ["^", "**", "exp()"],
        correctAnswer: 1,
      },
      {
        question: "Which data type is immutable?",
        options: ["List", "Tuple", "Dictionary"],
        correctAnswer: 1,
      },
    ],
  },
  {
    course: "6a3a28e2b0d572716e4989b0", 
    title: "Java Basics Quiz",
    questions: [
      {
        question: "Which method prints output in Java?",
        options: ["System.out.print()", "console.log()", "print()"],
        correctAnswer: 0,
      },
      {
        question: "Which keyword is used for inheritance?",
        options: ["extends", "inherits", "super"],
        correctAnswer: 0,
      },
      {
        question: "Which keyword defines a class?",
        options: ["class", "define", "object"],
        correctAnswer: 0,
      },
      {
        question: "Which keyword prevents inheritance?",
        options: ["final", "static", "private"],
        correctAnswer: 0,
      },
    ],
  },
  {
    course: "6a3a293bb0d572716e4989b1", 
    title: "MERN Stack Quiz",
    questions: [
      {
        question: "Which database is used in MERN?",
        options: ["MySQL", "MongoDB", "PostgreSQL"],
        correctAnswer: 1,
      },
      {
        question: "Which library is used for UI in MERN?",
        options: ["Angular", "React", "Vue"],
        correctAnswer: 1,
      },
      {
        question: "Which runtime is used for server-side JS?",
        options: ["Node.js", "Express.js", "React.js"],
        correctAnswer: 0,
      },
      {
        question: "Which framework handles routing in MERN?",
        options: ["Express.js", "React Router", "Both"],
        correctAnswer: 2,
      },
    ],
  },
  {
    course: "6a3a2982b0d572716e4989b2", 
    title: "SQL Basics Quiz",
    questions: [
      {
        question: "Which SQL statement is used to extract data?",
        options: ["GET", "SELECT", "EXTRACT"],
        correctAnswer: 1,
      },
      {
        question: "Which clause filters rows?",
        options: ["WHERE", "HAVING", "GROUP BY"],
        correctAnswer: 0,
      },
      {
        question: "Which keyword sorts results?",
        options: ["SORT", "ORDER BY", "GROUP BY"],
        correctAnswer: 1,
      },
      {
        question: "Which SQL command deletes records?",
        options: ["REMOVE", "DELETE", "DROP"],
        correctAnswer: 1,
      },
    ],
  },
  {
    course: "6a3a29c9b0d572716e4989b3", 
    title: "AI Fundamentals Quiz",
    questions: [
      {
        question: "What does AI stand for?",
        options: ["Artificial Intelligence", "Automated Interface", "Advanced Integration"],
        correctAnswer: 0,
      },
      {
        question: "Which company developed GPT models?",
        options: ["Google", "OpenAI", "Microsoft"],
        correctAnswer: 1,
      },
      {
        question: "Which branch of AI deals with vision?",
        options: ["NLP", "Computer Vision", "Robotics"],
        correctAnswer: 1,
      },
      {
        question: "Which algorithm is used for training neural networks?",
        options: ["Backpropagation", "Sorting", "Searching"],
        correctAnswer: 0,
      },
    ],
  },
];

async function seed() {
  try {
    await Quiz.deleteMany({});
    await Quiz.insertMany(quizzes);
    console.log("✅ Quizzes seeded successfully!");
    mongoose.connection.close();
  } catch (err) {
    console.error("Error seeding quizzes:", err);
  }
}

seed();
