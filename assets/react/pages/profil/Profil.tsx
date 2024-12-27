"use client";

import React, { useState } from "react";

const HomePage = () => {
  const [isSidebarExpanded] = useState(true);

  return (
    <div
      className={`relative flex flex-col top-[-1.8rem] items-center bg-customOrange min-h-screen ${
        isSidebarExpanded ? "ml-64 lg:ml-64 md:ml-20 sm:ml-10 z-10" : "mr-36"
      }`}
    >
      {/* Header */}
<div className="flex justify-between items-center text-white p-6 w-full max-w-6xl">
  {/* Left Section: User Info */}
  <div className="space-y-4 flex flex-col">
    <h1 className="text-2xl font-bold">Bonjour Manuel</h1>
    {/* Email and Airport Info */}
    <div className="grid grid-cols-2 gap-6">
      {/* Adresse e-mail */}
      <div>
        <p className="font-semibold">Adresse e-mail :</p>
        <p className="mt-1">martinvallee01@gmail.com</p>
      </div>
      {/* Aéroport local */}
      <div>
        <p className="font-semibold">Aéroport local :</p>
        <p className="mt-1 underline">Batumi, Géorgie</p>
      </div>
    </div>
  </div>
  {/* Right Section: User Avatar */}
  <div className="flex items-center justify-center w-32 h-32 rounded-full bg-blue-500 text-white text-3xl font-bold">
    M
  </div>
</div>




      {/* Navigation Links */}
      <div className="flex justify-evenly items-center mt-6 text-white text-sm font-semibold w-full max-w-6xl">
        <a href="#" className="hover:underline">
          Tableau de bord
        </a>
        <a href="#" className="hover:underline">
          Paramètres généraux
        </a>
        <a href="#" className="hover:underline">
          Préférences
        </a>
        <a href="#" className="hover:underline">
          Infos de paiement
        </a>
        <a href="#" className="hover:underline">
          Notifications
        </a>
      </div>

      {/* Search History Section */}
      <div className="mt-10 bg-white rounded-lg shadow-md p-6 w-full max-w-6xl">
        <h2 className="text-lg font-bold text-orange-600">
          Vos recherches précédentes
        </h2>
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-orange-100">
              <tr>
                <th className="py-2 px-4">Itinéraire</th>
                <th className="py-2 px-4">Date</th>
                <th className="py-2 px-4">Détails</th>
                <th className="py-2 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                { route: "TBS → Batumi", date: "mer. 11/12", details: "1 voyageur, Éco" },
                { route: "SOF → Sofia", date: "mer. 12/12", details: "2 voyageurs, Éco" },
                { route: "TBS → Tbilisi", date: "jeu. 13/12", details: "1 voyageur, Affaires" },
              ].map((search, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-100"
                  } border-b`}
                >
                  <td className="py-2 px-4">{search.route}</td>
                  <td className="py-2 px-4">{search.date}</td>
                  <td className="py-2 px-4">{search.details}</td>
                  <td className="py-2 px-4 text-orange-600 hover:underline cursor-pointer">
                    Supprimer
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="mt-4 text-orange-600 hover:underline">
          Tout supprimer
        </button>
      </div>
    </div>
  );
};

export default HomePage;
