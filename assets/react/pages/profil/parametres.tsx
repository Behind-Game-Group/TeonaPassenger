"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import HeaderProfil from "../../components/headerProfil/HeaderProfil";
import { useUserContext } from "../../context/UserContext";
import { getMethod, postMethod } from "../../services/axiosInstance";
import { set } from "date-fns";

interface UserProfile {
  id: number;
  lastname: string | null;
  firstname: string | null;
  username: string | null;
  avatar: string | null;
  site: string | null;
  local_airport: string | null;
}

const Parametres = () => {
  const { currentUser, updateUser } = useUserContext();
  const [profil, setProfile] = useState<Partial<UserProfile>>({});
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [site, setSite] = useState("");
// État pour savoir si on est en mode édition ou non
  const [edit, setEdit] = useState(false);
  const [error, setError] = useState(false)
  const { csrfToken } = useUserContext();

 useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await getMethod("/showUserProfile");
      console.log(response);
      setProfile(response)
      setFirstName(response.firstname);
      setLastName(response.lastname);
      setUsername(response.username);
      setSite(response.site);
    } catch (error) {
      console.error("Erreur lors de la récupération des données utilisateur :", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    if (e.target.value === "") {
      setError(true);
    } else {
      setError(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
      e.preventDefault();
  
      try {
        const response = await postMethod('/updateUserProfile', {
          firstname,
          lastname,
          username,
          site,
          csrfToken,
        });
        if (response) {
          fetchUserProfile();
          setEdit(!edit);
        }
      } catch (err) {
        console.log(err);
      }
    };

  return (
    <div className="relative flex flex-col top-[-1.8rem] items-center bg-customOrange min-h-screen ml-64 lg:ml-64 md:ml-20 sm:ml-10 z-10">
      {/* Header Profil */}
      <HeaderProfil />

      {/* liens profil */}
      <div className="flex justify-evenly items-center mt-6 text-white text-sm font-semibold w-full max-w-6xl">
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

      {/* Settings Section */}
      <div className="mt-10 w-full bg-white p-4 rounded-md max-w-[1588px] space-y-6">
        <h2 className="font-bold text-[20px]">Parametres généraux</h2>
        {/* Detail de connexion en dur(a revoir faire un form) */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex flex-row justify-between">
            <div className="flex flex-col w-full max-w-[500px]">
              <h2 className="font-bold text-[20px]">Détails de connexion</h2>
              { edit ? (
                <form className="flex flex-col space-y-4 ml-5 mt-14" onSubmit={handleUpdateProfile}>
                  <div className="flex flex-col space-y-2">
                    <p className="text-[15px]">
                      Prénom *
                    </p>
                    <input
                      type="text"
                      name="firstname"
                      value={firstname}
                      onChange={(e) => setFirstName(e.target.value)}
                      aria-label="User's firstname"
                      className="border-2 border-black p-1 w-full max-w-[400px] text-[15px]"
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <p className="text-[15px]">
                      Nom *
                    </p>
                    <input
                      type="text"
                      name="lastname"
                      value={lastname}
                      onChange={(e) => setLastName(e.target.value)}
                      aria-label="User's lastname"
                      className="border-2 border-black p-1 w-full max-w-[400px] text-[15px]"
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <p className="text-[15px]">
                      Nom d’utilisateur *
                    </p>
                    <input
                      type="text"
                      name="username"
                      value={username}
                      onChange={handleInputChange}
                      aria-label="User's username"
                      className={`border-2 p-1 w-full max-w-[400px] text-[15px] ${
                        error ? 'border-red-500' : 'border-black'
                      }`}
                    />
                    {error && (
                      <span className="text-red-500 text-sm">
                        Veuillez remplir le champ "Nom d’utilisateur".
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col space-y-2">
                    <p className="text-[15px]">
                      Site *
                    </p>
                    <input
                      type="text"
                      name="site"
                      value={site}
                      onChange={(e) => setSite(e.target.value)}
                      aria-label="User's site"
                      className="border-2 border-black p-1 w-full max-w-[400px] text-[15px]"
                    />
                  </div>
                  <div className="flex flex-row space-x-2">
                    { (username === "" || lastname === "" || username === "" || site === "") ? <p className="text-gray-600 bg-gray-400 border-2 border-black p-2">Enregistrer</p> : <button type="submit" className="text-white bg-orange-500 border-2 border-black p-2">Enregistrer</button> }
                    <button onClick={() => {setEdit(!edit), fetchUserProfile()}} className="border-2 border-black p-2">Annuler</button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col space-y-4 ml-5 mt-14 mb-5">
                  <div className="flex flex-col space-y-2">
                    <p className="text-[15px]">Votre nom</p>
                    <div className="flex flex-row justify-between border-2 border-black p-1 w-full max-w-[400px] text-[15px]">
                      <p>{profil.firstname} {profil.lastname}</p>
                      <button className="text-orange-600 hover:underline" onClick={() => setEdit(!edit)}>Modifier</button>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <p className="text-[15px]">Nom d’utilisateur·ice</p>
                    <div className="flex flex-row justify-between border-2 border-black p-1 w-full max-w-[400px] text-[15px]">
                      <p>{profil.username}</p>
                      <button className="text-orange-600 hover:underline" onClick={() => setEdit(!edit)}>Modifier</button>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <p className="text-[15px]">Adresse e-mail</p>
                    <div className="flex flex-row justify-between border-2 border-black p-1 w-full max-w-[400px] text-[15px]">
                      <p>{currentUser.email}</p>
                      <button className="text-orange-600 hover:underline" onClick={() => setEdit(!edit)}>Modifier</button>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2 mb-5">
                    <p className="text-[15px]">Site</p>
                    <div className="flex flex-row justify-between border-2 border-black p-1 w-full max-w-[400px] text-[15px]">
                      <p>{profil.site}</p>
                      <button className="text-orange-600 hover:underline" onClick={() => setEdit(!edit)}>Modifier</button>
                    </div>
                  </div>
                  <div className="h-6"></div>
                </div>
              )}
              <div className="flex flex-col ml-5">
                <p>Réseaux sociaux</p>
                <p>Reliez vos comptes à THEONA</p>
                <a href="#" className="flex flex-row justify-center border-2 border-black w-40 items-center mt-5">
                  <div className="w-16 h-16">
                    <img className="w-full h-full" src="/img/google.png" alt="google" />
                  </div>
                  <p>Relier</p>
                </a>
              </div>
            </div>
            <div className="max-w-[873px] max-h-[600px]">
              <img className="w-full h-full" src="/img/user.png" alt="user" />
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
