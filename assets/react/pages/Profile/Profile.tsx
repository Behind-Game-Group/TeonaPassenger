import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
    id: number;
    name: string;
    email: string;
}

const Profile = () => {
    const [user, setUser] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get('http://localhost:8000/api/users') // automatically requests the data from the API
                    .then((response) => {
                        console.log("Données reçues :", response.data);

                        return response.data;
                    });
                setUser(response.data); // allows us to access the data in the state
                setIsLoading(false);
            } catch (error) {
                console.log("An error occured while fetching user");

            }
        };

        fetchUser();
    }, []); // runs the effect only once

    if (isLoading) {
        return <div>Loading...</div>;
    }
    
    return (
        <div className='flex items-center justify-center h-screen w-screen'>
            <div className='flex flex-col items-center justify-center w-40 h-40 shadow-lg rounded-lg bg-slate-200'>
                <h1>Liste des utilisateurs</h1>

                <ul>
                    {user.map((user) => (
                        <li key={user.id}>
                            <strong>{user.name}</strong> - {user.email}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default Profile;