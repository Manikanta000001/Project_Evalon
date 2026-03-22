import { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

// import MOCK_QUESTIONS from "./data/questions";
import InstructionsView from "../views/InstructionsView";
import CompletionView from "../views/CompletionView";

import GlobalStyles from "../components/ExamPortalComponents/GlobalStyles";
import SubmitModal from "../components/ExamPortalComponents/SubmitModal";
import ExamHeader from "../components/ExamPortalComponents/ExamHeader";
import Sidebar from "../components/ExamPortalComponents/Sidebar";

import LeftPanel from "../components/ExamPortalComponents/LeftPanel";
import RightPanel from "../components/ExamPortalComponents/RightPanel";
import { useRef } from "react";

export default function ExamPortalView() {
  const { examId } = useParams();
  const location = useLocation();
  const examMeta = location.state?.examMeta;

  const [attemptId, setAttemptId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [judgeResults, setJudgeResults] = useState(null);

  const student = JSON.parse(localStorage.getItem("userdata"));
  const token = localStorage.getItem("token");

  // -----------------------------
  // VIEW STATE
  // -----------------------------
  const [view, setView] = useState("instructions");

  // -----------------------------
  // EXAM STATE
  // -----------------------------
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [visited, setVisited] = useState(new Set([0]));
  const [activeTab, setActiveTab] = useState("description");

  // -----------------------------
  // UI STATE
  // -----------------------------
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLeftSectionOpen, setIsLeftSectionOpen] = useState(true);

  // -----------------------------
  // TIMER
  // -----------------------------
  const [timeLeft, setTimeLeft] = useState(null);

  // const currentQuestion = MOCK_QUESTIONS[currentQuestionIdx];
  const currentQuestion = questions[currentQuestionIdx];

  const [codingMarks, setCodingMarks] = useState({});
  const [flags, setFlags] = useState(0);
  const exitHandled = useRef(false);
  const navigate = useNavigate();

  // -----------------------------
  // EFFECTS
  // -----------------------------
  useEffect(() => {
    if (view !== "exam") return;

    const checkFullscreen = async () => {
     if (!document.fullscreenElement && !exitHandled.current) {
        if (!attemptId) return; // 🔥 important

        exitHandled.current = true;

        alert("⚠️ You exited fullscreen.");

        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/attempt/flag`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              attemptId,
              type: "fullscreen_exit",
            }),
          });

          const data = await res.json();

          setFlags(data.flags);
          // ✅ real DB value
          console.log("The flags", data.flags);

          // 🔥 AUTO SUBMIT AFTER 3 FLAGS
          if (data.flags >= 10) {
            alert("❌ Too many violations. Exam will be submitted.");
            await submitExam();
            return;
          }
        } catch (err) {
          console.error("Flag save failed", err);
        }

        exitFullscreen();

        setTimeout(() => {
          navigate("/student");
        }, 300);
      }
    };

    const interval = setInterval(checkFullscreen, 500);

    return () => clearInterval(interval);
  }, [view, attemptId]);

  useEffect(() => {
    if (view === "exam") {
      exitHandled.current = false;
    }
  }, [view]);
  // when timmer is over
  useEffect(() => {
    if (view === "exam" && timeLeft === 0) {
      handleAutoSubmit();
    }
  }, [timeLeft, view]);

  // exit blocker
  useEffect(() => {
    if (view !== "exam" || timeLeft === null) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [view, timeLeft]);

  // auto submit helper
  const handleAutoSubmit = () => {
    submitExam();
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleQuestionSelect = (idx) => {
    setCurrentQuestionIdx(idx);
    setVisited((v) => new Set(v).add(idx));
  };

  const handleAnswerChange = async (value) => {
    const qId = currentQuestion.questionId;

    // 1. Update UI instantly
    setAnswers((prev) => ({
      ...prev,
      [qId]: value,
    }));

    // 2. Save to backend (autosave)
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/attempt/save`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          attemptId,
          questionId: qId,
          answer: value,
        }),
      });
    } catch (err) {
      console.error("Autosave failed", err);
    }
  };

  const getStatusColor = (idx) => {
    const qId = questions[idx].questionId;
    if (answers[qId] !== undefined)
      return "bg-blue-600 text-white border-blue-600";
    if (visited.has(idx)) return "bg-blue-100 text-blue-700 border-blue-200";
    return "bg-white text-slate-400 border-slate-200";
  };

  const stats = useMemo(() => {
    const answered = Object.keys(answers).length;
    const total = questions.length;
    return {
      answered,
      unanswered: total - answered,
      total,
    };
  }, [answers]);

  // full screen helper
  const enterFullscreen = () => {
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
  };

  const submitExam = async () => {
    if (!attemptId || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/attempt/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          attemptId,
          answers,
          codingMarks,
        }),
      });

      exitFullscreen();
      
      setView("completed");
    } catch (err) {
      alert("Submission failed");
      setIsSubmitting(false);
    }
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  // start exam api
  const startExam = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/attempt/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          examId,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.message);
        return;
      }

      const data = await res.json();

      setAttemptId(data.attemptId);
      setQuestions(data.questions);
      setFlags(data.flags || 0);

      if (data.resume) {
        setAnswers(data.answers || {});
      }

      // ⏱ TIMER (DB-DRIVEN)
      const totalSeconds = data.durationMinutes * 60;

      if (data.resume) {
        const elapsed =
          (Date.now() - new Date(data.startedAt).getTime()) / 1000;

        setTimeLeft(Math.max(totalSeconds - Math.floor(elapsed), 0));
      } else {
        setTimeLeft(totalSeconds);
      }

      setCurrentQuestionIdx(0);
      setVisited(new Set([0]));

      // 🖥 FULLSCREEN
      enterFullscreen();

      setView("exam");
    } catch (err) {
      console.error(err);
      alert("Failed to start exam");
    }
  };

  // -----------------------------
  // VIEW SWITCHING
  // -----------------------------
  if (view === "completed")
    return (
      <>
        <GlobalStyles />
        <CompletionView />
      </>
    );

  if (view === "instructions") {
    if (!examMeta) {
      return <div className="p-10">Invalid access. Please select an exam.</div>;
    }

    return (
      <InstructionsView exam={examMeta} student={student} onStart={startExam} />
    );
  }

  if (view === "exam" && questions.length === 0) {
    return <div className="p-10">Loading exam…</div>;
  }
  if (!currentQuestion) {
    return <div className="p-10">Loading question…</div>;
  }

  // -----------------------------
  // EXAM VIEW
  // -----------------------------
  return (
    <div className="flex flex-col h-screen bg-[#F8FAFC] overflow-hidden">
      <GlobalStyles />

      {showSubmitModal && (
        <SubmitModal
          stats={stats}
          onConfirm={async () => {
            await submitExam();
            setShowSubmitModal(false);
          }}
          onCancel={() => setShowSubmitModal(false)}
        />
      )}

      <ExamHeader
        formatTime={formatTime}
        timeLeft={timeLeft}
        flags={flags}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onOpenSubmit={() => setShowSubmitModal(true)}
        exam={examMeta}
      />

      <div className="flex flex-1 overflow-hidden">
        <LeftPanel
          question={currentQuestion}
          questionIdx={currentQuestionIdx}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={isLeftSectionOpen}
          judgeResults={judgeResults}
        />

        <RightPanel
          question={currentQuestion}
          answer={answers[currentQuestion.questionId]}
          onAnswerChange={handleAnswerChange}
          isLeftOpen={isLeftSectionOpen}
          toggleLeft={() => setIsLeftSectionOpen((p) => !p)}
          onPrev={() => handleQuestionSelect(currentQuestionIdx - 1)}
          onNext={() => handleQuestionSelect(currentQuestionIdx + 1)}
          isFirst={currentQuestionIdx === 0}
          isLast={currentQuestionIdx === questions.length - 1}
          setJudgeResults={setJudgeResults}
          setCodingMarks={setCodingMarks}
        />

        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          questions={questions}
          currentIdx={currentQuestionIdx}
          onSelect={handleQuestionSelect}
          getStatusColor={getStatusColor}
          stats={stats}
        />
      </div>
    </div>
  );
}
