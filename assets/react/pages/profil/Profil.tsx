  "use client";

  import React, { useState } from "react";
  import { searchHistory } from "../../components/Profil/searchHistory";
  import axios from "axios";
  import { Link } from "react-router-dom";
  import {
    FaPlane,
    FaBus,
    FaArrowRight,
    FaCar,
    FaHotel,
    FaShip,
    FaSearch,
  } from "react-icons/fa";
  import HeaderProfil from "../../components/headerProfil/HeaderProfil";
  import '../../../styles/preferences.css';

  // Définition du type 'Search' avec un type discriminant pour 'type'
  type Search = {
    route: string;
    date: string;
    details: string;
    type: "plane" | "bus" | "car" | "hotel" | "ferry"; // Utilisation des types littéraux
  };

  // Définition des icônes par type de transport
  const iconMap: { [key in "plane" | "bus" | "car" | "hotel" | "ferry"]: React.ElementType } = {
    plane: FaPlane,
    bus: FaBus,
    car: FaCar,
    hotel: FaHotel,
    ferry: FaShip,
  };

  const Profil = () => {
    const [currentUser, setUser] = useState({
      firstname: "Martin",
      email: "martinvallee01@gmail.com",
      airport: "Batumi, Géorgie",
      OtherAirport: "Charles de Gaulle, Paris",
    });
    const [searchHistoryState, setSearchHistory] = useState<Search[]>(
      searchHistory as Search[]
    );
    const [selectedSearch, setSelectedSearch] = useState<Search | null>(null);
    const [showAll, setShowAll] = useState(false); // Etat pour afficher tout l'historique

    const handleViewDetails = (search: Search) => {
      setSelectedSearch(search); // Ouvre la modal avec les détails
    };

    const handleClearAll = () => {
      const confirmClear = confirm("Êtes-vous sûr de vouloir tout supprimer ?");
      if (confirmClear) {
        setSearchHistory([]); // Efface l'historique
      }
    };

    const closeModal = () => {
      setSelectedSearch(null); // Ferme la modal
    };

    return (
      <div className="relative flex flex-col top-[-1.8rem] items-center bg-customOrange min-h-screen ml-64 lg:ml-64 md:ml-20 sm:ml-20 z-10 preferences-container">
        {/* Header */}
        <HeaderProfil />

        {/* liens profil */}
        <div className="flex justify-evenly items-center mt-6 text-white text-sm font-semibold w-full max-w-6xl liens">
          <Link to="/profil" className="hover:underline">
            Tableau de bord
          </Link>
          <Link to="/profil/parametres" className="hover:underline">
            Paramètres généraux
          </Link>
          <Link to="/profil/preferences" className="hover:underline">
            Préférences
          </Link>
          <Link to="/profil/voyageurs" className="hover:underline">
            Voyageurs
          </Link>
          <Link to="#" className="hover:underline">
            Infos de paiement
          </Link>
          <Link to="#" className="hover:underline">
            Notifications
          </Link>
        </div>

        {/* Historique de recherche */}
        <div className="mt-10 bg-white rounded-lg shadow-md p-6 w-full max-w-6xl relative space-y-6 preferences-settings-tableau">
          <h2 className="text-lg font-bold text-orange-600">
            Vos recherches précédentes
          </h2>
          <h3
            onClick={() => setShowAll(!showAll)} // Modifie l'état pour afficher tout l'historique
            className="cursor-pointer text-black hover:underline"
          >
            {showAll ? "Voir moins" : "Afficher: Tout l'historique"}
          </h3>
          {searchHistoryState.length > 0 ? (
            <div className="overflow-x-auto mt-4 border border-black rounded-lg p-5">
              <table className="min-w-full text-sm text-left">
                <tbody>
                  {searchHistoryState.slice(0, showAll ? searchHistoryState.length : 7).map(
                    (search, index) => (
                      <tr key={index} className="border-b border-black">
                        <td className="py-2 px-4 flex items-center gap-2">
                          {/* Icônes en fonction du type */}
                          {React.createElement(iconMap[search.type], { className: 'text-blue-500' })}
                          {/* Itinéraire avec flèche */}
                          {search.route.split("→").map((part, i, arr) => (
                            <React.Fragment key={i}>
                              {i > 0 && (
                                <FaArrowRight className="text-orange-500 mx-1" />
                              )}
                              <span>{part.trim()}</span>
                            </React.Fragment>
                          ))}
                        </td>
                        <td className="py-2 px-4">{search.date}</td>
                        <td className="py-2 px-4">{search.details}</td>
                        <td className="py-2 px-4 flex justify-end">
                          <button
                            onClick={() => handleViewDetails(search)}
                            className="flex items-center gap-2 text-orange-600 hover:underline cursor-pointer"
                          >
                            <FaSearch className="text-white bg-customOrange rounded-full p-[0.3rem] w-[1.5rem] h-[1.5rem] flex items-center justify-center" />
                            Voir les détails
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-4 text-gray-600">Aucune recherche récente.</p>
          )}

          {/* Le bouton "Tout supprimer" en haut à droite */}
          <button
            className="absolute top-[3.5rem] right-[2.5rem] text-orange-600 hover:underline"
            onClick={handleClearAll}
          >
            Tout supprimer
          </button>
        </div>

        {/* Modal */}
        {selectedSearch && (
          <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-lg font-bold mb-4">Détails de la recherche</h2>
              <p>
                <strong>Itinéraire :</strong> {selectedSearch.route}
              </p>
              <p>
                <strong>Date :</strong> {selectedSearch.date}
              </p>
              <p>
                <strong>Détails :</strong> {selectedSearch.details}
              </p>
              <button
                className="mt-4 text-orange-600 hover:underline"
                onClick={closeModal}
              >
                Fermer
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  export default Profil;
