import React, { useEffect, useState } from 'react';
import { postMethod, getMethod, deleteMethod, putMethod } from '../../services/axiosInstance';
import { useUserContext } from '../../context/UserContext';

type Trip = {
    id: number;
    destination: string;
    name: string;
    departureDate: string;
    arrivalDate: string;
    consultation: boolean;
};

// Fonction pour formater une date au format 'YYYY-MM-DD'
const formatDateForInput = (date: string) => {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Mois commence à 0
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;  // Retourne au format 'YYYY-MM-DD'
};

// Utilitaire pour obtenir la date d'aujourd'hui
const getTodayDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Mois de 0 à 11
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
};

// Utilisez cette fonction pour initialiser departureDate

function Trips() {

    const [tripSuccessMessage, setTripSuccessMessage] = useState<string>('');
    const [tripErrorMessage, setTripErrorMessage] = useState<string>('');

    // États des voyages
    const [name, setName] = useState<string>('');
    const [destination, setDestination] = useState<string>('');
    const [departureDate, setDepartureDate] = useState(getTodayDate());
    const [arrivalDate, setArrivalDate] = useState<string>('');
    const [isConsultable, setIsConsultable] = useState<'isConsultableOption1' | 'isConsultableOption2' | null>(null);

    const [trips, setTrips] = useState<Trip[]>([]);
    const [tripToEdit, setTripToEdit] = useState<Trip | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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

    const handleChoiceChangeExpeditor = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            setTripErrorMessage('La date d\'arrivée doit être après la date de départ.');
            return false;
        }
        return true;
    };

    // Soumission du formulaire (ajout ou mise à jour)
    const handleSubmitTrip = async (e: React.FormEvent) => {
        e.preventDefault();
        setTripSuccessMessage('');
        setTripErrorMessage('');

        if (!validateDates()) return;  // Validation avant envoi
        const data = {
            name,
            destination,
            departureDate,
            arrivalDate,
            isConsultable: isConsultable === 'isConsultableOption1' ? 'isConsultableOption1' : 'isConsultableOption2',
            csrfToken
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
                setTripSuccessMessage(response.message);
                fetchTrips();  // Recharge la liste des voyages
                resetForm();  // Réinitialiser le formulaire après la soumission
            } else {
                setTripErrorMessage('Une erreur inattendue est survenue.');
            }
        } catch (error: any) {
            console.error('Erreur détectée:', error);
            if (error.response) {
                setTripErrorMessage(error.response.data.error || 'Erreur inconnue du serveur.');
            } else if (error.request) {
                setTripErrorMessage('Erreur réseau. Veuillez vérifier votre connexion.');
            } else {
                setTripErrorMessage('Une erreur inattendue est survenue.');
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
                setTripSuccessMessage('Voyage supprimé avec succès!');
                // Rafraîchir la liste des voyages
                fetchTrips();

                // Si le voyage supprimé est celui qui est actuellement en édition, réinitialiser `tripToEdit`
                if (tripToEdit && tripToEdit.id === id) {
                    setTripToEdit(null);  // Réinitialise l'état de l'édition
                }
            } else {
                setTripErrorMessage('Une erreur inattendue est survenue.');
            }
        } catch (error: any) {
            console.error('Erreur Axios:', error);
            if (error.response) {
                setTripErrorMessage(error.response.data.error || 'Une erreur est survenue.');
            } else {
                setTripErrorMessage('Erreur réseau. Veuillez réessayer.');
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
    };

    useEffect(() => {
        fetchTrips();
    }, []);

    return (
        <div>

            <div className='border-2 border-black p-4 rounded-lg text-center justify-center'>
                <h1 className='text-3xl font-bold'>{tripToEdit ? 'Éditer un voyage' : 'Créer un voyage'}</h1>
                <section className='flex flex-col items-center justify-around gap-4'>
                    <label htmlFor="destination" className='text-black text-xl'>Nom de la destination</label>
                    <input
                        type="text"
                        name="destination"
                        placeholder="Destination de votre choix"
                        required
                        onChange={handleDestinationChange}
                        value={destination}
                        className='rounded-md p-2 w-[300px] border-gray-500 border text-center text-black'
                    />

                    <label htmlFor="name" className='text-black text-xl'>Nom du voyage</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Nom du voyage"
                        required
                        onChange={handleNameChange}
                        value={name}
                        className='rounded-md p-2 w-[300px] border-gray-500 border text-center text-black'
                    />

                    <label htmlFor="departureDate" className='text-black text-xl'>Date de départ</label>
                    <input
                        type="date"
                        name="departureDate"
                        required
                        onChange={handleDepartureDateChange}
                        value={departureDate}
                        className='rounded-md p-2 w-[300px] border-gray-500 border text-center text-black'
                    />

                    <label htmlFor="arrivalDate" className='text-black text-xl'>Date d'arrivée</label>
                    <input
                        type="date"
                        name="arrivalDate"
                        required
                        onChange={handleArrivalDateChange}
                        value={arrivalDate}
                        className='rounded-md p-2 w-[300px] border-gray-500 border text-center text-black'
                    />

                    <div className="flex items-center gap-4">
                        <label htmlFor="isConsultableOption1">
                            Toutes les personnes disposant du lien
                        </label>
                        <input
                            type="radio"
                            id="isConsultableOption1"
                            name="choice"
                            value="isConsultableOption1"
                            className="radio-button"
                            onChange={handleChoiceChangeExpeditor}
                            checked={isConsultable === 'isConsultableOption1'}
                        />

                        <label htmlFor="isConsultableOption2">
                            Seulement les personnes que vous invitez par e-mail
                        </label>
                        <input
                            type="radio"
                            id="isConsultableOption2"
                            name="choice"
                            value="isConsultableOption2"
                            className="radio-button"
                            onChange={handleChoiceChangeExpeditor}
                            checked={isConsultable === 'isConsultableOption2'}
                        />
                    </div>

                    <button
                        type="submit"
                        onClick={handleSubmitTrip}
                        className='rounded-md p-2 px-8 border-gray-500 border bg-customBlue text-center text-white hover:bg-blue-300 transition-all duration-200'
                        disabled={isSubmitting}  // Désactiver le bouton en cours de soumission
                    >
                        {tripToEdit ? 'Mettre à jour' : 'Ajouter'}
                    </button>
                </section>

                {/* Affichage des messages */}
                <div className='text-center'>
                    {tripSuccessMessage && <p className="text-green-500 mt-4">{tripSuccessMessage}</p>}
                    {tripErrorMessage && <p className="text-red-500 mt-4">{tripErrorMessage}</p>}
                </div>
            </div>

            {/* Liste des voyages */}
            <div className='flex flex-col items-center justify-around mt-6'>
                <h2 className='text-2xl font-bold'>Liste des voyages</h2>
                <ul className='list-disc text-black'>
                    {Array.isArray(trips) && trips.length > 0 ? (
                        trips.map((trip) => (
                            <li key={trip.id} className='mt-2'>
                                {trip.name} - {trip.destination} - {trip.departureDate} - {trip.arrivalDate} - {trip.consultation == false ? 'Seulement les personnes que vous invitez par e-mail' : 'Toutes les personnes disposant du lien'}
                                <button
                                    onClick={() => handleDeleteTrip(trip.id)}
                                    className="ml-2 text-red-500 hover:text-red-700"
                                >
                                    Supprimer
                                </button>
                                <button
                                    onClick={() => handleEditTrip(trip)}
                                    className="ml-2 text-blue-500 hover:text-blue-700"
                                >
                                    Éditer
                                </button>
                            </li>
                        ))
                    ) : (
                        <p>Aucun voyage trouvé.</p>
                    )}
                </ul>
            </div>
        </div>
    );
}

export default Trips;