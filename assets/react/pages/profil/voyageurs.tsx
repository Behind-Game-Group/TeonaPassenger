"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import HeaderProfil from "../../components/headerProfil/HeaderProfil";
import { useUserContext } from "../../context/UserContext";
import { getMethod, postMethod } from "../../services/axiosInstance";
import "../../../styles/preferences.css";
import '../../../styles/voyageurs.css';

interface Traveler {
  id: number;
  lastname: string;
  firstname: string;
  secondName: string;
  email: string;
  birthdate: string;
  gender: string;
  phoneCountry: number;
  phone: number;
  DHS?: number;
  KTN?: number;
  principal: boolean;
}

interface FidelityProgram {
  id: number;
  name: string;
  programNumber: number;
}

interface FidelityPrograms {
  id: number;
  fidelityProgs: FidelityProgram[];
}

const Voyageur = () => {
  const [travelers, setTravelers] = useState<Traveler[]>([]);
  const [principalTraveler, setPrincipalTraveler] = useState<Traveler | null>(
    null
  );
  const [editPrincipalTraveler, setEditPrincipalTraveler] = useState<
    Partial<Traveler>
  >({});
  const [newTraveler, setNewTraveler] = useState<Partial<Traveler>>({});
  const [editDataTraveler, setEditDataTraveler] = useState<Partial<Traveler>>(
    {}
  );
  const [ToggleEditTraveler, setToggleEditTraveler] = useState(false);
  const [ajout, setAjout] = useState(false);
  const [toggleNewTraveler, setToggleNewTraveler] = useState(false);
  const { csrfToken, currentUser } = useUserContext();

  const [fidelityPrograms, setFidelityPrograms] = useState<FidelityPrograms[]>(
    []
  );
  const [newFidelityProgram, setNewFidelityProgram] = useState<
    Partial<FidelityProgram>
  >({});
  const [listNewFidelityPrograms, setListNewFidelityPrograms] = useState<
    FidelityProgram[]
  >([]);
  const [selectedTravelerId, setSelectedTravelerId] = useState<number | null>(
    null
  );
  const [togglePrincipal, setTogglePrincipal] = useState<boolean>(false);

  useEffect(() => {
    fetchTravelers();
    fetchFidelityPrograms();
  }, []);

  // Fonction pour formater une date au format 'YYYY-MM-DD'
  const formatDateForInput = (date: string) => {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Mois commence à 0
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // Retourne au format 'YYYY-MM-DD'
  };

  const listCompanyAvion = [
    { name: "Air France" },
    { name: "Lufthansa" },
    { name: "KLM Royal Dutch Airlines" },
    { name: "British Airways" },
    { name: "Ryanair" },
    { name: "EasyJet" },
    { name: "Emirates" },
    { name: "Qatar Airways" },
    { name: "Singapore Airlines" },
    { name: "American Airlines" },
    { name: "Delta Air Lines" },
    { name: "United Airlines" },
    { name: "Turkish Airlines" },
    { name: "Aeroflot" },
    { name: "Air Canada" },
    { name: "Iberia" },
  ];

  const listNumTel = [
    { country: "France", code: "+33" },
    { country: "Espagne", code: "+34" },
    { country: "Italie", code: "+39" },
    { country: "Allemagne", code: "+49" },
    { country: "Royaume-Uni", code: "+44" },
    { country: "États-Unis", code: "+1" },
    { country: "Canada", code: "+1" },
    { country: "Belgique", code: "+32" },
    { country: "Suisse", code: "+41" },
    { country: "Portugal", code: "+351" },
    { country: "Pays-Bas", code: "+31" },
    { country: "Australie", code: "+61" },
    { country: "Brésil", code: "+55" },
    { country: "Mexique", code: "+52" },
    { country: "Argentine", code: "+54" },
    { country: "Japon", code: "+81" },
    { country: "Chine", code: "+86" },
    { country: "Inde", code: "+91" },
    { country: "Afrique du Sud", code: "+27" },
    { country: "Russie", code: "+7" },
    { country: "Colombie", code: "+57" },
  ];

  const fetchTravelers = async () => {
    try {
      const response = await getMethod("/showTravelers");
      console.log(response);

      if (response) {
        // Vérifiez si response est un tableau
        if (Array.isArray(response)) {
          const nonPrincipalTravelers = response.filter(
            (traveler: Traveler) => !traveler.principal
          );
          const principalTraveler = response.find(
            (traveler: Traveler) => traveler.principal
          );

          // Gestion des voyageurs non principaux
          if (nonPrincipalTravelers.length > 0) {
            const formattedTravelers = nonPrincipalTravelers.map(
              (traveler: Traveler) => ({
                ...traveler,
                birthdate: formatDateForInput(traveler.birthdate),
              })
            );
            setTravelers(formattedTravelers);
            console.log("Voyageurs non principaux : ", formattedTravelers);
          }

          // Gestion du voyageur principal
          if (principalTraveler) {
            principalTraveler.birthdate = formatDateForInput(
              principalTraveler.birthdate
            );
            setPrincipalTraveler(principalTraveler);
            setEditPrincipalTraveler(principalTraveler);
            console.log("Voyageur principal : ", principalTraveler);
          }
        } else {
          console.log("La réponse n'est pas un tableau :", response);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handlePrincipalTravelerChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEditPrincipalTraveler({
      ...editPrincipalTraveler,
      [e.target.name]: e.target.value,
    });
  };

  const handlePrincipalTraveler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csrfToken) {
      console.log("CSRF token not found");
      return;
    }

    if (principalTraveler) {
      try {
        console.log(editPrincipalTraveler);
        await postMethod("/modifyTraveler", {
          ...editPrincipalTraveler,
          id: editPrincipalTraveler.id,
          csrfToken,
        });
        fetchTravelers();
        setAjout(!ajout);
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        console.log(editPrincipalTraveler);
        await postMethod("/addTraveler", {
          ...editPrincipalTraveler,
          email: currentUser.email,
          principal: true,
          csrfToken,
        });
        fetchTravelers();
        setAjout(!ajout);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleTravelerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTraveler({ ...newTraveler, [e.target.name]: e.target.value });
  };

  const handleSelectNewTravelerChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setNewTraveler({ ...newTraveler, [e.target.name]: e.target.value });
  };

  const handleSelectEditTravelerChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setEditDataTraveler({
      ...editDataTraveler,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditTravelerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditDataTraveler({
      ...editDataTraveler,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectEditPrincipalTravelerChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setEditPrincipalTraveler({
      ...editPrincipalTraveler,
      [e.target.name]: e.target.value,
    });
  };

  const handleNewTraveler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!csrfToken) {
      console.log("CSRF token not found");
      return;
    }

    try {
      newTraveler.principal = togglePrincipal;
      const response = await postMethod("/addTraveler", {
        ...newTraveler,
        csrfToken,
      });
      if (response) {
        fetchTravelers();
        setToggleNewTraveler(!toggleNewTraveler);
        setTogglePrincipal(false);
        setNewTraveler({});
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteTraveler = async (id: number) => {
    if (!csrfToken) {
      console.log("CSRF token not found");
      return;
    }

    try {
      await postMethod("/deleteTraveler", { id, csrfToken });
      fetchTravelers();
    } catch (err) {
      console.log(err);
    }
  };

  const handleModifyTraveler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!csrfToken) {
      console.log("CSRF token not found");
      return;
    }

    try {
      editDataTraveler.principal = togglePrincipal;
      const response = await postMethod("/modifyTraveler", {
        ...editDataTraveler,
        id: editDataTraveler.id,
        csrfToken,
      });
      if (response) {
        const id = editDataTraveler.id;
        if (id && listNewFidelityPrograms.length > 0) {
          await handleAddFidelityProgram(id);
        } else {
          console.log(id);
          console.log(listNewFidelityPrograms.length);
        }
        fetchTravelers();
        setToggleEditTraveler(false);
        setTogglePrincipal(false);
        setEditDataTraveler({});
      }
      fetchTravelers();
    } catch (err) {
      console.log(err);
    }
  };

  const fetchFidelityPrograms = async () => {
    try {
      const response = await getMethod("/showFidelityPrograms");
      if (response) {
        setFidelityPrograms(response);
        console.log("aaa: ", response);
      } else {
        console.log("error");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleFidelityProgramNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewFidelityProgram({
      ...newFidelityProgram,
      [e.target.name]: e.target.value,
    });
  };

  const handleFidelityProgramNameChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setNewFidelityProgram({
      ...newFidelityProgram,
      [e.target.name]: e.target.value,
    });
  };

  const AddFidelityProgram = () => {
    if (newFidelityProgram.name && newFidelityProgram.programNumber) {
      setListNewFidelityPrograms([
        ...listNewFidelityPrograms,
        newFidelityProgram as FidelityProgram,
      ]);
      setNewFidelityProgram({});
    } else {
      console.log("Incomplete FidelityProgram");
    }
  };

  const removeFidelityProgram = (programNumber: number) => {
    setListNewFidelityPrograms(
      listNewFidelityPrograms.filter(
        (program) => program.programNumber !== programNumber
      )
    );
  };

  const handleAddFidelityProgram = async (id: number) => {
    if (!csrfToken) {
      console.log("CSRF token is missing.");
      return;
    }

    try {
      for (const program of listNewFidelityPrograms) {
        console.log("bbb: ", program);
        const response = await postMethod("/addFidelityProgram", {
          ...program,
          id: id,
          csrfToken,
        });
        if (response) {
          console.log("Fidelity Program added successfully.");
        } else {
          console.log("Fidelity Program not added.");
        }
      }
      fetchFidelityPrograms(); // Rafraîchir la liste des programmes de fidélité
      setListNewFidelityPrograms([]);
    } catch (err) {
      console.log("Failed to add fidelity program.");
    }
  };

  const handleDeleteFidelityProgram = async (id: number) => {
    if (!csrfToken) {
      console.log("CSRF token is missing.");
      return;
    }

    try {
      await postMethod("/deleteFidelityProgram", { id, csrfToken });
      fetchFidelityPrograms(); // Rafraîchir la liste après suppression
    } catch (err) {
      console.log("Failed to delete fidelity program.");
    }
  };

  const listTravelerPrograms = fidelityPrograms.find(
    (program) => program.id === editDataTraveler.id
  );

  return (
    <div className="relative flex flex-col top-[-1.8rem] items-center bg-customOrange min-h-screen ml-64 lg:ml-64 md:ml-20 sm:ml-10 z-10">
      {/* Header Profil */}
      <HeaderProfil />

      {/* liens profil */}
      <div className="flex justify-evenly items-center mt-6 text-white text-sm font-semibold w-full max-w-6xl liens">
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
      <div className="mt-10 w-full bg-white p-4 max-w-[1700px] rounded-md space-y-6 max-lg:w-[600px] settings-section">
        <h2 className="font-bold text-[20px]">Voyageur·euses</h2>
        {/* Detail de connexion en dur(a revoir faire un form) */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-[15px] font-bold">Voyageur·euse principal·e</h2>
          <p className="mt-2 text-[#562D80]">
            Ces informations nous permettront de pré-remplir certains champs et
            d’accélérer le processus de réservation.
          </p>
          <div
            className="relative flex my-6 items-center justify-center rounded-full text-white text-3xl font-bold bg-blue-500"
            style={{ width: "100px", height: "100px" }}
          >
            M
          </div>
          <div className="flex flex-col p-5 ml-10 voyageur-section">
            {ajout ? (
              <>
                <div className="border-2 border-blue-500 p-2 rounded-3xl">
                  <p className="text-blue-500">
                    <span className="text-white px-3 py-1 rounded-full bg-blue-500 mr-2">
                      ?
                    </span>
                    Le nom, la date de naissance et le genre saisi ci-dessous
                    doivent correspondre exactement à ceux indiqués sur la pièce
                    d’identité de la personne qui voyage, délivrée par le
                    gouvernement.
                  </p>
                </div>
                <form
                  onSubmit={handlePrincipalTraveler}
                  className="flex flex-col space-y-10 mt-10"
                >
                  {/* Ligne 1 : Prénom et 2ème prénom */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col">
                      <label className="text-[15px]">Prénom *</label>
                      <input
                        type="text"
                        name="firstname"
                        value={editPrincipalTraveler.firstname}
                        onChange={handlePrincipalTravelerChange}
                        aria-label="Traveler's firstname"
                        className="border-2 border-black p-2 w-full h-[50px] text-[15px] rounded-xl"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[15px]">2ème Prénom</label>
                      <input
                        type="text"
                        name="secondName"
                        value={editPrincipalTraveler.secondName}
                        onChange={handlePrincipalTravelerChange}
                        aria-label="Traveler's secondname"
                        className="border-2 border-black p-2 w-full h-[50px] text-[15px] rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Ligne 2 : Nom de famille et Date de naissance */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col">
                      <label className="text-[15px]">Nom de famille *</label>
                      <input
                        type="text"
                        name="lastname"
                        value={editPrincipalTraveler.lastname}
                        onChange={handlePrincipalTravelerChange}
                        aria-label="Traveler's lastname"
                        className="border-2 border-black p-2 w-full h-[50px] text-[15px] rounded-xl"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[15px]">
                        Date de naissance (DD/MM/YYYY) *
                      </label>
                      <input
                        type="date"
                        name="birthdate"
                        value={editPrincipalTraveler.birthdate}
                        onChange={handlePrincipalTravelerChange}
                        aria-label="Traveler's birthdate"
                        className="border-2 border-black p-2 w-full h-[50px] text-[15px] rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Ligne 3 : Genre et Téléphone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col">
                      <label className="text-[15px]">Sexe *</label>
                      <select
                        name="gender"
                        value={editPrincipalTraveler.gender}
                        onChange={handleSelectEditPrincipalTravelerChange}
                        aria-label="Traveler's gender"
                        className="border-2 border-black p-2 w-full h-[50px] text-[15px] rounded-xl"
                      >
                        <option value="">Sexe *</option>
                        <option value="Homme (H)">Homme (H)</option>
                        <option value="Femme (F)">Femme (F)</option>
                      </select>
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[15px]">
                        Téléphone portable *
                      </label>
                      <div className="flex items-center space-x-2">
                        <select
                          name="phoneCountry"
                          value={editPrincipalTraveler.phoneCountry}
                          onChange={handleSelectEditPrincipalTravelerChange}
                          aria-label="Traveler's phone country"
                          className="border-2 border-black p-2 w-[90px] text-[15px] rounded-xl"
                        >
                          <option value=""></option>
                          {listNumTel.map((num) => (
                            <option value={num.code}>
                              {num.country} ({num.code})
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          name="phone"
                          value={editPrincipalTraveler.phone}
                          onChange={handlePrincipalTravelerChange}
                          aria-label="Traveler's phone"
                          className="border-2 border-black p-2 flex-1 h-[50px] text-[15px] rounded-xl"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Ligne 4 : Numéro DHS et KTN */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col">
                      <label className="text-[15px]">
                        Numéro de recours DHS
                      </label>
                      <input
                        type="text"
                        name="DHS"
                        value={editPrincipalTraveler.DHS}
                        onChange={handlePrincipalTravelerChange}
                        aria-label="Traveler's DHS"
                        className="border-2 border-black p-2 w-full h-[50px] text-[15px] rounded-xl"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[15px]">
                        Numéro de voyageur·euse (KTN)
                      </label>
                      <input
                        type="text"
                        name="KTN"
                        value={editPrincipalTraveler.KTN}
                        onChange={handlePrincipalTravelerChange}
                        aria-label="Traveler's KTN"
                        className="border-2 border-black p-2 w-full h-[50px] text-[15px] rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Boutons */}
                  <div className="flex justify-center space-x-5 mt-5">
                    <button
                      type="submit"
                      disabled={
                        !editPrincipalTraveler.firstname ||
                        !editPrincipalTraveler.lastname ||
                        !editPrincipalTraveler.birthdate ||
                        !editPrincipalTraveler.gender ||
                        !editPrincipalTraveler.phone
                      }
                      className={`py-2 px-5 border-2 rounded-lg ${
                        editPrincipalTraveler.firstname &&
                        editPrincipalTraveler.lastname &&
                        editPrincipalTraveler.birthdate &&
                        editPrincipalTraveler.gender &&
                        editPrincipalTraveler.phone
                          ? "bg-customOrange text-white border-black"
                          : "bg-gray-400 text-gray-600 border-gray-400"
                      }`}
                    >
                      Enregistrer
                    </button>
                    <button
                      onClick={() => setAjout(!ajout)}
                      className="py-2 px-5 border-2 rounded-lg border-black"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <div className="flex flex-row justify-between mb-5 max-w-6xl">
                  {/* Informations de base */}
                  <div className="flex flex-col items-start">
                    <p className="font-semibold text-[15px] text-center">
                      Prénom
                    </p>
                    <p className="text-center min-w-[100px]">
                      {principalTraveler?.firstname ?? "-"}
                    </p>
                  </div>
                  <div className="flex flex-col items-start">
                    <p className="font-semibold text-[15px] text-center">
                      2ème prénom
                    </p>
                    <p className="text-center min-w-[100px]">
                      {principalTraveler?.secondName ?? "-"}
                    </p>
                  </div>
                  <div className="flex flex-col items-start">
                    <p className="font-semibold text-[15px] text-center">
                      Nom de famille
                    </p>
                    <p className="text-center min-w-[100px]">
                      {principalTraveler?.lastname ?? "-"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-row justify-between my-5">
                  {/* Section principale */}
                  <div className="flex flex-col w-full max-w-lg space-y-6">
                    {/* Date de naissance et sexe */}
                    <div className="flex flex-row justify-between ">
                      <div className="flex flex-col items-start date-section">
                        <p className="font-semibold text-[15px] text-center">
                          Date de naissance (DD/MM/YYYY)
                        </p>
                        <p className="text-center min-w-[150px]">
                          {principalTraveler?.birthdate ?? "-"}
                        </p>
                      </div>
                      <div className="flex flex-col items-start">
                        <p className="font-semibold text-[15px] text-center">
                          Sexe
                        </p>
                        <p className="text-center min-w-[100px]">
                          {principalTraveler?.gender ?? "-"}
                        </p>
                      </div>
                    </div>

                    {/* Numéro de téléphone */}
                    <div className="flex flex-col">
                      <p className="font-semibold text-[15px]">
                        Numéro de téléphone portable
                      </p>
                      <p className="text-left">
                        {principalTraveler?.phoneCountry ? "+" : null}
                        {principalTraveler?.phoneCountry}
                        {principalTraveler?.phone ?? "-"}
                      </p>
                    </div>

                    {/* Numéros spécifiques */}
                    <div className="flex flex-row justify-between num-section">
                      <div className="flex flex-col items-start">
                        <p className="font-semibold text-[15px] text-center">
                          Numéro de recours DHS
                        </p>
                        <p className="text-center min-w-[150px]">
                          {principalTraveler?.DHS ?? "-"}
                        </p>
                      </div>
                      <div className="flex flex-col items-start">
                        <p className="font-semibold text-[15px] text-center">
                          Numéro de voyageur·euse (KTN)
                        </p>
                        <p className="text-center min-w-[150px]">
                          {principalTraveler?.KTN ?? "-"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bouton de modification */}
                  <div className="flex justify-center items-center pr-10 modif-button">
                    <p
                      className="text-customOrange cursor-pointer text-center"
                      onClick={() => setAjout(!ajout)}
                    >
                      Modifier le ou la <br /> voyageur·euse
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* autres sections parametres */}
        <div className="bg-white rounded-lg border p-6">
          {ToggleEditTraveler ? (
            <>
              <h2 className="text-[15px] font-bold">
                Modifier le ou la voyageur·euse
              </h2>
              <form
                onSubmit={handleModifyTraveler}
                className="flex flex-col space-y-14 mt-10"
              >
                <div className="flex flex-row flex-wrap space-x-20">
                  <div className="flex flex-col w-[457px]">
                    <p className="text-[15px]">Prénom *</p>
                    <input
                      type="text"
                      name="firstname"
                      value={editDataTraveler.firstname}
                      onChange={handleEditTravelerChange}
                      aria-label="Traveler's firstname"
                      className="border-2 border-black p-1 w-full h-[53px] text-[15px] rounded-xl"
                    />
                  </div>
                  <div className="flex flex-col w-[457px]">
                    <p className="text-[15px]">2ème Prénom</p>
                    <input
                      type="text"
                      name="secondName"
                      value={editDataTraveler.secondName}
                      onChange={handleEditTravelerChange}
                      aria-label="Traveler's secondname"
                      className="border-2 border-black p-1 w-full h-[53px] text-[15px] rounded-xl"
                    />
                  </div>
                </div>
                <div className="flex flex-row flex-wrap space-x-20">
                  <div className="flex flex-col w-[457px]">
                    <p className="text-[15px]">Nom de famille *</p>
                    <input
                      type="text"
                      name="lastname"
                      value={editDataTraveler.lastname}
                      onChange={handleEditTravelerChange}
                      aria-label="Traveler's lastname"
                      className="border-2 border-black p-1 w-full h-[53px] text-[15px] rounded-xl"
                    />
                  </div>
                  <div className="flex flex-col w-[457px]">
                    <p className="text-[15px]">
                      Date de naissance (DD/MM/YYYY) *
                    </p>
                    <input
                      type="date"
                      name="birthdate"
                      value={editDataTraveler.birthdate}
                      onChange={handleEditTravelerChange}
                      aria-label="Traveler's birthdate"
                      className="border-2 border-black p-1 w-full h-[53px] text-[15px] rounded-xl"
                    />
                  </div>
                </div>
                <div className="flex flex-row flex-wrap space-x-20">
                  <div className="flex flex-row">
                    <select
                      name="phoneCountry"
                      value={editDataTraveler.phoneCountry}
                      onChange={handleSelectEditTravelerChange}
                      aria-label="Traveler's phone country"
                      className="border-2 border-black p-1 w-[104px] h-[53px] text-[15px] rounded-xl"
                    >
                      <option value=""></option>
                      {listNumTel.map((num) => (
                        <option value={num.code}>
                          {num.country} ({num.code})
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      id="phone"
                      name="phone"
                      placeholder="Numéro de téléphone portable *"
                      value={editDataTraveler.phone}
                      onChange={handleEditTravelerChange}
                      aria-label="Traveler's phone"
                      className="border-2 border-black p-1 w-full max-w-[353px] h-[53px] text-[15px] rounded-xl"
                    />
                  </div>
                  <input
                    type="text"
                    name="email"
                    placeholder="E-mail *"
                    value={editDataTraveler.email}
                    onChange={handleEditTravelerChange}
                    aria-label="Traveler's email"
                    className="border-2 border-black p-1 w-full max-w-[457px] h-[53px] text-[15px] rounded-xl"
                  />
                </div>
                <select
                  name="gender"
                  value={editDataTraveler.gender}
                  onChange={handleSelectEditTravelerChange}
                  aria-label="Traveler's gender"
                  className="border-2 border-black p-1 w-full max-w-[457px] h-[53px] text-[15px] rounded-xl"
                >
                  <option value="">Genre *</option>
                  <option value="Homme (H)">Homme (H)</option>
                  <option value="Femme (F)">Femme (F)</option>
                </select>
                <hr />
                <div className="flex flex-col justify-center space-y-2">
                  <div className="flex flex-row space-x-4">
                    <select
                      name="name"
                      id="name"
                      value={newFidelityProgram.name}
                      onChange={handleFidelityProgramNameChange}
                      aria-label="Traveler's name"
                      className="border-2 border-black p-1 w-full max-w-[457px] h-[53px] text-[15px] rounded-xl"
                    >
                      <option value="">
                        Recherche de programmes de fidélité
                      </option>
                      {listCompanyAvion.map((company) => (
                        <option value={company.name}>{company.name}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      id="programNumber"
                      name="programNumber"
                      placeholder="Numéro de programme de fidélité"
                      value={newFidelityProgram.programNumber}
                      onChange={handleFidelityProgramNumberChange}
                      aria-label="programNumber"
                      className="border-2 border-black p-1 w-full max-w-[457px] h-[53px] text-[15px] rounded-xl"
                    />
                    <div
                      className="cursor-pointer bg-customOrange text-white items-center px-3 py-1"
                      onClick={AddFidelityProgram}
                    >
                      <p>+</p>
                    </div>
                  </div>
                  <hr />
                  <div className="flex flex-col space-y-2">
                    {listTravelerPrograms &&
                    listTravelerPrograms.fidelityProgs.length > 0
                      ? listTravelerPrograms.fidelityProgs.map((prog) => (
                          <div
                            key={prog.id}
                            className="flex flex-row space-x-4"
                          >
                            <p className="text-[15px]">
                              {prog.name} | {prog.programNumber}
                            </p>
                            <p
                              onClick={() =>
                                handleDeleteFidelityProgram(prog.id)
                              }
                              className="cursor-pointer"
                            >
                              🗑️
                            </p>
                          </div>
                        ))
                      : null}
                    {listNewFidelityPrograms.map((program) => (
                      <div className="flex flex-row space-x-4">
                        <p>
                          {program.name} | {program.programNumber}
                        </p>
                        <p
                          onClick={() =>
                            removeFidelityProgram(program.programNumber)
                          }
                          className="cursor-pointer"
                        >
                          🗑️
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-row space-x-4">
                  <input
                    type="checkbox"
                    name="principal"
                    onClick={() => {
                      setTogglePrincipal(!togglePrincipal);
                    }}
                    aria-label="Traveler's principal"
                    className="w-5 h-5 border-2 border-black text-customOrange"
                  />
                  <p>Voyageur·euse principal·e</p>
                </div>
                <div className="flex flex-row justify-center max-w-[610px] w-full space-x-10">
                  {editDataTraveler.firstname === "" ||
                  editDataTraveler.lastname === "" ||
                  editDataTraveler.birthdate === "" ||
                  editDataTraveler.gender === "" ||
                  editDataTraveler.phone === null ||
                  editDataTraveler.email === "" ? (
                    <p className="text-gray-600 bg-gray-400 border-2 border-black p-2 w-[96px]">
                      Enregistrer
                    </p>
                  ) : (
                    <button
                      type="submit"
                      className="text-white bg-customOrange border-2 border-black p-2 w-[96px]"
                    >
                      Enregistrer
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setToggleEditTraveler(!ToggleEditTraveler);
                      setEditDataTraveler({});
                      setTogglePrincipal(false);
                    }}
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              {toggleNewTraveler ? (
                <>
                  <h2 className="text-[15px] font-bold">
                    Ajouter un·e voyageur·euse
                  </h2>
                  <form
                    onSubmit={handleNewTraveler}
                    className="flex flex-col space-y-14 mt-10"
                  >
                    <div className="flex flex-row flex-wrap space-x-20">
                      <div className="flex flex-col w-[457px]">
                        <p className="text-[15px]">Prénom *</p>
                        <input
                          type="text"
                          name="firstname"
                          value={newTraveler.firstname}
                          onChange={handleTravelerChange}
                          aria-label="Traveler's firstname"
                          className="border-2 border-black p-1 w-full h-[53px] text-[15px] rounded-xl"
                        />
                      </div>
                      <div className="flex flex-col w-[457px]">
                        <p className="text-[15px]">2ème Prénom</p>
                        <input
                          type="text"
                          name="secondName"
                          value={newTraveler.secondName}
                          onChange={handleTravelerChange}
                          aria-label="Traveler's secondname"
                          className="border-2 border-black p-1 w-full h-[53px] text-[15px] rounded-xl"
                        />
                      </div>
                    </div>
                    <div className="flex flex-row flex-wrap space-x-20">
                      <div className="flex flex-col w-[457px]">
                        <p className="text-[15px]">Nom de famille *</p>
                        <input
                          type="text"
                          name="lastname"
                          value={newTraveler.lastname}
                          onChange={handleTravelerChange}
                          aria-label="Traveler's lastname"
                          className="border-2 border-black p-1 w-full h-[53px] text-[15px] rounded-xl"
                        />
                      </div>
                      <div className="flex flex-col w-[457px]">
                        <p className="text-[15px]">
                          Date de naissance (DD/MM/YYYY) *
                        </p>
                        <input
                          type="date"
                          name="birthdate"
                          value={newTraveler.birthdate}
                          onChange={handleTravelerChange}
                          aria-label="Traveler's birthdate"
                          className="border-2 border-black p-1 w-full h-[53px] text-[15px] rounded-xl"
                        />
                      </div>
                    </div>
                    <div className="flex flex-row flex-wrap space-x-20">
                      <div className="flex flex-row">
                        <select
                          name="phoneCountry"
                          value={newTraveler.phoneCountry}
                          onChange={handleSelectNewTravelerChange}
                          aria-label="Traveler's phone country"
                          className="border-2 border-black p-1 w-[104px] h-[53px] text-[15px] rounded-xl"
                        >
                          <option value=""></option>
                          {listNumTel.map((num) => (
                            <option value={num.code}>
                              {num.country} ({num.code})
                            </option>
                          ))}
                        </select>
                        <input
                          type="number"
                          id="phone"
                          name="phone"
                          placeholder="Numéro de téléphone portable *"
                          value={newTraveler.phone}
                          onChange={handleTravelerChange}
                          aria-label="Traveler's phone"
                          className="border-2 border-black p-1 w-[353px] h-[53px] text-[15px] rounded-xl"
                        />
                      </div>

                      <input
                        type="text"
                        name="email"
                        placeholder="E-mail *"
                        value={newTraveler.email}
                        onChange={handleTravelerChange}
                        aria-label="Traveler's email"
                        className="border-2 border-black p-1 w-full max-w-[457px] h-[53px] text-[15px] rounded-xl"
                      />
                    </div>
                    <select
                      name="gender"
                      value={newTraveler.gender}
                      onChange={handleSelectNewTravelerChange}
                      aria-label="Traveler's gender"
                      className="border-2 border-black p-1 w-full max-w-[457px] h-[53px] text-[15px] rounded-xl"
                    >
                      <option value="">Genre *</option>
                      <option value="Homme (H)">Homme (H)</option>
                      <option value="Femme (F)">Femme (F)</option>
                    </select>
                    <div className="flex flex-row space-x-4">
                      <input
                        type="checkbox"
                        name="principal"
                        onClick={() => setTogglePrincipal(!togglePrincipal)}
                        aria-label="Traveler's principal"
                        className="w-5 h-5 border-2 border-black text-customOrange"
                      />
                      <p>Voyageur·euse principal·e</p>
                    </div>
                    <div className="flex flex-row justify-center max-w-[610px] w-full space-x-10">
                      {newTraveler.firstname === "" ||
                      newTraveler.lastname === "" ||
                      newTraveler.birthdate === "" ||
                      newTraveler.gender === "" ||
                      newTraveler.phone === null ||
                      newTraveler.email === "" ? (
                        <p className="text-gray-600 bg-gray-400 border-2 border-black p-2 w-[96px]">
                          Enregistrer
                        </p>
                      ) : (
                        <button
                          type="submit"
                          className="text-white bg-customOrange border-2 border-black p-2"
                        >
                          Enregistrer
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setToggleNewTraveler(!toggleNewTraveler);
                          setNewTraveler({});
                          setTogglePrincipal(false);
                        }}
                      >
                        Annuler
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <>
                  <h2 className="text-[20px] font-bold text-black">
                    Compagnons de voyage
                  </h2>
                  <p className="mt-2 text-[15px] text-[#562D80]">
                    Ajoutez des proches et collègues avec lesquels vous voyagez
                    régulièrement pour faciliter et accélérer vos réservations.
                  </p>
                  {travelers.map((traveler) => {
                    const travelerPrograms = fidelityPrograms.find(
                      (program) => program.id === traveler.id
                    );

                    return (
                      <>
                        <div className="flex flex-row space-x-60 my-2">
                          <div className="flex flex-col w-full max-w-[400px]">
                            <p className="font-semibold">
                              {traveler.lastname} {traveler.firstname}
                            </p>
                            <p className="text-[15px]">
                              {traveler.email} | +{traveler.phoneCountry}
                              {traveler.phone}
                            </p>
                          </div>
                          <div className="flex flex-col w-full max-w-[400px]">
                            <p className="font-semibold">
                              Programmes de fidélité
                            </p>
                            {travelerPrograms &&
                            travelerPrograms.fidelityProgs.length > 0 ? (
                              travelerPrograms.fidelityProgs.map((prog) => (
                                <p className="text-[15px]" key={prog.id}>
                                  {prog.name} | {prog.programNumber}
                                </p>
                              ))
                            ) : (
                              <p className="text-[15px]">Aucun</p>
                            )}
                          </div>
                          <div className="flex flex-row max-w-[200px] space-x-3">
                            <button
                              onClick={() => {
                                setToggleEditTraveler(!ToggleEditTraveler);
                                setEditDataTraveler(traveler);
                              }}
                              className="text-blue-800 font-semibold"
                            >
                              Modifier
                            </button>
                            <button
                              onClick={() => handleDeleteTraveler(traveler.id)}
                              className="text-blue-800 font-semibold"
                            >
                              Supprimer
                            </button>
                          </div>
                        </div>
                        <hr />
                      </>
                    );
                  })}
                  <div className="mt-10">
                    <button
                      className="text-customOrange font-bold"
                      onClick={() => setToggleNewTraveler(!toggleNewTraveler)}
                    >
                      Ajouter un·e voyageur·euse
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Voyageur;
