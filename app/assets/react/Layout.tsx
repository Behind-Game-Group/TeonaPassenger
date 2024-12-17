import React, { ReactNode, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiUser, FiHome, FiSun, FiTruck, FiTag } from "react-icons/fi";
import { FaShip, FaPlane, FaBed } from "react-icons/fa";
import { AiOutlineCar } from "react-icons/ai";
import "../styles/styles.scss"; // Assurez-vous que ce fichier est bien chargé dans Webpack

function Layout({ children }: { children: ReactNode }) {
  // Gestion de l'état de la barre latérale
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false); // État pour la largeur de la barre latérale

  const sidebarRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => {
    setIsSidebarVisible((prev) => !prev);
  };

  const toggleExpandSidebar = () => {
    setIsSidebarExpanded((prev) => !prev); // Bascule entre les deux modes
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
    <div className="flex flex-col max-h-full bg-customOrange mx-auto">
      {/* Bare latéral */}
      <aside
        ref={sidebarRef}
        className={`fixed top-[144px] left-0 ${
          isSidebarExpanded ? "w-64 z-10" : "w-10"
        } h-full bg-customOrange text-white border-r border-t border-white transition-all z-10`}
      >
        
        <nav>
          <ul className="">
            <li>
              <Link
                to="/vols/page"
                className="flex items-center hover:bg-white hover:text-orange-400 p-2 transition-colors border-2 border-white"
              >
                <FaPlane size={20} />
                {isSidebarExpanded && <span className="ml-2">Vols</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/hebergements"
                className="flex items-center hover:bg-white hover:text-orange-400 p-2 border-2 border-white"
              >
                <FaBed size={20} />
                {isSidebarExpanded && (
                  <span className="ml-2">Hébergements</span>
                )}
              </Link>
            </li>
            <li>
              <Link
                to="#"
                className="flex items-center hover:bg-white hover:text-orange-400 p-2 border-2 border-white"
              >
                <AiOutlineCar size={20} />
                {isSidebarExpanded && <span className="ml-2">Voitures</span>}
              </Link>
            </li>
            <li>
              <Link
                to="#"
                className="flex items-center hover:bg-white hover:text-orange-400 p-2 border-2 border-white"
              >
                <FiSun size={20} />
                {isSidebarExpanded && <span className="ml-2">Vol+Hôtel</span>}
              </Link>
            </li>
            <li>
              <Link
                to="#"
                className="flex items-center hover:bg-white hover:text-orange-400 p-2 border-2 border-white"
              >
                <FaShip size={20} />
                {isSidebarExpanded && <span className="ml-2">Black Sea</span>}
              </Link>
            </li>
            <li>
              <Link
                to="#"
                className="flex items-center hover:bg-white hover:text-orange-400 p-2 border-2 border-white"
              >
                <FiTruck size={20} />
                {isSidebarExpanded && <span className="ml-2">Bus</span>}
              </Link>
            </li>
            <li>
              <Link
                to="#"
                className="flex items-center hover:bg-white hover:text-orange-400 p-2 border-2 border-white"
              >
                <FaShip size={20} />
                {isSidebarExpanded && <span className="ml-2">Ferry</span>}
              </Link>
            </li>
            <li>
              <Link
                to="#"
                className="flex items-center hover:bg-white hover:text-orange-400 p-2 border-2 border-white"
              >
                <FiTag size={20} />
                {isSidebarExpanded && <span className="ml-2">Carnet</span>}
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 p-5 ${
          isSidebarVisible ? "ml-64" : "ml-0"
        } transition-all duration-300`}
      >
        {/* Header */}
        <header className="flex justify-between bg-customOrange border-b-2 border-white">
        <button
          onMouseEnter={toggleExpandSidebar}
          className="text-white mb-4 fixed top-[4rem] left-[1.5rem] z-50"
          aria-label="Élargir la barre latérale"
        >
          <FiMenu size={24} />
        </button>

          {/* Logo et titre */}
          <div
            className={`relative flex w-full p-4 transition-all duration-300 `}
          >
            <Link to={"/"} className="flex relative left-10">
              <img src="/img/logo.svg" alt="Logo" width={92} height={92} className="top-[1.3rem]" />
              <div className="relative flex flex-col top-7">
                <span className="font-bold text-xl text-white">
                  TEONA PASSAGER
                </span>
                <span className="text-sm text-white">All Wonders Whatever</span>
              </div>
            </Link>
          </div>

          {/* Profil */}
          <a
            href="#"
            className="relative w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center top-9 right-4"
            aria-label="Accéder au profil"
          >
            <img className="w-[25px]" src="/img/connexion-icon.png" alt="" />
          </a>
        </header>

        <section
          className={`${
            isSidebarVisible ? "ml-64" : "mr-36"
          } transition-all duration-300`}
        >
          {children}
        </section>
      </main>

      {/* Footer */}
      <footer
        className={`text-white p-8 border-t-2 border-white ${
          isSidebarExpanded ? "ml-64" : "ml-[45px]"
        } transition-all duration-300`}
      >
        <div className="flex justify-between gap-8">
          <div className="flex flex-col space-y-4 w-1/4">
            <h3 className="border-b-2 border-white pb-2">Entreprise</h3>
            <p>A propos</p>
            <p>Offres d'emploi</p>
            <p>Mobil Discover</p>
            <p>Notre fonctionnement</p>
            <p>Codes de réductions THEONA</p>
          </div>
          <div className="flex flex-col space-y-4 w-1/4">
            <h3 className="border-b-2 border-white pb-2">Contact</h3>
            <p>Aide/FAQ</p>
            <p>Presse</p>
            <p>Affiliation</p>
          </div>
          <div className="flex flex-col space-y-4 w-1/4">
            <h3 className="border-b-2 border-white pb-2">Plus</h3>
            <p>Frais de compagnies</p>
            <p>Compagnies aériennes</p>
            <p>Trains et bus</p>
          </div>
          <div className="flex flex-col space-y-4 w-1/4">
            <h3 className="border-b-2 border-white pb-2">
              Télécharger l'application THEONA
            </h3>
            <a href="#">
              <img className="w-1/3" src="/img/appstore.png" alt="appstore" />
            </a>
            <a href="#">
              <img
                className="w-1/3"
                src="/img/googleplay.png"
                alt="googleplay"
              />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
