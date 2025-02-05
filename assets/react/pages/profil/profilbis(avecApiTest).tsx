"use client";

import React, { useState, useEffect } from "react";
import axios from "axios"; // Axios pour simplifier les requêtes HTTP (ou fetch natif)

interface Search {
  id: number;
  route: string;
  date: string;
  details: string;
}

const HomePage = () => {
  const [searchHistory, setSearchHistory] = useState<Search[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSearch, setSelectedSearch] = useState<Search | null>(null); // État pour la modal

  // Fonction pour récupérer les données
  const fetchSearchHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Search[]>("/api/search-history"); // Exemple d'endpoint API
      setSearchHistory(response.data); // Remplit l'historique
    } catch (err: any) {
      setError(err.message || "Une erreur s'est produite.");
    } finally {
      setLoading(false);
    }
  };

  // Récupère l'historique au montage du composant
  useEffect(() => {
    fetchSearchHistory();
  }, []);

  const handleViewDetails = (search: Search) => {
    setSelectedSearch(search); // Ouvre la modal avec les détails
  };

  const handleClearAll = async () => {
    const confirmClear = confirm("Êtes-vous sûr de vouloir tout supprimer ?");
    if (confirmClear) {
      try {
        await axios.delete("/api/search-history"); // Suppression via l'API
        setSearchHistory([]); // Vide localement après suppression
      } catch (err: any) {
        setError(err.message || "Impossible de supprimer les données.");
      }
    }
  };

  const closeModal = () => {
    setSelectedSearch(null); // Ferme la modal
  };

  return (
    <div
      className={`relative flex flex-col top-[-1.8rem] items-center bg-customOrange min-h-screen ml-64 lg:ml-64 md:ml-20 sm:ml-10 z-10`}
    >
      {/* Header */}
      <div className="flex justify-between items-center text-white p-6 w-full max-w-6xl">
        <div className="space-y-4 flex flex-col">
          <h1 className="text-2xl font-bold">Bonjour Manuel</h1>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="font-semibold">Adresse e-mail :</p>
              <p className="mt-1">martinvallee01@gmail.com</p>
            </div>
            <div>
              <p className="font-semibold">Aéroport local :</p>
              <p className="mt-1 underline">Batumi, Géorgie</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center w-32 h-32 rounded-full bg-blue-500 text-white text-3xl font-bold">
          M
        </div>
      </div>

      {/* Liens profil */}
      <div className="flex justify-evenly items-center mt-6 text-white text-sm font-semibold w-full max-w-6xl">
        <a href="/profil" className="hover:underline">
          Tableau de bord
        </a>
        <a href="/profil/profilbis.tsx" className="hover:underline">
          Paramètres généraux
        </a>
        <a href="#" className="hover:underline">
          Préférences
        </a>
        <a href="#" className="hover:underline">
          Infos de paiement
        </a>
        <a href="#" className="hover:underline">
          Notifications
        </a>
      </div>

      {/* Historique des recherches */}
      <div className="mt-10 bg-white rounded-lg shadow-md p-6 w-full max-w-6xl">
        <h2 className="text-lg font-bold text-orange-600">
          Vos recherches précédentes
        </h2>
        {loading ? (
          <p className="text-gray-600 mt-4">Chargement des recherches...</p>
        ) : error ? (
          <p className="text-red-600 mt-4">Erreur : {error}</p>
        ) : searchHistory.length > 0 ? (
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-orange-100">
                <tr>
                  <th className="py-2 px-4">Itinéraire</th>
                  <th className="py-2 px-4">Date</th>
                  <th className="py-2 px-4">Détails</th>
                  <th className="py-2 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {searchHistory.map((search) => (
                  <tr
                    key={search.id}
                    className={`border-b ${
                      search.id % 2 === 0 ? "bg-white" : "bg-gray-100"
                    }`}
                  >
                    <td className="py-2 px-4">{search.route}</td>
                    <td className="py-2 px-4">{search.date}</td>
                    <td className="py-2 px-4">{search.details}</td>
                    <td className="py-2 px-4 text-orange-600 hover:underline cursor-pointer">
                      <button onClick={() => handleViewDetails(search)}>
                        Voir les détails
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-4 text-gray-600">Aucune recherche récente.</p>
        )}
        <button
          className="mt-4 text-orange-600 hover:underline"
          onClick={handleClearAll}
        >
          Tout supprimer
        </button>
      </div>

      {/* Modal */}
      {selectedSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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

export default HomePage;
