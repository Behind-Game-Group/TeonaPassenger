import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { postMethod } from '../../services/axionsInstances';

axios.defaults.withCredentials = true;

const RegisterForm = () => {
    const navigate = useNavigate();
    const { user, setUser } = useUser();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        const url = 'registerUser';
        const data = {
        email: email,
        password: password,
        };
        event.preventDefault();
        try {
        const response = await postMethod(url, data);
        console.log('Réponse du serveur après la requête POST :', response);
        if (response) {
            setSuccess("L'utilisateur à été enregistrer avec succès")
            navigate('/login');
        }
        } catch (error) {
            console.log('Erreur lors de la requête POST :', error);
            const errorMessage = error instanceof Error ? error.message : String(error);
            setError(errorMessage); 
        }
    };

    //event: React.FormEvent<HTMLFormElement>
    //event.preventDefault(); // Prévenir le comportement par défaut de soumission de formulaire

    return (
        <section>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />
                <button type="submit">Register</button>
                {error && <p>{error}</p>}
            </form>
        </section>

    );
};

export default RegisterForm;