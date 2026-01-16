import React from "react";
import { useOutletContext } from "react-router-dom";
import {
  BookOpen,
  Clock,
  CheckCircle,
  BarChart3,
  FileText,
} from "lucide-react";

export default function StudentDashboard() {
  const { dark: isDarkMode } = useOutletContext() || {};

  const stats = [
    {
      label: "Upcoming Exams",
      value: 3,
      icon: BookOpen,
      color: "text-indigo-500",
    },
    {
      label: "Completed Exams",
      value: 12,
      icon: CheckCircle,
      color: "text-emerald-500",
    },
    {
      label: "Avg Score",
      value: "82%",
      icon: BarChart3,
      color: "text-yellow-500",
    },
    {
      label: "Total Attempts",
      value: 18,
      icon: FileText,
      color: "text-purple-500",
    },
  ];

  const recentActivity = [
    {
      title: "Physics Unit Test",
      status: "Completed",
      score: "18 / 25",
    },
    {
      title: "Biology MCQ Test",
      status: "Completed",
      score: "22 / 25",
    },
    {
      title: "Math Algebra Quiz",
      status: "Upcoming",
      score: "-",
    },
  ];

  return (
    <div className="space-y-8">

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-2xl border flex items-center gap-4 ${
              isDarkMode
                ? "bg-slate-900 border-slate-800"
                : "bg-white border-slate-200"
            }`}
          >
            <div
              className={`p-3 rounded-xl ${
                isDarkMode ? "bg-slate-800" : "bg-slate-100"
              }`}
            >
              <item.icon size={24} className={item.color} />
            </div>

            <div>
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className="text-2xl font-black">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ================= UPCOMING EXAM ================= */}
      <div
        className={`p-6 rounded-2xl border ${
          isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
        }`}
      >
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Clock className="text-indigo-500" />
          Next Exam
        </h3>

        <div
          className={`p-4 rounded-xl flex justify-between items-center ${
            isDarkMode ? "bg-slate-800" : "bg-slate-50"
          }`}
        >
          <div>
            <p className="font-semibold">Chemistry Chapter Test</p>
            <p className="text-sm text-slate-500">
              Jan 26, 2026 • 10:00 AM • 45 mins
            </p>
          </div>

          <span className="px-4 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700">
            Scheduled
          </span>
        </div>
      </div>

      {/* ================= RECENT ACTIVITY ================= */}
      <div
        className={`p-6 rounded-2xl border ${
          isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
        }`}
      >
        <h3 className="font-bold text-lg mb-4">Recent Activity</h3>

        <div className="space-y-3">
          {recentActivity.map((item, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl flex justify-between items-center ${
                isDarkMode ? "bg-slate-800" : "bg-slate-50"
              }`}
            >
              <div>
                <p className="font-semibold">{item.title}</p>
                <p className="text-sm text-slate-500">{item.status}</p>
              </div>

              <span
                className={`text-sm font-bold ${
                  item.score === "-" ? "text-slate-400" : "text-emerald-500"
                }`}
              >
                {item.score}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
