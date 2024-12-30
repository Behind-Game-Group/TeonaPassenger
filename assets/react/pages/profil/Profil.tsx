import React, { useEffect, useState } from 'react';
import { getMethod, postMethod } from '../../services/axiosInstance';
import { useUserContext } from '../../context/UserContext';

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

const Profile = () => {
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
    const { csrfToken } = useUserContext();

    useEffect(() => {
        getCompanies();
        getFavoriteHotels();
        getDislikedHotels();
        getDestinations();
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

    return (
        <div className={`flex flex-col items-center bg-customOrange`}>
            <h1 className='text-white text-3xl'>Profile</h1>
            <div className='flex flex-col border-2 border-black rounded-sm items-center mb-5 w-[800px]'>
                <div className='flex flex-col gap-2 p-5'>
                    <h2 className='text-xl'>Compagnies</h2>
                    <p className='text-sm'>Affinez les résultats de recherche en précisant vos préférences pour les compagnies aériennes.</p>
                    <h3 className='text-xl'>A éviter</h3>
                    <p className='text-sm'>Ces options apparaîtront en bas des résultats.</p>
                    <div className='flex flex-row flex-wrap gap-2'>
                        {companies === undefined ? <p></p> : companies.map((company) => (
                            <div className='flex flex-row gap-2 bg-white rounded-lg p-2 items-center text-xs' key={company.id}>
                                {company.name}
                                <button className='bg-red-500 text-white p-1 rounded-md' onClick={() => deleteCompany(company.id)}>X</button>
                            </div>
                        ))}
                    </div>
                    <input type='text' placeholder='Recherche des compagnies aériennes' onChange={(e) => setAddCompany(e.target.value)} onKeyDown={newCompany} />
                </div>
            </div>
            <div className='flex flex-col border-2 border-black rounded-sm items-center mb-5 w-[800px]'>
                <div className='flex flex-col gap-2 p-5'>
                    <h2 className='text-xl'>Enseignes hôtelières</h2>
                    <p className='text-sm'>Affinez les résultats de recherche en précisant vos préférences pour les enseignes hôtelières.</p>
                    <h3 className='text-xl'>Préféré</h3>
                    <p className='text-sm'>Ces options apparaîtront en haut des résultats.</p>
                    <div className='flex flex-row flex-wrap gap-2'>
                        {favoriteHotels === undefined ? <p></p> : favoriteHotels.map((favoriteHotel) => (
                            <div className='flex flex-row gap-2 bg-white rounded-lg p-2 items-center text-xs' key={favoriteHotel.id}>
                                {favoriteHotel.name}
                                <button className='bg-red-500 text-white p-1 rounded-md' onClick={() => deleteFavoriteHotel(favoriteHotel.id)}>X</button>
                            </div>
                        ))}
                    </div>
                    <input type='text' placeholder='Recherche des enseignes hôtelières' onChange={(e) => setAddFavoriteHotel(e.target.value)} onKeyDown={newFavoriteHotel} />

                    <h3 className='text-xl mt-5'>A éviter</h3>
                    <p className='text-sm'>Ces options apparaîtront en bas des résultats.</p>
                    <div className='flex flex-row flex-wrap gap-2'>
                        {dislikedHotels === undefined ? <p></p> : dislikedHotels.map((dislikedHotel) => (
                            <div className='flex flex-row gap-2 bg-white rounded-lg p-2 items-center text-xs' key={dislikedHotel.id}>
                                {dislikedHotel.name}
                                <button className='bg-red-500 text-white p-1 rounded-md' onClick={() => deleteDislikedHotel(dislikedHotel.id)}>X</button>
                            </div>
                        ))}
                    </div>
                    <input type='text' placeholder='Recherche des enseignes hôtelières' onChange={(e) => setAddDislikedHotel(e.target.value)} onKeyDown={newDislikedHotel} />
                </div>
            </div>

            <div className='flex flex-col border-2 border-black rounded-sm items-center mb-5 w-[800px]'>
                <div className='flex flex-col gap-2 p-5'>
                    <h2 className='text-xl'>Destinations enregistrées</h2>
                    <p className='text-sm'>Choisissez l’une de vos destinations enregistrées pour trouver des hôtels et locations à proximité.</p>
                    {ajoutLieu === false ? (
                        <>
                            {destinations === undefined ? <p></p> : destinations.map((destination) => (
                                <div className='flex flex-row gap-2 bg-white rounded-lg p-2 items-center text-xs justify-between' key={destination.id}>
                                    <div className='flex flex-col gap-1'>
                                        <p className='text-lg'>{destination.name}</p>
                                        <p className='text-xs'>{destination.address}</p>
                                    </div>
                                    <div>
                                        <button className='bg-orange-500 text-white p-1 rounded-md' onClick={() => {
                                            setAddDestination(destination.name)
                                            setAddDestinationAdress(destination.address)
                                            setId(destination.id)
                                            setEditDestination(!editDestination)
                                            setAjoutLieu(!ajoutLieu)
                                        }}>Modifier</button>
                                        <button className='bg-red-500 text-white p-1 rounded-md' onClick={() => deleteDestination(destination.id)}>Supprimer</button>
                                    </div>
                                </div>
                            ))}
                            <button onClick={() => setAjoutLieu(!ajoutLieu)}>Ajouter un lieu</button>
                        </>
                    ) : (
                        <>
                            {editDestination ? (
                                <form onSubmit={(e) => {
                                    e.preventDefault()
                                    addDestination && addDestinationAdress && modifyDestination(id)
                                }} className='flex flex-col gap-2'>
                                    <div className='flex flex-row gap-2'>
                                        <input type='text' placeholder='Saisissez un hôtel une adresse ou une attraction' onChange={(e) => setAddDestinationAdress(e.target.value)} value={addDestinationAdress} />
                                        <input type="text" onChange={(e) => setAddDestination(e.target.value)} value={addDestination} />
                                    </div>
                                    <div className='flex flex-row gap-2'>
                                        <button type='submit'>Enregister</button>
                                        <button onClick={() => setAjoutLieu(!ajoutLieu)}>Annuler</button>
                                    </div>
                                </form>
                            ) : (
                                <form action={addDestination && addDestinationAdress && newDestination} className='flex flex-col gap-2'>
                                    <div className='flex flex-row gap-2'>
                                        <input type='text' placeholder='Saisissez un hôtel une adresse ou une attraction' onChange={(e) => setAddDestinationAdress(e.target.value)} value={addDestinationAdress} />
                                        <input type="text" onChange={(e) => setAddDestination(e.target.value)} value={addDestination} />
                                    </div>
                                    <div className='flex flex-row gap-2'>
                                        <button type='submit'>Enregister</button>
                                        <button onClick={() => setAjoutLieu(!ajoutLieu)}>Annuler</button>
                                    </div>
                                </form>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;