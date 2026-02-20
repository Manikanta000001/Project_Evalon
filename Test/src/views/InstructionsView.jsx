import { ShieldCheck, Clock, Info, User, ArrowRight } from "lucide-react";
// import MOCK_QUESTIONS from "../data/questions";

const InstructionsView = ({ exam, student, onStart }) => (
  <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center p-6 md:p-12 overflow-y-auto">
    <div className="max-w-4xl w-full space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-sm uppercase tracking-widest">
            <ShieldCheck size={18} />
            Secure Assessment
          </div>
          <h1 className="text-4xl font-black text-slate-900"> {exam.title}</h1>
          <p className="text-slate-500">
            Please read the following instructions carefully before starting the
            exam.
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 shrink-0">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
              Time Allowed
            </p>
            <p className="text-xl font-black text-slate-900">
              {exam.durationMinutes} Minutes
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Info size={20} className="text-blue-500" />
              Exam Guidelines
            </h2>
            <ul className="space-y-4">
              {[
                "This assessment consists of Multiple Choice Questions (MCQs) and Coding Challenges.",
                "Each MCQ carries 10 points. Coding challenges carry 50 points.",
                "You can navigate between questions freely using the Question Map or navigation buttons.",
                "Progress is saved automatically, but you must click 'Submit Assessment' at the end to finalize your results.",
                "System monitoring is active. Switching tabs or windows may lead to disqualification.",
              ].map((text, i) => (
                <li
                  key={i}
                  className="flex gap-3 text-slate-600 text-sm leading-relaxed"
                >
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">
                    {i + 1}
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Navigation Legend
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
                  01
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Answered</p>
                  <p className="text-[10px] text-slate-500">Saved progress</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-200 text-blue-700 flex items-center justify-center font-bold text-xs">
                  02
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Visited</p>
                  <p className="text-[10px] text-slate-500">
                    Viewed but skipped
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-400 flex items-center justify-center font-bold text-xs">
                  03
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    Not Visited
                  </p>
                  <p className="text-[10px] text-slate-500">Locked state</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[32px] overflow-hidden shadow-2xl shadow-slate-200 border border-slate-800">
            <div className="p-8 space-y-8">
              <div className="space-y-1 text-center sm:text-left">
                <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest opacity-80">
                  Candidate Identity
                </p>
                <div className="flex items-center gap-3 justify-center sm:justify-start">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <User size={20} className="text-blue-400" />
                  </div>
                  <p className="text-xl font-bold text-white tracking-tight">
                    {student.name}
                  </p>
                </div>
              </div>
              <div className="h-px bg-slate-800 w-full" />
              <div className="space-y-4">
                <div className="flex justify-between items-center group">
                  <span className="text-slate-400 text-xs font-medium group-hover:text-blue-300 transition-colors">
                    Pass Threshold
                  </span>
                  <span className="bg-slate-800 text-emerald-400 font-mono text-sm px-3 py-1 rounded-lg border border-slate-700">
                    {" "}
                    {exam.passPercentage}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-xs">Submission</span>
                  <span className="bg-slate-800 text-emerald-400 px-3 py-1 rounded-lg text-xs">
                    Auto-submit 
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-xs">Monitoring</span>
                  <span className="bg-slate-800 text-red-400 px-3 py-1 rounded-lg text-xs">
                    Fullscreen Required
                  </span>
                </div>
              </div>
            </div>
            <div className="p-4 pt-0">
              <button
                onClick={onStart}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-black text-base transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-3 group active:scale-[0.98]"
              >
                Start Assessment
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
              <p className="text-[10px] text-slate-500 text-center mt-4 px-4 leading-relaxed font-medium">
                Please ensure a stable connection before proceeding.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
export default InstructionsView;
