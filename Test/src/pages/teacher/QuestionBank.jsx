import React, { useState } from "react";
import axios from "axios";
import { Plus, Trash2, Search } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import { Link,useNavigate } from "react-router-dom";
export default function QuestionBank() {
  // 🌙 Dark mode from DashboardLayout
  const { dark: isDarkMode } = useOutletContext() || {};
const navigate = useNavigate();
  // 🧠 Local state (same as original)
  const [questions, setQuestions] = useState([
    { id: 1, text: "Explain the process of photosynthesis.", type: "Short Answer", subject: "Biology" },
    { id: 2, text: "Solve for x: 2x + 5 = 15", type: "Multiple Choice", subject: "Math" }
  ]);

  const [newQuestion, setNewQuestion] = useState({
    text: "",
    type: "Multiple Choice",
    subject: "",
  });

  // ➕ Add Question
  const addQuestion = () => {
    if (!newQuestion.text.trim()) return;

    setQuestions([
      ...questions,
      { ...newQuestion, id: Date.now() }
    ]);

    setNewQuestion({ text: "", type: "Multiple Choice", subject: "" });
  };

  // 🗑️ Delete Question
  const removeQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* ---------- Search + New Entry Bar ---------- */}
      <div
        className={`${
          isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
        } p-6 rounded-2xl border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4`}
      >
        <div className="relative flex-1 max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search repository..."
            className={`w-full pl-10 pr-4 py-2 rounded-lg text-sm outline-none ${
              isDarkMode
                ? "bg-slate-800 text-white focus:ring-1 focus:ring-indigo-500"
                : "bg-slate-50 focus:ring-1 focus:ring-indigo-500"
            }`}
          />
        </div>

        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-indigo-700" onClick={()=>{navigate("new")}}>
          <Plus size={16} />
          New Entry
        </button>
      </div>

      {/* ---------- Main Grid ---------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ---------- Question List ---------- */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className={`font-bold px-1 ${isDarkMode ? "text-white" : "text-slate-800"}`}>
            Questions Bank
          </h3>

          {questions.map(q => (
            <div
              key={q.id}
              className={`${
                isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
              } p-5 rounded-xl border flex justify-between items-start group`}
            >
              <div className="space-y-2">
                <div className="flex gap-2">
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                      isDarkMode ? "bg-indigo-500/10 text-indigo-400" : "bg-indigo-50 text-indigo-600"
                    }`}
                  >
                    {q.subject || "General"}
                  </span>

                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                      isDarkMode ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {q.type}
                  </span>
                </div>

                <p className={`${isDarkMode ? "text-slate-200" : "text-slate-800"} font-medium`}>
                  {q.text}
                </p>
              </div>

              <button
                onClick={() => removeQuestion(q.id)}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* ---------- Quick Add Panel ---------- */}
        <div
          className={`${
            isDarkMode ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200"
          } p-6 rounded-2xl border h-fit`}
        >
          <h3 className={`font-bold mb-6 ${isDarkMode ? "text-white" : "text-slate-800"}`}>
            Quick Add
          </h3>

          <div className="space-y-4">

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
                Subject
              </label>
              <input
                value={newQuestion.subject}
                onChange={e => setNewQuestion({ ...newQuestion, subject: e.target.value })}
                placeholder="e.g. Physics"
                className={`w-full px-3 py-2 rounded-lg outline-none border ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700 text-white"
                    : "bg-white border-slate-200"
                }`}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
                Content
              </label>
              <textarea
                rows={4}
                value={newQuestion.text}
                onChange={e => setNewQuestion({ ...newQuestion, text: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg resize-none outline-none border ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700 text-white"
                    : "bg-white border-slate-200"
                }`}
              />
            </div>

            <button
              onClick={addQuestion}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg"
            >
              Add to Bank
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
