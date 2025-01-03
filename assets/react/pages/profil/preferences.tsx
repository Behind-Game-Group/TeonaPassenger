"use client";

import React from "react";
import { useState } from "react";
import axios from "axios";
import HeaderProfil from "../../components/headerProfil/HeaderProfil";

const Preferences = () => {
  // State utilisateur
  const [user, setUser] = useState({
    name: "Martin",
    email: "martinvallee01@gmail.com",
    airport: "Batumi, Géorgie",
    OtherAirport: "Charles de Gaulle, Paris",
  });

  // Couleur du cercle
  const [circleColor, setCircleColor] = useState("#3B82F6"); // Bleu par défaut
  const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);

  // Palette de couleurs
  const colorPalette = [
    "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#9333EA", "#3B82F6",
    "#34D399", "#FBBF24", "#DC2626", "#8B5CF6",
  ];

  // Fonction pour changer la couleur
  const handleColorChange = (color: string) => {
    setCircleColor(color);
    setIsColorPickerVisible(false); // Cacher la palette après sélection
  };

  // État pour les destinations enregistrées
  const [destinations, setDestinations] = useState<string[]>([]);

  // État pour la nouvelle destination à ajouter
  const [newDestination, setNewDestination] = useState("");

  // Ajouter une nouvelle destination
  const addDestination = () => {
    if (newDestination.trim() !== "") {
      setDestinations((prev) => [...prev, newDestination]);
      setNewDestination(""); // Réinitialise le champ d'entrée
    }
  };

  // État pour savoir si on est en mode édition ou non
  const [isEditing, setIsEditing] = useState({
    airport: false,
    OtherAirport: false,
  });

  // Gestion de la modification d'un champ
  const handleUpdateField = (field: keyof typeof user, value: string) => {
    setUser((prev) => ({ ...prev, [field]: value }));
  };

  // Basculer le mode édition
  const toggleEdit = (field: keyof typeof isEditing) => {
    setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const saveUserData = async () => {
    try {
      const response = await axios.post("/api/update-user", user);

      if (response.status === 200) {
        console.log("Données sauvegardées avec succès !");
      } else {
        throw new Error("Erreur lors de la sauvegarde des données");
      }
    } catch (error) {
      console.error("Erreur :", error);
      alert("Une erreur est survenue lors de la sauvegarde.");
    }
  };

  return (
    <div className="relative flex flex-col top-[-1.8rem] items-center bg-customOrange min-h-screen ml-64 lg:ml-64 md:ml-20 sm:ml-10 z-10">
      {/* Header Profil */}
      <HeaderProfil user={user} />

      {/* liens profil */}
      <div className="flex justify-evenly items-center mt-6 text-white text-sm font-semibold w-full max-w-6xl">
        <a href="/profil" className="hover:underline">
          Tableau de bord
        </a>
        <a href="/profil/parametres.tsx" className="hover:underline">
          Paramètres généraux
        </a>
        <a href="/profil/preferences.tsx" className="hover:underline">
          Préférences
        </a>
        <a href="/profil/voyageurs.tsx" className="hover:underline">
          Voyageurs
        </a>
        <a href="#" className="hover:underline">
          Infos de paiement
        </a>
        <a href="#" className="hover:underline">
          Notifications
        </a>
      </div>

      {/* Settings Section */}
      <div className="mt-10 w-full bg-white p-4 rounded-md max-w-6xl space-y-6">
        <h2 className="font-bold">Préférences</h2>
        {/* Detail de connexion en dur(a revoir faire un form) */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-bold text-orange-600">Aéroports</h2>
          <p className="mt-2 text-gray-600">
            Trouvez des vols plus facilement en enregistrant votre aéroport
            local et les autres aéroports où vous vous rendez souvent.
          </p>
          <div className="grid grid-cols-2 gap-6 mt-4">
            <div>
              <p className="font-semibold">Aéroport local :</p>
              {isEditing.airport ? (
                <input
                  type="text"
                  value={user.airport}
                  onChange={(e) => handleUpdateField("airport", e.target.value)}
                  className="border rounded p-2 mt-2"
                />
              ) : (
                <p className="text-gray-700">{user.airport}</p>
              )}
              <button
                onClick={() => toggleEdit("airport")}
                className="text-orange-600 hover:underline mt-2"
              >
                {isEditing.airport ? "Enregistrer" : "Modifier"}
              </button>
            </div>
            <div>
              <p className="font-semibold">Autre aéroport :</p>
              {isEditing.OtherAirport ? (
                <input
                  type="OtherAirport"
                  value={user.OtherAirport}
                  onChange={(e) =>
                    handleUpdateField("OtherAirport", e.target.value)
                  }
                  className="border rounded p-2 mt-2"
                />
              ) : (
                <p className="text-gray-700">{user.OtherAirport}</p>
              )}
              <button
                onClick={() => toggleEdit("OtherAirport")}
                className="text-orange-600 hover:underline mt-2"
              >
                {isEditing.OtherAirport ? "Enregistrer" : "Modifier"}
              </button>
            </div>
          </div>
        </div>

        {/* autres sections parametres */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-bold text-orange-600">
            Destinations enregistrées
          </h2>
          <p className="mt-2 text-gray-600">
            Choisissez l’une de vos destinations enregistrées pour trouver des
            hôtels et locations à proximité.
          </p>
          <div className="grid grid-cols-2 gap-6 mt-4">
            <div>
              <p className="font-semibold">Destinations :</p>
              <ul className="mt-2 text-gray-700 list-disc list-inside">
                {destinations.map((destination, index) => (
                  <li key={index}>{destination}</li>
                ))}
              </ul>
              <input
                type="text"
                value={newDestination}
                onChange={(e) => setNewDestination(e.target.value)}
                className="border rounded p-2 mt-2 w-full"
                placeholder="Nouvelle destination"
              />
              <button
                onClick={addDestination}
                className="text-orange-600 hover:underline mt-2"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preferences;
