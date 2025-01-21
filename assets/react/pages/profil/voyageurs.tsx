"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import HeaderProfil from "../../components/headerProfil/HeaderProfil";
import { useUserContext } from "../../context/UserContext";
import { getMethod, postMethod } from "../../services/axiosInstance";

interface Traveler {
  id: number;
  lastname: string;
  firstname: string;
  secondName: string;
  email: string;
  birthdate: string;
  gender: string;
  phone: string;
  DHS?: number;
  KTN?: number;
  principal: boolean;
}

interface FidelityProgram {
  id: number;
  name: string;
  programNumber: number;
}

const Voyageur = () => {
  const [travelers, setTravelers] = useState<Traveler[]>([]);
  const [principalTraveler, setPrincipalTraveler] = useState<Traveler | null>(null);
  const [editPrincipalTraveler, setEditPrincipalTraveler] = useState<Partial<Traveler>>({});
  const [newTraveler, setNewTraveler] = useState<Partial<Traveler>>({});
  const [editDataTraveler, setEditDataTraveler] = useState<Partial<Traveler>>({});
  const [ToggleEditTraveler, setToggleEditTraveler] = useState(false);
  const [ajout, setAjout] = useState(false);
  const [toggleNewTraveler, setToggleNewTraveler] = useState(false);
  const { csrfToken, currentUser } = useUserContext();

  const [fidelityPrograms, setFidelityPrograms] = useState<FidelityProgram[]>([]);
  const [newFidelityProgram, setNewFidelityProgram] = useState<Partial<FidelityProgram>>({});
  const [selectedTravelerId, setSelectedTravelerId] = useState<number | null>(null);
  const [togglePrincipal, setTogglePrincipal] = useState<boolean>(false);

  useEffect(() => {
    fetchTravelers();
    fetchFidelityPrograms();
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
      console.log(response);
  
      if (response) {
        // Vérifiez si response est un tableau
        if (Array.isArray(response)) {
          const nonPrincipalTravelers = response.filter((traveler: Traveler) => !traveler.principal);
          const principalTraveler = response.find((traveler: Traveler) => traveler.principal);
  
          // Gestion des voyageurs non principaux
          if (nonPrincipalTravelers.length > 0) {
            const formattedTravelers = nonPrincipalTravelers.map((traveler: Traveler) => ({
              ...traveler,
              birthdate: formatDateForInput(traveler.birthdate),
            }));
            setTravelers(formattedTravelers);
            console.log("Voyageurs non principaux : ", formattedTravelers);
          }
  
          // Gestion du voyageur principal
          if (principalTraveler) {
            principalTraveler.birthdate = formatDateForInput(principalTraveler.birthdate);
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

    const handlePrincipalTravelerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setEditPrincipalTraveler({ ...editPrincipalTraveler, [e.target.name]: e.target.value });
    };

    const handlePrincipalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setTogglePrincipal(e.target.checked);
      console.log(togglePrincipal);
    };

    const handlePrincipalTraveler = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!csrfToken) {
        console.log('CSRF token not found');
        return;
      }

      if (principalTraveler) {
        try {
          console.log(editPrincipalTraveler);
          await postMethod('/modifyTraveler', {
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
          await postMethod('/addTraveler', {
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
    }

    const handleTravelerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewTraveler({ ...newTraveler, [e.target.name]: e.target.value });
    };

    const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setNewTraveler({ ...newTraveler, [e.target.name]: e.target.value });
    };

    const handleEditGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setEditDataTraveler({ ...editDataTraveler, [e.target.name]: e.target.value });
    };

    const handleEditTravelerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setEditDataTraveler({ ...editDataTraveler, [e.target.name]: e.target.value });
    };

    const handleEditPrincipalGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setEditPrincipalTraveler({ ...editPrincipalTraveler, [e.target.name]: e.target.value });
    };

    const handleNewTraveler = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!csrfToken) {
        console.log('CSRF token not found');
        return;
      }

      try {
        console.log(newTraveler);
        console.log("ici" + newTraveler.gender);
        const response = await postMethod('/addTraveler', {
          ...newTraveler,
          principal: togglePrincipal,
          csrfToken,
        });
        if (response) {
          fetchTravelers();
          setToggleNewTraveler(!toggleNewTraveler)
          setNewTraveler({});
        }
      } catch (err) {
      console.log(err);
    }
    };

    const handleDeleteTraveler = async (id: number) => {
      if (!csrfToken) {
        console.log('CSRF token not found');
        return;
      }

      try {
        await postMethod('/deleteTraveler', { id, csrfToken });
        fetchTravelers();
      } catch (err) {
        console.log(err);
      } 
    };

    const handleModifyTraveler = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!csrfToken) {
        console.log('CSRF token not found');
        return;
      }

      try {
        const response = await postMethod('/modifyTraveler', {
          ...editDataTraveler,
          id: editDataTraveler.id,
          principal: togglePrincipal,
          csrfToken,
        });
        if (response) {
          fetchTravelers();
          setToggleEditTraveler(false);
          setEditDataTraveler({});
        }
        fetchTravelers();
        } catch (err) {
          console.log(err);
        } 
    };

    const fetchFidelityPrograms = async () => {
      try {
        const response = await getMethod('/showFidelityPrograms');
        setFidelityPrograms(response);
        console.log(response);
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
            { ajout ? (
              <>
                <div className="border-2 border-blue-500 p-2 rounded-3xl">
                  <p className="text-blue-500"><span className="text-white px-3 py-1 rounded-full bg-blue-500 mr-2">?</span>Le nom, la date de naissance et le genre saisi ci-dessous doivent correspondre exactement à ceux indiqués sur la pièce d’identité de la personne qui voyage, délivrée par le gouvernement.</p>
                </div>
                <form onSubmit={handlePrincipalTraveler} className="flex flex-col space-y-4">
                  <div className="flex flex-row flex-wrap space-x-20 justify-center">
                    <div className="flex flex-col w-[457px]">
                      <p className="text-[15px]">Prénom *</p>
                      <input
                      type="text"
                      name="firstname"
                      value={editPrincipalTraveler.firstname}
                      onChange={handlePrincipalTravelerChange}
                      aria-label="Traveler's firstname"
                      className="border-2 border-black p-1 w-full h-[53px] text-[15px] rounded-xl"
                      />
                    </div>
                    <div className="flex flex-col w-[457px]">
                      <p className="text-[15px]">2ème Prénom</p>
                      <input
                      type="text"
                      name="secondName"
                      value={editPrincipalTraveler.secondName}
                      onChange={handlePrincipalTravelerChange}
                      aria-label="Traveler's secondname"
                      className="border-2 border-black p-1 w-full h-[53px] text-[15px] rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="flex flex-row flex-wrap space-x-20 justify-center">
                    <div className="flex flex-col w-[457px]">
                      <p className="text-[15px]">Nom de famille *</p>
                      <input
                      type="text"
                      name="lastname"
                      value={editPrincipalTraveler.lastname}
                      onChange={handlePrincipalTravelerChange}
                      aria-label="Traveler's lastname"
                      className="border-2 border-black p-1 w-full h-[53px] text-[15px] rounded-xl"
                      />
                    </div>
                    <div className="flex flex-col w-[457px]">
                      <p className="text-[15px]">Date de naissance (DD/MM/YYYY) *</p>
                      <input
                      type="date"
                      name="birthdate"
                      value={editPrincipalTraveler.birthdate}
                      onChange={handlePrincipalTravelerChange}
                      aria-label="Traveler's datetime"
                      className="border-2 border-black p-1 w-full h-[53px] text-[15px] rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col justify-center">
                    <select name="gender" value={editPrincipalTraveler.gender} onChange={handleEditPrincipalGenderChange} aria-label="Traveler's gender" className="border-2 border-black p-1 w-[266px] h-[53px] text-[15px] rounded-xl">
                      <option value="">Genre *</option>
                      <option value="Homme (H)">Homme (H)</option>
                      <option value="Femme (F)">Femme (F)</option>
                    </select>
                    <div>
                      <p className="text-[15px]">Telephone portable *</p>
                      <input
                      type="text"
                      name="phone"
                      value={editPrincipalTraveler.phone}
                      onChange={handlePrincipalTravelerChange}
                      aria-label="Traveler's phone"
                      className="border-2 border-black p-1 w-full max-w-[400px] text-[15px]"
                      />
                    </div>
                  </div>
                  <div className="flex flex-row flex-wrap">
                    <div className="flex flex-col">
                      <p className="text-[15px]">Numéro de recours DHS</p>
                      <input
                      type="text"
                      name="DHS"
                      value={editPrincipalTraveler.DHS}
                      onChange={handlePrincipalTravelerChange}
                      aria-label="Traveler's DHS"
                      className="border-2 border-black p-1 w-full max-w-[400px] text-[15px]"
                      />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-[15px]">Numéro de voyageur·euse (KTN)</p>
                      <input
                      type="text"
                      name="KTN"
                      value={editPrincipalTraveler.KTN}
                      onChange={handlePrincipalTravelerChange}
                      aria-label="Traveler's KTN"
                      className="border-2 border-black p-1 w-full max-w-[400px] text-[15px]"
                      />
                    </div>
                  </div>
                  <div className="flex flex-row">
                    {(editPrincipalTraveler.firstname === "" || editPrincipalTraveler.lastname === "" || editPrincipalTraveler.birthdate === "" || editPrincipalTraveler.gender === "" || editPrincipalTraveler.phone === "") ? <p className="text-gray-600 bg-gray-400 border-2 border-black p-2 w-[96px]">Enregistrer</p> : <button type="submit" className="text-white bg-customOrange border-2 border-black p-2">Enregistrer</button>}
                    <button onClick={() => setAjout(!ajout)}>Annuler</button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <div className="flex flex-row justify-between mb-5 max-w-6xl">
                  <div className="flex flex-col items-center">
                    <p className="font-semibold text-[15px]">Prénom</p>
                    <p>{principalTraveler?.firstname ?? "-"}</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="font-semibold text-[15px]">2ème prénom</p>
                    <p>{principalTraveler?.secondName ?? "-"}</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="font-semibold text-[15px]">Nom de famille</p>
                    <p>{principalTraveler?.lastname ?? "-"}</p>
                  </div>
                </div>
                <div className="flex flex-row justify-between my-5">
                  <div className="flex flex-col w-full max-w-lg">
                    <div className="flex flex-row justify-between my-5">
                      <div className="flex flex-col items-center">
                        <p className="font-semibold text-[15px]">Date de naissance (DD/MM/YYYY)</p>
                        <p>{principalTraveler?.birthdate ?? "-"}</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <p className="font-semibold text-[15px]">Sexe</p>
                        <p>{principalTraveler?.gender ?? "-"}</p>
                      </div>
                    </div>
                    <div className="flex flex-col my-5">
                      <p className="font-semibold text-[15px]">Numéro de téléphone portable</p>
                      <p>{principalTraveler?.phone ?? "-"}</p>
                    </div>
                    <div className="flex flex-row justify-between mt-5">
                      <div className="flex flex-col items-center">
                        <p className="font-semibold text-[15px]">Numéro de recours DHS</p>
                        <p>{principalTraveler?.DHS ?? "-"}</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <p className="font-semibold text-[15px]">Numéro de voyageur·euse (KTN)</p>
                        <p>{principalTraveler?.KTN ?? "-"}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center items-center pr-10">
                    <p className="text-customOrange cursor-pointer" onClick={() => setAjout(!ajout)}>Modifier le ou la <br/> voyageur·euse</p>  
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* autres sections parametres */}
        <div className="bg-white rounded-lg border p-6">
          { ToggleEditTraveler ? (
            <>
              <h2 className="text-[15px] font-bold">Modifier le ou la voyageur·euse</h2>
              <form onSubmit={handleModifyTraveler} className="flex flex-col">
                <div className="flex flex-row flex-wrap">
                  <div className="flex flex-col">
                    <p className="text-[15px]">Prénom *</p>
                    <input
                      type="text"
                      name="firstname"
                      value={editDataTraveler.firstname}
                      onChange={handleEditTravelerChange}
                      aria-label="Traveler's firstname"
                      className="border-2 border-black p-1 w-full max-w-[400px] text-[15px]"
                    />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[15px]">2ème Prénom</p>
                    <input
                      type="text"
                      name="secondName"
                      value={editDataTraveler.secondName}
                      onChange={handleEditTravelerChange}
                      aria-label="Traveler's secondname"
                      className="border-2 border-black p-1 w-full max-w-[400px] text-[15px]"
                    />
                  </div>
                </div>
                <div className="flex flex-row flex-wrap">
                  <div className="flex flex-col">
                    <p className="text-[15px]">Nom de famille *</p>
                    <input
                      type="text"
                      name="lastname"
                      value={editDataTraveler.lastname}
                      onChange={handleEditTravelerChange}
                      aria-label="Traveler's lastname"
                      className="border-2 border-black p-1 w-full max-w-[400px] text-[15px]"
                    />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[15px]">Date de naissance (DD/MM/YYYY) *</p>
                    <input
                      type="date"
                      name="birthdate"
                      value={editDataTraveler.birthdate}
                      onChange={handleEditTravelerChange}
                      aria-label="Traveler's birthdate"
                      className="border-2 border-black p-1 w-full max-w-[400px] text-[15px]"
                    />
                  </div>
                </div>
                <div className="flex flex-row flex-wrap">
                  <input
                    type="number"
                    name="phone"
                    placeholder="Numéro de téléphone portable *"
                    value={editDataTraveler.phone}
                    onChange={handleEditTravelerChange}
                    aria-label="Traveler's phone"
                    className="border-2 border-black p-1 w-full max-w-[400px] text-[15px]"
                  />
                  <input
                    type="text"
                    name="email"
                    placeholder="E-mail *"
                    value={editDataTraveler.email}
                    onChange={handleEditTravelerChange}
                    aria-label="Traveler's email"
                    className="border-2 border-black p-1 w-full max-w-[400px] text-[15px]"
                  />
                </div>
                <select name="gender" value={editDataTraveler.gender} onChange={handleEditGenderChange} aria-label="Traveler's gender" className="border-2 border-black p-1 w-full max-w-[400px] text-[15px]">
                  <option value="">Genre *</option>
                  <option value="Homme (H)">Homme (H)</option>
                  <option value="Femme (F)">Femme (F)</option>
                </select>
                <button>Ajouter un autre programme</button>
                <div className="flex flex-row space-x-4">
                  <input type="checkbox" name="principal" value="false" onChange={handlePrincipalChange} aria-label="Traveler's principal" className="border-2 border-black p-1 w-full max-w-[400px] text-[15px]"/>
                  <p>Voyageur·euse principal·e</p>
                </div>
                <div className="flex flex-row">
                  {(editDataTraveler.firstname === "" || editDataTraveler.lastname === "" || editDataTraveler.birthdate === "" || editDataTraveler.gender === "" || editDataTraveler.phone === "" || editDataTraveler.email === "") ? <p className="text-gray-600 bg-gray-400 border-2 border-black p-2 w-[96px]">Enregistrer</p> : <button type="submit" className="text-white bg-customOrange border-2 border-black p-2">Enregistrer</button>}
                  <button onClick={() => {
                    setToggleEditTraveler(!ToggleEditTraveler)
                    setEditDataTraveler({})
                    }}>Annuler</button>
                </div>
              </form>
            </>
          ) : (
            <>
            { toggleNewTraveler ? (
              <>
                <h2 className="text-[15px] font-bold">Ajouter un·e voyageur·euse</h2>
                <form onSubmit={handleNewTraveler} className="flex flex-col">
                  <div className="flex flex-row flex-wrap">
                    <div className="flex flex-col">
                      <p className="text-[15px]">Prénom *</p>
                      <input
                        type="text"
                        name="firstname"
                        value={newTraveler.firstname}
                        onChange={handleTravelerChange}
                        aria-label="Traveler's firstname"
                        className="border-2 border-black p-1 w-full max-w-[400px] text-[15px]"
                      />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-[15px]">2ème Prénom</p>
                      <input
                        type="text"
                        name="secondName"
                        value={newTraveler.secondName}
                        onChange={handleTravelerChange}
                        aria-label="Traveler's secondname"
                        className="border-2 border-black p-1 w-full max-w-[400px] text-[15px]"
                      />
                    </div>
                  </div>
                  <div className="flex flex-row flex-wrap">
                    <div className="flex flex-col">
                      <p className="text-[15px]">Nom de famille *</p>
                      <input
                        type="text"
                        name="lastname"
                        value={newTraveler.lastname}
                        onChange={handleTravelerChange}
                        aria-label="Traveler's lastname"
                        className="border-2 border-black p-1 w-full max-w-[400px] text-[15px]"
                      />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-[15px]">Date de naissance (DD/MM/YYYY) *</p>
                      <input
                        type="date"
                        name="birthdate"
                        value={newTraveler.birthdate}
                        onChange={handleTravelerChange}
                        aria-label="Traveler's birthdate"
                        className="border-2 border-black p-1 w-full max-w-[400px] text-[15px]"
                      />
                    </div>
                  </div>
                  <div className="flex flex-row flex-wrap">
                    <input
                      type="number"
                      name="phone"
                      placeholder="Numéro de téléphone portable *"
                      value={newTraveler.phone}
                      onChange={handleTravelerChange}
                      aria-label="Traveler's phone"
                      className="border-2 border-black p-1 w-full max-w-[400px] text-[15px]"
                    />
                    <input
                      type="text"
                      name="email"
                      placeholder="E-mail *"
                      value={newTraveler.email}
                      onChange={handleTravelerChange}
                      aria-label="Traveler's email"
                      className="border-2 border-black p-1 w-full max-w-[400px] text-[15px]"
                    />
                  </div>
                  <select name="gender" value={newTraveler.gender} onChange={handleGenderChange} aria-label="Traveler's gender" className="border-2 border-black p-1 w-full max-w-[400px] text-[15px]">
                    <option value="">Genre *</option>
                    <option value="Homme (H)">Homme (H)</option>
                    <option value="Femme (F)">Femme (F)</option>
                  </select>
                  <button>Ajouter un autre programme</button>
                  <div className="flex flex-row space-x-4">
                    <input type="checkbox" name="principal" value="false" onChange={handlePrincipalChange} aria-label="Traveler's principal" className="border-2 border-black p-1 w-full max-w-[400px] text-[15px]"/>
                    <p>Voyageur·euse principal·e</p>
                  </div>
                  <div className="flex flex-row">
                    {(newTraveler.firstname === "" || newTraveler.lastname === "" || newTraveler.birthdate === "" || newTraveler.gender === "" || newTraveler.phone === "" || newTraveler.email === "") ? <p className="text-gray-600 bg-gray-400 border-2 border-black p-2 w-[96px]">Enregistrer</p> : <button type="submit" className="text-white bg-customOrange border-2 border-black p-2">Enregistrer</button>}
                    <button onClick={() => {
                      setToggleNewTraveler(!toggleNewTraveler)
                      setNewTraveler({})
                      }}>Annuler</button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <h2 className="text-[15px] font-bold text-black">
                  Compagnons de voyage
                </h2>
                <p className="mt-2 text-[15px] text-[#562D80]">
                Ajoutez des proches et collègues avec lesquels vous voyagez régulièrement pour faciliter et accélérer vos réservations.
                </p>
                {travelers.map((traveler) => (
                  <>
                    <div className="flex flex-row space-x-60 my-2">
                      <div className="flex flex-col">
                        <p>{traveler.lastname} {traveler.firstname}</p>
                        <p>{traveler.email} | {traveler.phone}</p>
                      </div>
                      <div className="flex flex-col">
                        <p>Programmes de fidélité</p>
                        <p>Aucun</p>
                      </div>
                      <div className="flex flex-row">
                        <button onClick={() => {
                          setToggleEditTraveler(!ToggleEditTraveler)
                          setEditDataTraveler(traveler)
                        }} className="text-blue-800">Modifier</button>
                        <button onClick={() => handleDeleteTraveler(traveler.id)} className="text-blue-800">Supprimer</button>
                      </div>
                    </div>
                    <hr />
                  </>
                ))}
                <div className="mt-10">
                  <button className="text-customOrange font-bold" onClick={() => setToggleNewTraveler(!toggleNewTraveler)}>Ajouter un·e voyageur·euse</button>
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
