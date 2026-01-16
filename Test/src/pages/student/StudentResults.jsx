import React from "react";
import { useOutletContext } from "react-router-dom";
import { Trophy, BarChart3, CheckCircle, XCircle } from "lucide-react";

export default function StudentResults() {
  const { dark: isDarkMode } = useOutletContext() || {};

  const results = [
    {
      id: 1,
      exam: "Physics Unit Test",
      subject: "Physics",
      score: 18,
      total: 25,
      status: "Pass",
    },
    {
      id: 2,
      exam: "Chemistry Basics",
      subject: "Chemistry",
      score: 14,
      total: 25,
      status: "Fail",
    },
    {
      id: 3,
      exam: "Math Algebra Quiz",
      subject: "Mathematics",
      score: 22,
      total: 25,
      status: "Pass",
    },
  ];

  return (
    <div className="space-y-8">

      {/* ================= OVERVIEW ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <ResultStat
          title="Total Exams"
          value={results.length}
          icon={BarChart3}
          color="text-indigo-500"
          isDarkMode={isDarkMode}
        />
        <ResultStat
          title="Passed"
          value={results.filter(r => r.status === "Pass").length}
          icon={CheckCircle}
          color="text-emerald-500"
          isDarkMode={isDarkMode}
        />
        <ResultStat
          title="Failed"
          value={results.filter(r => r.status === "Fail").length}
          icon={XCircle}
          color="text-red-500"
          isDarkMode={isDarkMode}
        />
      </div>

      {/* ================= RESULTS TABLE ================= */}
      <div
        className={`p-6 rounded-2xl border ${
          isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
        }`}
      >
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Trophy className="text-yellow-500" />
          Exam Results
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="py-3">Exam</th>
                <th>Subject</th>
                <th>Score</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {results.map((r) => {
                const percent = Math.round((r.score / r.total) * 100);

                return (
                  <tr
                    key={r.id}
                    className={`border-t ${
                      isDarkMode ? "border-slate-800" : "border-slate-100"
                    }`}
                  >
                    <td className="py-3 font-medium">{r.exam}</td>
                    <td>{r.subject}</td>
                    <td>
                      {r.score} / {r.total}
                      <span className="ml-2 text-xs text-slate-500">
                        ({percent}%)
                      </span>
                    </td>
                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          r.status === "Pass"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ================= STAT CARD ================= */
function ResultStat({ title, value, icon: Icon, color, isDarkMode }) {
  return (
    <div
      className={`p-5 rounded-2xl border flex items-center gap-4 ${
        isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
      }`}
    >
      <div
        className={`p-3 rounded-xl ${
          isDarkMode ? "bg-slate-800" : "bg-slate-100"
        }`}
      >
        <Icon size={24} className={color} />
      </div>

      <div>
        <p className="text-sm text-slate-500">{title}</p>
        <p className="text-2xl font-black">{value}</p>
      </div>
    </div>
  );
}
