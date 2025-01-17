"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import HeaderProfil from "../../components/headerProfil/HeaderProfil";
import { useUserContext } from "../../context/UserContext";
import { getMethod } from "../../services/axiosInstance";

interface Traveler {
  id: number;
  lastname: string;
  firstname: string;
  email: string;
  birthdate: string;
  gender: string;
  phone: string;
  DHS?: number;
  KTN?: number;
  principal: boolean;
}

const Voyageur = () => {
  const [travelers, setTravelers] = useState<Traveler[]>([]);
  const [principalTraveler, setPrincipalTraveler] = useState<Traveler | null>(null);
  const [newTraveler, setNewTraveler] = useState<Partial<Traveler>>({});
  const [editDataTraveler, setEditDataTraveler] = useState<Partial<Traveler>>({});
  const [editTraveler, setEditTraveler] = useState(false);
  const [ajout, setAjout] = useState(false);
  const { csrfToken } = useUserContext();

  useEffect(() => {
    fetchTravelers();
  }, []);

  // Fonction pour formater une date au format 'YYYY-MM-DD'
  const formatDateForInput = (date: string) => {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Mois commence à 0
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;  // Retourne au format 'YYYY-MM-DD'
  };

  const fetchTravelers = async () => {
      try {
        const response = await getMethod('/showTravelers');
        if (response) {
          if (response.principal === false) {
          const formattedTravelers = response.map((traveler: Traveler) => ({
            ...traveler,
            birthdate: formatDateForInput(traveler.birthdate),
  
          }));
          setTravelers(formattedTravelers);
          console.log(response);
          } else {
            response[0].birthdate = formatDateForInput(response[0].birthdate);
            setPrincipalTraveler(response[0]);
          }
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
      <div className="mt-10 w-full bg-white p-4 max-w-[1700px] rounded-md space-y-6">
        <h2 className="font-bold text-[20px]">Voyageur·euses</h2>
        {/* Detail de connexion en dur(a revoir faire un form) */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-[15px] font-bold">
          Voyageur·euse principal·e
          </h2>
          <p className="mt-2 text-[#562D80]">
            Ces informations nous permettront de pré-remplir certains champs et
            d’accélérer le processus de réservation.
          </p>
            <div
              className="relative flex my-6 items-center justify-center rounded-full text-white text-3xl font-bold bg-blue-500"
              style={{ width: '100px', height:'100px' }}
            >
              M
            </div>
          <div className="flex flex-col p-5 ml-10">
            <div className="flex flex-row justify-between mb-5 max-w-6xl">
              <div className="flex flex-col items-center">
                <p className="font-semibold text-[15px]">Prénom</p>
                <p>-</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="font-semibold text-[15px]">2ème prénom</p>
                <p>-</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="font-semibold text-[15px]">Nom de famille</p>
                <p>-</p>
              </div>
            </div>
            <div className="flex flex-row justify-between my-5">
              <div className="flex flex-col w-full max-w-lg">
                <div className="flex flex-row justify-between my-5">
                  <div className="flex flex-col items-center">
                    <p className="font-semibold text-[15px]">Date de naissance (DD/MM/YYYY)</p>
                    <p>-</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="font-semibold text-[15px]">Sexe</p>
                    <p>-</p>
                  </div>
                </div>
                <div className="flex flex-col my-5">
                  <p className="font-semibold text-[15px]">Numéro de téléphone portable</p>
                  <p>-</p>
                </div>
                <div className="flex flex-row justify-between mt-5">
                  <div className="flex flex-col items-center">
                    <p className="font-semibold text-[15px]">Numéro de recours DHS</p>
                    <p>-</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="font-semibold text-[15px]">Numéro de voyageur·euse (KTN)</p>
                    <p>-</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-center items-center pr-10">
                <p className="text-customOrange cursor-pointer">Modifier le ou la <br/> voyageur·euse</p>  
              </div>
            </div>
          </div>
        </div>

        {/* autres sections parametres */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-[15px] font-bold text-black">
            Compagnons de voyage
          </h2>
          <p className="mt-2 text-[15px] text-[#562D80]">
          Ajoutez des proches et collègues avec lesquels vous voyagez régulièrement pour faciliter et accélérer vos réservations.
          </p>
          <div className="mt-10">
            <button className="text-customOrange font-bold">Ajouter un·e voyageur·euse</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Voyageur;
