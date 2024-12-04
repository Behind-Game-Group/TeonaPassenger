"use client"; // Directive pour indiquer que ce fichier doit être traité comme un composant client

import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // import du style
import { registerLocale } from "react-datepicker"; // Importation de la fonction pour configurer la langue fr du calendrier
import {fr} from "date-fns/locale/fr"; // Importation langue française

// Enregistrement langue française
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
    <div className="flex items-center space-x-4 p-4 bg-white shadow-md rounded-lg">
      {/* Aéroport départ alors la je sais pas comment ça marche... API ? */}
      <input
        type="text"
        placeholder="Aéroport départ"
        className="px-4 py-2 border rounded-md"
      />

      {/* Aéroport arrivée */}
      <input
        type="text"
        placeholder="Aéroport arrivée"
        className="px-4 py-2 border rounded-md"
      />

      {/* Date aller */}
      <DatePicker
        selected={departureDate}
        onChange={handleDepartureDateChange}
        dateFormat="yyyy/MM/dd"
        className="px-4 py-2 border rounded-md"
        placeholderText="Date d'aller"
        locale="fr"
      />

      {/* Date retour */}
      <DatePicker
        selected={returnDate}
        onChange={handleReturnDateChange}
        dateFormat="yyyy/MM/dd"
        className="px-4 py-2 border rounded-md"
        placeholderText="Date de retour"
        locale="fr"
      />

      {/* Bouton de recherche */}
      <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
        Rechercher
      </button>
    </div>
  );
};

export default SearchBar;
