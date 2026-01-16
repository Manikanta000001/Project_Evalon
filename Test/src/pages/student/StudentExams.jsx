import React from "react";
import { useOutletContext } from "react-router-dom";
import { Clock, CheckCircle, BookOpen, PlayCircle } from "lucide-react";

export default function StudentExams() {
  const { dark: isDarkMode } = useOutletContext() || {};

  const upcoming = [
    { id: 1, title: "Physics Unit Test", date: "Jan 24, 2026", time: "10:00 AM", duration: "45 mins" },
    { id: 2, title: "Math Algebra Quiz", date: "Jan 27, 2026", time: "09:00 AM", duration: "30 mins" },
  ];

  const active = [
    { id: 3, title: "Biology MCQ Test", endsIn: "28 mins left" },
  ];

  const completed = [
    { id: 4, title: "Chemistry Basics", score: "18/25", status: "Checked" },
    { id: 5, title: "English Grammar Test", score: "22/25", status: "Checked" },
  ];

  return (
    <div className="space-y-8">

      {/* ---------- Active Exam ---------- */}
      {active.length > 0 && (
        <div
          className={`p-6 rounded-2xl border ${
            isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
          }`}
        >
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <PlayCircle className="text-emerald-500" />
            Active Exam
          </h3>

          {active.map((exam) => (
            <div
              key={exam.id}
              className={`flex justify-between items-center p-4 rounded-xl ${
                isDarkMode ? "bg-slate-800" : "bg-slate-50"
              }`}
            >
              <div>
                <p className="font-semibold">{exam.title}</p>
                <p className="text-sm text-slate-500">{exam.endsIn}</p>
              </div>

              <button className="px-5 py-2 rounded-xl font-bold bg-emerald-600 text-white hover:bg-emerald-700">
                Continue Exam
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ---------- Upcoming Exams ---------- */}
      <div
        className={`p-6 rounded-2xl border ${
          isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
        }`}
      >
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Clock className="text-indigo-500" />
          Upcoming Exams
        </h3>

        {upcoming.map((exam) => (
          <div
            key={exam.id}
            className={`p-4 rounded-xl mb-3 flex justify-between items-center ${
              isDarkMode ? "bg-slate-800" : "bg-slate-50"
            }`}
          >
            <div>
              <p className="font-semibold">{exam.title}</p>
              <p className="text-sm text-slate-500">
                {exam.date} • {exam.time} • {exam.duration}
              </p>
            </div>

            <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-100 text-indigo-700">
              Scheduled
            </span>
          </div>
        ))}
      </div>

      {/* ---------- Completed Exams ---------- */}
      <div
        className={`p-6 rounded-2xl border ${
          isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
        }`}
      >
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <CheckCircle className="text-yellow-500" />
          Completed Exams
        </h3>

        {completed.map((exam) => (
          <div
            key={exam.id}
            className={`p-4 rounded-xl mb-3 flex justify-between items-center ${
              isDarkMode ? "bg-slate-800" : "bg-slate-50"
            }`}
          >
            <div>
              <p className="font-semibold">{exam.title}</p>
              <p className="text-sm text-slate-500">Score: {exam.score}</p>
            </div>

            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">
              {exam.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
