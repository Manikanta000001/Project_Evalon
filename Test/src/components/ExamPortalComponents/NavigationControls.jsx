import { ChevronLeft, ChevronRight } from "lucide-react";

export default function NavigationControls({
  onPrev,
  onNext,
  disablePrev,
  disableNext,
}) {
  return (
    <div className="absolute bottom-6 right-6 flex items-center bg-white p-1 rounded-2xl border border-slate-200 shadow-2xl z-40">
      <button
        disabled={disablePrev}
        onClick={onPrev}
        className="flex items-center gap-2 px-4 py-3 rounded-xl hover:bg-slate-50 disabled:opacity-30 transition-all text-slate-600 font-bold text-xs"
      >
        <ChevronLeft size={18} />
        <span>Prev</span>
      </button>

      <div className="h-6 w-[1px] bg-slate-100 mx-1" />

      <button
        disabled={disableNext}
        onClick={onNext}
        className="flex items-center gap-2 px-4 py-3 rounded-xl hover:bg-slate-50 disabled:opacity-30 transition-all text-blue-600 font-bold text-xs"
      >
        <span>Next</span>
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
