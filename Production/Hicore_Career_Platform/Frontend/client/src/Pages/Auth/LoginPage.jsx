import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LoginNew from "./LoginNew";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect path after successful login
  const redirectPath = location.state?.from || "/";

  const onLoginSuccess = () => {
    // After successful login, navigate to original path
    navigate(redirectPath, { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-6 rounded shadow">
        <LoginNew onLoginSuccess={onLoginSuccess} />
      </div>
    </div>
  );
};

export default LoginPage;
