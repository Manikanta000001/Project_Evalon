const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const Student = require("../models/Student.model");
const Teacher = require("../models/Teacher.model");
const Admin = require("../models/Admin.model");


const generateToken = (user, role) => {
  return jwt.sign(
    { id: user._id, role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};


// POST /api/auth/signup
 const signup = async (req, res) => {
  try {
    const { role } = req.body;

    if (!role || !["student", "teacher"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // ---------------- STUDENT SIGNUP ----------------
    if (role === "student") {
      const {
        name,
        email,
        password,
        rollNumber,
        admissionBatch,
        currentBatch,
        collegeId,
        department,
        section
      } = req.body;

      if (
        !name ||
        !email ||
        !password ||
        !rollNumber ||
        !admissionBatch ||
        !currentBatch ||
        !collegeId ||
        !department ||
        !section
      ) {
        return res.status(400).json({ message: "All student fields are required" });
      }

      const exists = await Student.findOne({
        $or: [{ email }, { rollNumber }]
      });

      if (exists) {
        return res.status(400).json({ message: "Student already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const student = await Student.create({
        name,
        email,
        password: hashedPassword,
        rollNumber,
        admissionBatch,
        currentBatch,
        collegeId,
        department,
        section
      });

      const token = generateToken(student, "student");

      return res.status(201).json({
        id: student._id,
        name: student.name,
        email: student.email,
        role: "student",
        token
      });
    }

    // ---------------- TEACHER SIGNUP ----------------
    if (role === "teacher") {
      const { name, email, password, collegeId, department } = req.body;

      if (!name || !email || !password || !collegeId || !department) {
        return res.status(400).json({ message: "All teacher fields are required" });
      }

      const exists = await Teacher.findOne({ email });
      if (exists) {
        return res.status(400).json({ message: "Teacher already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const teacher = await Teacher.create({
        name,
        email,
        password: hashedPassword,
        collegeId,
        department
      });

      const token = generateToken(teacher, "teacher");

      return res.status(201).json({
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        role: "teacher",
        token
      });
    }
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


// POST /api/auth/login
 const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    let user = null;
    let role = null;

    // 1️⃣ Check Admin
    user = await Admin.findOne({ email });
    if (user) role = "admin";

    // 2️⃣ Check Student
    if (!user) {
      user = await Student.findOne({ email });
      if (user) role = "student";
    }

    // 3️⃣ Check Teacher
    if (!user) {
      user = await Teacher.findOne({ email });
      if (user) role = "teacher";
    }

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Account disabled" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role,
        collegeId: user.collegeId
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role,
      token
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


// GET /api/auth/me
 const getMe = async (req, res) => {
  try {
    const { id, role } = req.user;

    let user;
    if (role === "student") {
      user = await Student.findById(id).select("-password");
    } else if (role === "teacher") {
      user = await Teacher.findById(id).select("-password");
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(user);
  } catch (err) {
    console.error("GetMe error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
module.exports = {
  signin,
  signup,getMe,
};
