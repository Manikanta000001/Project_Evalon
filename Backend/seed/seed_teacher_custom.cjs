const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const Teacher = require("../models/Teacher.model");
const Exam = require("../models/Exam.model");
const Attempt = require("../models/Attempt.model");
const Result = require("../models/Result.model");
const Student = require("../models/Student.model");

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const teacherId = new mongoose.Types.ObjectId("699b14c29af44c0c1ed313e7");

        // 1. Clear existing data for this teacher
        const existingExams = await Exam.find({ createdBy: teacherId });
        const examIds = existingExams.map(ex => ex._id);
        
        await Attempt.deleteMany({ examId: { $in: examIds } });
        await Result.deleteMany({ examId: { $in: examIds } });
        await Exam.deleteMany({ createdBy: teacherId });
        console.log("Cleaned up old records.");

        // We want 3 weeks the frontend will map correctly. 
        // We use February dates to ensure week 1, 2, 3 map to 2026-1, 2026-2, 2026-3 perfectly.
        const weekConfigs = [
            { weekName: "Week 1", date: new Date(Date.UTC(2026, 1, 5, 10, 0, 0)), numExams: 3, participation: 0.90 },  // Feb 5
            { weekName: "Week 2", date: new Date(Date.UTC(2026, 1, 12, 10, 0, 0)), numExams: 3, participation: 0.75 }, // Feb 12
            { weekName: "Week 3", date: new Date(Date.UTC(2026, 1, 19, 10, 0, 0)), numExams: 3, participation: 0.85 }, // Feb 19
        ];

        const examsData = [];
        let examCounter = 1;

        for (const config of weekConfigs) {
            for (let i = 0; i < config.numExams; i++) {
                const start = new Date(config.date.getTime() + i * 2 * 60 * 60 * 1000); 
                const end = new Date(start.getTime() + 45 * 60 * 1000);

                examsData.push({
                    _id: new mongoose.Types.ObjectId(),
                    title: `CSE Subject Test ${examCounter++} (${config.weekName})`,
                    durationMinutes: 45,
                    passPercentage: 40,
                    department: "CSE",
                    year: "23",
                    section: ["A", "B", "C"],
                    startAt: start,
                    endAt: end,
                    codingPerStudent: 1,
                    createdBy: teacherId,
                    isCancelled: false,
                    weekConfig: config
                });
            }
        }

        const insertedExams = await Exam.insertMany(examsData);
        console.log(`Created ${insertedExams.length} exams.`);

        const students = await Student.find({ department: "CSE", admissionBatch: "23" });
        
        const attemptsData = [];
        const resultsData = [];

        for (const exam of examsData) {
            for (const student of students) {
                // Determine if student attempts the exam
                if (Math.random() <= exam.weekConfig.participation) {
                    const attemptId = new mongoose.Types.ObjectId();
                    
                    // Grade Distribution algorithm
                    // ~50% A, 10% B, 10% C, 10% D, 20% F
                    const rand = Math.random();
                    let score;
                    if (rand < 0.50) {
                        score = Math.floor(Math.random() * 16) + 85; // A: 85-100
                    } else if (rand < 0.60) {
                        score = Math.floor(Math.random() * 15) + 70; // B: 70-84
                    } else if (rand < 0.70) {
                        score = Math.floor(Math.random() * 15) + 55; // C: 55-69
                    } else if (rand < 0.80) {
                        score = Math.floor(Math.random() * 15) + 40; // D: 40-54
                    } else {
                        score = Math.floor(Math.random() * 40);      // F: 0-39
                    }

                    const total = 100;
                    const percentage = score;
                    const passed = score >= 40;

                    attemptsData.push({
                        _id: attemptId,
                        examId: exam._id,
                        studentId: student._id,
                        status: "submitted",
                        startedAt: exam.startAt,
                        submittedAt: exam.endAt // Assuming submission at end of exam
                    });

                    resultsData.push({
                        attemptId: attemptId,
                        examId: exam._id,
                        studentId: student._id,
                        score: score,
                        total: total,
                        percentage: percentage,
                        passed: passed,
                        createdAt: exam.endAt // Critical: tie createdAt to the exam time to fix week grouping
                    });
                }
            }
        }

        if (attemptsData.length > 0) {
            await Attempt.insertMany(attemptsData);
        }

        if (resultsData.length > 0) {
            await Result.insertMany(resultsData);
            console.log(`Successfully seeded ${resultsData.length} result records targeting the 50/10/10/10/20 distribution.`);
        }

        process.exit(0);

    } catch (error) {
        console.error("Error seeding customized distribution:", error);
        process.exit(1);
    }
};

seedData();
