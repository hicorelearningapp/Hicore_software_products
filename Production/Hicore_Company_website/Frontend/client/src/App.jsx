import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import ScrollToAnchor from "./components/ScrollToAnchor";
import CareerPage from "./pages/CareerPage";
import ContactSection from "./components/homeComponents/ContactSection";
import Semiconductor from "./pages/Semiconductor/Semiconductor";
import Equipmenthome from "./pages/Semiconductor/Equipmentsoftware/Equipmenthome";
import ScrollToTop from "./data/ScrolltoTop";

const MainLayout = () => (
  <>
    <Navbar />
    <ScrollToAnchor />
    <Outlet />
  </>
);

const App = () => {
  return (
    <Router>
      {/* This component runs on every route change */}
      <ScrollToTop /> 
      
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Projects />} />
          <Route path="/career" element={<CareerPage />} />
          <Route path="/contact" element={<ContactSection />} />
        </Route>

        {/* Semiconductor Routes */}
        <Route path="/hicore/semiconductor" element={<Semiconductor />} />
        <Route path="/hicore/semiconductor/equipmentsoftware" element={<Equipmenthome />} />
      </Routes>
    </Router>
  );
};

export default App;