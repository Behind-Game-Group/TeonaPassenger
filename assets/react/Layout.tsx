import React, { ReactNode, useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { FiSun, FiTag } from "react-icons/fi";
import { FaShip, FaPlane, FaBed, FaBus } from "react-icons/fa";
import { AiOutlineCar } from "react-icons/ai";
import "../styles/styles.scss"; // Assurez-vous que ce fichier est bien chargé dans Webpack
import Header from "./components/header/Header";
import Authenticator from "./components/authenticator/Authenticator";
import { useUserContext } from "./context/UserContext";
import { getMethod } from "./services/axiosInstance";

function Layout({ children }: { children: ReactNode }) {
  const { category } = useParams();
  // Gestion de l'état de la barre latérale
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(false); // État pour la largeur de la barre latérale
  const {user, updateUser, authenticatorView} = useUserContext();
  const [loginView, setLoginView] = useState<boolean>(false);
  const [registerView, setRegisterView] = useState<boolean>(false);

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

  useEffect(() => {
    getMethod('/getCurrentUser')
          .then(data => {
            // console.log('Données récupérées :', data);
            updateUser(data.user);
          })
          .catch(error => {
            console.error(
              'Erreur lors de la récupération des données :',
              error,
            );
          });
  }, []);

  console.log(authenticatorView);

  return (
    <div className="flex flex-col max-h-full bg-customOrange mx-auto">
      {/* Bare latéral */}
      <aside
        ref={sidebarRef}
        className={`fixed top-[124px] left-0 ${
          isSidebarExpanded ? "w-64 z-10" : "w-10"
        } h-full bg-customOrange text-white border-r border-white transition-all z-50`}
      >
        <nav>
          <ul className="">
            <li>
              <Link
                to="/vols"
                className="{category === 'vols'} flex items-center hover:bg-white hover:text-orange-400 p-2 transition-colors border-t border-b border-white"
              >
                <FaPlane size={20} />
                {isSidebarExpanded && <span className="ml-2">Vols</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/hebergements"
                className="{category === 'hebergements'} flex items-center hover:bg-white hover:text-orange-400 p-2 border-b border-white"
              >
                <FaBed size={20} />
                {isSidebarExpanded && (
                  <span className="ml-2">Hébergements</span>
                )}
              </Link>
            </li>
            <li>
              <Link
                to="/voitures"
                className="{category === 'voitures'} flex items-center hover:bg-white hover:text-orange-400 p-2 border-b border-white"
              >
                <AiOutlineCar size={20} />
                {isSidebarExpanded && <span className="ml-2">Voitures</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/vol+hotel"
                className="{category === 'vol+hotel'} flex items-center hover:bg-white hover:text-orange-400 p-2 border-b border-white"
              >
                <FiSun size={20} />
                {isSidebarExpanded && <span className="ml-2">Vol+Hôtel</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/black+sea"
                className="{category === 'black+sea'} flex items-center hover:bg-white hover:text-orange-400 p-2 border-b border-white"
              >
                <FaShip size={20} />
                {isSidebarExpanded && <span className="ml-2">Black Sea</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/bus"
                className="{category === 'bus'} flex items-center hover:bg-white hover:text-orange-400 p-2 border-b border-white"
              >
                <FaBus size={20} />
                {isSidebarExpanded && <span className="ml-2">Bus</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/ferry"
                className=" {category === 'ferry'} flex items-center hover:bg-white hover:text-orange-400 p-2 border-b border-white"
              >
                <FaShip size={20} />
                {isSidebarExpanded && <span className="ml-2">Ferry</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/carnet"
                className="{category === 'carnet'} flex items-center hover:bg-white hover:text-orange-400 p-2 border-b border-white"
              >
                <FiTag size={20} />
                {isSidebarExpanded && <span className="ml-2">Carnet</span>}
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      <Header isSidebarExpanded={isSidebarExpanded} toggleExpandSidebar={toggleExpandSidebar} />
      {/* Main Content */}
      <main
        className={`flex-1 p-5 ${
          isSidebarVisible ? "ml-64" : "ml-0"
        } transition-all duration-300`}
      >
        {authenticatorView && <div className="fixed w-[100%] h-[100%] place-content-center z-10 rounded-lg bg-transparent text-white gap-2 flex flex-col items-center justify-around top-[5rem] hover:brightness-95"><Authenticator /></div>}
        <section
          className={`mt-32 ${
            isSidebarVisible
              ? "ml-64 lg:ml-64 md:ml-20 sm:ml-10"
              : "mr-36 lg:mr-36 md:mr-20 sm:mr-10"
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
            <a href="#">
            <p>A propos</p>
            </a>
            <a href="#">
            <p>Offres d'emploi</p>
            </a>
            <a href="#">
            <p>Mobil Discover</p>
            </a>
            <a href="#">
            <p>Notre fonctionnement</p>
            </a>
            <a href="#">
            <p>Codes de réductions THEONA</p>
            </a>
          </div>
          <div className="flex flex-col space-y-4 w-1/4">
            <h3 className="border-b-2 border-white pb-2">Contact</h3>
            <a href="">
            <p>Aide/FAQ</p>
            </a>
            <a href="">
            <p>Presse</p>
            </a>
            <a href="">
            <p>Affiliation</p>
            </a>
          </div>
          <div className="flex flex-col space-y-4 w-1/4">
            <h3 className="border-b-2 border-white pb-2">Plus</h3>
            <a href="">
            <p>Frais de compagnies</p>
            </a>
            <a href="">
            <p>Compagnies aériennes</p>
            </a>
            <a href="">
            <p>Trains et bus</p>
            </a>
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
