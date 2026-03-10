import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const user = JSON.parse(localStorage.getItem("userdata"));

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const hasAccess = user.roles?.some(role =>
    allowedRoles.includes(role)
  );

  if (!hasAccess) {
    return <Navigate to="/teacher" replace />;
  }

  return children;
}