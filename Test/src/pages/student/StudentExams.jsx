import React from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Clock, CheckCircle, BookOpen, PlayCircle } from "lucide-react";

export default function StudentExams() {
  const { dark: isDarkMode } = useOutletContext() || {};
  const [exams, setExams] = useState([]);
  const navigate = useNavigate();
  // checking avaliable exams
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/exams/available", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setExams(data);
      } catch (err) {
        console.error("Failed to fetch exams", err);
      }
    };

    fetchExams();
  }, []);
  console.log(exams);

  const now = new Date();

  const active = exams.filter(
    (e) => new Date(e.startAt) <= now && new Date(e.endAt) >= now,
  );

  const upcoming = exams.filter((e) => new Date(e.startAt) > now);

  const completed = exams.filter((e) => new Date(e.endAt) < now);

  return (
    <div className="space-y-8">
      {/* ---------- Active Exam ---------- */}
      {active.length > 0 && (
        <div
          className={`p-6 rounded-2xl border ${
            isDarkMode
              ? "bg-slate-900 border-slate-800"
              : "bg-white border-slate-200"
          }`}
        >
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <PlayCircle className="text-emerald-500" />
            Active Exam
          </h3>

          {active.map((exam) => (
            <div
              key={exam.examId}
              className={`flex justify-between items-center p-4 rounded-xl ${
                isDarkMode ? "bg-slate-800" : "bg-slate-50"
              }`}
            >
              <div>
                <p className="font-semibold">{exam.title}</p>
                <p className="text-sm text-slate-500">
                  Ends at {new Date(exam.endAt).toLocaleTimeString()}
                </p>
              </div>

              {exam.attemptStatus === "submitted" ? (
                // 🟡 COMPLETED
                <span className="px-5 py-2 rounded-xl font-bold bg-slate-300 text-slate-600 cursor-not-allowed">
                  Completed
                </span>
              ) : exam.attemptStatus === "in_progress" ? (
                // 🟢 IN PROGRESS
                <button
                  onClick={() =>
                    navigate(`/exam/${exam.examId}/instructions`, {
                      state: { examMeta: exam },
                    })
                  }
                  className="px-5 py-2 rounded-xl font-bold bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  Continue Exam
                </button>
              ) : (
                // 🔵 NOT STARTED (no attempt)
                <button
                  onClick={() =>
                    navigate(`/exam/${exam.examId}/instructions`, {
                      state: { examMeta: exam },
                    })
                  }
                  className="px-5 py-2 rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Take Test
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ---------- Upcoming Exams ---------- */}
      <div
        className={`p-6 rounded-2xl border ${
          isDarkMode
            ? "bg-slate-900 border-slate-800"
            : "bg-white border-slate-200"
        }`}
      >
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Clock className="text-indigo-500" />
          Upcoming Exams
        </h3>

        {upcoming.length === 0 ? (
          <EmptyState
            message="No upcoming exams scheduled"
            isDark={isDarkMode}
          />
        ) : (
          upcoming.map((exam) => (
            <div
              key={exam.examId}
              className={`p-4 rounded-xl mb-3 flex justify-between items-center ${
                isDarkMode ? "bg-slate-800" : "bg-slate-50"
              }`}
            >
              <div>
                <p className="font-semibold">{exam.title}</p>
                <p className="text-sm text-slate-500">
                  {new Date(exam.startAt).toLocaleString()} •{" "}
                  {exam.durationMinutes} mins
                </p>
              </div>

              <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-100 text-indigo-700">
                Scheduled
              </span>
            </div>
          ))
        )}
      </div>

      {/* ---------- Completed Exams ---------- */}
      <div
        className={`p-6 rounded-2xl border ${
          isDarkMode
            ? "bg-slate-900 border-slate-800"
            : "bg-white border-slate-200"
        }`}
      >
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <CheckCircle className="text-yellow-500" />
          Completed Exams
        </h3>

        {completed.length === 0 ? (
          <EmptyState message="No completed exams yet" isDark={isDarkMode} />
        ) : (
          completed.map((exam) => (
            <div
              key={exam.examId}
              className={`p-4 rounded-xl mb-3 flex justify-between items-center ${
                isDarkMode ? "bg-slate-800" : "bg-slate-50"
              }`}
            >
              <div>
                <p className="font-semibold">{exam.title}</p>
                <p className="text-sm text-slate-500">Score: {exam.score?? 0}</p>
              </div>

              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">
                Exam Expired
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
function EmptyState({ message, isDark }) {
  return (
    <div
      className={`p-6 rounded-xl text-center text-sm font-medium ${
        isDark ? "bg-slate-800 text-slate-400" : "bg-slate-50 text-slate-500"
      }`}
    >
      {message}
    </div>
  );
}
