import React from "react";
import { Users } from "lucide-react";
import { useOutletContext } from "react-router-dom";

export default function StudentsPage() {
  // 🌙 Dark mode value from DashboardLayout
  const { dark: isDarkMode } = useOutletContext() || {};

  return (
    <div
      className={`flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed ${
        isDarkMode
          ? "bg-slate-900/50 border-slate-800 text-slate-400"
          : "bg-white border-slate-200 text-slate-500"
      }`}
    >
      <Users size={64} className="mb-4 opacity-30" />

      <p className="text-xl font-bold tracking-tight">
        Classroom Management Coming Soon
      </p>

      <p className="text-sm font-medium mt-1">
        You’ll be able to add students, assign exams, view reports, and more.
      </p>
    </div>
  );
}
