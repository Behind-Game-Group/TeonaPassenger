import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from '../../service/context';
import { useNavigate } from 'react-router-dom';

axios.defaults.withCredentials = true;

const LoginForm = () => {
    const navigate = useNavigate();
    const { user, setUser } = useUser();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prévenir le comportement par défaut de soumission de formulaire
        console.log({ email, password });
        if (!email || !password) {
            setError('Email and password are required');
            return;
        }
        try {
            const response = await axios.post('login_check',
                {
                    email: email,
                    password: password,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true
                }
            );
            if (response.status === 200) {
                const userData = { email };
                setUser(userData);
            }
            navigate('/profil');
            console.log('Login successful:', response);
        } catch (error) {
            setError('Échec de l\'authentification');
            setSuccess('');
            console.error('Error logging in:', error);
        }
    };

    if (!user === null) {
        navigate('/profil');
    }

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