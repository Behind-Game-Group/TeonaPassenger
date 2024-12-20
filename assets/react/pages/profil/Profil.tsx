import React, { useState, useEffect } from 'react';
import axios from 'axios';



function ProfileDisplay() {

    interface Profil {
        name: string;
        surname: string;
        username: string;
        avatar: string;
        site: string;
        localAirport: string;
    }
    
    const [profil, setProfil] = useState<Profil | null>(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('/profil/display', { withCredentials: true }) // Inclut les cookies
            .then((response) => {
                setProfil(response.data[0]);
            })
            .catch((error) => {
                setError(error.response ? error.response.data.error : error.message);
            });
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!profil) {
        return <div>Loading...</div>;
    }

    return (
        <div className='flex flex-col items-center justify-around'>
            <div>
                <h1>Profile Details</h1>
                <p>Name: {profil.name}</p>
                <p>Surname: {profil.surname}</p>
                <p>Username: {profil.username}</p>
                <p>Avatar: <img src={profil.avatar} alt="Avatar" /></p>
                <p>Site: {profil.site}</p>
                <p>Local Airport: {profil.localAirport}</p>
            </div>
        </div>
    );
}

export default ProfileDisplay;
