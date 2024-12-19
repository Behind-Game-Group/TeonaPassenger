"use client";

import React, { useState } from "react";
import SearchBar from "../../components/searchBar/SearchBar";
import { FaPlane, FaHotel, FaCar, FaShip, FaEnvelope, FaBell, FaBed } from "react-icons/fa";
import { Link } from "react-router-dom";
import TrendingCities from "../../components/VillesTendances/VIllesTendances";
import FAQSection from "../../components/FAQSection/FAQSection";

const HomePage = () => {
  const [isSidebarExpanded] = useState(true);

  return (
    <div className={`relative bg-customOrange min-h-screen ${isSidebarExpanded ? "ml-64 z-10" : "mr-36"}`}>
      
      {/* Où voulez-vous partir"*/}
      <div className="relative top-10 left-0 isolate">
        <div className="absolute top-0 left-0 flex flex-wrap items-end content-start gap-[16px_14px] w-[853px] h-[103px]">
          <h2 className="w-[505px] h-[44px] text-white font-lucida font-medium text-[40px] leading-[40px] text-center">
          Où voulez-vous partir ?
          </h2>

        </div>
        <div>
            <ul className="flex space-x-4 h-[150px] ml-[15px]">
                <li className="flex items-center space-x-2 text-white text-[25px] leading-[40px] font-medium">
                  <a href="#" className="text-white">Aller-retour</a>
                  <img src="/img/caret-circle-down.svg" className="w-[26px] h-[27px]" />
                </li>
                <li className="flex items-center space-x-2 text-white text-[25px] leading-[40px] font-medium">
                  <a href="#" className="text-white">1 adulte</a>
                  <img src="/img/caret-circle-down.svg" className="w-[26px] h-[27px]" />
                </li>
                <li className="flex items-center space-x-2 text-white text-[25px] leading-[40px] font-medium">
                  <a href="#" className="text-white">Économique</a>
                  <img src="/img/caret-circle-down.svg" className="w-[26px] h-[27px]" />
                </li>
                <li className="flex items-center space-x-2 text-white text-[25px] leading-[40px] font-medium">
                  <a href="#" className="text-white">Aucun bagage</a>
                  <img src="/img/caret-circle-down.svg" className="w-[26px] h-[27px]" />
                </li>
            </ul>

        </div>
      </div>


      {/* Barre de recherche*/} 
      <div className="">
        <SearchBar />
      </div>

     {/* Section "Carrousel" */}
     <div>
        <div className="absolute w-[500px] h-[135px] left-[1085px] top-[300px] bg-[#009DD7] rounded-[15px]">
          <img src="/img/cities/batoumi.png" alt="bucarest picture" className="rounded-[15px]" />
          <h2 className="absolute left-[350px] top-[50px] text-white text-[32px] font-normal">
          Batoumi
          </h2>
        </div>

        <div className="absolute w-[500px] h-[135px] left-[8px] top-[300px] bg-[#009DD7] rounded-[15px]">
          <img src="/img/cities/bucarest.png" alt="bucarest picture" className="rounded-[15px]" />
          <h2 className="absolute left-[350px] top-[50px] text-white text-[32px] font-normal">
              Bucarest
          </h2>
        </div>
        <div className="absolute w-[500px] h-[135px] left-[550px] top-[300px] bg-[#009DD7] rounded-[15px]">
          <img src="/img/cities/tbilissi.png" alt="bucarest picture" className="rounded-[15px]" />
          <h2 className="absolute left-[350px] top-[50px] text-white text-[32px] font-normal">
          Tbilissi
          </h2>
        </div>
     </div>

     {/* Section "Ce que Teona vous propose" */}
     <div className="w-full max-w-6xl mt-10 px-4 lg:ml-64">
          <h2 className="absolute w-[613px] h-[22px] left-[2px] top-[500px] font-[Lucida Grande] font-normal text-[40px] leading-[22px] text-center text-white">
              Ce que THEONA vous propose :
          </h2>
     </div>

    
      {/* Ticket star" */}
      <div className="absolute w-[350px] h-[195px] left-[35px] top-[550px] border border-white rounded-[15px] box-border flex flex-col justify-center items-center gap-4">
            <div className="w-[55px] h-[50px] bg-white rounded-[10px] flex justify-center items-center">
                  <img src="/img/ticket-star.svg" alt="ticket-star icon" className="w-[49px] h-[49px]" />
            </div>
            <p className="w-[247px] text-center font-lucida font-medium text-[16px] leading-[22px] text-white">
                      Grande sélection, super offres. Parcourez des centaines de sites et comparez les prix.
            </p>
      </div>

      {/* like" */}
      <div className="absolute w-[350px] h-[195px] left-[420px] top-[550px] border border-white rounded-[15px] box-border flex flex-col justify-center items-center gap-4">
            <div className="w-[55px] h-[50px] bg-white rounded-[10px] flex justify-center items-center">
                  <img src="/img/like.svg" alt="ticket-star icon" className="w-[49px] h-[49px]" />
            </div>
            <p className="w-[247px] text-center font-lucida font-medium text-[16px] leading-[22px] text-white">
            Recherche en toute tranquillité Les prix que vous voyez ne changent pas en fonction de vos recherches.
            </p>
      </div>


      {/* setting" */}
      <div className="absolute w-[350px] h-[195px] left-[800px] top-[550px] border border-white rounded-[15px] box-border flex flex-col justify-center items-center gap-4">
            <div className="w-[55px] h-[50px] bg-white rounded-[10px] flex justify-center items-center">
                  <img src="/img/slider.svg" alt="ticket-star icon" className="w-[49px] h-[49px]" />
            </div>
            <p className="w-[247px] text-center font-lucida font-medium text-[16px] leading-[22px] text-white">
              Filtrez les résultats WiFi gratuit ? Arrivée tôt le matin ? Personnalisez votre recherche.
            </p>
      </div>

      {/* setting" */}
      <div className="absolute w-[350px] h-[195px] left-[1180px] top-[550px] border border-white rounded-[15px] box-border flex flex-col justify-center items-center gap-4">
            <div className="w-[55px] h-[50px] bg-white rounded-[10px] flex justify-center items-center">
            <img src="/img/medal-star.svg" alt="ticket-star icon" className="w-[49px] h-[49px] text-orange-500" />

            </div>
            <p className="w-[247px] text-center font-lucida font-medium text-[16px] leading-[22px] text-white">
            Vérifié et gratuit Utilisation entièrement gratuite - aucuns frais cachés.
            </p>
      </div>

      

    </div>
  )
}

export default HomePage;
