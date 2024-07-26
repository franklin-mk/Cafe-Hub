//src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

const ProtectedRoute = ({ children, role }) => {
  const { user } = useUser();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/customer'} />;
  }

  return children;
};

export default ProtectedRoute;