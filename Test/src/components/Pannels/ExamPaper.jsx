// ExamPaper.jsx
import React from "react";
import Banner from "../necnbanner.png";
const ExamPaper = ({ data : paperData}) => {
  return (
    <div className="bg-white text-black font-serif">
      {/* PASTE ONLY THE PAPER CONTENT */}
      {/* header, table, footer */}
            <div id="printable-paper" className=" mx-auto bg-white shadow-2xl p-8 md:p-12 print:shadow-none print:p-0"   style={{
              
          width: "210mm",
          minHeight: "297mm",
        }}>
              
              {/* Improved Header Area */}
              <div className="border-[1.5px] border-black p-0 overflow-hidden">
                {/* Top Row: Hall Ticket & Regulation */}
                <div className="flex border-b border-black text-[10px] font-bold">
                  <div className="w-32 border-r border-black p-1 text-center bg-gray-50 print:bg-white">
                    Hall Ticket No:
                    <div className="h-6"></div>
                  </div>
                  <div className="flex-1 flex flex-col justify-center items-center text-center px-4 py-2">
                    {/* <h1 className="text-xl font-black tracking-tight leading-none uppercase">{paperData.collegeName}</h1>
                    <p className="text-[11px] font-bold mt-1">{paperData.subtitle}</p>
                    <p className="text-[10px] font-bold mt-0.5 uppercase tracking-wider">{paperData.location}</p> */}
                    <img src={Banner} alt="" />
                  </div>
                  <div className="w-32 border-l border-black p-1 text-center bg-gray-50 print:bg-white">
                    Regulation:
                    <div className="text-sm font-black mt-1 uppercase">{paperData.regulation}</div>
                  </div>
                </div>
      
                {/* Secondary Header: Exam Title & Branch */}
                <div className="border-b border-black text-center py-3 bg-gray-50 print:bg-white relative">
                  <h2 className="text-sm font-bold uppercase">{paperData.examTitle}</h2>
                  <h3 className="text-[13px] font-bold mt-1 underline decoration-black underline-offset-4">{paperData.examType}</h3>
                  <p className="text-[11px] font-black mt-2 tracking-wide text-gray-700">{paperData.branch}</p>
                </div>
      
                {/* Paper Details Row */}
                <div className="grid grid-cols-2 text-xs font-bold divide-x divide-black border-b border-black">
                  <div className="p-2 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-500 uppercase text-[9px]">Course:</span>
                      <span>{paperData.courseName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 uppercase text-[9px]">Date & Session:</span>
                      <span>{paperData.dateSession}</span>
                    </div>
                  </div>
                  <div className="p-2 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-500 uppercase text-[9px]">Max Marks:</span>
                      <span>{paperData.maxMarks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 uppercase text-[9px]">Time Duration:</span>
                      <span>{paperData.time}</span>
                    </div>
                  </div>
                </div>
      
                {/* New Integrated Instructions Row */}
                <div className="flex text-[10px] leading-snug bg-gray-50 print:bg-white">
                  <div className="w-32 border-r border-black font-bold p-2 flex items-center justify-center uppercase tracking-tighter text-center">
                    Instructions
                  </div>
                  <div className="flex-1 p-2">
                    <ul className="list-disc pl-4 italic">
                      {paperData.instructions.map((inst, idx) => (
                        <li key={idx}>{inst}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
      
              {/* Question Table */}
              <table className="w-full mt-6 border-collapse border border-black text-[13px]">
                <thead className="bg-gray-100 print:bg-transparent">
                  <tr className="border-b border-black">
                    <th className="border-r border-black w-10 py-1">Q.No</th>
                    <th className="border-r border-black w-10 py-1">Sub</th>
                    <th className="border-r border-black px-4 py-1 text-center uppercase tracking-widest text-[10px]">Question Description</th>
                    <th className="border-r border-black w-10 py-1 text-[10px]">CO</th>
                    <th className="border-r border-black w-10 py-1 text-[10px]">BL</th>
                    <th className="w-16 py-1 text-[10px]">Marks</th>
                  </tr>
                </thead>
                <tbody>
                  {paperData.questions.map((q) => (
                    <React.Fragment key={q.id}>
                      {/* Option A */}
                      <tr className="border-b border-black">
                        <td className="border-r border-black text-center font-bold align-middle" rowSpan={3}>{q.id}</td>
                        <td className="border-r border-black text-center font-bold p-2">(A)</td>
                        <td className="border-r border-black p-3 text-left leading-relaxed">
                          {q.options[0].text}
                        </td>
                        <td className="border-r border-black text-center font-medium">{q.options[0].co}</td>
                        <td className="border-r border-black text-center font-medium">{q.options[0].bl}</td>
                        <td className="text-center font-bold italic">{q.options[0].marks}</td>
                      </tr>
                      {/* Choice Divider */}
                      <tr className="border-b border-black">
                        <td className="border-r border-black py-1" colSpan={5}>
                          <div className="flex items-center justify-center font-black text-[10px] tracking-widest">
                            <div className="h-[0.5px] bg-black opacity-20 flex-1 mx-10"></div>
                            (OR)
                            <div className="h-[0.5px] bg-black opacity-20 flex-1 mx-10"></div>
                          </div>
                        </td>
                      </tr>
                      {/* Option B */}
                      <tr className="border-b border-black last:border-b-0">
                        <td className="border-r border-black text-center font-bold p-2">(B)</td>
                        <td className="border-r border-black p-3 text-left leading-relaxed">
                          {q.options[1].text}
                        </td>
                        <td className="border-r border-black text-center font-medium">{q.options[1].co}</td>
                        <td className="border-r border-black text-center font-medium">{q.options[1].bl}</td>
                        <td className="text-center font-bold italic">{q.options[1].marks}</td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
      
              {/* Footer */}
              <div className="mt-12 text-center text-xs font-black tracking-widest uppercase italic opacity-60">
                *** End of Examination Paper ***
              </div>
      


            </div>
    </div>
  );
};

export default ExamPaper;
