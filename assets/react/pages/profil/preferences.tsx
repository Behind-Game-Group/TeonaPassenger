"use client";

import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import HeaderProfil from "../../components/headerProfil/HeaderProfil";
import '../../../styles/preferences.css';
import { deleteMethod, getMethod, postMethod } from '../../services/axiosInstance';
import { useUserContext } from '../../context/UserContext';
import '../../../styles/preferences.css';


type Company = {
  id: number;
  name: string;
};

type FavoriteHotel = {
  id: number;
  name: string;
};

type DislikedHotel = {
  id: number;
  name: string;
};

type FavoriteDestination = {
  id: number;
  name: string;
  address: string;
};

interface Airport {
  id: number;
  name: string;
}

const Preferences = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [addCompany, setAddCompany] = useState("");
  const [favoriteHotels, setFavoriteHotels] = useState<FavoriteHotel[]>([]);
  const [addFavoriteHotel, setAddFavoriteHotel] = useState("");
  const [dislikedHotels, setDislikedHotels] = useState<DislikedHotel[]>([]);
  const [addDislikedHotel, setAddDislikedHotel] = useState("");
  const [ajoutLieu, setAjoutLieu] = useState<boolean>(false);
  const [destinations, setDestinations] = useState<FavoriteDestination[]>([]);
  const [addDestination, setAddDestination] = useState("");
  const [addDestinationAdress, setAddDestinationAdress] = useState("");
  const [editDestination, setEditDestination] = useState(false)
  const [id, setId] = useState(0)
  const [localAirport, setLocalAirport] = useState<string>("");
  const [airports, setAirports] = useState<Airport[]>([]);
  const [newAirport, setNewAirport] = useState<string>("");
  const [userLocalAirport, setUserLocalAirport] = useState<string | null>(null);
  const { csrfToken, currentUser } = useUserContext();

  useEffect(() => {
    getCompanies();
    getFavoriteHotels();
    getDislikedHotels();
    getDestinations();
    fetchAirports();
    getUserLocalAirport();
  }, []);

  const getCompanies = async () => {
    try {
      const response = await getMethod('/showCompanies');
      if (response) {
        setCompanies(response);
      } else {
        console.log('Aucune réponse');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const newCompany = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      try {
        e.preventDefault();
        setAddCompany((e.target as HTMLInputElement).value);
        const response = await postMethod('/addCompany', { name: addCompany, csrfToken: csrfToken });
        if (response) {
          console.log(response);
          getCompanies();
        } else {
          console.log('Aucune réponse');
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const deleteCompany = async (id: number) => {
    try {
      const response = await postMethod('/deleteCompany', { id: id, csrfToken: csrfToken });
      if (response) {
        console.log(response);
        getCompanies();
      } else {
        console.log('Aucune réponse');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getFavoriteHotels = async () => {
    try {
      const response = await getMethod('/showFavoriteHotels');
      if (response) {
        setFavoriteHotels(response);
      } else {
        console.log('Aucune réponse');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const newFavoriteHotel = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      try {
        e.preventDefault();
        setAddFavoriteHotel((e.target as HTMLInputElement).value);
        const response = await postMethod('/addFavoriteHotel', { name: addFavoriteHotel, csrfToken: csrfToken });
        if (response) {
          console.log(response);
          getFavoriteHotels();
          getDislikedHotels();
        } else {
          console.log('Aucune réponse');
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const deleteFavoriteHotel = async (id: number) => {
    try {
      const response = await postMethod('/deleteFavoriteHotel', { id: id, csrfToken: csrfToken });
      if (response) {
        console.log(response);
        getFavoriteHotels();
      } else {
        console.log('Aucune réponse');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getDislikedHotels = async () => {
    try {
      const response = await getMethod('/showDislikedHotels');
      if (response) {
        setDislikedHotels(response);
      } else {
        console.log('Aucune réponse');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const newDislikedHotel = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      try {
        e.preventDefault();
        setAddDislikedHotel((e.target as HTMLInputElement).value);
        const response = await postMethod('/addDislikedHotel', { name: addDislikedHotel, csrfToken: csrfToken });
        if (response) {
          console.log(response);
          getFavoriteHotels();
          getDislikedHotels();
        } else {
          console.log('Aucune réponse');
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const deleteDislikedHotel = async (id: number) => {
    try {
      const response = await postMethod('/deleteDislikedHotel', { id: id, csrfToken: csrfToken });
      if (response) {
        console.log(response);
        getDislikedHotels();
      } else {
        console.log('Aucune réponse');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getDestinations = async () => {
    try {
      const response = await getMethod('/showDestinations');
      if (response) {
        setDestinations(response);
      } else {
        console.log('Aucune réponse');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const newDestination = async () => {
    try {
      const response = await postMethod('/addDestination', {
        name: addDestination,
        adress: addDestinationAdress,
        csrfToken: csrfToken
      });
      if (response) {
        console.log(response);
        getDestinations();
        setAjoutLieu(false);
        setAddDestination("");
        setAddDestinationAdress("");
      } else {
        console.log('Aucune réponse');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const modifyDestination = async (id: number) => {
    try {
      const response = await postMethod('/modifyDestination', {
        id: id,
        name: addDestination,
        adress: addDestinationAdress,
        csrfToken: csrfToken
      });
      if (response) {
        console.log(response);
        getDestinations();
        setAddDestination("")
        setAddDestinationAdress("")
        setId(0)
        setAjoutLieu(false);
        setEditDestination(false);
      } else {
        console.log('Aucune réponse');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteDestination = async (id: number) => {
    try {
      const response = await postMethod('/deleteDestination', { id: id, csrfToken: csrfToken });
      if (response) {
        console.log(response);
        getDestinations();
      } else {
        console.log('Aucune réponse');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAirports = async () => {
    try {
      const response = await getMethod('/showAirports');
      setAirports(response);
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  const newLocalAirport = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      try {
        e.preventDefault();
        const response = await postMethod('/addLocalAirport', { airport: localAirport, csrfToken: csrfToken });
        if (response) {
          console.log(response);
          getUserLocalAirport();
        } else {
          console.log('Aucune réponse');
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const DeleteLocalAirport = async () => {
    try {
      const response = await deleteMethod('/deleteLocalAirport', { csrfToken: csrfToken });
      if (response) {
        console.log(response);
        setUserLocalAirport(null);
        setLocalAirport("");
      } else {
        console.log('Aucune réponse');
      }
    } catch (error) {
      console.log(error);
    }
  }

  const deleteAirport = async (id: number) => {
    try {
      const response = await deleteMethod('/deleteAirport', { id, csrfToken: csrfToken });
      if (response) {
        console.log(response);
        fetchAirports();
      } else {
        console.log('Aucune réponse');
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleAddAirport = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      try {
        e.preventDefault();
        const response = await postMethod('/addAirport', { name: newAirport, csrfToken: csrfToken });
        if (response) {
          console.log(response);
          fetchAirports();
        } else {
          console.log('Aucune réponse');
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getUserLocalAirport = async () => {
      try {
        const response = await getMethod("/showUserProfile");
        console.log("local", response.local_airport);
        setUserLocalAirport(response.local_airport);
      } catch (error) {
        console.error("Erreur lors de la récupération des données utilisateur :", error);
      }
    };

  return (
    <div className="relative flex flex-col top-[-1.8rem] items-center bg-customOrange min-h-screen ml-64 lg:ml-64 md:ml-20 sm:ml-10 z-10 preferences-container">
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
      <div className="mt-10 w-full bg-white p-4 max-w-[1700px] rounded-md space-y-6 max-lg:w-[600px] preferences-settings">
        <div className='flex flex-col mt-10 mb-10 gap-10 justify-center items-center'>
          <div className='border-2 border-[#562D80] rounded-md w-full max-w-[1200px]'>
            <div className='flex flex-col p-10 space-y-3 rounded-md'>
              <h2 className='font-bold text-[20px]'>Aéroports</h2>
              <p className='text-[#562D80]'>Trouvez des vols plus facilement en enregistrant votre aéroport local et les autres aéroports où vous vous rendez souvent.</p>
              <div>
                <h3 className='font-semibold'>Aéroport local</h3>
                {userLocalAirport !== null ? (
                  <div className='flex flex-row gap-2 bg-[#562D80] text-white rounded-lg p-2 items-center text-sm justify-between my-2 w-full max-w-[400px]'>
                    <p>{userLocalAirport}</p>
                    <button onClick={() => DeleteLocalAirport()} className='border-2 rounded-full py-1 px-2'>X</button>
                  </div>
                ) : (
                  <>
                    <input
                      type="text"
                      name="localAirport"
                      value={localAirport}
                      placeholder='Ajoutez votre aéroport local principal'
                      onChange={(e) => setLocalAirport(e.target.value)}
                      className="border-2 border-black p-1 w-full max-w-[457px] h-[53px] text-[15px] rounded-md"
                      onKeyDown={newLocalAirport}
                    />
                  </>
                )}
              </div>
              <div className='flex flex-col'>
                <h3 className='font-semibold'>Autres aéroports</h3>
                <div className='flex flex-row flex-wrap w-full gap-3'>
                  {airports === undefined ? null : airports.map((airport) => (
                  <div className='flex flex-row gap-2 bg-[#562D80] text-white rounded-lg p-2 items-center text-xs justify-between my-2' key={airport.id}>
                    <p>{airport.name}</p>
                    <button onClick={() => deleteAirport(airport.id)} className='border-2 rounded-full py-1 px-2'>X</button>
                  </div>
                  ))}
                </div>
                <input
                  type="text"
                  name="name"
                  placeholder='Saisissez un autre aéroport '
                  value={newAirport}
                  onChange={(e) => setNewAirport(e.target.value)}
                  onKeyDown={handleAddAirport}
                  className="border-2 border-black p-1 w-full max-w-[457px] h-[53px] text-[15px] rounded-md"
                />
              </div>
            </div>
          </div>
          <div className='border-2 border-[#562D80] rounded-md w-full max-w-[1200px]'>
            <div className='flex flex-col p-10 space-y-3 rounded-md'>
              <h2 className='font-bold text-[20px]'>Compagnies</h2>
              <p className='text-[#562D80]'>Affinez les résultats de recherche en précisant vos préférences pour les compagnies aériennes.</p>
              <h3 className='font-semibold'>A éviter</h3>
              <p className='text-[#562D80]'>Ces options apparaîtront en bas des résultats.</p>
              <div className='flex flex-row flex-wrap w-full gap-3'>
                {companies === undefined ? null : companies.map((company) => (
                  <div className='flex flex-row gap-2 bg-[#562D80] text-white rounded-lg p-2 items-center text-xs justify-between' key={company.id}>
                    <p>{company.name}</p>
                    <button onClick={() => deleteCompany(company.id)} className='border-2 rounded-full py-1 px-2'>X</button>
                  </div>
                ))}
              </div>
              <input
                type="text"
                placeholder='Recherche des compagnies aériennes'
                onChange={(e) => setAddCompany(e.target.value)}
                onKeyDown={newCompany}
                className="border-2 border-black p-1 w-full max-w-[457px] h-[53px] text-[15px] rounded-md"
              />
            </div>
          </div>
          <div className='border-2 border-[#562D80] rounded-md w-full max-w-[1200px]'>
            <div className='flex flex-col p-10 space-y-3 rounded-md'>
              <h2 className='font-bold text-[20px]'>Enseignes hôtelières</h2>
              <p className='text-[#562D80]'>Affinez les résultats de recherche en précisant vos préférences pour les enseignes hôtelières.</p>
              <h3 className='font-semibold'>Préféré</h3>
              <p className='text-[#562D80]'>Ces options apparaîtront en haut des résultats.</p>
              <div className='flex flex-row flex-wrap w-full gap-3'>
                {favoriteHotels === undefined ? null : favoriteHotels.map((favoriteHotel) => (
                  <div className='flex flex-row gap-2 bg-[#562D80] text-white rounded-lg p-2 items-center text-xs justify-between' key={favoriteHotel.id}>
                    <p>{favoriteHotel.name}</p>
                    <button onClick={() => deleteFavoriteHotel(favoriteHotel.id)} className='border-2 rounded-full py-1 px-2'>X</button>
                  </div>
                ))}
              </div>
              <input
                type="text"
                placeholder='Recherche des enseignes hôtelières'
                onChange={(e) => setAddFavoriteHotel(e.target.value)}
                onKeyDown={newFavoriteHotel}
                className="border-2 border-black p-1 w-full max-w-[457px] h-[53px] text-[15px] rounded-md"
              />
              <h3 className='font-semibold'>A éviter</h3>
              <p className='text-[#562D80]'>Ces options apparaîtront en bas des résultats.</p>
              <div className='flex flex-row flex-wrap w-full gap-3'>
                {dislikedHotels === undefined ? null: dislikedHotels.map((dislikedHotel) => (
                  <div className='flex flex-row gap-2 bg-[#562D80] text-white rounded-lg p-2 items-center text-xs justify-between' key={dislikedHotel.id}>
                    <p>{dislikedHotel.name}</p>
                    <button onClick={() => deleteDislikedHotel(dislikedHotel.id)} className='border-2 rounded-full py-1 px-2'>X</button>
                  </div>
                ))}
              </div>
              <input
                type="text"
                placeholder='Recherche des enseignes hôtelières'
                onChange={(e) => setAddDislikedHotel(e.target.value)}
                onKeyDown={newDislikedHotel}
                className="border-2 border-black p-1 w-full max-w-[457px] h-[53px] text-[15px] rounded-md"
              />
            </div>
          </div>
          <div className='border-2 border-[#562D80] rounded-md w-full max-w-[1200px]'>
            <div className='flex flex-col p-10 space-y-3 rounded-md'>
              <h2 className='font-bold text-[20px]'>Destinations enregistrées</h2>
              <p className='text-[#562D80]'>Choisissez l’une de vos destinations enregistrées pour trouver des hôtels et locations à proximité.</p>
              {ajoutLieu === false ? (
                <>
                  {destinations === undefined ? null : destinations.map((destination) => (
                    <>
                      <div className='flex flex-row gap-2 bg-white rounded-lg p-2 items-center' key={destination.id}>
                        <div className='flex flex-col gap-1 w-full max-w-[80%]'>
                          <p className='text-lg'>{destination.name}</p>
                          <p className='text-xs'>{destination.address}</p>
                        </div>
                        <div className='w-full max-w-[20%]'>
                          <button className="text-blue-800 font-semibold mr-5" onClick={() => {
                            setAddDestination(destination.name)
                            setAddDestinationAdress(destination.address)
                            setId(destination.id)
                            setEditDestination(!editDestination)
                            setAjoutLieu(!ajoutLieu)
                          }}>Modifier</button>
                          <button onClick={() => deleteDestination(destination.id)} className="text-blue-800 font-semibold">Supprimer</button>
                        </div>
                      </div>
                      <hr />
                    </>
                  ))}
                  <button className='bg-[#562D80] text-white p-1 rounded-md w-[195px] h-[53px]' onClick={() => setAjoutLieu(!ajoutLieu)}>Ajouter un lieu</button>
                </>
              ) : (
                <>
                  {editDestination ? (
                    <form onSubmit={(e) => {
                      e.preventDefault()
                      addDestination && addDestinationAdress && modifyDestination(id)
                    }} className='flex flex-col gap-2'>
                      <div className='flex flex-row gap-2 my-5'>
                        <input type='text' placeholder='Saisissez un hôtel une adresse ou une attraction' onChange={(e) => setAddDestinationAdress(e.target.value)} value={addDestinationAdress} className='border-2 border-black p-1 w-full max-w-[457px] h-[53px] text-[15px] rounded-md' />
                        <input type="text" onChange={(e) => setAddDestination(e.target.value)} value={addDestination} className='border-2 border-black p-1 w-full max-w-[457px] h-[53px] text-[15px] rounded-md' />
                      </div>
                      <div className='flex flex-row gap-2'>
                        <button type='submit' className='bg-[#562D80] text-white p-1 rounded-md w-[152px] h-[53px]'>Enregister</button>
                        <button onClick={() => setAjoutLieu(!ajoutLieu)} className='border-2 border-black p-1 rounded-md w-[152px] h-[53px]'>Annuler</button>
                      </div>
                    </form>
                  ) : (
                    <form onSubmit={(e) => { e.preventDefault(); addDestination && addDestinationAdress && newDestination(); }} className='flex flex-col gap-2'>
                      <div className='flex flex-row gap-5 my-5'>
                        <input type='text' placeholder='Saisissez un hôtel une adresse ou une attraction' onChange={(e) => setAddDestinationAdress(e.target.value)} value={addDestinationAdress} className='border-2 border-black p-1 w-full max-w-[457px] h-[53px] text-[15px] rounded-md' />
                        <input type="text" onChange={(e) => setAddDestination(e.target.value)} value={addDestination} className='border-2 border-black p-1 w-full max-w-[457px] h-[53px] text-[15px] rounded-md'/>
                      </div>
                      <div className='flex flex-row gap-2'>
                        <button type='submit' className='bg-[#562D80] text-white p-1 rounded-md w-[152px] h-[53px]'>Enregister</button>
                        <button onClick={() => setAjoutLieu(!ajoutLieu)} className='border-2 border-black p-1 rounded-md w-[152px] h-[53px]'>Annuler</button>
                      </div>
                    </form>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preferences;
