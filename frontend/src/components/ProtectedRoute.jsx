import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ children }) {
  const { lawyer } = useAuth();
  return lawyer ? children : <Navigate to="/login" replace />;
}
