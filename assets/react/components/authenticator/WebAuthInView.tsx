import React, { ChangeEvent } from 'react'
import { postMethod } from '../../services/axiosInstance';
import { startAuthentication, startRegistration } from '@simplewebauthn/browser';

interface WebAuthInViewProps {
    register: boolean;
    setRegister: (register: boolean) => void
    username: string;
    handleUsernameChange: (username: ChangeEvent<HTMLInputElement>) => void;
    email: string;
    handleEmailChange: (email: ChangeEvent<HTMLInputElement>) => void;
    error: string;
    setError: (username: string) => void;
    errorEmail: string;
    setErrorEmail: (email: string) => void;
    errorUsername: string;
    setErrorUrsername: (username: string) => void;
    success: string
    setSuccess: (success: string) => void;
    authenticatorView: boolean;
    setAuthenticatorView: (authenticatorView: boolean) => void;
}

export default function WebAuthInView({ register, setRegister, username, email, error, setError, errorEmail, setErrorEmail, errorUsername, setErrorUrsername, success, setSuccess, authenticatorView, setAuthenticatorView,
 handleEmailChange, handleUsernameChange }: WebAuthInViewProps) {
    
    const url: string = register ? '/register/options' : '/login';

    const postData = async () => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        
        if (register && !emailRegex.test(email)) {
            setError('Adresse e-mail invalide. Veuillez entrer une adresse valide.');
            setSuccess('');
            return;
        } else {
            setError('');
        }
        
        const data = { email: email, username: username, };
        
        try {
            const response = await fetch(url, {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
            });
            
            const options = await response.json();
            
            if (register) {
                const attResp = await startRegistration(options);
                console.log(attResp);
            } else {
                const assertion = await startAuthentication(options);
                const loginResponse = await fetch('/login', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(assertion)
                });
                console.log('Réponse du serveur après la requête POST :', loginResponse);
                
                if (loginResponse.ok) { setAuthenticatorView(true); }
            }
        } catch (error) {
            setError('Erreur survenue lors de la ' + (register ? 'inscription' : 'connexion') + ', veuillez réessayer.'); setSuccess(''); console.error('Erreur lors de la requête POST :', error);
        }
    };

  return (
    <>
        <span className='text-black text-xl text-center'>{register ? 'Inscrivez-' : 'Connectez-'}vous avec votre adresse mail ou votre nom d'utilisateur voir <button className='text-customBlue text-xl' onClick={() => setRegister(!register)}>{register ? 'connectez' : 'inscrivez'} vous ici</button></span>    
        <form onSubmit={(e) => { e.preventDefault(); (username || email) && postData(); }} 
            className='flex flex-col p-2 items-center gap-3 justify-around w-[80%] h-auto'>
            {error && <span className='text-red-500 text-xl'>{error}</span>}
            {success && <span className='text-green-500 text-xl'>{success}</span>}
            <input onChange={(email)=>handleEmailChange(email)} className='rounded-md p-2 w-[300px] border-gray-500 border text-center text-black' type='text' name='email' placeholder='Saisissez votre adresse électronique...' value={email} />
            {errorEmail && <span className='text-red-500 text-xs'>{errorEmail}</span>}
            {register && 
                <div className='flex flex-col justify-center gap-4'>
                    <text className='text-gray-400 text-xl text-center'>- ou -</text>
                    <input
                        onChange={(username)=>handleUsernameChange(username)}
                        className='rounded-md p-2 w-[300px] border-gray-500 border text-center text-black'
                        type={'text'}
                        name='username'
                        placeholder="Renseigner votre nom d'utilisateur"
                        value={username}
                    />
                </div>
                
            }
            {errorUsername && <span className='text-red-500 text-xs'>{errorUsername}</span>}
            <button className='rounded-md p-2 border-gray-500 border bg-customBlue text-center text-white' type='submit'>{register ? "S'inscrire" : 'Se connecter'}</button>
        </form>
    </>
  )
}
