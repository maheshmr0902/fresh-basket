import { Navigate } from 'react-router-dom';
import { useAppContext } from '../Context/AppContext';

const ProtectedRoute = ({ children, requireSeller = false }) => {
  const { user, isSeller } = useAppContext();
  if (requireSeller) {
    return isSeller ? children : <Navigate to="/seller-login" />;
  }
  return user ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
