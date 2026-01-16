import React from "react";
import { Plus, Upload, ChevronRight } from "lucide-react";
import { useOutletContext } from "react-router-dom";

export default function AssessmentStudio() {
  // 🌙 Dark mode coming from DashboardLayout
  const { dark: isDarkMode } = useOutletContext() || {};

  return (
    <div
      className={`${
        isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
      } p-8 rounded-2xl border shadow-xl max-w-4xl mx-auto animate-in fade-in duration-500`}
    >
      {/* ---------- Header ---------- */}
      <div className="flex items-center space-x-4 mb-8">
        <div className="p-3 bg-brandBlue-600 text-white rounded-2xl shadow-lg shadow-brandBlue-500/20">
          <Plus size={24} />
        </div>
        <div>
          <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-slate-800"}`}>
            Assessment Studio
          </h2>
          <p className="text-slate-500">Step-by-step exam configuration</p>
        </div>
      </div>

      {/* ---------- Form Section ---------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

        {/* Exam Title */}
        <div>
          <label className="block text-xs font-black uppercase tracking-widest mb-2 text-slate-400">
            Title of Examination
          </label>

          <input
            type="text"
            placeholder="e.g. Thermodynamics Weekly Quiz"
            className={`w-full px-4 py-3 rounded-xl border outline-none ${
              isDarkMode
                ? "bg-slate-800 border-slate-700 text-white focus:border-brandBlue-500"
                : "bg-slate-50 border-slate-200 text-slate-800 focus:border-brandBlue-500"
            }`}
          />
        </div>

        {/* Time + Passing Grade */}
        <div className="grid grid-cols-2 gap-4">

          <div>
            <label className="block text-xs font-black uppercase tracking-widest mb-2 text-slate-400">
              Time Limit
            </label>

            <select
              className={`w-full px-4 py-3 rounded-xl border outline-none ${
                isDarkMode
                  ? "bg-slate-800 border-slate-700 text-white"
                  : "bg-slate-50 border-slate-200 text-slate-800"
              }`}
            >
              <option>45 Minutes</option>
              <option>60 Minutes</option>
              <option>90 Minutes</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-widest mb-2 text-slate-400">
              Passing Grade
            </label>

            <input
              type="text"
              placeholder="%"
              className={`w-full px-4 py-3 rounded-xl border outline-none ${
                isDarkMode
                  ? "bg-slate-800 border-slate-700 text-white"
                  : "bg-slate-50 border-slate-200 text-slate-800"
              }`}
            />
          </div>
        </div>
      </div>

      {/* ---------- Upload CSV Box ---------- */}
      <div className="space-y-6">
        <div
          className={`p-8 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center text-center space-y-2 group ${
            isDarkMode
              ? "bg-slate-800/50 border-slate-700 hover:border-brandBlue-500"
              : "bg-slate-50 border-slate-200 hover:border-brandBlue-400"
          }`}
        >
          <div
            className={`p-4 rounded-2xl shadow-sm mb-2 ${
              isDarkMode ? "bg-slate-800 text-brandBlue-400" : "bg-white text-brandBlue-600"
            }`}
          >
            <Upload size={32} />
          </div>

          <h4 className={`font-bold ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}>
            Upload CSV or Excel Question Data
          </h4>

          <p className="text-sm text-slate-500 max-w-xs">
            Format: Question, Option A, Option B, Correct Index
          </p>

          <button
            className={`mt-4 px-8 py-3 rounded-xl text-sm font-bold shadow-lg ${
              isDarkMode
                ? "bg-brandBlue-600 text-white hover:bg-brandBlue-700"
                : "bg-slate-900 text-white hover:bg-slate-800"
            }`}
          >
            Select File
          </button>
        </div>
      </div>

      {/* ---------- Footer Buttons ---------- */}
      <div
        className={`mt-10 pt-8 border-t flex justify-between ${
          isDarkMode ? "border-slate-800" : "border-slate-100"
        }`}
      >
        <button className="px-6 py-3 rounded-xl font-semibold text-slate-500 hover:text-slate-400">
          Cancel Draft
        </button>

        <button className="px-10 py-4 bg-brandBlue-600 text-white rounded-2xl font-black shadow-xl shadow-brandBlue-500/20 flex items-center gap-2 hover:translate-y-[-2px] transition-all">
          Continue to Questions
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
