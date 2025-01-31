"use client";

import React, { useEffect, useState } from "react";
import SearchBar from "../../components/searchBar/SearchBar";
import {
  FaPlane,
  FaCar,
  FaShip,
  FaEnvelope,
  FaBell,
  FaBed,
} from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import TrendingCities from "../../components/VillesTendances/VIllesTendances";
import FAQSection from "../../components/FAQSection/FAQSection";
import Carousel from "../../components/Carrousel/Carrousel";
import DestinationSelector from "../../components/destinationSelector/destinationSelector";
import '../../../styles/home.css';
import useWindowDimensions from "../../hooks/useWindowDimensions";

const HomePage = () => {
  const [isSidebarExpanded] = useState(true);
  const { category } = useParams<{ category: string }>();

  const [destinationName, setDestinationName] = useState("");
  useEffect(() => {
    const h2Elements = document.querySelectorAll(".dynamic-destination h2");
    h2Elements.forEach((h2) => {
      h2.addEventListener("click", () => {
        const name = h2.textContent?.trim();
        if (name) {
          setDestinationName(name);
          window.location.href = `/resultat/${encodeURIComponent(name)}`;
        }
      });
    });
  }, []);

  const { width, height } = useWindowDimensions();

  const phoneSize = width < 390;

  const lgScreen = width > 1300;

  // console.log( "Width :", width, "Height :", height);
  

  return (
    <div
      className={`relative flex flex-col top-[-1.8rem] items-center bg-customOrange min-h-screen ${isSidebarExpanded ? "lg:ml-64 md:ml-20 sm:ml-10 z-10" : "mr-36"
        } ${phoneSize ? "pl-4" : "pl-4"}`}
    >

      <DestinationSelector />
  
      <div className="search-bar-container w-full lg:w-auto">
        <SearchBar />
      </div>

      <div className="carousel-section lg:grid-cols-2 xl:justify-center xl:mt-10 mt-10 flex">
        <div className={`flex gap-[4.5rem] flex-col ${lgScreen ? "lg:flex-row" : ""}`}>
          <Link to={`/resultat/${encodeURIComponent("Batoumi")}`} className="destination-link">
            <div className="destination-card w-[310px] h-[100px] bg-[#009DD7] rounded-[15px] flex dynamic-destination">
              <img
                src="/img/cities/batoumi.png"
                alt="batoumi picture"
                className="destination-img rounded-l-[15px] w-[150px] h-full object-cover"
              />
              <h2 className="destination-title flex items-center justify-center flex-grow text-white text-[20px] font-normal">
                Batoumi
              </h2>
            </div>
          </Link>

          <Link to={`/resultat/${encodeURIComponent("Bucarest")}`} className="destination-link">
            <div className="destination-card w-[350px] h-[100px] bg-[#009DD7] rounded-[15px] flex dynamic-destination">
              <img
                src="/img/cities/bucarest.png"
                alt="bucarest picture"
                className="destination-img rounded-l-[15px] w-[150px] h-full object-cover"
              />
              <h2 className="destination-title flex items-center justify-center flex-grow text-white text-[20px] font-normal">
                Bucarest
              </h2>
            </div>
          </Link>

          <Link to={`/resultat/${encodeURIComponent("Tbilissi")}`} className="destination-link">
            <div className="destination-card w-[350px] h-[100px] bg-[#009DD7] rounded-[15px] flex dynamic-destination">
              <img
                src="/img/cities/tbilissi.png"
                alt="tbilissi picture"
                className="destination-img rounded-l-[15px] w-[150px] h-full object-cover"
              />
              <h2 className="destination-title flex items-center justify-center flex-grow text-white text-[20px] font-normal">
                Tbilissi
              </h2>
            </div>
          </Link>
        </div>
      </div>

      <div className="offer-section w-full max-w-6xl mt-10 px-4 content-center">
        <h2 className="offer-title text-2xl text-white font-bold text-center mb-6 ml-10">
          Ce que Teona vous propose
        </h2>
        <div className="offer-grid grid grid-cols-2 mr-[61px] lg:ml-[-61px] gap-x-[8.5rem] gap-y-[2.5rem] sm:grid-cols-2 md:grid-cols-4 sm:gap-6 sm:mx-auto ml-10">
          <Link to="/resultat" className="offer-item-link">
            <div className="offer-item flex flex-col items-center p-4 bg-white shadow-md rounded-lg w-[120px] sm:w-auto">
              <FaPlane size={40} className="offer-icon text-blue-500 mb-4" />
              <p className="offer-text text-center font-semibold">Réservez vos vols</p>
              {category === "vols" && <p className="offer-status">Recherche de vols disponibles...</p>}
            </div>
          </Link>
          <div className="offer-item flex flex-col items-center p-3 bg-white shadow-md rounded-lg w-[120px] sm:w-auto">
            <FaBed size={40} className="offer-icon text-blue-500 mb-4" />
            <p className="offer-text text-center font-semibold">Trouvez des hébergements</p>
          </div>

          <div className="offer-item flex flex-col items-center p-4 bg-white shadow-md rounded-lg w-[120px] sm:w-auto">
            <FaCar size={40} className="offer-icon text-blue-500 mb-4" />
            <p className="offer-text text-center font-semibold">Louez une voiture</p>
          </div>

          <div className="offer-item flex flex-col items-center p-4 bg-white shadow-md rounded-lg w-[120px] sm:w-auto">
            <FaShip size={40} className="offer-icon text-blue-500 mb-4" />
            <p className="offer-text text-center font-semibold">Voyagez en ferry</p>
          </div>
        </div>
      </div>

      <div className="image-map-container w-[75%] mt-10 px-4 ">
        <img
          src="/img/map2.png"
          alt="map"
          className="image-map hidden sm:block sm:w-full sm:h-auto border border-white rounded-lg"
        />
      </div>

      <div className="explore-world-section w-full max-w-6xl mt-10 pl-4 text-white ml-8 lg:ml-0">
        <h2 className="explore-title text-3xl font-bold">Explorer le monde</h2>
        <p className="explore-text text-lg">
          Trouver des vols, des hébergements, des véhicules, des ferries, des
          carnets, et bien plus encore !
        </p>
      </div>

      <div className="newsletter-section w-full max-w-6xl mt-4 pl-4  text-white border border-white rounded-lg">
        <h2 className="newsletter-title text-center text-2xl">Recevez notre newsletter</h2>
        <p className="newsletter-text text-center">
          Restez au courant de notre activité et de nos dernières mises à jour !
        </p>
        <div className="newsletter-input-container flex items-center justify-between bg-customBlue rounded-lg p-2 m-2 max-w-md mx-auto">
          <div className="newsletter-input flex items-center bg-transparent flex-grow">
            <FaEnvelope className="newsletter-icon text-white mx-2" size={24} />
            <input
              type="email"
              placeholder="Entrez votre email"
              className="newsletter-input-field bg-transparent border-none text-white placeholder-white focus:outline-none w-full"
            />
          </div>
          <button className="newsletter-button flex flex-col bg-customBlue hover:brightness-95 text-white px-4 py-1 rounded-md">
            Envoyer
          </button>
        </div>
      </div>

      <div className="direct-route-section w-full max-w-6xl flex justify-between items-center mt-10 px-4 ">
        <div className="direct-route-info text-white">
          <h2 className="direct-route-title text-3xl font-bold">Droit au but</h2>
          <p className="direct-route-text text-lg">
            Évitez les escales et arrivez sans délai à votre destination grâce à
            ces itinéraires directs
          </p>
        </div>
        <button className="direct-route-button bg-customBlue text-white px-4 py-2 rounded-lg hover:brightness-95">
          Tout plus
        </button>
      </div>

      <div>
        <Carousel />
      </div>

      <div className="popular-tools-section w-full max-w-6xl mt-10 px-4 ">
        <h2 className="popular-tools-title text-white text-3xl font-bold mb-2">
          Outils populaires
        </h2>
        <p className="popular-tools-text text-white mb-4">Pour rendre vos voyages simplissime</p>
        <div className="popular-tools-links flex gap-4">
          <a
            href="#"
            className="popular-tool-link flex w-auto max-w-[12rem] p-4 rounded-md bg-customBlue text-white text-center hover:brightness-95"
          >
            <FaBell size={20} className="mr-2" />
            Alerte de prix
          </a>
          <a
            href="#"
            className="popular-tool-link flex w-auto max-w-[12rem] p-4 rounded-md bg-customBlue text-white text-center hover:brightness-95"
          >
            <FaPlane size={20} className="mr-2" />
            Trouver un vol
          </a>
        </div>
      </div>

      <div className="trending-cities-section">
        <TrendingCities />
      </div>

      <div>
        <FAQSection />
      </div>
    </div>
  );
};

export default HomePage;