import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { authentication } from "../config/firebase";
const ProtectedRoute = ({ children }) => {
  const [user, loading, error] = useAuthState(authentication);

  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default ProtectedRoute;
