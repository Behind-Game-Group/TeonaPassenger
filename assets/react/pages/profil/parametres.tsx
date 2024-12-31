"use client";

import React from "react";

const HomePage = () => {
  return (
    <div className="relative flex flex-col top-[-1.8rem] items-center bg-customOrange min-h-screen ml-64 lg:ml-64 md:ml-20 sm:ml-10 z-10">
      {/* Header Profil */}
      <div className="flex justify-between items-center text-white p-6 w-full max-w-6xl">
        <div className="space-y-4 flex flex-col">
          <h1 className="text-2xl font-bold">Bonjour Martin</h1>
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

      {/* liens profil */}
      <div className="flex justify-evenly items-center mt-6 text-white text-sm font-semibold w-full max-w-6xl">
        <a href="/profil" className="hover:underline">
          Tableau de bord
        </a>
        <a href="/profil/parametres.tsx" className="hover:underline">
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
              <p className="text-gray-700">Manuel</p>
              <button className="text-orange-600 hover:underline mt-2">Modifier</button>
            </div>
            <div>
              <p className="font-semibold">Adresse e-mail :</p>
              <p className="text-gray-700">martinvallee01@gmail.com</p>
              <button className="text-orange-600 hover:underline mt-2">Modifier</button>
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

export default HomePage;
