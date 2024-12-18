import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
    id: number;
    email: string;
    password: string;
}

const Profil = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [formError, setFormError] = useState('');
    const [editUserId, setEditUserId] = useState<number | null>(null);

    // Fonction pour récupérer les utilisateurs existants
    const fetchUsers = async () => {
        const url = '/userlist';
        try {
            setIsLoading(true);
            const response = await axios.get(url);
            console.log("Données reçues :", response.data);
            setUsers(response.data); // Assurez-vous que les données renvoyées correspondent au format attendu
        } catch (error) {
            console.error("Une erreur s'est produite lors de la récupération des utilisateurs", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Appeler fetchUsers au montage du composant
    useEffect(() => {
        fetchUsers();
    }, []);

    // Gestion des changements dans le formulaire
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // POST A USER IN DATABASE
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormError('');

        if (!formData.email) {
            setFormError("L'email est requis.");
            return;
        }

        if (!formData.password) {
            setFormError("Le mot de passe est requis.");
            return;
        }

        try {
            if (editUserId) {
                const response = await axios.put(`http://localhost:8000/update-user/${editUserId}`, formData);
                console.log(response.data);
                if (response.data.status === 'success') {
                    console.log("Utilisateur mis à jour avec succès :", response.data.message);
                    alert("Utilisateur mis à jour avec succès.");
                    // Réinitialiser le formulaire
                    setFormData({ email: '', password: '' });
                    setEditUserId(null);
                    // Recharger les utilisateurs
                    fetchUsers();
                } else {
                    setFormError(response.data.message || "Une erreur s'est produite.");
                }
            } else {
                const response = await axios.post('http://localhost:8000/insert-user-data', formData);

                if (response.data.status === 'success') {
                    console.log("Utilisateur ajouté avec succès :", response.data.message);
                    alert("Utilisateur ajouté avec succès.");
                    // Réinitialiser le formulaire
                    setFormData({ email: '', password: '' });

                    // Recharger les utilisateurs
                    fetchUsers();
                } else {
                    setFormError(response.data.message || "Une erreur s'est produite.");
                }
            }
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.message) {
                setFormError(error.response.data.message);
            } else {
                setFormError("Une erreur inattendue s'est produite.");
            }
        }
    };

    // DELETE A USER IN DATABASE
    const handleDelete = async (id: number) => {
        try {
            const response = await axios.delete(`http://localhost:8000/delete-user/${id}`);
            console.log(response.data);
            if (response.data.status === 'success') {
                console.log("Utilisateur supprimé avec succès :", response.data.message);
                alert("Utilisateur supprimé avec succès.");
                // Réinitialiser le formulaire
                setFormData({ email: '', password: '' });

                // Recharger les utilisateurs
                fetchUsers();
            } else {
                setFormError(response.data.message || "Une erreur s'est produite.");
            }
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.message) {
                setFormError(error.response.data.message);
            } else {
                setFormError("Une erreur inattendue s'est produite.");
                console.log(error);
            }
        }
    };

    // UPDATE A USER IN DATABASE
    const handleUpdate = (user: User) => {
        setEditUserId(user.id);
        setFormData({ email: user.email, password: user.password })
    };

    if (isLoading) {
        return <div>Chargement...</div>;
    }

    return (
        <div className="flex items-center justify-center h-screen w-screen gap-4">
            {/* Liste des utilisateurs */}
            <div className="flex flex-col items-center justify-center w-96 h-96 shadow-lg rounded-lg bg-slate-200">
                <h1>Liste des utilisateurs</h1>
                <ul>
                    {users.length > 0 ? (
                        users.map((user) => (
                            <li key={user.id} className='flex flex-row gap-4 items-center'>
                                <strong>{user.email}</strong>
                                <button onClick={() => handleDelete(user.id)} className='bg-red-300 w-8 shadow-lg rounded-lg'>X</button>
                                <button onClick={() => handleUpdate(user)} className='bg-blue-300 w-8 shadow-lg rounded-lg'>V</button>
                            </li>
                        ))
                    ) : (
                        <li>Aucun utilisateur trouvé.</li>
                    )}
                </ul>
            </div>

            {/* Formulaire pour ajouter un utilisateur */}
            <div className="card bg-slate-200 shadow-lg p-4 rounded-lg">
                <div className="card-header">
                    <h5 className="card-title">Ajouter un utilisateur</h5>
                </div>

                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                placeholder="Entrez l'email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />

                            <label htmlFor="password">Mot de passe</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                name="password"
                                placeholder="Entrez votre mot de passe"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        {formError && (
                            <div className="text-red-500 text-sm mt-2">{formError}</div>
                        )}

                        <button type="submit" className="btn btn-primary mt-4">
                            Ajouter
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profil;
