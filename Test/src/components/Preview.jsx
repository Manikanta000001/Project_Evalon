import { useState } from "react";
import PreviewPane from "./Pannels/PreviewPane";
import CapturePane from "./Pannels/CapturePane";
import ExamPaper from "./Pannels/ExamPaper";

// utils/transformBackendExam.js
function transformBackendExam(backendData) {
  if (!backendData?.units) return [];

  const questions = [];
  let qId = 1;

  Object.values(backendData.units).forEach((unitQs) => {
    for (let i = 0; i < unitQs.length; i += 2) {
      if (!unitQs[i] || !unitQs[i + 1]) continue;

      questions.push({
        id: qId++,
        options: [
          { sub: "A", text: unitQs[i].text, co: "2", bl: "3", marks: "10" },
          { sub: "B", text: unitQs[i + 1].text, co: "1", bl: "3", marks: "10" },
        ],
      });
    }
  });

  return questions;
}

const Preview = ({ backendData: data, meta, ref }) => {
  const [scale, setScale] = useState(0.8);
  console.log("The meta data", meta);

  if (!data || !data.units) {
    return (
      <div className="h-screen  text-gray-500">
        Upload a document to preview the exam paper
      </div>
    );
  }

  const DEPARTMENT_MAP = {
  CSE: "Computer Science Engineering",
  ECE: "Electronics and Communication Engineering",
  EEE: "Electrical and Electronics Engineering",
  IT: "Information Technology",
  MECH: "Mechanical Engineering",
  CIVIL: "Civil Engineering",
};

  const getMaxMarks = (examType) => {
    if (!examType) return 30;

    const type = examType.toLowerCase();

    if (type.includes("assignment")) return 10;
    if (type.includes("mid")) return 30;

    return 30; // default
  };
  // const paperData = {
  //   collegeName: "NARAYANA ENGINEERING COLLEGE",
  //   subtitle: "(AUTONOMOUS)",
  //   location: "NELLORE",

  //   examTitle: "III B.Tech I Semester",
  //   examType: data.examType?.toUpperCase() ?? "EXAM",

  //   branch: "COMPUTER SCIENCE AND ENGINEERING - DATA SCIENCE",
  //   commonTo: meta.commonTo ?? [],
  //   courseName: "Operating Systems",
  //   regulation: "NECR BTECH 29",

  //   dateSession: "02-09-2025 (FN)",
  //   time: "11.20 AM to 12.50 PM",
  //   maxMarks: 30,

  //   instructions: [
  //     "Answer ALL questions.",
  //     "Answer any ONE full question wherever OR option is available.",
  //     "Figures indicate CO, BL & Marks.",
  //   ],

  //   // 🔥 THIS IS THE IMPORTANT LINE
  //   questions: transformBackendExam(data),
  // };

  const paperData = {
    collegeName: "NARAYANA ENGINEERING COLLEGE",
    subtitle: "(AUTONOMOUS)",
    location: "NELLORE",

    examTitle: `${meta.degree} ${meta.year} ${meta.semester} Semester`,
    examType: meta.examType?.toUpperCase() ?? "EXAM",

   branch: DEPARTMENT_MAP[meta.department] || meta.department,
    commonTo: meta.commonTo ?? [],
    courseName: meta.courseName,
    courseId: meta.courseId,
    regulation: meta.regulation,

    dateSession: `${meta.date} (${meta.session})`,
    time: `${meta.startTime} to ${meta.endTime}`,

    // 🔥 dynamic now
    maxMarks: getMaxMarks(meta.examType),

    instructions: [
      "Answer ALL questions.",
      "Answer any ONE full question wherever OR option is available.",
      "Figures indicate CO, BL & Marks.",
    ],

    questions: transformBackendExam(data),
  };

  return (
    <div className=" flex justify-center ">
      {/* RIGHT: PREVIEW */}

      {/* <PreviewPane data={paperData} scale={scale} /> */}
      <ExamPaper data={paperData} />
      <CapturePane data={paperData} ref={ref} />

      {/* HIDDEN CAPTURE */}
    </div>
  );
};

export default Preview;
