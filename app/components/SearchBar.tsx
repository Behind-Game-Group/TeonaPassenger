"use client"; // Directive pour indiquer que ce fichier doit être traité comme un composant client

import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Style pour le calendrier
import { registerLocale } from "react-datepicker";
import { fr } from "date-fns/locale/fr";

registerLocale("fr", fr);

const SearchBar = () => {
    const [departureDate, setDepartureDate] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);

  const handleDepartureDateChange = (date: Date | null) => {
    setDepartureDate(date);
  };

  const handleReturnDateChange = (date: Date | null) => {
    setReturnDate(date);
  };

  return (

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
      );
    };

    export default SearchBar;