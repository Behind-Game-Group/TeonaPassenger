import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
    id: number;
    email: string;
}

const Profile = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get('http://localhost:8000/api/users');
                console.log("Données reçues :", response.data);
                setUsers(response.data); // Remplace par response.data.users si nécessaire
            } catch (error) {
                console.error("An error occurred while fetching users", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex items-center justify-center h-screen w-screen">
            <div className="flex flex-col items-center justify-center w-40 h-40 shadow-lg rounded-lg bg-slate-200">
                <h1>Liste des utilisateurs</h1>

                <ul>
                    {users?.length > 0 ? (
                        users.map((user) => (
                            <li key={user.id}>
                                <strong>{user.email}</strong>
                            </li>
                        ))
                    ) : (
                        <li>Aucun utilisateur trouvé.</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Profile;
