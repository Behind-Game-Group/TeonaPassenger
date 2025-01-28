import React, { useEffect, useState } from 'react'
import { useUserContext } from '../../context/UserContext';
import { deleteMethod, getMethod, postMethod, putMethod } from '../../services/axiosInstance';
import '../../../styles/trip.css';


type Trip = {
    id: number;
    destination: string;
    name: string;
    departureDate: string;
    arrivalDate: string;
    consultation: boolean;
};

const formatDateForInput = (date: string) => {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Mois commence à 0
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;  // Retourne au format 'YYYY-MM-DD'
};

export default function trip() {
    const [plus, setplus] = useState(false);
    const [trips, setTrips] = useState<Trip[]>([]);
    const [name, setName] = useState<string>('');
    const [destination, setDestination] = useState<string>('');
    const [departureDate, setDepartureDate] = useState<string>('');
    const [arrivalDate, setArrivalDate] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [errordate, setErrordate] = useState<string>('');
    const [isConsultable, setIsConsultable] = useState<'isConsultableOption1' | 'isConsultableOption2' | null>(null);
    const [tripToEdit, setTripToEdit] = useState<Trip | null>(null);  // Nouvel état pour l'édition
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);  // Indicateur de soumission en cours
    const { csrfToken } = useUserContext();

    const handleDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDestination(e.target.value);
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const handleDepartureDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDepartureDate(e.target.value);
    };

    const handleArrivalDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setArrivalDate(e.target.value);
    };

    const handleChoiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === 'isConsultableOption1' || value === 'isConsultableOption2') {
            setIsConsultable(value);
        }
    };

    // Validation des dates
    const validateDates = () => {
        const depDate = new Date(departureDate);
        const arrDate = new Date(arrivalDate);
        if (arrDate <= depDate) {
            setErrordate('La date d\'arrivée doit être après la date de départ.');
            return false;
        }
        return true;
    };

    // Soumission du formulaire (ajout ou mise à jour)
    const handleSubmitTrip = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');
        setErrordate('');

        if (!validateDates()) return;  // Validation avant envoi

        const data = {
            name,
            destination,
            departureDate,
            arrivalDate,
            isConsultable: isConsultable === 'isConsultableOption1' ? 'isConsultableOption1' : 'isConsultableOption2',
            csrfToken,
        };

        setIsSubmitting(true);  // Marquer la soumission en cours

        try {
            let response;

            if (tripToEdit) {
                // Si un voyage est en édition, faire une mise à jour (PUT)
                response = await putMethod(`/trip/${tripToEdit.id}`, data);
            } else {
                // Sinon, créer un nouveau voyage (POST)
                response = await postMethod('/trip/add', data);
            }

            if (response && response.message) {
                setSuccessMessage(response.message);
                fetchTrips();  // Recharge la liste des voyages
                resetForm();  // Réinitialiser le formulaire après la soumission
                setplus(!plus);
            } else {
                setErrorMessage('Une erreur inattendue est survenue.');
            }
        } catch (error: any) {
            console.error('Erreur détectée:', error);
            if (error.response) {
                setErrorMessage(error.response.data.error || 'Erreur inconnue du serveur.');
            } else if (error.request) {
                setErrorMessage('Erreur réseau. Veuillez vérifier votre connexion.');
            } else {
                setErrorMessage('Une erreur inattendue est survenue.');
            }
        } finally {
            setIsSubmitting(false);  // Fin de la soumission
        }
    };

    const fetchTrips = async () => {
        const url = '/trips/display';
        try {
            const response = await getMethod(url);
            if (response) {
                // Formater les dates avant de les assigner à l'état
                const formattedTrips = response.map((trip: Trip) => ({
                    ...trip,
                    departureDate: formatDateForInput(trip.departureDate),
                    arrivalDate: formatDateForInput(trip.arrivalDate),
                }));
                setTrips(formattedTrips);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des voyages:', error);
            setTrips([]);
        }
    };

    const handleDeleteTrip = async (id: number) => {
        const url = '/trip';
        const data = { id, csrfToken };

        try {
            const response = await deleteMethod(url, data);
            if (response.status === 200) {
                setSuccessMessage('Voyage supprimé avec succès!');
                // Rafraîchir la liste des voyages
                fetchTrips();

                // Si le voyage supprimé est celui qui est actuellement en édition, réinitialiser `tripToEdit`
                if (tripToEdit && tripToEdit.id === id) {
                    setTripToEdit(null);  // Réinitialise l'état de l'édition
                }
            } else {
                setErrorMessage('Une erreur inattendue est survenue.');
            }
        } catch (error: any) {
            console.error('Erreur Axios:', error);
            if (error.response) {
                setErrorMessage(error.response.data.error || 'Une erreur est survenue.');
            } else {
                setErrorMessage('Erreur réseau. Veuillez réessayer.');
            }
        }
    };


    // Fonction pour réinitialiser le formulaire après la soumission ou l'annulation de l'édition
    const resetForm = () => {
        setName('');
        setDestination('');
        setDepartureDate('');
        setArrivalDate('');
        setIsConsultable(null);
        setTripToEdit(null);  // Réinitialise l'état de l'édition
    };

    // Fonction de gestion de l'édition
    const handleEditTrip = (trip: Trip) => {
        setTripToEdit(trip);  // Remplir l'état avec les informations du voyage à éditer
        setName(trip.name);
        setDestination(trip.destination);
        setDepartureDate(trip.departureDate);
        setArrivalDate(trip.arrivalDate);
        setIsConsultable(
            trip.consultation === true
                ? 'isConsultableOption1'
                : trip.consultation === false
                    ? 'isConsultableOption2'
                    : 'isConsultableOption1'
        );
        console.log('trip.isConsultable:', trip.consultation);
        setplus(!plus);
    };
    useEffect(() => {
        fetchTrips();
    }, []);

    return (
        <div className='relative flex flex-col top-[-1.8rem] items-center bg-customOrange min-h-screen ml-64 lg:ml-64 md:ml-20 sm:ml-10 z-10'>
            <div className='flex flex-col items-center justify-center w-full max-w-[1000px]'>
                <div className='flex flex-row justify-between items-center w-full my-10 section-trip'>
                    <h1 className='text-5xl font-bold text-white'>Trips</h1>
                    <button onClick={() => setplus(!plus)} className='bg-white text-black p-2 rounded-md button-create'>Créer un Voyage</button>
                </div>
                <div className='w-full trip-list'>
                    <h2 className='text-white my-3'>Liste des Trips</h2>
                    <div className='flex flex-col gap-4 w-full list'>
                        {trips.length > 0 ? (
                            trips.map((trip) => (
                                <div key={trip.id} className='flex flex-row w-full lists'>
                                    <div className='bg-[#562D80] w-[20%] violet-list'></div>
                                    <div className='flex flex-row gap-2 bg-white p-4 w-[80%] justify-between'>
                                        <div className='flex flex-col gap-1'>
                                            <p className='font-bold text-[15px]'>{trip.name}</p>
                                            <p className='text-[15px]'>{trip.destination}</p>
                                            <p className='text-date'>{trip.departureDate} - {trip.arrivalDate}</p>
                                        </div>
                                        <div className='flex flex-row gap-1 buttons'>
                                            <button onClick={() => handleEditTrip(trip)} className=' text-blue-500'>Modifier</button>
                                            <button onClick={() => handleDeleteTrip(trip.id)} className=' text-blue-500'>Supprimer</button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className='text-white no-list'>Aucun trip trouvé.</p>
                        )}
                    </div>
                </div>
                {plus && (
                    <div className='flex flex-col items-center justify-around fixed top-0 left-0 right-0 bottom-0 bg-customOrangeOpacity z-10 '>
                        <div className='bg-white w-full max-w-[480px] mt-[90px] p-5 rounded create-trip'>
                            <div className='flex flex-row justify-between items-center'>
                                <h1 className='text-[20px] font-bold my-4'>{tripToEdit ? 'Éditer un voyage' : 'Créer un voyage'}</h1>
                                <button onClick={() => {setplus(!plus), resetForm()}}>X</button>
                            </div>
                            <section className='flex flex-col gap-4'>
                                <div className='flex flex-col'>
                                    <label htmlFor="destination" className='text-black text-[15px]'>Destination</label>
                                    <input
                                        type="text"
                                        name="destination"
                                        onChange={handleDestinationChange}
                                        value={destination}
                                        className='rounded-md p-2 w-full max-w-full border-gray-500 border text-black'
                                    />
                                </div>
                                <div className='flex flex-col'>
                                    <label htmlFor="name" className='text-black text-[15px]'>Nom du voyage</label>
                                    <input
                                        type="text"
                                        name="name"
                                        onChange={handleNameChange}
                                        value={name}
                                        className='rounded-md p-2 w-full max-w-full border-gray-500 border text-black'
                                    />
                                </div>
                                <div className='flex flex-row gap-3 date'>
                                    <div className='flex flex-col'>
                                        <label htmlFor="departureDate" className='text-black text-[15px]'>Date de début</label>
                                        <input
                                            type="date"
                                            name="departureDate"
                                            onChange={handleDepartureDateChange}
                                            value={departureDate}
                                            className='rounded-md p-2 w-[212px] border-gray-500 border text-center text-black'
                                        />
                                    </div>
                                    <div className='flex flex-col'>
                                        <label htmlFor="arrivalDate" className='text-black text-[15px]'>Date de fin</label>
                                        <input
                                            type="date"
                                            name="arrivalDate"
                                            onChange={handleArrivalDateChange}
                                            value={arrivalDate}
                                            className='rounded-md p-2 w-[212px] border-gray-500 border text-center text-black'
                                        />
                                    </div>
                                </div>
                                {errordate && <p className='text-red-500 text-[15px]'>{errordate}</p>}
                                <hr />
                                <div className="flex flex-col gap-4">
                                    <h3 className='font-bold text-[15px]'>Qui peut consulter votre voyage ?</h3>
                                    <div className='flex flex-row gap-3'>
                                        <input
                                            type="radio"
                                            name="choice"
                                            value="isConsultableOption1"
                                            className='radio-button'
                                            onChange={handleChoiceChange}
                                            checked={isConsultable === 'isConsultableOption1'}
                                        />
                                        <label htmlFor="isConsultableOption1" className='text-[15px]'>Toutes les personnes disposant du lien</label>
                                    </div>
                                    <div className='flex flex-row gap-3'>
                                        <input
                                            type="radio"
                                            name="choice"
                                            value="isConsultableOption2"
                                            className='radio-button'
                                            onChange={handleChoiceChange}
                                            checked={isConsultable === 'isConsultableOption2'}
                                        />
                                        <label htmlFor="isConsultableOption2" className='text-[15px]'>Seulement les personnes que vous invitez par e-mail</label>
                                    </div>
                                </div>
                                {errorMessage && <p className='text-red-500 text-[15px]'>{errorMessage}</p>}
                                <button
                                    type="submit"
                                    onClick={handleSubmitTrip}
                                    className='w-full max-w-[212px] rounded-md p-2 px-8 border-gray-500 border bg-customBlue text-center text-white hover:bg-blue-300 transition-all duration-200'
                                    disabled={isSubmitting}  // Désactiver le bouton en cours de soumission
                                >
                                    {tripToEdit ? 'Mettre à jour' : 'Ajouter'}
                                </button>
                            </section>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
