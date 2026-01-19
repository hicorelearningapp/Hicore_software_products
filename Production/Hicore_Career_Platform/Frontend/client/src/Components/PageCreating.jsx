// src/Components/PageCreating.jsx
import React from "react";
import { useParams } from "react-router-dom";

const PageCreating = ({ title }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <p className="text-gray-600 text-lg">This page is under construction. Please check back later.</p>
    </div>
  );
};

export default PageCreating;
