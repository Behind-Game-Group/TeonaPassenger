"use client";

import React, { useState } from "react";
import axios from "axios";
import HeaderProfil from "../../components/headerProfil/HeaderProfil";

const AddVoyageur = () => {
  // State utilisateur
  const [user, setUser] = useState({
    name: "Martin",
    secondname: "Vincenzo",
    lastname: "Vallée",
    birthday: "01/01/1990",
    sexe: "Masculin",
    email: "martinvallee01@gmail.com",
    tel: "0785442489",
    airport: "Batumi, Géorgie",
    OtherAirport: "Charles de Gaulle, Paris",
  });

  // Couleur du cercle
  const [circleColor, setCircleColor] = useState("#3B82F6"); // Bleu par défaut

  // Palette de couleurs
  const colorPalette = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#9333EA",
    "#3B82F6",
    "#34D399",
    "#FBBF24",
    "#DC2626",
    "#8B5CF6",
  ];

  // Ajouter une nouvelle destination
  const [destinations, setDestinations] = useState<string[]>([]); // État des destinations

  const addDestination = (newDestination: string) => {
    if (newDestination.trim() !== "") {
      setDestinations((prev) => [...prev, newDestination]);
    }
  };

  // État pour les champs à ajouter
  const [newField, setNewField] = useState({
    name: "",
    secondname: "",
    lastname: "",
    birthday: "",
    sexe: "",
    tel: "",
    airport: "",
    OtherAirport: "",
  });

  // Mapping des intitulés des champs
  const fieldLabels: Record<string, string> = {
    name: "Prénom",
    secondname: "Deuxième prénom",
    lastname: "Nom de famille",
    birthday: "Date de naissance",
    sexe: "Sexe",
    tel: "Numéro de téléphone",
    airport: "Aéroport préféré",
    OtherAirport: "Autre aéroport",
  };

  // Mapping des placeholders
  const fieldPlaceholders: Record<string, string> = {
    name: "Entrez votre prénom",
    secondname: "Entrez votre deuxième prénom",
    lastname: "Entrez votre nom de famille",
    birthday: "JJ/MM/AAAA",
    sexe: "Sélectionnez votre sexe",
    tel: "Entrez votre numéro de téléphone",
    airport: "Entrez l’aéroport préféré",
    OtherAirport: "Entrez un autre aéroport",
  };

  // Fonction pour gérer la modification d'un champ
  const handleFieldChange = (field: keyof typeof newField, value: string) => {
    setNewField((prev) => ({ ...prev, [field]: value }));
  };

  // Fonction pour sauvegarder les informations
  const saveUserData = async () => {
    const updatedUser = { ...user, ...newField }; // Fusionner les champs actuels avec les nouveaux champs
    try {
      const response = await axios.post("/api/update-user", updatedUser);

      if (response.status === 200) {
        console.log("Données sauvegardées avec succès !");
        setUser(updatedUser); // Mettre à jour l'état utilisateur avec les nouvelles données
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
        <a href="#" className="hover:underline">
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
        <h2 className="font-bold">Voyageurs</h2>
        {/* Section pour ajouter un voyageur */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-bold text-orange-600">
            Ajouter un voyageur
          </h2>
          <p className="mt-2 text-gray-600">
            Ces informations nous permettront de pré-remplir certains champs et
            d’accélérer le processus de réservation.
          </p>
          <div
            className="relative flex mt-2 items-center justify-center rounded-full text-white text-3xl font-bold"
            style={{ backgroundColor: circleColor, width: "80px", height: "80px" }}
          >
            {newField.name.charAt(0) || user.name.charAt(0)}
          </div>

          <div className="grid grid-cols-2 gap-6 mt-4">
            {Object.keys(newField).map((key) => (
              <div key={key}>
                <p className="font-semibold">{fieldLabels[key] || key.charAt(0).toUpperCase() + key.slice(1)} :</p>
                <input
                  type="text"
                  value={newField[key as keyof typeof newField]}
                  onChange={(e) => handleFieldChange(key as keyof typeof newField, e.target.value)}
                  placeholder={fieldPlaceholders[key] || "Entrez une valeur"}
                  className="border rounded p-2 mt-2 w-72"
                />
              </div>
            ))}
          </div>

          <button
            onClick={saveUserData}
            className="mt-6 bg-orange-600 text-white py-2 px-6 rounded"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddVoyageur;
