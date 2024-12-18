import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { postMethod } from '../../services/axionsInstances';
import { jwtDecode } from 'jwt-decode';

axios.defaults.withCredentials = true;

const LoginForm = () => {
    const navigate = useNavigate();
    const { user, setUser } = useUser();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        const url = 'loginCheck';
        const data = {
            email: email,
            password: password,
        };
        event.preventDefault();
        try {
            const response = await postMethod(url, data);
            console.log('Réponse du serveur après la requête POST :', response);
            if (response) {
                setSuccess("Connexion réussie");
                if (response.token) {
                    localStorage.setItem('token', response.token); // Stocker le token
                    console.log('Token reçu et sauvegardé:', response.token);
                    const decoded: any = jwtDecode(response.token); // Décoder le token
                    setUser({ email: decoded.email }); // Mettre à jour le contexte utilisateur
                    console.log('Connexion réussie');
                    navigate('/profil');
                } else {
                    setError("Connexion échouée");
                }
            }
        } catch (error) {
            console.log('Erreur lors de la requête POST :', error);
            setError("Connexion échouée");
        }
    };

    return (
        <section>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">email</label>
                <input
                    id='email'
                    name='email'
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                />
                <label htmlFor="password">password</label>
                <input
                    id='password'
                    name='password'
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />
                <button type="submit">Login</button>
                {error && <p>{error}</p>}
                {success && <p>{success}</p>}
            </form>
        </section>

    );
};

export default LoginForm;