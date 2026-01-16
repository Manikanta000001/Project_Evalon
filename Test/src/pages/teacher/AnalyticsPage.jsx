import React from "react";
import { BarChart3 } from "lucide-react";
import { useOutletContext } from "react-router-dom";

export default function AnalyticsPage() {
  // 🌙 Dark mode flag from DashboardLayout
  const { dark: isDarkMode } = useOutletContext() || {};

  return (
    <div
      className={`flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed ${
        isDarkMode
          ? "bg-slate-900/50 border-slate-800 text-slate-400"
          : "bg-white border-slate-200 text-slate-500"
      }`}
    >
      <BarChart3 size={64} className="mb-4 opacity-30" />

      <p className="text-xl font-bold tracking-tight">
        Analytics & Insights Coming Soon
      </p>

      <p className="text-sm font-medium mt-1">
        Detailed performance reports and trends will appear here.
      </p>
    </div>
  );
}
