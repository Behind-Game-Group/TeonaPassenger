import React, { useState } from 'react'
import { useUserContext } from '../../context/UserContext';
import { postMethod } from '../../services/axiosInstance';

export default function expeditor() {
    const [expeditorSuccessMessage, setExpeditorSuccessMessage] = useState<string>('');
    const [expeditorErrorMessage, setExpeditorErrorMessage] = useState<string>('');
    const [emailExpeditor, setEmailExpeditor] = useState<string>('');
    const [ajout, setAjout] = useState<boolean>(false);
    const { csrfToken } = useUserContext();

    const handleEmailChangeExpeditor = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmailExpeditor(e.target.value);
    };

    const handleSubmitExpeditor = async (e: React.FormEvent) => {
        e.preventDefault();
        setExpeditorSuccessMessage('');
        setExpeditorErrorMessage('');

        const url = '/expeditors';
        const data = { email: emailExpeditor, csrfToken };

        try {
            const response = await postMethod(url, data);
            if(response) {
                console.log(response);
                setAjout(false);
                setEmailExpeditor('');
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
    return (
        <>
        { ajout ? 
            <>
                <div className='fixed h-screen bg-customOrangeOpacity w-full top-0 left-0 flex justify-center items-center'>
                    <div className='bg-white flex flex-col justify-center items-center w-[507px] z-50 p-5'>
                        <button className='cursor-pointer text-[25px] text-black' onClick={() => setAjout(!ajout)}>X</button>
                        <h2 className='text-[20px] font-bold'>Ajouter une adresse e-mail</h2>
                        <p className='text-[15px] my-5 p-2'>N’ajoutez que des adresses e-mail auxquelles vous ou un de vos proches avez accès. Au lieu d’envoyer des confirmations directement à partir d’un site de voyage, envoyez-les à votre adresse avant de les transférer à trips@theonagroup.fr.
                        </p>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Adresse e-mail"
                            required
                            onChange={handleEmailChangeExpeditor}
                            value={emailExpeditor}
                            className='rounded-md p-2 w-[300px] border-gray-500 border text-center text-black'
                        />
                        <button
                            type="submit"
                            onClick={handleSubmitExpeditor}
                            className='rounded-md p-2 px-8 mt-3 border-gray-500 border bg-customOrange text-center text-white'
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
