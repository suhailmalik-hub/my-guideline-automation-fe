import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../hooks/use-auth';

export const ProtectedRoute = () => {
  if (!isAuthenticated()) {
    return (
      <Navigate
        to='/login'
        replace
      />
    );
  }

  return <Outlet />;
};
