import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ToolPage from "./pages/ToolPage";
import UploadPage from "./pages/UploadPage";
import CustomToolRouter from "./pages/CustomToolRouter";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import AllTools from "./pages/AllTools";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* First screen → shown for ALL tools */}
        <Route path="/tools/:toolId" element={<ToolPage />} />

        {/* Second screen → Convert tools ONLY */}
        <Route path="/tools/:toolId/upload" element={<UploadPage />} />

        {/* Second screen → Custom tools (Organize, Edit, AI, Password, etc.) */}
        <Route path="/tools/:toolId/custom" element={<CustomToolRouter />} />
        <Route path="/alltools" element={<AllTools />} />
      </Routes>
    </>
  );
};

export default App;
