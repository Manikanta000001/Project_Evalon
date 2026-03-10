// RoleBasedDashboard.jsx
import TeacherDashboard from "../pages/teacher/TeacherDashboard";
import HODDashboard from "../pages/Hod/HoadDashboard";
import ExamCellDashboard from "../pages/examcell/ExamQuestionBanks";
import PrincipalDashboard from "../pages/principal/PrincipalDashboard";
import TeacherUpload from "../pages/teacher/TeacherUpload";
import ApprovalPage from "../pages/Hod/ApprovalPage";
import Examcell from "../pages/examcell/ExamCell";
import HoadDashboard from "../pages/Hod/HoadDashboard";


export default function RoleBasedDashboard() {
  const user = JSON.parse(localStorage.getItem("userdata"));
  if (!user) return null;
  const roles = user.roles || [];
 

  // Priority order (you decide)
  if (roles.includes("principal")) {
    // return <ApprovalPage/>
    return <Examcell />;
  }

  if (roles.includes("examcell")) {
    return <Examcell />;
  }

  if (roles.includes("hod")) {
    return <HoadDashboard />;
  }

  if (roles.includes("teacher")) {
    return <TeacherDashboard />;
  }

  return null;
}
