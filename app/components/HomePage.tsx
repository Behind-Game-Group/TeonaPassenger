"use client";

import React, { useState } from "react";
import SearchBar from "./SearchBar";
import { FaPlane, FaHotel, FaCar, FaShip } from "react-icons/fa";
import InteractiveMap from "./InteractiveMap";

const HomePage = () => {
  const [isSidebarVisible] = useState(true);

  return (
    <div
      className={`flex flex-col items-center bg-orange-400 border border-white rounded-md min-h-screen `}
    >
      {/* Barre de recherche */}
      <div className="lg:ml-64">
      <SearchBar />
      </div>

      {/* Section "Ce que Teona vous propose" */}
      <div className="w-full max-w-6xl mt-10 px-4 lg:ml-64">
        <h2 className="text-2xl text-black font-bold text-center mb-6">
          Ce que Teona vous propose
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {/* Vols */}
          <div className="flex flex-col items-center p-4 bg-white shadow-md rounded-lg">
            <FaPlane size={40} className="text-blue-500 mb-4" />
            <p className="text-center font-semibold">Réservez vos vols</p>
          </div>

          {/* Hébergements */}
          <div className="flex flex-col items-center p-4 bg-white shadow-md rounded-lg">
            <FaHotel size={40} className="text-blue-500 mb-4" />
            <p className="text-center font-semibold">Trouvez des hébergements</p>
          </div>

          {/* Véhicules */}
          <div className="flex flex-col items-center p-4 bg-white shadow-md rounded-lg">
            <FaCar size={40} className="text-blue-500 mb-4" />
            <p className="text-center font-semibold">Louez une voiture</p>
          </div>

          {/* Ferry */}
          <div className="flex flex-col items-center p-4 bg-white shadow-md rounded-lg">
            <FaShip size={40} className="text-blue-500 mb-4" />
            <p className="text-center font-semibold">Voyagez en ferry</p>
          </div>
        </div>
      </div>

      {/* Carte interactive */}
        <InteractiveMap isSidebarVisible={isSidebarVisible} />
    </div>
  );
};

export default HomePage;
