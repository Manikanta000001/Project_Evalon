// import React from "react";
// import {
//   Document,
//   Page,
//   Text,
//   View,
//   StyleSheet,
//   Image,
//   PDFViewer,
// } from "@react-pdf/renderer";

// import Banner from "./necnbanner.png";

// const styles = StyleSheet.create({
//   page: {
//     padding: 10,
//     fontSize: 10,
//     fontFamily: "Times-Roman",
//   },

//   row: { flexDirection: "row" },

//   cell: {
//     borderWidth: 1,
//     borderColor: "#000",
//     padding: 5,
//   },

//   center: { textAlign: "center" },
//   bold: { fontWeight: "bold" },

//   table: { width: "100%", borderWidth: 1 },

//   qno: { width: "8%" },
//   subq: { width: "8%" },
//   question: { width: "56%" },
//   co: { width: "10%" },
//   bl: { width: "9%" },
//   marks: { width: "9%" },

//   headerBox: {
//     borderWidth: 1,
//     borderColor: "#000",
//     padding: 6,
//     marginBottom: 6,
//   },

//   bannerBox: {
//     height: 60,
//     borderWidth: 1,
//     borderColor: "#000",
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 6,
//   },

//   size: { width: "100%", height: "100%" },
// });

// const ExamPaperPDF = ({ data }) => {
//   if (!data || !data.units) return null;

//   // flatten questions across units
//   const questions = Object.values(data.units).flat();

//   return (
//     <PDFViewer width="100%" height="700px">
//       <Document>
//         <Page size="A4" style={styles.page}>
//           <View style={styles.size}>
//             {/* ===== BANNER ===== */}
//             <View style={styles.bannerBox}>
//               <Image src={Banner} />
//             </View>

//             {/* ===== HEADER ===== */}
//             <View style={styles.headerBox}>
//               <Text style={[styles.bold, styles.center]}>
//                 {data.examType.toUpperCase()} – PREVIEW
//               </Text>
//               <Text style={styles.center}>
//                 IV B.Tech I Semester (Computer Science and Engineering)
//               </Text>
//             </View>

//             {/* ===== COURSE INFO ===== */}
//             <View style={styles.headerBox}>
//               <View style={styles.row}>
//                 <Text style={[styles.cell, { width: "50%" }]}>
//                   Course: __________
//                 </Text>
//                 <Text style={[styles.cell, { width: "50%" }]}>
//                   Date & Session: __________
//                 </Text>
//               </View>
//               <View style={styles.row}>
//                 <Text style={[styles.cell, { width: "50%" }]}>
//                   Time: __________
//                 </Text>
//                 <Text style={[styles.cell, { width: "50%" }]}>
//                   Max. Marks: __________
//                 </Text>
//               </View>
//             </View>

//             {/* ===== INSTRUCTIONS ===== */}
//             <View style={styles.headerBox}>
//               <Text>
//                 <Text style={styles.bold}>Instructions: </Text>
//                 Answer ALL questions. Answer any ONE full question where OR option
//                 is available.
//               </Text>
//             </View>

//             {/* ===== QUESTION TABLE ===== */}
//             <View style={styles.table}>
//               {/* Table Header */}
//               <View style={styles.row}>
//                 {["Q.No", "Sub Q", "Question", "CO", "BL", "Marks"].map(
//                   (h, i) => (
//                     <Text
//                       key={i}
//                       style={[
//                         styles.cell,
//                         styles.bold,
//                         styles.center,
//                         [styles.qno, styles.subq, styles.question, styles.co, styles.bl, styles.marks][i],
//                       ]}
//                     >
//                       {h}
//                     </Text>
//                   )
//                 )}
//               </View>

//               {/* Questions */}
//               {questions.map((q, i) => (
//                 <View style={styles.row} key={i}>
//                   <Text style={[styles.cell, styles.qno, styles.center]}>
//                     {Math.floor(i / 2) + 1}
//                   </Text>
//                   <Text style={[styles.cell, styles.subq, styles.center]}>
//                     {i % 2 === 0 ? "(A)" : "(B)"}
//                   </Text>
//                   <Text style={[styles.cell, styles.question]}>
//                     {q.text.replace(/<[^>]+>/g, "")}
//                   </Text>
//                   <Text style={[styles.cell, styles.co, styles.center]}>—</Text>
//                   <Text style={[styles.cell, styles.bl, styles.center]}>—</Text>
//                   <Text style={[styles.cell, styles.marks, styles.center]}>
//                     —
//                   </Text>
//                 </View>
//               ))}
//             </View>
//           </View>
//         </Page>
//       </Document>
//     </PDFViewer>
//   );
// };

// export default ExamPaperPDF;









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




const Preview = ({backendData:data,meta,ref}) => {
  const [scale, setScale] = useState(0.8);


    if (!data || !data.units) {
  return (
    <div className="h-screen  text-gray-500">
      Upload a document to preview the exam paper
    </div>
  );
}
  const paperData = {
    collegeName: "NARAYANA ENGINEERING COLLEGE",
    subtitle: "(AUTONOMOUS)",
    location: "NELLORE",

    examTitle: "III B.Tech I Semester",
    examType: data.examType?.toUpperCase() ?? "EXAM",

    branch: "COMPUTER SCIENCE AND ENGINEERING - DATA SCIENCE",
    courseName: "Operating Systems",
    regulation: "NECR BTECH 29",

    dateSession: "02-09-2025 (FN)",
    time: "11.20 AM to 12.50 PM",
    maxMarks: 30,

    instructions: [
      "Answer ALL questions.",
      "Answer any ONE full question wherever OR option is available.",
      "Figures indicate CO, BL & Marks."
    ],

    // 🔥 THIS IS THE IMPORTANT LINE
    questions: transformBackendExam(data),
  };


  
  return (
    <div className=" flex justify-center ">
      


      {/* RIGHT: PREVIEW */}

        {/* <PreviewPane data={paperData} scale={scale} /> */}
        <ExamPaper data={paperData}  />
      <CapturePane data={paperData} ref={ref}/>
     

      {/* HIDDEN CAPTURE */}
    </div>
  );
};


export default Preview;
