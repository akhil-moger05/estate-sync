import { Navigate } from "react-router-dom";
import { pb } from "../lib/pb";

// Only lets the right role open a page.
// <ProtectedRoute role="admin"> ... </ProtectedRoute>
export default function ProtectedRoute({ role, children }) {
  if (!pb.authStore.isValid) {
    return <Navigate to="/login" replace />;
  }

  const user = pb.authStore.model;
  if (role && user?.role !== role) {
    // Send the person to their own dashboard
    const home =
      user?.role === "admin"
        ? "/dashboard/admin"
        : user?.role === "agent"
        ? "/dashboard/agent"
        : "/dashboard/user";
    return <Navigate to={home} replace />;
  }

  return children;
}
