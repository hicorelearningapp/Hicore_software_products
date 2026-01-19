import React, { useState } from "react";

// ✅ Import icons from assets folder

import categoryIcon from "../../../../assets/MentorAllPage/Challenege.png";
import projectIcon from "../../../../assets/MentorAllPage/Projects.png";
import careerIcon from "../../../../assets/MentorAllPage/Resume.png";
import mockIcon from "../../../../assets/MentorAllPage/Interview.png";
import mentorIcon from "../../../../assets/MentorAllPage/Mentor.png";
import excellenceIcon from "../../../../assets/MentorAllPage/Badge-one.png";



 const Inprogress = () => {
   const categories = [
     {
       id: 1,
       icon: categoryIcon,
       count: 12,
       title: "All Categories",
       bg: "bg-blue-50",
     },
     {
       id: 2,
       icon: projectIcon,
       count: 3,
       title: "Project Supervision",
       bg: "bg-yellow-50",
     },
     {
       id: 3,
       icon: careerIcon,
       count: 2,
       title: "Career Guidance",
       bg: "bg-blue-50",
     },
     {
       id: 4,
       icon: mockIcon,
       count: 2,
       title: "Mock Interviews",
       bg: "bg-yellow-50",
     },
     {
       id: 5,
       icon: mentorIcon,
       count: 3,
       title: "1:1 Mentorship",
       bg: "bg-green-50",
     },
     {
       id: 6,
       icon: excellenceIcon,
       count: 2,
       title: "Excellence",
       bg: "bg-pink-50",
     },
   ];

   return (
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mx-auto mt-6">
       {categories.map((item) => (
         <div
           key={item.id}
           className={`${item.bg} rounded-xl flex flex-col items-center justify-center p-8`}
         >
           <img src={item.icon} alt={item.title} className="w-12 h-12 mb-6" />
           <h3 className="text-2xl text-blue-900 font-bold mb-3">
             {item.count}
           </h3>
           <p className="text-blue-900 font-medium">{item.title}</p>
         </div>
       ))}
     </div>
   );
 };

export default Inprogress