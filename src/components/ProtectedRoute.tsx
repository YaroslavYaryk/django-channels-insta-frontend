import React from "react";
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export function ProtectedRoute({ children }: { children: any }) {
  const { user, logout } = useContext(AuthContext);
  // console.log(user);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
