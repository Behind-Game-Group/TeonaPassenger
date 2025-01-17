import React, { useState } from 'react'
import { postMethod } from '../../services/axiosInstance';
import { useUserContext } from '../../context/UserContext';

export default function sharedtrip() {
        const [email, setEmail] = useState<string>('');
        const [errorMessage, setErrorMessage] = useState<string>('');
        const [isEditable, setIsEditable] = useState<'option1' | 'option2' | null>(null);
        const [ajout, setAjout] = useState<boolean>(false);
        const { csrfToken } = useUserContext();

        const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setEmail(e.target.value);
        };
    
        const handleChoiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setIsEditable(e.target.value === "option1" ? 'option1' : 'option2');
        };
    
        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
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
        
            const data = { 
                email: email, 
                isEditable, 
                csrfToken 
            };
    
            const url = '/sharedtrips/add';
        
            try {
                const response = await postMethod(url, data);
                if(response) {
                    console.log(response);
                    setAjout(false);
                    setEmail('');
                    setIsEditable(null);
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
        <>
        { ajout ? 
            <>
                <div className='fixed h-screen bg-customOrangeOpacity w-full top-0 left-0 flex justify-center items-center'>
                    <div className='bg-white flex flex-col justify-center items-center w-[507px] z-50 p-5'>
                        <button className='cursor-pointer text-[10px] text-black' onClick={() => setAjout(!ajout)}>X</button>
                        <h2 className='text-[20px] font-bold'>Partagez vos voyages</h2>
                        <p className='text-[15px] my-5 p-2'>Ajoutez les e-mails de vos compagnons de voyage pour partager automatiquement vos projets avec eux.</p>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Adresse e-mail"
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
                            className='rounded-md p-2 px-8 border-gray-500 border bg-customOrange text-center text-white'
                        >
                            Ajouter
                        </button>
                    </div>
                </div>
            </>
        :
            <button className="text-white bg-customOrange p-1 my-4 rounded-sm text-[15px] w-[200px]" onClick={() => {setAjout(!ajout), window.scrollTo({ top: 0, behavior: 'smooth' })}}>Ajouter une adresse e-mail</button>}
        </>
    )
}
