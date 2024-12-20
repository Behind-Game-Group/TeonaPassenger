"use client"; // Directive pour indiquer que ce fichier doit être traité comme un composant client

import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Style pour le calendrier
import { registerLocale } from "react-datepicker";
import { fr } from "date-fns/locale/fr";
import { FaPlane } from "react-icons/fa";

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

      <div className="flex flex-col xl:flex-row items-center justify-center space-y-4 xl:space-y-0 xl:space-x-4 p-2 bg-customBlue shadow-md rounded-lg w-full max-w-6xl mt-6">
        <div className="relative">
      {/* Aéroport départ */}
      <FaPlane size={20} className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-500"/>
      {/* Champ Input */}
      <input type="text" placeholder="De..." className="w-[215px] h-[42px] pl-12 bg-white shadow-[0px_4px_4px_rgba(0,0,0,0.25)] rounded-[25px] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
    </div>
  
    <div className="relative w-[90px] h-[42px] bg-white shadow-[0px_4px_4px_rgba(0,0,0,0.25)] rounded-[25px] flex items-center justify-center">
      <img src="/img/arrows.png" alt="arrow-switch-horizontal" className="w-[23px] text-white"/>
    </div>
  
    <div className="relative">
      {/* Aéroport arrivée */}
      <FaPlane size={20} className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-500"/>
      {/* Champ Input */}
      <input type="text" placeholder="A..." className="w-[215px] h-[42px] pl-12 bg-white shadow-[0px_4px_4px_rgba(0,0,0,0.25)] rounded-[25px] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
    </div>
  
    <div className="w-[215px] h-[42px] bg-white shadow-[0px_4px_4px_rgba(0,0,0,0.25)] rounded-[25px] flex justify-center items-center">
      {/* Date aller */}
      <DatePicker
        selected={departureDate}
        onChange={handleDepartureDateChange}
        dateFormat="yyyy/MM/dd"
        placeholderText="Date d'aller"
        locale="fr"
        className="w-full h-full px-4 py-2 rounded-[25px] border-none focus:outline-none"
      />
    </div>
  
    <div className="w-[215px] h-[42px] bg-white shadow-[0px_4px_4px_rgba(0,0,0,0.25)] rounded-[25px] flex justify-center items-center">
      {/* Date retour */}
      <DatePicker
        selected={returnDate}
        onChange={handleReturnDateChange}
        dateFormat="yyyy/MM/dd"
        placeholderText="Date de retour"
        locale="fr"
        className="w-full h-full px-4 py-2 rounded-[25px] border-none focus:outline-none"
      />
    </div>
  
  
    <button className="w-[162px] h-[46px] border-[1px] border-white rounded-[27px] flex flex-row justify-end items-center p-[8px] gap-[14px] hover:brightness-95">
      {/* Bouton de recherche */}
      <span className="w-[71px] h-[20px] text-white text-[15px] leading-[20px] font-roboto font-normal">Rechercher</span>
      <img src="/img/search.svg" alt="search-icon" className="w-[24px] text-white"/>
    </button>

  </div>
  
      );
    };

    export default SearchBar;