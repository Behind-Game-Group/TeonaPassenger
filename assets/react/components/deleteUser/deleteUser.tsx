import React, { useState } from 'react'
import { useUserContext } from '../../context/UserContext';
import { deleteMethod } from '../../services/axiosInstance';

export default function deleteUser() {
    const [ajout, setAjout] = useState(false)
    const { currentUser, csrfToken } = useUserContext();

    const deleteUsers = async () => {
        const url = '/user/delete';
        const data = {
            email: currentUser.email,
            csrfToken: csrfToken 
        };

        try {
            const response = await deleteMethod(url, data);
            if (response) {
                console.log(response);
                setAjout(false);
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <>
        { ajout ? 
            <>
            <div className='fixed h-screen bg-customOrangeOpacity w-full top-0 left-0 flex justify-center items-center'>
                <div className='bg-white flex flex-col justify-center items-center w-[1050px] z-50 p-5'>
                    <h2 className='text-[20px] font-bold'>Supprimer le compte et les infos enregistrées</h2>
                    <p className='text-[15px] my-5 p-2'>En supprimant votre compte, vous perdrez vos préférences et infos enregistrées. Nous vous enverrons un e-mail à {currentUser.email} pour vous expliquer la suppression étape par étape.</p>
                    <div className='flex flex-row space-x-2'>
                        <button
                            onClick={() => deleteUsers()}
                            className='rounded-md p-2 px-8 mt-3 border bg-customOrange text-center text-white'
                        >
                            Supprimer mon compte
                        </button>
                        <button
                            onClick={() => setAjout(!ajout)}
                            className='rounded-md p-2 px-8 mt-3 border bg-gray-300 text-center text-gray-500'
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            </div>
        </>
        :
            <button className="text-white bg-customOrange p-1 my-4 ml-5 rounded-sm text-[15px] w-[200px]" onClick={() => {setAjout(!ajout), window.scrollTo({ top: 0, behavior: 'smooth' })}}>Supprimer mon compte</button>}
        </>
    )
}
