import React, { useEffect, useState } from 'react';
import { postMethod, getMethod, deleteMethod, putMethod } from '../../services/axiosInstance';
import { useUserContext } from '../../context/UserContext';

type Expeditor = {
    id: number,
    email: string;
};

type Trip = {
    id: number;
    destination: string;
    name: string;
    departureDate: string;
    arrivalDate: string;
    consultation: boolean;
};

type SharedTrip = {
    id: number;
    email: string;
    isEditable: boolean;
};

// Fonction pour formater une date au format 'YYYY-MM-DD'
const formatDateForInput = (date: string) => {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Mois commence à 0
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;  // Retourne au format 'YYYY-MM-DD'
};

function ProfileDisplay() {

    const [expeditorSuccessMessage, setExpeditorSuccessMessage] = useState<string>('');
    const [expeditorErrorMessage, setExpeditorErrorMessage] = useState<string>('');
    const [tripSuccessMessage, setTripSuccessMessage] = useState<string>('');
    const [tripErrorMessage, setTripErrorMessage] = useState<string>('');
    const [sharedTripSuccessMessage, setSharedTripSuccessMessage] = useState<string>('');
    const [sharedTripErrorMessage, setSharedTripErrorMessage] = useState<string>('');

    const [emailExpeditor, setEmailExpeditor] = useState<string>('');
    const [expeditors, setExpeditors] = useState<Expeditor[]>([]);

    // États des voyages
    const [name, setName] = useState<string>('');
    const [destination, setDestination] = useState<string>('');
    const [departureDate, setDepartureDate] = useState<string>('');
    const [arrivalDate, setArrivalDate] = useState<string>('');
    const [isConsultable, setIsConsultable] = useState<'isConsultableOption1' | 'isConsultableOption2' | null>(null);

    const [trips, setTrips] = useState<Trip[]>([]);
    const [tripToEdit, setTripToEdit] = useState<Trip | null>(null);  // Nouvel état pour l'édition
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);  // Indicateur de soumission en cours

    const [emailSharedTrip, setEmailSharedTrip] = useState<string>('');
    const [isEditable, setIsEditable] = useState<'isEditableOption1' | 'isEditableOption2' | null>(null);
    const [sharedTrips, setSharedTrips] = useState<SharedTrip[]>([]);

    const {csrfToken} = useUserContext();

    // Handlers pour chaque champ de formulaire
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

    const handleEmailChangeExpeditor = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmailExpeditor(e.target.value);
    };

    const handleEmailChangeSharedTrip = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmailSharedTrip(e.target.value);
    };

    const handleChoiceChangeSharedTrip = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if(value === 'isEditableOption1' || value === 'isEditableOption2') {
            setIsEditable(value);
        }
    };

    const handleSubmitExpeditor = async (e: React.FormEvent) => {
        e.preventDefault();
        setExpeditorSuccessMessage('');
        setExpeditorErrorMessage('');

        const url = '/expeditors';
        const data = { email: emailExpeditor, csrfToken };

        try {
            const response = await postMethod(url, data);

            if (response) {
                // Vérifier si la réponse contient un message
                setExpeditorSuccessMessage(response.message || 'Opération réussie');
                setExpeditorErrorMessage('');  // On réinitialise l'erreur en cas de succès
                fetchExpeditors(); // Recharge la liste des expéditeurs
            } else {
                setExpeditorErrorMessage('Une erreur inattendue est survenue.');
            }
        } catch (error: any) {
            console.error('Erreur Axios : ', error);

            if (error.response) {
                // Vérification du type d'erreur : on peut renvoyer le message d'erreur du backend
                setExpeditorErrorMessage(error.response.data.error || 'Une erreur est survenue.');
            } else {
                setExpeditorErrorMessage('Erreur réseau. Veuillez réessayer.');
            }
        }
    };


    const fetchExpeditors = async () => {
        const url = '/expeditors';

        try {
            const response = await getMethod(url);
            console.log('Réponse de l’API :', response);

            // Si la réponse contient un tableau, mettez à jour l'état
            if (response) {
                setExpeditors(response);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des expéditeurs :', error);
            setExpeditors([]); // Nettoyez les données en cas d'erreur
        }
    };

    useEffect(() => {
        fetchExpeditors();
    }, []);

    const handleDeleteExpeditor = async (emailToDelete: string) => {
        const url = '/expeditor';
        const data = { email: emailToDelete, csrfToken  };

        try {
            const response = await deleteMethod(url, data); // Envoyer l'email dans le corps

            if (response.status === 200) {
                setExpeditors((prevExpeditors) =>
                    prevExpeditors.filter((expeditor) => expeditor.email !== emailToDelete)
                );
                setExpeditorErrorMessage('');
                setExpeditorSuccessMessage('Expéditeur supprimé avec succès!');
            } else {
                setExpeditorSuccessMessage('');
                setExpeditorErrorMessage('Une erreur inattendue est survenue.');
            }
        } catch (error: any) {
            console.error('Erreur Axios : ', error);

            if (error.response) {
                setExpeditorErrorMessage(error.response.data.error || 'Une erreur est survenue.');
            } else {
                setExpeditorErrorMessage('Erreur réseau. Veuillez réessayer.');
            }
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
        const data = { id, csrfToken  };

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

    const handleSubmitSharedTrip = async (e: React.FormEvent) => {
        e.preventDefault();
        setSharedTripSuccessMessage('');
        setSharedTripErrorMessage('');

        // Validation côté client
        if (emailSharedTrip.trim() === '') {
            setSharedTripErrorMessage('Veuillez entrer un email valide.');
            return;
        }

        if (isEditable === null) {
            setSharedTripErrorMessage('Vous devez sélectionner si l\'utilisateur peut éditer ou non.');
            return;
        }

        const data = {
            email: emailSharedTrip,
            isEditable, 
            csrfToken 
        };

        const url = '/sharedtrips/add';

        try {
            const response = await postMethod(url, data);

            // Succès
            if (response && response.message) {
                setSharedTripSuccessMessage(response.message); // Assume que `response.message` existe
                fetchSharedTrips();
            } else {
                setSharedTripErrorMessage('Une erreur inattendue est survenue.');
            }
        } catch (error: any) {
            console.error('Erreur détectée:', error);

            // Gestion des erreurs du backend
            if (error.response) {
                // Erreur avec une réponse du serveur
                setSharedTripErrorMessage(error.response.data.error || 'Erreur inconnue du serveur.');
            } else if (error.request) {
                // Erreur réseau
                setSharedTripErrorMessage('Erreur réseau. Veuillez vérifier votre connexion.');
            } else {
                // Autre type d'erreur
                setSharedTripErrorMessage('Une erreur inattendue est survenue.');
            }
        }
        
    };

    const fetchSharedTrips = async () => {
        const url = '/sharedtrips/display';

        try {
            const response = await getMethod(url);
            console.log('Réponse de l’API :', response);

            // Si la réponse contient un tableau, mettez à jour l'état
            if (response) {
                // Formater les données avant de les assigner à l'état
                const formattedSharedTrips = response.map((sharedTrip: SharedTrip) => ({
                    ...sharedTrip,
                    isEditable: sharedTrip.isEditable, // Conserve la valeur booléenne telle quelle
                }));
                setSharedTrips(formattedSharedTrips);

                console.log('sharedTrips:', response);
                
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des voyages:', error);
            setSharedTrips([]);
        }
    };

    useEffect(() => {
        fetchSharedTrips();
    }, []);

    const handleDeleteSharedTrip = async (emailToDelete: string) => {
        const url = '/sharedtrips/delete';
        const data = { email: emailToDelete, csrfToken };

        try {
            const response = await deleteMethod(url, data); // Envoyer l'email dans le corps

            if (response.status === 200) {
                setSharedTrips((prevSharedTrips) =>
                    prevSharedTrips.filter((sharedTrip) => sharedTrip.email !== emailToDelete)
                );
                setSharedTripErrorMessage('');
                setSharedTripSuccessMessage('Voyageurs partagés supprimés avec succès!');
            } else {
                setSharedTripSuccessMessage('');
                setSharedTripErrorMessage('Une erreur inattendue est survenue.');
            }
        } catch (error: any) {
            console.error('Erreur Axios :', error);

            if (error.response) {
                setSharedTripErrorMessage(error.response.data.error || 'Une erreur est survenue.');
            } else {
                setSharedTripErrorMessage('Erreur réseau. Veuillez réessayer.');
            }
        }
    };

    return (
        <div className='flex flex-col items-center justify-around'>
            <div className='border-2 border-black p-4 rounded-lg'>
                <h1 className='text-3xl font-bold'>Ajouter un expéditeur</h1>
                <section className='flex flex-col items-center justify-around gap-4'>
                    <label htmlFor="email" className='text-black text-xl'>Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Ajouter l'email d'un expéditeur"
                        required
                        onChange={handleEmailChangeExpeditor}
                        value={emailExpeditor}
                        className='rounded-md p-2 w-[300px] border-gray-500 border text-center text-black'
                    />
                    <button
                        type="submit"
                        onClick={handleSubmitExpeditor}
                        className='rounded-md p-2 border-gray-500 border bg-customBlue text-center text-white hover:bg-blue-300 transition-all duration-200'
                    >
                        Ajouter
                    </button>
                </section>

                {/* Affichage des messages */}
                <div className='text-center'>
                    {expeditorSuccessMessage && <p className="text-green-500 mt-4">{expeditorSuccessMessage}</p>}
                    {expeditorErrorMessage && <p className="text-red-500 mt-4">{expeditorErrorMessage}</p>}
                </div>
            </div>

            {/* Liste des expéditeurs */}
            <div className='flex flex-col items-center justify-around mt-6'>
                <h2 className='text-2xl font-bold'>Liste des emails ajoutés :</h2>
                <ul className='list-disc text-black'>
                    {Array.isArray(expeditors) && expeditors.length > 0 ? (
                        expeditors.map((expeditor) => (
                            <li key={expeditor.id} className='mt-2'>
                                {expeditor.email}
                                <button
                                    onClick={() => handleDeleteExpeditor(expeditor.email)} // Passage de l'email spécifique à supprimer
                                    className="ml-2 text-red-500 hover:text-red-700"
                                >
                                    Delete
                                </button>
                            </li>
                        ))
                    ) : (
                        <p>Aucun expéditeur trouvé.</p>
                    )}
                </ul>
            </div>

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

            <a href="/trips" className='text-white hover:text-blue-700 bg-gray-300 p-4 rounded-lg shadow-lg mt-4'>Ajouter un voyage</a>

            <div className='flex flex-col items-center justify-around'>
                <div className='border-2 border-black p-4 rounded-lg'>
                    <h1 className='text-3xl font-bold'>Partager un voyage avec un autre utilisateur</h1>
                    <section className='flex flex-col items-center justify-around gap-4'>
                        <label htmlFor="email" className='text-black text-xl'>Entrez l'email ici</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="xyz@xyz.com"
                            required
                            onChange={handleEmailChangeSharedTrip}
                            value={emailSharedTrip}
                            className='rounded-md p-2 w-[300px] border-gray-500 border text-center text-black'
                        />
                        <h2 className='text-xl font-bold'>Peut éditer</h2>
                        <div className="flex items-center gap-4">
                            
                            <label htmlFor="isEditableOption1">Oui</label>
                            <input
                                type="radio"
                                name="choice"
                                value="isEditableOption1"
                                className='radio-button'
                                onChange={handleChoiceChangeSharedTrip}
                            />

                            <label htmlFor="isEditableOption2">Non</label>
                            <input
                                type="radio"
                                name="choice"
                                value="isEditableOption2"
                                className='radio-button'
                                onChange={handleChoiceChangeSharedTrip}
                            />
                        </div>

                        <button
                            type="submit"
                            onClick={handleSubmitSharedTrip}
                            className='rounded-md p-2 px-8 border-gray-500 border bg-customBlue text-center text-white hover:bg-blue-300 transition-all duration-200'
                        >
                            Ajouter
                        </button>
                    </section>

                    {/* Affichage des messages */}
                    <div className='text-center'>
                        {sharedTripSuccessMessage && <p className="text-green-500 mt-4">{sharedTripSuccessMessage}</p>}
                        {sharedTripErrorMessage && <p className="text-red-500 mt-4">{sharedTripErrorMessage}</p>}
                    </div>
                </div>
                {/* Liste des voyageurs partagés */}
                <div className='flex flex-col items-center justify-around mt-6'>
                    <h2 className='text-2xl font-bold'>Liste des voyageurs partagés</h2>
                    <ul className='list-disc text-black'>
                        {Array.isArray(sharedTrips) && sharedTrips.length > 0 ? (
                            sharedTrips.map((sharedTrip) => (
                                <li key={sharedTrip.id} className='mt-2'>
                                    {sharedTrip.email} - {sharedTrip.isEditable == true ? 'Peut éditer' : 'Ne peut pas éditer'}
                                    <button
                                        onClick={() => handleDeleteSharedTrip(sharedTrip.email)} // Passage de l'email spécifique à supprimer
                                        className="ml-2 text-red-500 hover:text-red-700"
                                    >
                                        Supprimer
                                    </button>
                                </li>
                            ))
                        ) : (
                            <p>Aucun voyageurs partagés trouvé.</p>
                        )}
                    </ul>
                </div>
            </div>


        </div>
    );
}

export default ProfileDisplay;
