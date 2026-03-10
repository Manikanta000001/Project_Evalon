import { Routes, Route } from "react-router-dom";

import DashboardLayout from "../Test/src/Layouts/DashboardLayout";
import StudentLayout from "../Test/src/Layouts/StudentLayout";

// Teacher imports

import TeacherDashboard from "../Test/src/pages/teacher/TeacherDashboard";
import AssessmentStudio from "../Test/src/pages/teacher/AssessmentStudio";
import QuestionBank from "../Test/src/pages/teacher/QuestionBank";
import StudentsPage from "../Test/src/pages/teacher/StudentsPage";
import AnalyticsPage from "../Test/src/pages/teacher/AnalyticsPage";

// Student imports

import StudentDashboard from "../Test/src/pages/student/StudentDashboard";
import StudentExams from "../Test/src/pages/student/StudentExams";
import StudentResults from "../Test/src/pages/student/StudentResults";
import StudentProfile from "../Test/src/pages/student/StudentProfile";

import Landing from "./scenes/LandingPage/LandingPage";
import AuthPage from "./scenes/AuthPage/AuthPage";

import Dashboard from "./src/Dashboard";
import Generation from "./src/pages/teacher/Generation";
import ExamPortalView from "./src/views/ExamPortalView";
import RoleBasedDashboard from "./src/Layouts/RoleBasedDashboard";
import ApprovalPage from "./src/pages/Hod/ApprovalPage";
import TeacherUpload from "./src/pages/teacher/TeacherUpload";
import ExamQuestionBanks from "./src/pages/examcell/ExamQuestionBanks";
import ProtectedRoute from "./src/ProtectedRoute";
import SavedRepo from "./src/pages/examcell/SavedRepo";
import BankStatusComp from "./src/pages/teacher/BankStatusComp";
import PasswordRestOtp from "./src/components/PasswordRestOtp";

function App() {
  return (
    <Routes>
      {/* your existing routes remain here */}
      <Route path="/" element={<Landing />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/exam/:examId/instructions" element={<ExamPortalView />} />
      {/* <Route path="/exam/:examId/start" element={<ExamPortalView />} /> */}

      {/* <Route path="/teacher" element={<DashboardLayout />}>
        <Route index element={<TeacherDashboard />} />
        <Route path="create" element={<AssessmentStudio />} />
        <Route path="questions" element={<Generation />} />
        <Route path="students" element={<StudentsPage />} />
        <Route path="analytics" element={<HoadDashboard/>} />

 
      </Route> */}

      <Route path="/teacher" element={<DashboardLayout />}>
        <Route index element={<RoleBasedDashboard />} />

        <Route
          path="create"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <AssessmentStudio />
            </ProtectedRoute>
          }
        />
        <Route
          path="students"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <StudentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="upload"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <TeacherUpload />
            </ProtectedRoute>
          }
        />
        <Route
          path="bankstatus"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <BankStatusComp/>
            </ProtectedRoute>
          }
        />

        <Route
          path="questions"
          element={
            <ProtectedRoute allowedRoles={["examcell"]}>
              <Generation />
            </ProtectedRoute>
          }
        />
        <Route
          path="analytics"
          element={
              <AnalyticsPage />
          }
        />
        <Route
          path="approvals"
          element={
            <ProtectedRoute allowedRoles={["hod"]}>
              <ApprovalPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="generate-paper"
          element={
            <ProtectedRoute allowedRoles={["examcell","principal"]}>
              <ExamQuestionBanks />
            </ProtectedRoute>
          }
        />
        <Route
          path="savedrepo"
          element={
            <ProtectedRoute allowedRoles={["examcell"]}>
              <SavedRepo/>
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="/student" element={<StudentLayout />}>
        <Route index element={<StudentDashboard />} />
        <Route path="exams" element={<StudentExams />} />
        <Route path="results" element={<StudentResults />} />
        <Route path="profile" element={<StudentProfile />} />
      </Route>
        <Route path="forgot-password" element={<PasswordRestOtp/>} />


    </Routes>
  );
}

export default App;
