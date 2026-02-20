import { Send } from "lucide-react";
const SubmitModal = ({ stats, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
    <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-md w-full p-10 space-y-8 border border-slate-100">
      <div className="text-center space-y-2">
        <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center mx-auto text-blue-600 mb-6">
          <Send size={36} />
        </div>
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Final Submission</h3>
        <p className="text-slate-500 text-sm">Are you sure you want to end your assessment session?</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-5 bg-emerald-50 rounded-3xl border border-emerald-100 text-center">
          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Answered</p>
          <p className="text-3xl font-black text-emerald-700">{stats.answered}</p>
        </div>
        <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Remaining</p>
          <p className="text-3xl font-black text-slate-700">{stats.unanswered}</p>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <button 
          onClick={onConfirm}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-200 active:scale-[0.98]"
        >
          Confirm & Submit
        </button>
        <button 
          onClick={onCancel}
          className="w-full py-4 bg-white hover:bg-slate-50 text-slate-500 font-bold rounded-2xl transition-all border border-slate-100"
        >
          Cancel Review
        </button>
      </div>
    </div>
  </div>
);
export default SubmitModal;