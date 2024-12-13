import React, { use, useEffect, useState } from 'react';
import ky from 'ky';

function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log({ email, password });
        if (!email || !password) {
            setError('Email and password are required');
            return;
        }
        try {
            ky.post('api/register', {
                json: {
                    email: email,
                    password: password
                }
            })
                .text() // Lire la réponse comme texte
                .then((responseText) => {
                    console.log(responseText); // Affichez la réponse brute
                })
                .catch((error) => {
                    console.error('Error:', error); // Gère les erreurs, si le statut est hors 2xx
                });
            setSuccess('Success');
            setError('');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Error during registration');
            setSuccess('');
        }
    };

    const handleEx = async (e: any) => {
        e.preventDefault();
        await ky.get('/api/profil');
    };

    return (
        <main className='h-screen w-screen flex justify-center items-center'>
            <section>
                <h1 className='bg-black text-white'>Connexion Page</h1>
                <form className='bg-white' onSubmit={handleSubmit}>
                    {error && <p className="text-red-500">{error}</p>}
                    {success && <p className="text-green-500">{success}</p>}
                    <input type="text" placeholder="Email" className='bg-black text-white' value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" placeholder="Mot de passe" className='bg-black text-white' value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button className='bg-black text-white'>Register</button>
                </form>
                <button onSubmit={handleEx}>Submit</button>
            </section>
        </main>

    )
}

export default Login;