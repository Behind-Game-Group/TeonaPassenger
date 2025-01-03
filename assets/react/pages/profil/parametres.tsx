"use client";

import React from "react";
import { useState } from "react";
import axios from "axios";
import HeaderProfil from "../../components/headerProfil/HeaderProfil";

const Parametres = () => {

 // State utilisateur
 const [user, setUser] = useState({
  name: "Martin",
  email: "martinvallee01@gmail.com",
  airport: "Batumi, Géorgie",
});

// État pour savoir si on est en mode édition ou non
const [isEditing, setIsEditing] = useState({
  name: false,
  email: false,
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
        <h2 className="font-bold">Parametres généraux</h2>
        {/* Detail de connexion en dur(a revoir faire un form) */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-bold text-orange-600">Détails de connexion</h2>
          <p className="mt-2 text-gray-600">Modifiez vos informations personnelles.</p>
          <div className="grid grid-cols-2 gap-6 mt-4">
            <div>
              <p className="font-semibold">Nom :</p>
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
              <p className="font-semibold">Adresse e-mail :</p>
              {isEditing.email ? (
                <input
                  type="email"
                  value={user.email}
                  onChange={(e) => handleUpdateField("email", e.target.value)}
                  className="border rounded p-2 mt-2"
                />
              ) : (
                <p className="text-gray-700">{user.email}</p>
              )}
              <button
                onClick={() => toggleEdit("email")}
                className="text-orange-600 hover:underline mt-2"
              >
                {isEditing.email ? "Enregistrer" : "Modifier"}
              </button>
            </div>
          </div>
        </div>

        {/* autres sections parametres */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-bold text-orange-600">Clés d'identification</h2>
          <p className="mt-2 text-gray-600">Configurez vos clés pour sécuriser vos connexions.</p>
          <button className="text-orange-600 hover:underline mt-4">Ajouter des clés</button>
        </div>
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-bold text-orange-600">Connectez votre boîte mail</h2>
          <p className="mt-2 text-gray-600">Synchronisez vos réservations avec Gmail ou Outlook.</p>
          <button className="text-orange-600 hover:underline mt-4">Configurer</button>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-bold text-orange-600">Informations relatives à votre utilisation</h2>
          <p className="mt-2 text-gray-600">Les informations d'utilisation nous aident à améliorer votre expérience. Voulez-vous consulter vos données personnelles ?</p>
          <button className="text-orange-600 hover:underline mt-4">Voir mes données</button>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-bold text-orange-600">Vos données personnelles</h2>
          <p className="mt-2 text-gray-600">Nous partageons vos données personnelles pour permettre à de tierces parties de vous fournir des informations de marketing et des offres pertinentes. Vous pouvez modifier les options de partage de vos données pour les fins indiquées ci-dessus. <a href="#" className="text-orange-600 hover:underline">En savoir plus</a></p>
          <br />
          <p className="text-gray-600"> Partage avec les sociétés de notre groupe. <a href="#" className="text-orange-600 hover:underline">En savoir plus</a></p>
          <br />
          <p className="text-gray-600">partage avec les partenaires de voyages. <a href="#" className="text-orange-600 hover:underline">En savoir plus</a></p>
          <br />
          <p className="text-gray-600">partage avec nos partenaires commerciaux. <a href="#" className="text-orange-600 hover:underline">En savoir plus</a></p>
        </div>
      </div>
    </div>
  );
};

export default Parametres;
