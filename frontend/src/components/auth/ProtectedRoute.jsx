import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>loading...</div>;
  }

  if (!isAuthenticated) {
    //if a person go to dashboard without login, the page redirected to login. 'state' remembers the location that the user navigated
    // from dashboard to the login page. replace errases the dashboard history so that after login, the page automatically redirected
    // to dashboard, where the user tries to go before login...
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

export default ProtectedRoute;
