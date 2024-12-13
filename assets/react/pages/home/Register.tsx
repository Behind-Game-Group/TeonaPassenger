import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../service/context';

axios.defaults.withCredentials = true;

const RegisterForm = () => {
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
            const response = await axios.post('register', { email, password });
            console.log('User created successful:', response);
            setSuccess('Success');
            setError('');
        } catch (error) {
            console.error('Error creating user:', error);
            setError('Échec de l\'inscription');
            setSuccess('');
        }
    };

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