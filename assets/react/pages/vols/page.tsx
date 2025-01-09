import React, { useState } from "react";
import SearchBar from "../../components/searchBar/SearchBar";
 // Assurez-vous d'importer votre SearchBar

const FlightsPage = () => {
  const [flights, setFlights] = useState<any[]>([]); // Stocker les informations de vol
  const [loading, setLoading] = useState(false);

  // Fonction de recherche des vols (à adapter selon la source de données)
  const handleSearch = (departure: string, arrival: string) => {
    setLoading(true);
    // Logique de recherche (exemple avec des données fictives)
    setTimeout(() => {
      const searchResults = [
        { id: 1, flight: "AB123", departure, arrival, price: "€250" },
        { id: 2, flight: "CD456", departure, arrival, price: "€300" },
        { id: 3, flight: "EF789", departure, arrival, price: "€350" },
      ];
      setFlights(searchResults);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center bg-orange-400 min-h-screen">
      <div className="lg:ml-64 mt-6">
        <SearchBar />
      </div>

      <div className="w-full max-w-6xl mt-10 px-4 lg:ml-64">
        <h2 className="text-2xl text-black font-bold text-center mb-6">
          Résultats de Vols
        </h2>

        {/* Affichage pendant le chargement */}
        {loading && <div className="text-center text-white">Chargement...</div>}

        {/* Affichage des résultats de recherche */}
        {!loading && flights.length === 0 && (
          <div className="text-center text-white">Aucun vol trouvé.</div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {flights.map((flight) => (
            <div
              key={flight.id}
              className="flex flex-col items-center p-4 bg-white shadow-md rounded-lg"
            >
              <h3 className="font-semibold">{flight.flight}</h3>
              <p>Départ: {flight.departure}</p>
              <p>Arrivée: {flight.arrival}</p>
              <p>Prix: {flight.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlightsPage;
