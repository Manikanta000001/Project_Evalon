const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const Paper = require("../models/Paper.js");

const seedPapers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    await Paper.deleteMany({});
    console.log("Cleared existing Paper records");

    const records = [];

    const questionsSet1 = {
      examType: "assignment",
      units: {
        "UNIT-I": [
          {
            qno: "6",
            text: "Construct the code to assign text to a TextView control through the Ja…",
            images: [],
            equations: [],
            tables: []
          },
          {
            qno: "3.",
            text: "Explain how the SDK manager could be used to download and install the …",
            images: [],
            equations: [],
            tables: []
          },
          {
            qno: "12",
            text: "Write short notes on a) View b) ViewGroup c) Activity d)Intent",
            images: [],
            equations: [],
            tables: []
          },
          {
            qno: "9",
            text: "What is virtual device and SDK manager explain?",
            images: [],
            equations: [],
            tables: []
          }
        ]
      }
    };

    const questionsSet2 = {
      examType: "assignment",
      units: {
        "UNIT-I": [
          {
            qno: "6",
            text: "Construct the code to assign text to a TextView control through the Ja…",
            images: [],
            equations: [],
            tables: []
          },
          {
            qno: "4.",
            text: "What is Dalvik Virtual machine? What is its function? b) In what file …",
            images: [],
            equations: [],
            tables: []
          },
          {
            qno: "9",
            text: "What is virtual device and SDK manager explain?",
            images: [],
            equations: [],
            tables: []
          },
          {
            qno: "11",
            text: "List the limitations of an Android Emulator. List the three perspectiv…",
            images: [],
            equations: [],
            tables: []
          }
        ]
      }
    };

    const regulations = ["R21", "R22", "R23"];
    const examTypes = ["assignment"];
    const degrees = ["B.Tech", "M.Tech", "MBA"];
    const departments = ["CSE", "ECE", "MECH", "IT", "EEE"];
    const years = ["I", "II", "III", "IV"];
    const semesters = ["I", "II"];
    const courses = ["Operating Systems", "Cloud Computing", "Android Development", "Computer Networks", "Data Structures"];
    const sessions = ["Forenoon", "Afternoon"];

    const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const pad = (n) => n.toString().padStart(2, '0');
    
    for (let i = 0; i < 50; i++) {
        // Generate random date between now and next month
        const dateObj = new Date();
        dateObj.setDate(dateObj.getDate() + Math.floor(Math.random() * 30));
        const dateStr = `${dateObj.getFullYear()}-${pad(dateObj.getMonth() + 1)}-${pad(dateObj.getDate())}`;

        const isMorning = Math.random() > 0.5;
        const startTime = isMorning ? "10:00" : "14:00";
        const endTime = isMorning ? "12:00" : "16:00";
        const session = isMorning ? "Forenoon" : "Afternoon";

        records.push({
            meta: {
              regulation: getRandomElement(regulations),
              examType: getRandomElement(examTypes),
              degree: getRandomElement(degrees),
              department: getRandomElement(departments),
              year: getRandomElement(years),
              semester: getRandomElement(semesters),
              commonTo: Math.random() > 0.7 ? [getRandomElement(departments), getRandomElement(departments)] : [],
              courseName: getRandomElement(courses),
              date: dateStr,
              startTime: startTime,
              endTime: endTime,
              session: session,
            },
            questions: i < 25 ? questionsSet1 : questionsSet2,
            status: "draft"
        });
    }

    try {
      const result = await Paper.insertMany(records);
      console.log(`Successfully added ${result.length} paper records.`);
    } catch (err) {
      console.error("Error inserting paper records", err);
    }

    process.exit(0);
  } catch (error) {
    console.error("Error connecting to database:", error);
    process.exit(1);
  }
};

seedPapers();
