import { Clock, LayoutGrid, Send, User } from "lucide-react";
const ExamHeader = ({ formatTime, timeLeft, isSidebarOpen, onToggleSidebar, onOpenSubmit,exam }) => (
  <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-50">
    <div className="flex items-center gap-6">
      <div className="flex flex-col">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Assessment</span>
        <span className="font-bold text-blue-600 text-sm">{exam.title}</span>
      </div>
      <div className="h-8 w-[1px] bg-slate-200 hidden sm:block" />
    </div>
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-xl border border-slate-200">
        <Clock size={16} className="text-blue-600" />
        <span className="font-mono font-bold text-slate-700 text-sm">{formatTime(timeLeft)}</span>
      </div>
      <button 
        onClick={onToggleSidebar}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all font-bold text-xs ${
          isSidebarOpen ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-white border-slate-200 text-slate-600'
        }`}
      >
        <LayoutGrid size={16} />
        <span className="hidden lg:inline">Questions</span>
      </button>
      <button 
        onClick={onOpenSubmit}
        className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl font-bold text-xs transition-all shadow-lg shadow-emerald-100 flex items-center gap-2 active:scale-95"
      >
        <Send size={14} /> Submit
      </button>
      <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 cursor-pointer">
        <User size={18} className="text-slate-500" />
      </div>
    </div>
  </header>
);
export default ExamHeader;