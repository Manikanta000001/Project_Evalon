// =======================
// COLLEGES
// =======================
 const colleges = [
  {
    collegeCode: "711",
    name: "ABC Engineering College",
    location: "Tamil Nadu"
  },
  {
    collegeCode: "722",
    name: "XYZ Institute of Technology",
    location: "Karnataka"
  }
];

// =======================
// ADMINS
// =======================
 const admins = [
  {
    name: "ABC Admin",
    email: "admin@abc.edu",
    password: "admin123"
  }
];

// =======================
// TEACHERS
// =======================
 const teachers = [
  {
    name: "Dr. Ramesh Kumar",
    email: "ramesh.cse@abc.edu",
    password: "teacher123",
    department: "CSE"
  },
  {
    name: "Ms. Anitha Rao",
    email: "anitha.cse@abc.edu",
    password: "teacher123",
    department: "CSE"
  },
  {
    name: "Mr. Suresh Patel",
    email: "suresh.ece@abc.edu",
    password: "teacher123",
    department: "ECE"
  },
  {
    name: "Dr. Meena Iyer",
    email: "meena.it@abc.edu",
    password: "teacher123",
    department: "IT"
  }
];


 const students = [
  // ---------- CSE | Batch 22 (some detained) ----------
  {
    name: "Arjun S",
    email: "arjun22@abc.edu",
    password: "student123",
    rollNumber: "22711",
    admissionBatch: "22",
    currentBatch: "23", // detained
    department: "CSE",
    section: "B"
  },
  {
    name: "Kavin R",
    email: "kavin22@abc.edu",
    password: "student123",
    rollNumber: "22712",
    admissionBatch: "22",
    currentBatch: "22",
    department: "CSE",
    section: "B"
  },
  {
    name: "Divya P",
    email: "divya22@abc.edu",
    password: "student123",
    rollNumber: "22713",
    admissionBatch: "22",
    currentBatch: "22",
    department: "CSE",
    section: "A"
  },

  // ---------- CSE | Batch 23 ----------
  {
    name: "Karthik M",
    email: "karthik23@abc.edu",
    password: "student123",
    rollNumber: "23711",
    admissionBatch: "23",
    currentBatch: "23",
    department: "CSE",
    section: "B"
  },
  {
    name: "Sneha R",
    email: "sneha23@abc.edu",
    password: "student123",
    rollNumber: "23712",
    admissionBatch: "23",
    currentBatch: "23",
    department: "CSE",
    section: "A"
  },
  {
    name: "Vishal K",
    email: "vishal23@abc.edu",
    password: "student123",
    rollNumber: "23713",
    admissionBatch: "23",
    currentBatch: "23",
    department: "CSE",
    section: "B"
  },

  // ---------- ECE | Batch 23 ----------
  {
    name: "Priya N",
    email: "priya23@abc.edu",
    password: "student123",
    rollNumber: "23721",
    admissionBatch: "23",
    currentBatch: "23",
    department: "ECE",
    section: "A"
  },
  {
    name: "Rahul V",
    email: "rahul23@abc.edu",
    password: "student123",
    rollNumber: "23722",
    admissionBatch: "23",
    currentBatch: "23",
    department: "ECE",
    section: "B"
  },

  // ---------- IT | Batch 24 ----------
  {
    name: "Ananya S",
    email: "ananya24@abc.edu",
    password: "student123",
    rollNumber: "24731",
    admissionBatch: "24",
    currentBatch: "24",
    department: "IT",
    section: "A"
  },
  {
    name: "Rohit D",
    email: "rohit24@abc.edu",
    password: "student123",
    rollNumber: "24732",
    admissionBatch: "24",
    currentBatch: "24",
    department: "IT",
    section: "B"
  }
];

module.exports = {
  colleges,
  admins,
  teachers,
  students
};