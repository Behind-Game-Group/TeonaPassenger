"use client"; // indique que c'est un composant client ça ne marche pas sans ça

import { ReactNode, useState } from "react";
import Image from "next/image"; // Importation du composant Image de Next.js
import {
  FiMenu,
  FiUser,
  FiAirplay,
  FiHome,
  FiSun,
  FiTruck,
  FiTag,
} from "react-icons/fi"; // Importation des icônes
import { FaShip } from 'react-icons/fa';
import { AiOutlineCar } from 'react-icons/ai';
import { metadata } from "./metadata"; // Importation du fichier metadata
import "./globals.css"; // importation du style

export default function RootLayout({ children }: { children: ReactNode }) {
  // Gestion de l'état barre latérale
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarVisible((prev) => !prev);
  };

  return (
    <html lang="fr">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body className="flex -min-h-screen bg-orange-400 m-0">
        {/* Barre latéral */}
        {isSidebarVisible && (
  <aside className="w-1/5 bg-orange-400 text-white p-4 mr-4 border border-white h-full">
    <h1 className="font-bold text-xl mb-6"></h1>
    <nav>
      <ul className="space-y-4">
        <li>
          <a
            href="#"
            className="flex items-center p-4 border-2 border-white rounded-md hover:bg-white hover:text-orange-400 transition-colors"
          >
            <FiAirplay size={20} className="mr-2" />
            Vols
          </a>
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
)}

        {/* Contenu principal */}
        <main className="flex-1">
          {/* Header avec bouton burger */}
          <header className="flex items-center justify-between bg-orange-400 p-4">
            {/* Bouton Burger */}
            <button
              type="button"
              onClick={toggleSidebar}
              className="text-white p-2"
              aria-label="Afficher/masquer la barre latérale"
            >
              <FiMenu size={24} />
            </button>

            {/* Logo et titre */}
            <header className="flex items-center justify-center w-full bg-orange-400 p-4">
              {/* conteneur */}
              <div className="flex items-center space-x-4">
                <Image src="/logo.svg" alt="Logo" width={52} height={52} />
                <div className="flex flex-col items-start">
                  <span className="font-bold text-lg">Teona Passager</span>
                  <span className="text-sm">All Wonders Whatever</span>
                </div>
              </div>
            </header>

            {/* Icone profil */}
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center"
              aria-label="Accéder au profil"
            >
              <FiUser size={20} className="text-white" />
            </a>
          </header>

          {/* Contenu de la page */}
          {children}
        </main>
      </body>
    </html>
  );
}
