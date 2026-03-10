import React from "react";
import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  BookOpen,
  Clock,
  CheckCircle,
  BarChart3,
  FileText,
} from "lucide-react";

export default function StudentDashboard() {
  const { dark: isDarkMode } = useOutletContext() || {};
  const [dashboard, setDashboard] = useState(null);
useEffect(() => {
  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/dashboard/student", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDashboard(res.data);
    } catch (err) {
      console.error("Dashboard error", err);
    }
  };

  fetchDashboard();
}, []);

  const stats = [
    {
      label: "Upcoming Exams",
      value: dashboard?.stats?.upcoming || 0,
      icon: BookOpen,
      color: "text-indigo-500",
    },
    {
      label: "Completed Exams",
      value: dashboard?.stats?.completed || 0,
      icon: CheckCircle,
      color: "text-emerald-500",
    },
    {
      label: "Avg Score",
     value: `${dashboard?.stats?.avgScore ?? 0}%`,
      icon: BarChart3,
      color: "text-yellow-500",
    },
    {
      label: "Total Attempts",
      value: dashboard?.stats?.attempts || 0,
      icon: FileText,
      color: "text-purple-500",
    },
  ];
console.log(dashboard)
if (!dashboard) {
  return <div className="p-6 text-slate-500">Loading dashboard...</div>;
}

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
          isDarkMode
            ? "bg-slate-900 border-slate-800"
            : "bg-white border-slate-200"
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
            <p className="font-semibold">
              {dashboard?.nextExam?.title || "No upcoming exam"}
            </p>
            <p className="text-sm text-slate-500">
              {dashboard?.nextExam
                ? `${new Date(dashboard.nextExam.startAt).toLocaleString()} • ${dashboard.nextExam.duration} mins`
                : ""}
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
          isDarkMode
            ? "bg-slate-900 border-slate-800"
            : "bg-white border-slate-200"
        }`}
      >
        <h3 className="font-bold text-lg mb-4">Recent Activity</h3>

        <div className="space-y-3">
          {dashboard?.recentActivity?.map((item, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl flex justify-between items-center ${
                isDarkMode ? "bg-slate-800" : "bg-slate-50"
              }`}
            >
              <div>
                <p className="font-semibold">{item.title}</p>
                <p className="text-sm text-slate-500">{item.status} • {new Date(item.date).toLocaleDateString()}</p>
              </div>

              <span
                className={`text-sm font-bold ${
                  item.score === "-" ? "text-slate-400" : "text-emerald-500"
                }`}
              >
                {item.score ? `${item.score} / ${item.total}` : "-"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
