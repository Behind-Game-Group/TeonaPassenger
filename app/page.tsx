"use client"; // Directive pour indiquer que ce fichier doit être traité comme un composant client

import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Style pour le calendrier
import { registerLocale } from "react-datepicker";
import { fr } from "date-fns/locale/fr";
import { FaPlane, FaHotel, FaCar, FaShip } from "react-icons/fa"; // Icônes pour les propositions

// Configuration de la langue française pour le calendrier
registerLocale("fr", fr);

const HomePage = () => {
  const [departureDate, setDepartureDate] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);

  const handleDepartureDateChange = (date: Date | null) => {
    setDepartureDate(date);
  };

  const handleReturnDateChange = (date: Date | null) => {
    setReturnDate(date);
  };

  return (
    <div className="flex flex-col items-center bg-orange-400 border border-white rounded-md min-h-screen">
      

      {/* Barre de recherche */}
      <div className="flex flex-wrap items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 p-4 bg-white shadow-md rounded-lg w-full max-w-6xl mt-6">
        {/* Aéroport départ */}
        <input
          type="text"
          placeholder="Aéroport départ"
          className="px-4 py-2 border rounded-md max-w-[170px] sm:w-1/2 md:w-1/4"
        />

        {/* Aéroport arrivée */}
        <input
          type="text"
          placeholder="Aéroport arrivée"
          className="px-4 py-2 border rounded-md max-w-[170px] sm:w-1/2 md:w-1/4"
        />

        {/* Date aller */}
        <DatePicker
          selected={departureDate}
          onChange={handleDepartureDateChange}
          dateFormat="yyyy/MM/dd"
          className="px-4 py-2 border rounded-md min-w-[200px] sm:w-1/2 md:w-1/4"
          placeholderText="Date d'aller"
          locale="fr"
        />

        {/* Date retour */}
        <DatePicker
          selected={returnDate}
          onChange={handleReturnDateChange}
          dateFormat="yyyy/MM/dd"
          className="flex-1 min-w-[200px] px-4 py-2 border rounded-md"
          placeholderText="Date de retour"
          locale="fr"
        />

        {/* Bouton de recherche */}
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md w-full sm:w-auto">
          Rechercher
        </button>
      </div>

      {/* Section "Ce que Teona vous propose" */}
      <div className="w-full max-w-6xl mt-10">
        <h2 className="text-2xl text-black font-bold text-center mb-6">
          Ce que Teona vous propose
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {/* Vols */}
          <div className="flex flex-col items-center p-4 bg-white shadow-md rounded-lg">
            <FaPlane size={40} className="text-blue-500 mb-4" />
            <p className="text-center font-semibold">Réservez vos vols</p>
          </div>

          {/* Jebergements */}
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
    </div>
  );
};

export default HomePage;
