import React, { ReactNode, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiUser, FiHome, FiSun, FiTruck, FiTag } from "react-icons/fi";
import { FaShip, FaPlane } from "react-icons/fa";
import { AiOutlineCar } from "react-icons/ai";
import "../styles/styles.scss"; // Assurez-vous que ce fichier est bien chargé dans Webpack

function Layout({ children }: { children: ReactNode }) {
  // Gestion de l'état de la barre latérale
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  // Référence à la barre latérale pour détecter les clics à l'extérieur
  const sidebarRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => {
    setIsSidebarVisible((prev) => !prev);
  };

  // Fermeture de la barre latérale si l'utilisateur clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsSidebarVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col max-h-full bg-orange-400 m-0">
      {/* Menu latéral */}
      <aside
        ref={sidebarRef}
        className={`${
          isSidebarVisible ? "translate-x-0" : "-translate-x-full"
        } fixed top-0 left-0 w-64 h-[165%] bg-orange-400 text-white p-4 border-r-2 border-white border-t-2 transform transition-transform lg:translate-x-0 lg:top-[133px] lg:absolute z-50 lg:z-auto`}
      >
        <h1 className="font-bold text-xl mb-6"></h1>
        <nav>
          <ul className="space-y-4">
            <li>
              <Link
                to="/vols/page"
                className="flex items-center p-4 border-2 border-white rounded-md hover:bg-white hover:text-orange-400 transition-colors"
              >
                <FaPlane size={20} className="mr-2" />
                Vols
              </Link>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center p-4 border-2 border-white rounded-md hover:bg-white hover:text-orange-400 transition-colors"
              >
                <FiHome size={20} className="mr-2" />
                Hébergements
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center p-4 border-2 border-white rounded-md hover:bg-white hover:text-orange-400 transition-colors"
              >
                <AiOutlineCar size={20} className="mr-2" />
                Voitures
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center p-4 border-2 border-white rounded-md hover:bg-white hover:text-orange-400 transition-colors"
              >
                <FiSun size={20} className="mr-2" />
                Vol+Hôtel
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center p-4 border-2 border-white rounded-md hover:bg-white hover:text-orange-400 transition-colors"
              >
                <FiTag size={20} className="mr-2" />
                Black Sea
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center p-4 border-2 border-white rounded-md hover:bg-white hover:text-orange-400 transition-colors"
              >
                <FiTruck size={20} className="mr-2" />
                Bus
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center p-4 border-2 border-white rounded-md hover:bg-white hover:text-orange-400 transition-colors"
              >
                <FaShip size={20} className="mr-2" />
                Ferry
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center p-4 border-2 border-white rounded-md hover:bg-white hover:text-orange-400 transition-colors"
              >
                <FiTag size={20} className="mr-2" />
                Carnet
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Contenu principal */}
      <main
        className={`flex-1 p-4 ${
          isSidebarVisible ? "ml-64" : "ml-0"
        } transition-all duration-300`}
      >
        {/* Header avec bouton burger */}
        <header className="flex items-center justify-between bg-orange-400 p-4 border-b-2 border-white">
          {/* Bouton Burger, visible seulement sur mobile */}
          <button
            type="button"
            onClick={toggleSidebar}
            className="text-white p-2 lg:hidden"
            aria-label="Afficher/masquer la barre latérale"
          >
            <FiMenu size={24} />
          </button>

          {/* Logo et titre */}
          <div className="flex items-center justify-center w-full bg-orange-400 p-4">
            <Link to={"/"} className="flex items-center space-x-4">
              <img src="/img/logo.svg" alt="Logo" width={52} height={52} />
              <div className="flex flex-col items-start">
                <span className="font-bold text-lg">Teona Passager</span>
                <span className="text-sm">All Wonders Whatever</span>
              </div>
            </Link>
          </div>

          {/* Icône profil */}
          <a
            href="#"
            className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center"
            aria-label="Accéder au profil"
          >
            <FiUser size={20} className="text-white" />
          </a>
        </header>

        {/* Contenu de la page */}
        <div
          className={`${isSidebarVisible ? "ml-64" : "ml-0"} transition-all duration-300`}
        >
          {children}
        </div>
      </main>
    </div>
  );
}

export default Layout;
