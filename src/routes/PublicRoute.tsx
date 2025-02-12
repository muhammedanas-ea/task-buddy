import { Navigate, Outlet } from "react-router-dom";
import { useUserAuth } from "../context/userAuthContext";

const PublicRoute = () => {
  const { user } = useUserAuth();
  
  return user ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;