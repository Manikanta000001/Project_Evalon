const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const ExamRoute = require("./routes/Exam.route");
const Attemptroute = require("./routes/StudentExam.attempt.route");
const Resultroute = require("./routes/Results.route");
const Teachertroute = require("./routes/TeacherExam.route");
const questionBankRoutes = require("./routes/questionBank.routes");
const PaperRoute = require("./routes/Paper.route");
const DashboardRoute = require("./routes/Dashboard.route");


dotenv.config();
connectDB();

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// health route
app.get("/", (req, res) => {
  res.send("Evalon Auth API running...");
});

// auth routes
app.use("/api/auth", authRoutes);
app.use("/api/attempt", Attemptroute);
app.use("/api/results", Resultroute);
app.use("/api/teacher", Teachertroute);
app.use("/api/question-banks", questionBankRoutes);
app.use("/api/papers", PaperRoute);
app.use("/api/dashboard", DashboardRoute);
app.use("/api", ExamRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
