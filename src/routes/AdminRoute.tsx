import { Navigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import React from "react";

interface Props {
  children: React.ReactNode;
}

export default function AdminRoute({ children }: Props) {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "ADMIN") {
    return <Navigate to="/todos" replace />;
  }

  console.log("AUTH USER ROLE:", user?.role);


  return children;
}
