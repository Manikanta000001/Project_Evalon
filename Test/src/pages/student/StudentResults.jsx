
import { useOutletContext } from "react-router-dom";
import { useState,useEffect } from "react";




import { 
  Trophy, 
  BarChart3, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft, 
  Target,
  ChevronRight,
  History,
  Activity
} from "lucide-react";

export default function StudentResults() {
 const { dark: isDarkMode } = useOutletContext() || {};
  const [selectedExam, setSelectedExam] = useState(null);

const [results, setResults] = useState([]);

useEffect(() => {
  const fetchResults = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/results/my", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const data = await res.json();
      console.log("result",data);
      setResults(data);
    } catch (err) {
      console.error("Failed to fetch results", err);
    }
  };

  fetchResults();
}, []);

const total = results.length;
const passed = results.filter(r => r.status === "Pass").length;

const successRate =
  total === 0 ? 0 : Math.round((passed / total) * 100);

const averageScore =
  total === 0
    ? 0
    : Math.round(
        results.reduce((sum, r) => sum + r.percentage, 0) / total
      );



  if (selectedExam) {
    return (
      <ExamDetailView 
        exam={selectedExam} 
        onBack={() => setSelectedExam(null)} 
        isDarkMode={isDarkMode} 
      />
    );
  }

  return (
    <div className={`min-h-screen p-6 md:p-12 transition-all duration-500 font-sans ${isDarkMode ? "bg-[#020617] text-slate-100" : "bg-white text-slate-900"}`}>
      <div className="max-w-6xl mx-auto space-y-10">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatBox title="Assessments" value={results.length} icon={History} iconColor="text-blue-400" isDarkMode={isDarkMode} />
          <StatBox title="Success Rate" value={`${successRate}%`} icon={CheckCircle2} iconColor="text-sky-400" isDarkMode={isDarkMode} />
          <StatBox title="Avg. Score" value={`${averageScore}%`} icon={Target} iconColor="text-indigo-400" isDarkMode={isDarkMode} />
        </div>

        <div className={`overflow-hidden rounded-xl border ${
          isDarkMode ? "bg-[#0f172a] border-blue-900/50 shadow-2xl" : "bg-white border-blue-100 shadow-xl"
        }`}>
          <div className={`px-8 py-6 border-b flex justify-between items-center ${
            isDarkMode ? "border-blue-900/50 bg-transparent" : "border-blue-50 bg-blue-50/30"
          }`}>
            <h3 className={`text-sm font-bold tracking-widest flex items-center gap-3 ${isDarkMode ? "text-blue-100" : "text-blue-900"}`}>
              <Trophy className="text-amber-500" size={16} />
              EXAMINATION LOG
            </h3>
            
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className={`${isDarkMode ? "text-blue-400/70" : "text-blue-600/70"} text-[10px] font-bold uppercase tracking-[0.15em]`}>
                  <th className="px-8 py-4">Assessment Module</th>
                  <th className="px-8 py-4 text-center">Efficiency</th>
                  <th className="px-8 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? "divide-blue-900/30" : "divide-blue-50"}`}>
                {results.map((r) => (
                  <tr
                    key={r.attemptId}
                    onClick={() => setSelectedExam(r)}
                    className={`group cursor-pointer transition-all ${isDarkMode ? "hover:bg-blue-400/[0.04]" : "hover:bg-blue-600/[0.02]"}`}
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-1.5 h-8 rounded-full ${r.status === "Pass" ? "bg-sky-500" : "bg-rose-500"}`}></div>
                        <div>
                          <span className={`font-semibold text-sm block transition-colors ${isDarkMode ? "text-slate-100 group-hover:text-blue-400" : "text-slate-900 group-hover:text-blue-600"}`}>{r.exam}</span>
                          <span className={`text-[10px] font-medium uppercase tracking-wider ${isDarkMode ? "text-blue-400/60" : "text-blue-500/60"}`}>{r.subject} • {r.date}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className={`text-sm font-bold tracking-tighter ${isDarkMode ? "text-slate-100" : "text-slate-900"}`}>{r.score} <span className={isDarkMode ? "text-slate-500" : "text-slate-400"}>/ {r.total}</span></div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 text-[10px] font-black tracking-[0.1em] uppercase">
                        <span className={r.status === "Pass" ? (isDarkMode ? "text-sky-400" : "text-sky-600") : "text-rose-500"}>{r.status}</span>
                        <ChevronRight size={14} className={isDarkMode ? "text-blue-900" : "text-blue-100"} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExamDetailView({ exam, onBack, isDarkMode }) {
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const correct = exam.score;
  const incorrect = exam.total - exam.score;
  const percent = Math.round((correct / exam.total) * 100);
  
  const radius = 85;
  const circumference = 2 * Math.PI * radius;
  const initialOffset = circumference;
  const targetOffset = circumference - (percent / 100) * circumference;

  return (
    <div className={`min-h-screen p-6 md:p-12 animate-in fade-in slide-in-from-right-10 duration-700 ${isDarkMode ? "bg-[#020617] text-slate-100" : "bg-white text-slate-900"}`}>
      <div className="max-w-4xl mx-auto space-y-12">
        <button onClick={onBack} className={`flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${isDarkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"}`}>
          <ArrowLeft size={16} /> Back to Overview
        </button>

        <div className={`rounded-2xl border ${
          isDarkMode ? "bg-[#0f172a] border-blue-900/50 shadow-2xl" : "bg-white border-blue-100 shadow-2xl"
        } overflow-hidden`}>
          
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className={`p-12 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r ${isDarkMode ? "border-blue-900/50 bg-blue-500/[0.02]" : "border-blue-50 bg-blue-50/10"}`}>
              
              <div className={`p-10 rounded-[2rem] border flex items-center justify-center transition-all duration-1000 ${animate ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} ${
                isDarkMode ? "border-blue-800/50 bg-blue-900/20" : "border-blue-50 bg-blue-50/5"
              }`}>
                <div className="relative inline-flex items-center justify-center">
                  <svg className="w-64 h-64 transform -rotate-90">
                    <circle
                      cx="128" cy="128" r={radius}
                      stroke="currentColor" strokeWidth="12" fill="transparent"
                      className={isDarkMode ? "text-blue-950" : "text-blue-50"}
                    />
                    <circle
                      cx="128" cy="128" r={radius}
                      stroke="currentColor" strokeWidth="12" fill="transparent"
                      strokeDasharray={circumference}
                      strokeDashoffset={animate ? targetOffset : initialOffset}
                      strokeLinecap="round"
                      className={`transition-all duration-[1500ms] ease-out ${exam.status === "Pass" ? "text-sky-500" : "text-rose-500"}`}
                    />
                  </svg>
                  <div className={`absolute text-center transition-all duration-1000 delay-500 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <span className={`block text-6xl font-light tracking-tighter mb-1 ${isDarkMode ? "text-white" : "text-blue-900"}`}>{percent}<span className="text-2xl">%</span></span>
                    <span className={`text-[10px] uppercase font-bold tracking-[0.3em] ${isDarkMode ? "text-blue-400/60" : "text-blue-600/60"}`}>Accuracy</span>
                  </div>
                </div>
              </div>

              <div className={`mt-10 w-full grid grid-cols-2 gap-px rounded-lg overflow-hidden border ${isDarkMode ? "bg-blue-900/50 border-blue-900/50" : "bg-blue-100 border-blue-100"}`}>
                <div className={`p-4 flex flex-col items-center ${isDarkMode ? "bg-[#0f172a]" : "bg-white"}`}>
                  <span className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isDarkMode ? "text-blue-400/60" : "text-blue-500/60"}`}>Correct</span>
                  <span className={`text-xl font-bold text-sky-500 transition-all duration-700 delay-[800ms] ${animate ? 'opacity-100' : 'opacity-0'}`}>{correct}</span>
                </div>
                <div className={`p-4 flex flex-col items-center ${isDarkMode ? "bg-[#0f172a]" : "bg-white"}`}>
                  <span className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isDarkMode ? "text-blue-400/60" : "text-blue-500/60"}`}>Incorrect</span>
                  <span className={`text-xl font-bold text-rose-500 transition-all duration-700 delay-[800ms] ${animate ? 'opacity-100' : 'opacity-0'}`}>{incorrect}</span>
                </div>
              </div>
            </div>

            <div className="p-12 space-y-8 self-center">
              <div className={`transition-all duration-700 ${animate ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
                <span className={`text-[10px] font-bold uppercase tracking-[0.3em] mb-2 block ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>Executive Summary</span>
                <h2 className={`text-4xl font-light leading-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>{exam.exam}</h2>
                <p className={`text-sm mt-2 font-medium ${isDarkMode ? "text-blue-300/60" : "text-blue-600/60"}`}>{exam.subject} Department •  Audit</p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isDarkMode ? "bg-sky-500/10 text-sky-400" : "bg-sky-50 text-sky-600"}`}>
                      <Target size={18} />
                    </div>
                    <span className={`text-xs font-semibold ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>Proficiency Rating</span>
                  </div>
                  <span className={`text-sm font-bold uppercase tracking-widest ${isDarkMode ? "text-sky-400" : "text-sky-600"}`}>{exam.status}</span>
                </div>
                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isDarkMode ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-600"}`}>
                      <BarChart3 size={18} />
                    </div>
                    <span className={`text-xs font-semibold ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>Standardized Score</span>
                  </div>
                  <span className={`text-sm font-bold ${isDarkMode ? "text-slate-100" : "text-slate-900"}`}>{exam.score} <span className={isDarkMode ? "text-slate-500" : "text-slate-400"}>pts</span></span>
                </div>
              </div>

              <div className={`p-6 rounded-xl border transition-all duration-1000 delay-[1000ms] ${animate ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} ${
                isDarkMode ? "bg-blue-500/[0.03] border-blue-900/50" : "bg-blue-50/30 border-blue-50"
              }`}>
                <p className={`text-xs leading-relaxed italic ${isDarkMode ? "text-blue-400/60" : "text-blue-600/60"}`}>
                  "Analysis indicates {percent}% alignment with curriculum benchmarks."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBox({ title, value, icon: Icon, iconColor, isDarkMode }) {
  return (
    <div className={`p-8 rounded-xl border transition-all ${
      isDarkMode ? "bg-[#0f172a] border-blue-900/50 hover:border-blue-800 shadow-lg shadow-black/40" : "bg-white border-blue-50 shadow-md hover:shadow-lg"
    }`}>
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-[11px] font-bold uppercase tracking-[0.2em] mb-2 ${isDarkMode ? "text-blue-400/60" : "text-blue-600/60"}`}>{title}</p>
          <p className={`text-4xl font-semibold tracking-tighter transition-colors ${isDarkMode ? "text-white" : "text-blue-900"}`}>{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${isDarkMode ? "bg-blue-900/40" : "bg-blue-50"} ${iconColor || "text-blue-400"}`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}