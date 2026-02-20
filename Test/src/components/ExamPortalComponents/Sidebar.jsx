import { X } from "lucide-react";

const Sidebar = ({ isOpen, onClose, questions, currentIdx, onSelect, getStatusColor, stats }) => (
  <aside className={`fixed inset-y-0 right-0 z-[60] w-80 bg-white border-l border-slate-200 shadow-2xl transition-all duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
    <div className="p-8 h-full flex flex-col w-80">
      <div className="flex items-center justify-between mb-10">
        <h3 className="font-bold text-slate-900">Question Map</h3>
        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400"><X size={20} /></button>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {questions.map((_, idx) => (
          <button
            key={idx}
            onClick={() => { onSelect(idx); onClose(); }}
            className={`h-12 w-full rounded-xl border-2 flex items-center justify-center font-bold text-sm transition-all ${getStatusColor(idx)} ${currentIdx === idx ? 'ring-2 ring-blue-600 ring-offset-2 scale-105' : ''}`}
          >
            {idx + 1}
          </button>
        ))}
      </div>
      <div className="mt-auto space-y-4">
        <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
           <div className="flex justify-between items-center mb-2">
             <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Progress</span>
             <span className="text-sm font-bold text-blue-600">{stats.answered} / {stats.total}</span>
           </div>
           <div className="w-full bg-blue-100 h-2 rounded-full overflow-hidden">
             <div className="bg-blue-600 h-full transition-all duration-500" style={{ width: `${(stats.answered / stats.total) * 100}%` }} />
           </div>
        </div>
      </div>
    </div>
  </aside>
);
export default Sidebar;