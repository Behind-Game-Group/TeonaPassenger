import React, { useState } from 'react';
import { postMethod } from '../../services/axiosInstance';

function SharedTrips() {
    const [email, setEmail] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isEditable, setIsEditable] = useState<boolean | null>(null);

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handleChoiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsEditable(e.target.value === "option1");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');
    
        // Validation côté client
        if (email.trim() === '') {
            setErrorMessage('Veuillez entrer un email valide.');
            return;
        }
    
        if (isEditable === null) {
            setErrorMessage('Vous devez sélectionner si l\'utilisateur peut éditer ou non.');
            return;
        }
    
        const data = { email, isEditable };
        const url = '/sharedtrips/add';
    
        try {
            const response = await postMethod(url, data);
            
            // Succès
            if (response) {
                setSuccessMessage(response.data.message); // Assume que `response.message` existe
            } else {
                setErrorMessage('Une erreur inattendue est survenue.');
            }
        } catch (error: any) {
            console.error('Erreur détectée:', error);
    
            // Gestion des erreurs du backend
            if (error.response) {
                // Erreur avec une réponse du serveur
                setErrorMessage(error.response.data.error || 'Erreur inconnue du serveur.');
            } else if (error.request) {
                // Erreur réseau
                setErrorMessage('Erreur réseau. Veuillez vérifier votre connexion.');
            } else {
                // Autre type d'erreur
                setErrorMessage('Une erreur inattendue est survenue.');
            }
        }
    };
    

    return (
        <div className='flex flex-col items-center justify-around'>
            <div>
                <h1 className='text-3xl font-bold'>Partager un voyage avec un autre utilisateur</h1>
                <section className='flex flex-col items-center justify-around gap-4'>
                    <label htmlFor="email" className='text-black text-xl'>Entrez l'email ici</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="xyz@xyz.com"
                        required
                        onChange={handleEmailChange}
                        value={email}
                        className='rounded-md p-2 w-[300px] border-gray-500 border text-center text-black'
                    />
                    <h2 className='text-xl font-bold'>Peut éditer</h2>
                    <div className="flex items-center gap-4">
                        <label htmlFor="option1">Oui</label>
                        <input
                            type="radio"
                            name="choice"
                            value="option1"
                            className='radio-button'
                            onChange={handleChoiceChange}
                        />

                        <label htmlFor="option2">Non</label>
                        <input
                            type="radio"
                            name="choice"
                            value="option2"
                            className='radio-button'
                            onChange={handleChoiceChange}
                        />
                    </div>

                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className='rounded-md p-2 px-8 border-gray-500 border bg-customBlue text-center text-white hover:bg-blue-300 transition-all duration-200'
                    >
                        Ajouter
                    </button>
                </section>

                {/* Affichage des messages */}
                <div className='text-center'>
                    {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
                    {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
                </div>
            </div>
        </div>
    );
}

export default SharedTrips;
