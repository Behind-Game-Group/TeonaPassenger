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

  const [mode, setMode] = useState<"départ" | "arrivée">("départ");

  const [priceOpen, setPriceOpen] = useState(false); // État pour la section "Prix"
  const [price, setPrice] = useState(50); // État pour la valeur du curseur

  // Fonction pour tout sélectionner
  const selectAll = () => {
    const checkboxes = document.querySelectorAll<HTMLInputElement>(
      ".compagnie-checkbox"
    );
    checkboxes.forEach((checkbox) => (checkbox.checked = true));
  };

  // Fonction pour tout désélectionner
  const deselectAll = () => {
    const checkboxes = document.querySelectorAll<HTMLInputElement>(
      ".compagnie-checkbox"
    );
    checkboxes.forEach((checkbox) => (checkbox.checked = false));
  };

  const generateCompagnies = (n: number) => {
    const allCompagnies = [
      "Air France",
      "British Airways",
      "Lufthansa",
      "EasyJet",
      "Ryanair",
      "Turkish Airlines",
      "Wizz Air",
      "Emirates",
      "KLM",
      "Qatar Airways",
      "Delta Airlines",
      "United Airlines",
      "Alitalia",
      "American Airlines",
      "Jet Airways",
      "Singapore Airlines",
      "Cathay Pacific",
      "Japan Airlines",
      "Air India",
      "Aeroflot",
    ];
    return allCompagnies.slice(0, n);
  };

  const [showAllCheckBoxes, setShowAllCheckBoxes] = useState(false);

  const compagnies = generateCompagnies(showAllCheckBoxes ? 20 : 6);

  const toggleVisibility = () => {
    setShowAllCheckBoxes(!showAllCheckBoxes);
  };

  const [isOpen, setIsOpen] = useState(false);

  const toggleSection = () => {
    setIsOpen(!isOpen);
  };

  const togglePriceSection = () => {
    setPriceOpen(!priceOpen); // Ouvre ou ferme la section Prix
  };

  return (
    <div
      className={`relative flex flex-col top-[-1.8rem] items-center bg-customOrange min-h-screen ${
        isSidebarExpanded ? "ml-64 lg:ml-64 md:ml-20 sm:ml-10 z-10" : "mr-36"
      }`}
    >
      <main className="flex-1 p-6">
        {/* Filtres */}
        <section className="flex space-x-6 min-w-[40.5rem]">
          <div className="w-1/4 bg-white p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Filtres</h2>
            <div className="space-y-4">
              {/* Type de vol */}
              <div>
                <h3 className="font-semibold pb-2">Type de vol</h3>
                <div className="space-y-2">
                  <label className="flex items-center text-sm">
                    <input type="checkbox" className="mr-2" />
                    Vol direct
                  </label>
                  <label className="flex items-center text-sm">
                    <input type="checkbox" className="mr-2" />1 escale
                  </label>
                  <label className="flex items-center text-sm">
                    <input type="checkbox" className="mr-2" />2 escales et +
                  </label>
                </div>
              </div>

              {/* Horaires */}
              <div className="border-t">
                <h3 className="font-semibold">Horaires</h3>

                {/* Boutons Départs/Arrivées */}
                <div className="mb-4 bg-gray-200 py-1 px-1 grid grid-cols-2 gap-2 rounded-md">
                  <button
                    className="px-0 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => setMode("départ")}
                  >
                    Départs
                  </button>
                  <button
                    className="px-0 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                    onClick={() => setMode("arrivée")}
                  >
                    Arrivées
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="block">
                    {mode === "départ" ? "Départ de" : "Arrivée de"} {city} :{" "}
                    <strong>{formatTime(departPar)}</strong>
                    <input
                      type="range"
                      min="0"
                      max="24"
                      step="1"
                      value={departPar}
                      onChange={(e) =>
                        setDepartPar(parseInt(e.target.value, 10))
                      }
                      className="w-full"
                    />
                  </label>
                  <label className="block">
                    {mode === "départ" ? "Départ de" : "Arrivée de"} NYC :{" "}
                    <strong>{formatTime(departNyc)}</strong>
                    <input
                      type="range"
                      min="0"
                      max="24"
                      step="1"
                      value={departNyc}
                      onChange={(e) =>
                        setDepartNyc(parseInt(e.target.value, 10))
                      }
                      className="w-full"
                    />
                  </label>
                </div>
              </div>

              <div className="border-t">
                <h3 className="font-semibold mb-1">Compagnies</h3>
                <div className="mb-4  p-2 grid grid-cols-2 gap-1">
                  <button
                    className="px-0 py-1  text-left text-gray-500  transition-all duration-200 ease-in-out font-light text-xs underline"
                    onClick={selectAll}
                  >
                    Tout sélectionner
                  </button>
                  <button
                    className="px-0 py-1  text-left text-gray-500  transition-all duration-200 ease-in-out font-light text-xs underline"
                    onClick={deselectAll}
                  >
                    Tout supprimer
                  </button>
                </div>
                <div>
                  <div className="space-y-2">
                    {compagnies.map((compagnie, index) => (
                      <label key={index} className="flex items-center text-sm">
                        <input
                          type="checkbox"
                          className="compagnie-checkbox mr-2"
                          defaultChecked={false}
                        />
                        {compagnie}
                      </label>
                    ))}
                    <button
                      className="text-left text-gray-500  transition-all duration-200 ease-in-out font-light text-xs underline"
                      onClick={toggleVisibility}
                    >
                      {showAllCheckBoxes ? "Masquer" : "Afficher"} toutes les
                      compagnies
                    </button>
                  </div>
                </div>
              </div>

              {/* Moyens de transport */}
              <div className="border-t">
                <h3 className="font-semibold mb-2">Moyens de transport</h3>
                <div className="space-y-2">
                  <label className="flex items-center text-sm">
                    <input type="checkbox" className="mr-2" />
                    Vol
                  </label>
                  <label className="flex items-center text-sm">
                    <input type="checkbox" className="mr-2" />
                    Vol + Bus
                  </label>
                  <label className="flex items-center text-sm">
                    <input type="checkbox" className="mr-2" />
                    Vol + Train
                  </label>
                </div>
              </div>

              {/* Classes */}
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={toggleSection}
              >
                <h3 className="font-semibold">Classes</h3>
                {/* Flèche */}
                <span
                  className={`transform transition-transform text-gray-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </div>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? "max-h-40" : "max-h-0"
                }`}
              >
                <div className="mt-0 space-y-2">
                  <label className="flex items-center text-sm">
                    <input type="checkbox" className="mr-2" />
                    Eco
                  </label>
                  <label className="flex items-center text-sm">
                    <input type="checkbox" className="mr-2" />
                    Premium
                  </label>
                  <label className="flex items-center text-sm">
                    <input type="checkbox" className="mr-2" />
                    Premium +
                  </label>
                </div>
              </div>

              {/* Section Prix */}
              <div>
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={togglePriceSection}
                >
                  <h3 className="font-semibold">Prix</h3>
                  <span
                    className={`transform transition-transform text-gray-300 ${
                      priceOpen ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                </div>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    priceOpen ? "max-h-40" : "max-h-0"
                  }`}
                >
                  <div className="mt-2 space-y-2">
                    <label className="block">
                      Prix : <strong>{price}€</strong>
                      <input
                        type="range"
                        min="50"
                        max="3000"
                        step="50"
                        value={price}
                        onChange={(e) => setPrice(parseInt(e.target.value, 10))}
                        className="w-full mt-2"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Résultats */}
          <div className="flex-1 space-y-6">
            <h1 className="text-2xl font-bold text-white">
              {" "}
              Voici les résultats pour : {decodeURIComponent(city || "")}
            </h1>
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
