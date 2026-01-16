import React from "react";

const StatCard = ({ icon: Icon, label, value, trend, trendUp, isDarkMode }) => (
  <div
    className={`${
      isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
    } p-5 rounded-xl border shadow-sm flex items-center space-x-4`}
  >
    <div
      className={`p-3 rounded-lg ${
        isDarkMode ? "bg-brandBlue-500/10 text-brandBlue-400" : "bg-brandBlue-50 text-brandBlue-600"
      }`}
    >
      <Icon size={24} />
    </div>
    <div>
      <p className="text-sm text-slate-500">{label}</p>
      <div className="flex items-center space-x-2">
        <h4 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-slate-800"}`}>
          {value}
        </h4>
        <span
          className={`text-[10px] px-2 py-0.5 rounded ${
            trendUp ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {trend}
        </span>
      </div>
    </div>
  </div>
);

export default StatCard;
