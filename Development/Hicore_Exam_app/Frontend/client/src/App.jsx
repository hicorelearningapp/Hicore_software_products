// src/App.jsx
import React, { useEffect, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./Components/Navbar";
import Home from "./Components/Landingpage/Home";
import Footer from "./Components/Footer";
import Login from "./Auth/Login";
import StudentDashboardPage from "./Dashboard/StudentDashboard/StudentDashboardPage";
import TeacherDashboardPage from "./Dashboard/TeacherDashboard/TeacherDashboardPage";


// Lazy-loaded pages
const ExamRoadmap = React.lazy(() => import("./Pages/ExamPage/ExamRoadmap"));
const ExamDetail = React.lazy(() => import("./Pages/ExamPage/ExamDetail"));

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center p-8">
    <div className="text-center">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 text-gray-600">
        The page you requested does not exist.
      </p>
    </div>
  </div>
);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = () => {
  const location = useLocation();

  // 🔥 Hide navbar/footer on dashboard
  const isDashboardRoute = location.pathname.startsWith("/dashboard");

  return (
    <>
      {!isDashboardRoute && <Navbar />}
      <ScrollToTop />

      <Suspense fallback={<div className="p-8">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Dashboard */}
          <Route path="/dashboard/student" element={<StudentDashboardPage />} />
          <Route path="/dashboard/teacher" element={<TeacherDashboardPage />} />

          {/* Course routes */}
          <Route path="/course/:examName" element={<ExamDetail />} />
          <Route path="/course/:examName/roadmap" element={<ExamRoadmap />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      {!isDashboardRoute && <Footer />}
    </>
  );
};

export default App;
