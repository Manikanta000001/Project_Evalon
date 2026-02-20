export default function MCQOptions({ options, value, onChange }) {
  return (
    <div className="max-w-3xl mx-auto space-y-3">
      {options.map((option, idx) => {
        const isSelected = value === option.index;

        return (
          <button
            key={option._id || idx}
            onClick={() => onChange(option.index)}
            className={`w-full flex items-center p-4 rounded-xl border-2 transition-all text-left ${
              isSelected
                ? "bg-white border-blue-600 shadow-md ring-1 ring-blue-600"
                : "bg-white border-white shadow-sm hover:bg-blue-50 hover:border-blue-200"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs mr-4 shrink-0 ${
                isSelected
                  ? "bg-blue-600 text-white"
                  : "bg-slate-50 text-slate-400 border border-slate-100"
              }`}
            >
              {String.fromCharCode(65 + idx)}
            </div>

            <span
              className={`font-medium text-sm ${
                isSelected ? "text-blue-600" : "text-slate-600"
              }`}
            >
              {option.text}
            </span>
          </button>
        );
      })}
    </div>
  );
}
