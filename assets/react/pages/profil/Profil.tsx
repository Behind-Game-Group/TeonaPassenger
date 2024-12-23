import React, { useState, useEffect } from 'react';
import { postMethod, getMethod } from '../../services/axiosInstance';
import axios from 'axios';



function ProfileDisplay() {

    // Authorized expeditors
    const [email, setEmail] = useState<string>("");

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    useEffect(() => {
        const postExpeditors = async () => {
            const url = '/expeditors';
            const data = {
                email: email,
            }
            try {
                const response = await postMethod(url, data);
                console.log('Réponse du serveur après la requête POST :', response);
                if (response) {
                    console.log(response);
                }
            } catch (error) {
                console.error('Erreur lors de la requête POST :', error);
            }
        };
        postExpeditors();
    }, [email]);

    return (
        <div className='flex flex-col items-center justify-around'>
            <div>
                <h1 className='text-3xl font-bold'>Ajouter un expéditeur</h1>
                <section className='flex flex-col items-center justify-around gap-4'>
                    <label htmlFor="email" className='text-black text-xl'>Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Ajouter l'email d'un expéditeur"
                        required onChange={handleEmailChange}
                        value={email}
                        className='rounded-md p-2 w-[300px] border-gray-500 border text-center text-black'
                    />
                    <button type="submit" className='rounded-md p-2 border-gray-500 border bg-customBlue text-center text-white hover:bg-blue-300 transition-all duration-200'>Ajouter</button>
                </section>

            </div>
        </div>
    );

}

export default ProfileDisplay;
