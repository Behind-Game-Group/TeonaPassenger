"use client";

import React from "react";
import { useState } from "react";
import axios from "axios";
import HeaderProfil from "../../components/headerProfil/HeaderProfil";

const Voyageur = () => {
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
  const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);

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
    name: false,
    secondname: false,
    lastname: false,
    birthday: false,
    sexe: false,
    tel: false,
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
        {/* Detail de connexion en dur(a revoir faire un form) */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-bold text-orange-600">
            Voyageur principal
          </h2>
          <p className="mt-2 text-gray-600">
            Ces informations nous permettront de pré-remplir certains champs et
            d’accélérer le processus de réservation.
          </p>
            <div
              className="relative flex mt-2 items-center justify-center rounded-full text-white text-3xl font-bold"
              style={{ backgroundColor: circleColor, width: '80px', height:'80px' }}
            >
              {user.name.charAt(0)}
            </div>
          <div className="grid grid-cols-2 gap-6 mt-4">
            <div>
              <p className="font-semibold">Prénom :</p>
              {isEditing.name ? (
                <input
                  type="text"
                  value={user.name}
                  onChange={(e) => handleUpdateField("name", e.target.value)}
                  className="border rounded p-2 mt-2"
                />
              ) : (
                <p className="text-gray-700">{user.name}</p>
              )}
              <button
                onClick={() => toggleEdit("name")}
                className="text-orange-600 hover:underline mt-2"
              >
                {isEditing.name ? "Enregistrer" : "Modifier"}
              </button>
            </div>
            <div>
              <p className="font-semibold">Second prénom :</p>
              {isEditing.secondname ? (
                <input
                  type="secondname"
                  value={user.secondname}
                  onChange={(e) =>
                    handleUpdateField("secondname", e.target.value)
                  }
                  className="border rounded p-2 mt-2"
                />
              ) : (
                <p className="text-gray-700">{user.secondname}</p>
              )}
              <button
                onClick={() => toggleEdit("secondname")}
                className="text-orange-600 hover:underline mt-2"
              >
                {isEditing.secondname ? "Enregistrer" : "Modifier"}
              </button>
            </div>
            <div>
              <p className="font-semibold">Nom :</p>
              {isEditing.lastname ? (
                <input
                  type="lastname"
                  value={user.lastname}
                  onChange={(e) =>
                    handleUpdateField("lastname", e.target.value)
                  }
                  className="border rounded p-2 mt-2"
                />
              ) : (
                <p className="text-gray-700">{user.lastname}</p>
              )}
              <button
                onClick={() => toggleEdit("lastname")}
                className="text-orange-600 hover:underline mt-2"
              >
                {isEditing.lastname ? "Enregistrer" : "Modifier"}
              </button>
            </div>
            <div>
              <p className="font-semibold">Date de naissance :</p>
              {isEditing.birthday ? (
                <input
                  type="birthday"
                  value={user.birthday}
                  onChange={(e) =>
                    handleUpdateField("birthday", e.target.value)
                  }
                  className="border rounded p-2 mt-2"
                />
              ) : (
                <p className="text-gray-700">{user.birthday}</p>
              )}
              <button
                onClick={() => toggleEdit("birthday")}
                className="text-orange-600 hover:underline mt-2"
              >
                {isEditing.birthday ? "Enregistrer" : "Modifier"}
              </button>
            </div>
            <div>
              <p className="font-semibold">Sexe :</p>
              {isEditing.sexe ? (
                <input
                  type="sexe"
                  value={user.sexe}
                  onChange={(e) => handleUpdateField("sexe", e.target.value)}
                  className="border rounded p-2 mt-2"
                />
              ) : (
                <p className="text-gray-700">{user.sexe}</p>
              )}
              <button
                onClick={() => toggleEdit("sexe")}
                className="text-orange-600 hover:underline mt-2"
              >
                {isEditing.sexe ? "Enregistrer" : "Modifier"}
              </button>
            </div>
            <div>
              <p className="font-semibold">Téléphone :</p>
              {isEditing.tel ? (
                <input
                  type="tel"
                  value={user.tel}
                  onChange={(e) => handleUpdateField("tel", e.target.value)}
                  className="border rounded p-2 mt-2"
                />
              ) : (
                <p className="text-gray-700">{user.tel}</p>
              )}
              <button
                onClick={() => toggleEdit("tel")}
                className="text-orange-600 hover:underline mt-2"
              >
                {isEditing.tel ? "Enregistrer" : "Modifier"}
              </button>
            </div>
          </div>
        </div>

        {/* autres sections parametres */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-bold text-orange-600">
            Ajouter voyageur
          </h2>
          <p className="mt-2 text-gray-600">
          Ajoutez des proches et collègues avec lesquels vous voyagez régulièrement pour faciliter et accélérer vos réservations.
          </p>
          <div className="grid grid-cols-2 gap-6 mt-4">
            <div>              
              <a href="/profil/ajoutervoyageur.tsx"
                
                className="text-orange-600 hover:underline mt-2"
              >
                Ajouter un voyageur
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Voyageur;
