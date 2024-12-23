"use client";

import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";



const ResultatPage = () => {
  const [isSidebarExpanded] = useState(true);
  const { category } = useParams<{ category: string }>();

  const [departPar, setDepartPar] = useState(0); // Valeur initiale en heures
  const [departNyc, setDepartNyc] = useState(0);

  // Fonction pour convertir la valeur en heures au format HH:MM
  const formatTime = (value: number): string => {
    const hours = Math.floor(value);
    const minutes = (value % 1) * 60; // En cas de besoin pour des pas plus petits
    return `${String(hours).padStart(2, "0")}:00`;
  };

  const { city } = useParams<{ city: string }>();

  return (
    <div
      className={`relative flex flex-col top-[-1.8rem] items-center bg-customOrange min-h-screen ${
        isSidebarExpanded ? "ml-64 lg:ml-64 md:ml-20 sm:ml-10 z-10" : "mr-36"
      }`}
    >
      
      <main className="flex-1 p-6">
        {/* Filtres */}
        <section className="flex space-x-6">
          <div className="w-1/4 bg-customBlue p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Filtres</h2>
            <div className="space-y-4">
              {/* Type de vol */}
              <div>
                <h3 className="font-semibold">Type de vol</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Vol direct
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    1 escale
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    2 escales et +
                  </label>
                </div>
              </div>

              {/* Horaires */}
              <div>
                <h3 className="font-semibold">Horaires</h3>
                <div className="space-y-2">
                  <label className="block">
                    Départ de PAR : <strong>{formatTime(departPar)}</strong>
                    <input type="range" min="0" max="24" step="1" value={departPar} onChange={(e) => setDepartPar(parseInt(e.target.value, 10))} className="w-full" />
                  </label>
                  <label className="block">
                    Départ de NYC : <strong>{formatTime(departNyc)}</strong>
                    <input type="range" min="0" max="24" step="1" value={departNyc} onChange={(e) => setDepartNyc(parseInt(e.target.value, 10))} className="w-full" />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Résultats */}
          <div className="flex-1 space-y-6">
            <h1 className="text-2xl font-bold"> Voici les résultats pour : {decodeURIComponent(city || "")}</h1>
            <div className="space-y-4">
              {/* Carte de vol */}
              <div className="bg-customBlue p-4 rounded-lg flex justify-between items-center">
                <div>
                  <h2 className="font-bold">Le meilleur choix</h2>
                  <p>11:25 - 15:50 (direct)</p>
                </div>
                <div>
                  <p className="text-xl font-bold">394 €</p>
                  <button className="bg-customBlue brightness-90 hover:brightness-75 px-4 py-2 rounded-lg mt-2">
                    Choisir
                  </button>
                </div>
              </div>

              {/* Autres cartes */}
              <div className="bg-customBlue p-4 rounded-lg flex justify-between items-center">
                <div>
                  <h2 className="font-bold">Le moins cher</h2>
                  <p>17:25 - 06:35 (1 escale)</p>
                </div>
                <div>
                  <p className="text-xl font-bold">372 €</p>
                  <button className="bg-customBlue brightness-90 hover:brightness-75 px-4 py-2 rounded-lg mt-2">
                    Choisir
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main> 
      
    </div>
  );
};

export default ResultatPage;
