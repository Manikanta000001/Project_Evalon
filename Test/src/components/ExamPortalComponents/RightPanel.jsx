import MCQOptions from "./MCQOptions";
import CodeEditor from "./CodeEditor";
import NavigationControls from "./NavigationControls";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function RightPanel({
  question,
  answer,
  onAnswerChange,
  isLeftOpen,
  toggleLeft,
  onPrev,
  onNext,
  isFirst,
  isLast,
  setJudgeResults,
  setCodingMarks,
}) {
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRun = async (language, sourceCode) => {
    try {
      setIsRunning(true);
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/code/run-all", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          questionId: question.questionId,
          language,
          sourceCode,
        }),
      });

      const data = await res.json();

      console.log("Judge Results:", data);

      if (!data.success) {
        alert("Execution failed");
        return;
      }

      // show results
      setJudgeResults(data.results);
    } catch (err) {
      console.error("Run error:", err);
    } finally {
      setIsRunning(false); // 👈 STOP LOADING
    }
  };

  const handleSubmit = async (language, sourceCode) => {
    try {
      setIsSubmitting(true);

      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/code/run-all", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          questionId: question.questionId,
          language,
          sourceCode,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        alert("Execution failed");
        return;
      }

      setJudgeResults(data.results);

      const passedCount = data.results.filter((r) => r.passed).length;
      const totalTestCases = data.results.length;

      const questionMarks = question.marks || 0;

      const awardedMarks = (passedCount / totalTestCases) * questionMarks;

      // 🔥 SEND MARKS UP TO PARENT
      setCodingMarks((prev) => ({
        ...prev,
        [question.questionId]: awardedMarks,
      }));

      console.log("Awarded Marks:", awardedMarks);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 relative">
      {/* TOGGLE LEFT PANEL (ONLY FOR CODING) */}
      {question.type === "coding" && (
        <button
          onClick={toggleLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-12 bg-white border border-slate-200 rounded-full shadow-md z-40 flex items-center justify-center text-slate-400"
        >
          {isLeftOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      )}

      {/* ANSWER AREA */}
      <div className="flex-1 p-8 overflow-y-auto pb-24">
        {question.type === "mcq" ? (
          <MCQOptions
            options={question.options}
            value={answer}
            onChange={onAnswerChange}
          />
        ) : (
          <CodeEditor
            value={answer}
            onChange={onAnswerChange}
            onRun={handleRun}
            onSubmit={handleSubmit}
            languages={["python", "javascript", "java", "cpp"]}
            isRunning={isRunning}
            isSubmitting={isSubmitting}
          />
        )}
      </div>

      {/* NAVIGATION */}
      <NavigationControls
        onPrev={onPrev}
        onNext={onNext}
        disablePrev={isFirst}
        disableNext={isLast}
      />
    </div>
  );
}
