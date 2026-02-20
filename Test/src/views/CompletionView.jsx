import { PartyPopper, CheckCircle2, LogOut } from "lucide-react";
const CompletionView = () => (
  <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
    <div className="max-w-md w-full space-y-8 animate-submit-view">
      <div className="relative inline-block animate-zoom-fade">
         <div className="absolute inset-0 bg-emerald-500 blur-3xl opacity-20 animate-pulse" />
         <div className="relative bg-emerald-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto text-emerald-600">
            <PartyPopper size={48} className="animate-bounce" />
         </div>
      </div>
      <div className="space-y-3">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Assessment Submitted!</h1>
        <p className="text-slate-500 leading-relaxed">
          Your responses have been securely uploaded. You have successfully completed the certification attempt.
        </p>
      </div>
      <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 space-y-4 shadow-sm">
        <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold text-sm">
          <CheckCircle2 size={18} />
          Session ID: #SEC-{Math.random().toString(36).substr(2, 9).toUpperCase()}
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          The evaluation process has started. Your results will be released via your registered dashboard soon.
        </p>
      </div>
      <button 
        onClick={() => window.location.reload()}
        className="flex items-center justify-center gap-2 w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl transition-all active:scale-95 shadow-xl shadow-slate-200"
      >
        <LogOut size={20} /> Exit Assessment
      </button>
    </div>
  </div>
);
export default CompletionView;