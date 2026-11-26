import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRole }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    const fallbackPath =
      user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard';
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
}
