"use client";

import React, { useState } from "react";
import SearchBar from "../../components/searchBar/SearchBar";
import { FaPlane, FaHotel, FaCar, FaShip, FaEnvelope, FaBell, FaBed } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import TrendingCities from "../../components/VillesTendances/VIllesTendances";
import FAQSection from "../../components/FAQSection/FAQSection";

const HomePage = () => {
  const [isSidebarExpanded] = useState(true);
  const { category } = useParams<{ category: string }>();

  return (
    <div className={`flex flex-col items-center bg-customOrange min-h-screen ${isSidebarExpanded ? "ml-64 lg:ml-64 md:ml-20 sm:ml-10 z-10" : "mr-36"}`}>
      {/* Barre de recherche */}
      <div>
        <SearchBar />
      </div>

      {/* Section "Ce que Teona vous propose" */}
      <div className="w-full max-w-6xl mt-10 px-4 content-center">
        <h2 className="text-2xl text-white font-bold text-center mb-6">
          Ce que Teona vous propose
        </h2>
        <div className="grid grid-cols-2 mr-[61px] ml-[-61px] gap-x-[8.5rem] gap-y-[2.5rem] sm:grid-cols-2 md:grid-cols-4 sm:gap-6 sm:mx-auto">
          {/* Vols */}
          <div className="flex flex-col items-center p-2 bg-white shadow-md rounded-lg w-[120px] sm:w-auto">
            <FaPlane size={40} className="text-blue-500 mb-4" />
            <p className="text-center font-semibold">Réservez vos vols</p>
            {category === "vols" && <p>Recherche de vols disponibles...</p>} {/* ceci est un test */}
          </div>

          {/* Hébergements */}
          <div className="flex flex-col items-center p-2 bg-white shadow-md rounded-lg w-[120px] sm:w-auto">
            <FaHotel size={40} className="text-blue-500 mb-4" />
            <p className="text-center font-semibold">
              Trouvez des hébergements
            </p>
          </div>

          {/* Véhicules */}
          <div className="flex flex-col items-center p-4 bg-white shadow-md rounded-lg w-[120px] sm:w-auto">
            <FaCar size={40} className="text-blue-500 mb-4" />
            <p className="text-center font-semibold">Louez une voiture</p>
          </div>

          {/* Ferry */}
          <div className="flex flex-col items-center p-4 bg-white shadow-md rounded-lg w-[120px] sm:w-auto">
            <FaShip size={40} className="text-blue-500 mb-4" />
            <p className="text-center font-semibold">Voyagez en ferry</p>
          </div>
        </div>
      </div>

      {/* Image Map */}
      <div className="w-[75%] mt-10 px-4 ">
        <img
          src="/img/map2.png"
          alt="map"
          className=" hidden sm:block sm:w-full sm:h-auto border border-white rounded-lg"
        />
      </div>

      {/* Explorer le monde */}
      <div className="w-full max-w-6xl mt-10 pl-4 text-white">
        <h2 className="text-3xl font-bold">Explorer le monde</h2>
        <p className="text-lg">
          Trouver des vols, des hébergements, des véhicules, des ferries, des
          carnets, et bien plus encore !
        </p>
      </div>

      {/* Newsletter */}
      <div className="w-full max-w-6xl mt-4 pl-4  text-white border border-white rounded-lg">
        <h2 className="text-center text-2xl">Recevez notre newsletter</h2>
        <p className="text-center">
          Restez au courant de notre activité et de nos dernières mises à jour !
        </p>
        <div className="flex items-center justify-between bg-customBlue rounded-lg p-2 m-2 max-w-md mx-auto">
          {/* Champ d'entrée et icône */}
          <div className="flex items-center bg-transparent flex-grow">
            <FaEnvelope className="text-white mx-2" size={24} />
            <input
              type="email"
              placeholder="Entrez votre email"
              className="bg-transparent border-none text-white placeholder-white focus:outline-none w-full"
            />
          </div>
          {/* Bouton à droite */}
          <button className="flex flex-col bg-customBlue hover:brightness-95 text-white px-4 py-1 rounded-md">
            Envoyer
          </button>
        </div>
      </div>

      {/* Section Droit au but */}
      <div className="w-full max-w-6xl flex justify-between items-center mt-10 px-4 ">
        <div className="text-white">
          <h2 className="text-3xl font-bold">Droit au but</h2>
          <p className="text-lg">
            Évitez les escales et arrivez sans délai à votre destination grâce à
            ces itinéraires directs
          </p>
        </div>
        <button className="bg-customBlue text-white px-4 py-2 rounded-lg hover:brightness-95">
          Tout plus
        </button>
      </div>

      {/* Carrousel */}
      <div className="relative mt-6 pl-4 hidden sm:block">
        {/* Bouton gauche */}
        <button className="absolute top-[50%] bg-customBlue text-white p-3 w-10 h-10 rounded-full hover:brightness-95 flex items-center justify-center">
          &#8592;
        </button>

        {/* Cartes */}
        <div className="flex space-x-4 overflow-x-auto">
          {/* Carte 1 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden ">
            <div className="bg-customBlue text-center text-white py-2 font-bold">
              Bucarest
            </div>
            <img
              src="/img/bucarest.png"
              alt="Bucarest"
              className="h[200px] w-[379px] lg:w-[379px] lg:h-[300px] object-cover"
            />
          </div>
          {/* Carte 2 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-customBlue text-center text-white py-2 font-bold">
              Batoumi
            </div>
            <img
              src="/img/batoumi.png"
              alt="Batoumi"
              className="h[200px] w-[379px] lg:w-[379px] lg:h-[300px] object-cover"
            />
          </div>
          {/* Carte 3 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-customBlue text-center text-white py-2 font-bold">
              Bursa
            </div>
            <img
              src="/img/bursa.jpg"
              alt="Bursa"
              className="h[200px] w-[379px] lg:w-[379px] lg:h-[300px] object-cover"
            />
          </div>
          {/* Carte 4 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-customBlue text-center text-white py-2 font-bold">
              Verna
            </div>
            <img
              src="/img/verna.png"
              alt="Verna"
              className="h[200px] w-[379px] lg:w-[379px] lg:h-[300px] object-cover"
            />
          </div>
        </div>

        {/* Bouton droit */}
        <button className="absolute right-0 top-[50%] bg-customBlue text-white p-3 w-10 h-10 rounded-full hover:brightness-95 flex items-center justify-center">
          &#8594;
        </button>
      </div>

      {/* Section Outils populaires */}
<div className="w-full max-w-6xl mt-10 px-4 ">
  <h2 className="text-white text-3xl font-bold mb-2">Outils populaires</h2>
  <p className="text-white mb-4">Pour rendre vos voyages simplissime</p>
  <div className="flex gap-4">
    <a
      href="#"
      className="flex w-auto max-w-[12rem] p-4 rounded-md bg-customBlue text-white text-center hover:brightness-95"
    >
      <FaBell size={20} className="mr-2" />
      Alerte de prix
    </a>
    <a
      href="#"
      className="flex w-auto max-w-[12rem] p-4 rounded-md bg-customBlue text-white text-center hover:brightness-95"
    >
      <FaPlane size={20} className="mr-2" />
      Trouver un vol
    </a>
  </div>
</div>

<div>
  <TrendingCities />
</div>

<div>
  <FAQSection />
</div>

    </div>
  );
};

export default HomePage;
