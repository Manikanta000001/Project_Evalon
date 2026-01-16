
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

function App() {
  return (
    <Routes>
      {/* your existing routes remain here */}

      <Route path="/" element={<Landing />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/auth" element={<AuthPage />} />

      <Route path="/teacher" element={<DashboardLayout />}>
        <Route index element={<TeacherDashboard />} />
        <Route path="create" element={<AssessmentStudio />} />
        <Route path="questions" element={<QuestionBank />} />
        <Route path="students" element={<StudentsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
      </Route>

      <Route path="/student" element={<StudentLayout />}>
        <Route index element={<StudentDashboard />} />
        <Route path="exams" element={<StudentExams />} />
        <Route path="results" element={<StudentResults />} />
        <Route path="profile" element={<StudentProfile />} />
      </Route>
    </Routes>
  );
}

export default App;
