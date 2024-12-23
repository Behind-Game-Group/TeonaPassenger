"use client";

import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";


const HomePage = () => {
  const [isSidebarExpanded] = useState(true);
  const { category } = useParams<{ category: string }>();

  return (
    <div
      className={`relative flex flex-col top-[-1.8rem] items-center bg-customOrange min-h-screen ${
        isSidebarExpanded ? "ml-64 lg:ml-64 md:ml-20 sm:ml-10 z-10" : "mr-36"
      }`}
    >
      
      
      
    </div>
  );
};

export default HomePage;
