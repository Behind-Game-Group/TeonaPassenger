import React, { ChangeEvent, useState } from 'react';
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { postMethod } from '../../services/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../context/UserContext';

export default function Authenticator() {
    const navigate = useNavigate();
    const [register, setRegister] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const [password, setPassWord] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");
    const [errorEmail, setErrorEmail] = useState<string>("");
    const [errorPassword, setErrorPassword] = useState<string>("");

    const { authenticatorView, setAuthenticatorView } = useUserContext();

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassWord(e.target.value);
    };

    const url: string = register ? '/registerCredentials' : '/loginCredentials';

    const postData = async () => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/; // Au moins 8 caractères, une lettre et un chiffre.

        if (!emailRegex.test(email)) {
            setErrorEmail("Adresse e-mail invalide. Veuillez entrer une adresse valide.");
            setSuccess("");
            return;
        } else {
            setErrorEmail("");
        }

        if (!passwordRegex.test(password)) {
            setErrorPassword(
                "Mot de passe invalide. Il doit contenir au moins 8 caractères, une lettre et un chiffre."
            );
            setSuccess("");
            return;
        } else {
            setErrorPassword("");
        }

        const data = {
            email: email,
            password: password,
        };
        console.log(data);
        try {
            if (url !== undefined) {
                const response = await postMethod(url, data);
                console.log('Réponse du serveur après la requête POST :', response);
                if (response) {
                    console.log(response);
                    if (register) {
                        setRegister(!register);
                        setSuccess("Votre compte a bien été créé !");
                        setError("");
                    } else {
                        setAuthenticatorView(!authenticatorView);
                        window.location.reload();
                    }
                }
            }
        } catch (error) {
            const err = register ? "inscription" : "connexion";
            setError("Erreur survenue lors de la " + err + ", veuillez réessayer.");
            setSuccess("");
            console.error('Erreur lors de la requête POST :', error);
        }
    };

    return (
        <div className="relative w-[60%] p-2 h-[70%] place-content-center z-20 rounded-lg bg-white text-white gap-2 flex flex-col items-center justify-around hover:brightness-95">
            <div className='flex flex-col items-center justify-around'>
                <h2 className='text-black text-2xl'>Bienvenue sur TEONA PASSENGER.</h2>
                <h2 className='text-black text-2xl'>C'est parti pour un tour</h2>
            </div>
            <>
                <h3 className='text-black text-xl w-[80%]'>Connectez-vous ou créez un compte pour enregistrer des recherches, créer des Alertes de prix, voir les Offres privées et plus encore.</h3>
            </>
            <div className='flex flex-row items-center justify-around w-full h-10'>
                <button className='flex flex-row rounded-md p-2 border-gray-500 border items-center gap-2 text-black text-2xl'><FcGoogle />Google</button>
                <button className='flex flex-row rounded-md p-2 border-gray-500 border items-center gap-2 text-black text-2xl'><FaApple />Apple</button>
            </div>
            <div className='flex flex-row p-2 items-center gap-2 justify-around w-[80%] h-auto'>
                <div className='w-[50%] h-[2px] bg-gray-500' />
                <text className='text-black text-xl text-center'>ou</text>
                <div className='w-[50%] h-[2px] bg-gray-500' />
            </div>
            <text className='text-black text-xl text-center'>{register ? 'Inscrivez-' : 'Connectez-'}vous avec votre adresse mail et votre mot de passe ou <button className='text-customBlue text-xl' onClick={() => setRegister(!register)}>{register ? 'connectez' : 'inscrivez'} vous ici</button></text>
            <div className='flex flex-col p-2 items-center gap-3 justify-around w-[80%] h-auto'>
                {error && <text className='text-red-500 text-xl'>{error}</text>}
                {success && <text className='text-green-500 text-xl'>{success}</text>}
                {errorEmail && <text className='text-red-500 text-xs'>{errorEmail}</text>}
                <input onChange={handleEmailChange} className='rounded-md p-2 w-[300px] border-gray-500 border text-center text-black' type='email' name='email' placeholder='Saisissez votre adresse électronique...' value={email} />
                {errorPassword && <text className='text-red-500 text-xs'>{errorPassword}</text>}
                <div className='flex flex-row gap-2 ml-[22px]'>
                    <input
                        onChange={handlePasswordChange}
                        className='rounded-md p-2 w-[300px] border-gray-500 border text-center text-black'
                        type={showPassword ? 'text' : 'password'}
                        name='password'
                        placeholder='Renseigner votre mot de passe'
                        value={password}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className=''
                    >
                        {showPassword ? <FaEyeSlash size={20} color='#000' /> : <FaEye size={20} color='#000' />}
                    </button>
                </div>
                <button onClick={postData} className='rounded-md p-2 border-gray-500 border bg-customBlue text-center text-white' type='submit'>{register ? "S'inscrire" : 'Se connecter'}</button>
            </div>
        </div>
    )
}
