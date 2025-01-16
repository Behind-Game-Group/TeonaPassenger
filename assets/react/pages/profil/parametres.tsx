"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import HeaderProfil from "../../components/headerProfil/HeaderProfil";
import { useUserContext } from "../../context/UserContext";
import { deleteMethod, getMethod, postMethod } from "../../services/axiosInstance";
import SharedTrips from "../../components/sharedtrip/sharedtrip";
import Expeditors from "../../components/expeditor/expeditor";
import DeleteUser from "../../components/deleteUser/deleteUser";

interface UserProfile {
  id: number;
  lastname: string | null;
  firstname: string | null;
  username: string | null;
  avatar: string | null;
  site: string | null;
  local_airport: string | null;
}

interface SharedTrip {
  id: number;
  email: string;
  isEditable: boolean;
}

type Expeditor = {
  id: number,
  email: string;
};

const Parametres = () => {
  const { currentUser, updateUser } = useUserContext();
  const [profil, setProfile] = useState<Partial<UserProfile>>({});
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [site, setSite] = useState("");
  const [sharedTripsDisplay, setSharedTripsDisplay] = useState<SharedTrip[]>([]);
  const [expeditors, setExpeditors] = useState<Expeditor[]>([]);
  // État pour savoir si on est en mode édition ou non
  const [edit, setEdit] = useState(false);
  const [error, setError] = useState(false)
  const { csrfToken } = useUserContext();

  useEffect(() => {
    fetchUserProfile();
    fetchSharedTrips();
    fetchExpeditors();
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

  const fetchSharedTrips = async () => {
    try {
      const response = await getMethod('/sharedtrips/display');
      if (response) {
        setSharedTripsDisplay(response);
        console.log(response);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const deleteSharedTrips = async (email: string) => {
    try {
      const response = await deleteMethod('/sharedtrips/delete', {
        email,
        csrfToken
      })
      if (response) {
        fetchSharedTrips()
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchExpeditors = async () => {
    const url = '/expeditors';

    try {
      const response = await getMethod(url);
      console.log('Réponse de l’API :', response);

      if (response) {
        setExpeditors(response);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des expéditeurs :', error);
      setExpeditors([]);
    }
  };

  const handleDeleteExpeditor = async (emailToDelete: string) => {
    const url = '/expeditor';
    const data = { email: emailToDelete, csrfToken };

    try {
      const response = await deleteMethod(url, data);
      if(response) {
        fetchExpeditors();
      }
    } catch (error: any) {
      console.error('Erreur Axios : ', error);
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
              {edit ? (
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
                      className={`border-2 p-1 w-full max-w-[400px] text-[15px] ${error ? 'border-red-500' : 'border-black'
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
                    {(username === "" || lastname === "" || username === "" || site === "") ? <p className="text-gray-600 bg-gray-400 border-2 border-black p-2">Enregistrer</p> : <button type="submit" className="text-white bg-customOrange border-2 border-black p-2">Enregistrer</button>}
                    <button onClick={() => { setEdit(!edit), fetchUserProfile() }} className="border-2 border-black p-2">Annuler</button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col space-y-4 ml-5 mt-14 mb-5">
                  <div className="flex flex-col space-y-2">
                    <p className="text-[15px]">Votre nom</p>
                    <div className="flex flex-row justify-between border-2 border-black p-1 w-full max-w-[400px] text-[15px]">
                      <p>{profil.firstname} {profil.lastname}</p>
                      <button className="text-customOrange  hover:underline" onClick={() => setEdit(!edit)}>Modifier</button>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <p className="text-[15px]">Nom d’utilisateur·ice</p>
                    <div className="flex flex-row justify-between border-2 border-black p-1 w-full max-w-[400px] text-[15px]">
                      <p>{profil.username}</p>
                      <button className="text-customOrange hover:underline" onClick={() => setEdit(!edit)}>Modifier</button>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <p className="text-[15px]">Adresse e-mail</p>
                    <div className="flex flex-row justify-between border-2 border-black p-1 w-full max-w-[400px] text-[15px]">
                      <p>{currentUser.email}</p>
                      <button className="text-customOrange hover:underline" onClick={() => setEdit(!edit)}>Modifier</button>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2 mb-5">
                    <p className="text-[15px]">Site</p>
                    <div className="flex flex-row justify-between border-2 border-black p-1 w-full max-w-[400px] text-[15px]">
                      <p>{profil.site}</p>
                      <button className="text-customOrange hover:underline" onClick={() => setEdit(!edit)}>Modifier</button>
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
          <h2 className="font-bold text-[20px]">Clés d'identification</h2>
          <p className="mt-2 text-gray-600">Faciles à configurer, les clés d'identification vous permettent de vous connecter à votre compte THEONA en toute sécurité grâce à votre empreinte digitale, votre visage ou le verrouillage de votre écran.</p>
          <button className="text-white bg-customOrange p-1 mt-4 rounded-sm text-[15px]">Ajouter une clé d’accès </button>
        </div>
        <div className="bg-white rounded-lg border p-6">
          <h2 className="font-bold text-[20px]">Connectez votre boîte mail</h2>
          <p className="mt-2 text-gray-600">Importez automatiquement vos réservations depuis Gmail ou Outlook vers Trips,<br /> sans transfert d’emails. Organisez votre voyage sans efforts.</p>
          <button className="text-white bg-customOrange p-1 mt-4 rounded-sm text-[15px]">Connecter</button>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex flex-col">
            <h2 className="font-bold text-[20px]">Expéditeurs autorisés</h2>
            <p className="mt-2 text-gray-600">Autorisez vos compagnons de voyage a ajouter des infos à votre profil Trips en transférant vos e-mails de confirmation à trips@theonagroup.fr</p>
            {expeditors.map((expeditor) => (
              <div className="flex flex-row space-x-60 my-2">
                <div className="flex flex-row space-x-4">
                  <p className="font-bold">{expeditor.email}</p>
                  <button onClick={() => handleDeleteExpeditor(expeditor.email)} className="text-red-800">SUP</button>
                </div>
                <p><span className="text-red-700">(non confirmé)</span> | <span className="text-blue-500 font-bold">renvoyer l’e-mail de confirmation</span></p>
              </div>
            ))}
            <Expeditors />
          </div>
          <hr className="my-4" />
          <div className="flex flex-col">
            <h2 className="font-bold text-[20px]">Partage automatique des voyages</h2>
            <p className="mt-2 text-gray-600">Vous avez un compagnon de voyage préféré ? Ajoutez son adresse e-mail pour l’inclure automatiquement dans l’organisation de votre voyage.</p>
            {sharedTripsDisplay.map((sharedtrips) => (
              <div className="flex flex-col my-3">
                <div className="flex flex-row space-x-4">
                  <p className="font-bold">{sharedtrips.email}</p>
                  <button onClick={() => deleteSharedTrips(sharedtrips.email)} className="text-red-800">SUP</button>
                </div>
                <div className="flex flex-row space-x-4">
                  <p className="text-[15px]">Peut modifier mes voyages</p>
                  <p className="text-gray-700">{sharedtrips.isEditable ? "oui" : "non"}</p>
                </div>
              </div>
            ))}
            <SharedTrips />
          </div>
          <hr className="my-4" />
          <div className="flex flex-col">
            <h2 className="text-[20px]">Flux de calendrier Trips</h2>
            <p className="mt-2 text-gray-600">Cette adresse de flux présente tous vos voyages.</p>
            <p className="text-gray-900 p-1 my-2 bg-gray-100 w-[500px]">https://www.theonagroup.fr/trips/ical/uf/lFzw9Mkm0LE/VSU39KV1/calendar.ics</p>
            <a href="" className="text-customOrange">Réinitialiser ce lien</a>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <h2 className="font-bold text-[20px]">Informations relatives à votre utilisation</h2>
          <p className="mt-2 text-gray-600">Les informations d'utilisation nous aident à améliorer votre expérience. Voulez-vous consulter vos données personnelles ?</p>
          <button className="text-white bg-customOrange p-1 mt-4 rounded-sm text-[15px]">Voir mes données</button>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <h2 className="font-bold text-[20px]">Vos données personnelles</h2>
          <p className="mt-2 text-gray-600">Nous partageons vos données personnelles pour permettre à de tierces parties de vous fournir des informations de marketing et des offres pertinentes. Vous pouvez modifier les options de partage de vos données pour les fins indiquées ci-dessus. <a href="#" className="text-orange-600 hover:underline">En savoir plus</a></p>
          <br />
          <p className="text-gray-600"> Partage avec les sociétés de notre groupe. <a href="#" className="text-customOrange hover:underline">En savoir plus</a></p>
          <br />
          <p className="text-gray-600">partage avec les partenaires de voyages. <a href="#" className="text-customOrange hover:underline">En savoir plus</a></p>
          <br />
          <p className="text-gray-600">partage avec nos partenaires commerciaux. <a href="#" className="text-customOrange hover:underline">En savoir plus</a></p>
        </div>

        <DeleteUser />
      </div>
    </div>
  );
};

export default Parametres;
