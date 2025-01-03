import React, { useEffect, useState } from 'react';
import { postMethod, getMethod, deleteMethod } from '../../services/axiosInstance';
import { useUserContext } from '../../context/UserContext';

type Expeditor = {
    id: number,
    email: string;
};

type SharedTrip = {
    id: number;
    email: string;
    isEditable: boolean;
};


function ProfileDisplay() {

    const [expeditorSuccessMessage, setExpeditorSuccessMessage] = useState<string>('');
    const [expeditorErrorMessage, setExpeditorErrorMessage] = useState<string>('');
    const [sharedTripSuccessMessage, setSharedTripSuccessMessage] = useState<string>('');
    const [sharedTripErrorMessage, setSharedTripErrorMessage] = useState<string>('');

    const [emailExpeditor, setEmailExpeditor] = useState<string>('');
    const [expeditors, setExpeditors] = useState<Expeditor[]>([]);



    const [emailSharedTrip, setEmailSharedTrip] = useState<string>('');
    const [isEditable, setIsEditable] = useState<'isEditableOption1' | 'isEditableOption2' | null>(null);
    const [sharedTrips, setSharedTrips] = useState<SharedTrip[]>([]);

    const {csrfToken} = useUserContext();

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

                setExpeditorSuccessMessage(response.message || 'Opération réussie');
                setExpeditorErrorMessage('');  
                fetchExpeditors(); 
            } else {
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

    useEffect(() => {
        fetchExpeditors();
    }, []);

    const handleDeleteExpeditor = async (emailToDelete: string) => {
        const url = '/expeditor';
        const data = { email: emailToDelete, csrfToken  };

        try {
            const response = await deleteMethod(url, data); 

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


    const handleSubmitSharedTrip = async (e: React.FormEvent) => {
        e.preventDefault();
        setSharedTripSuccessMessage('');
        setSharedTripErrorMessage('');

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

            if (response && response.message) {
                setSharedTripSuccessMessage(response.message); 
                fetchSharedTrips();
            } else {
                setSharedTripErrorMessage('Une erreur inattendue est survenue.');
            }
        } catch (error: any) {
            console.error('Erreur détectée:', error);

            if (error.response) {
                
                setSharedTripErrorMessage(error.response.data.error || 'Erreur inconnue du serveur.');
            } else if (error.request) {
            
                setSharedTripErrorMessage('Erreur réseau. Veuillez vérifier votre connexion.');
            } else {
                
                setSharedTripErrorMessage('Une erreur inattendue est survenue.');
            }
        }
        
    };

    const fetchSharedTrips = async () => {
        const url = '/sharedtrips/display';

        try {
            const response = await getMethod(url);
            console.log('Réponse de l’API :', response);

            if (response) {
                
                const formattedSharedTrips = response.map((sharedTrip: SharedTrip) => ({
                    ...sharedTrip,
                    isEditable: sharedTrip.isEditable, 
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
            const response = await deleteMethod(url, data);

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
                                    onClick={() => handleDeleteExpeditor(expeditor.email)}
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
                                        onClick={() => handleDeleteSharedTrip(sharedTrip.email)}
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
