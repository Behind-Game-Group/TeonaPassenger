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

    const { authenticatorView, setAuthenticatorView } = useUserContext();

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassWord(e.target.value);
    };

    const url: string = register ? '/registerCredentials' : '/loginCredentials';

    const postData = async () => {
        const data = {
        email: email,
        password: password,
        };
        // console.log(data);
        try {
        if (url !== undefined) {
            const response = await postMethod(url, data);
            console.log('Réponse du serveur après la requête POST :', response);
            if (response) {
                console.log(response);
                if (register) {
                    setRegister(!register);
                } else {
                    setAuthenticatorView(!authenticatorView);
                    window.location.reload();
                }
            }
        }
        } catch (error) {
        console.error('Erreur lors de la requête POST :', error);
        }
    };

  return (
    <div className="relative w-[60%] p-2 h-[70%] place-content-center z-20 rounded-lg bg-white text-white gap-2 flex flex-col items-center justify-around hover:brightness-95">
        <div className='flex flex-col items-center justify-around'>
            <h2 className='text-black text-2xl'>Bienvenue sur TEONA PASSAGER.</h2>
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
            <div className='w-[50%] h-[2px] bg-gray-500'/>
            <text className='text-black text-xl text-center'>ou</text>
            <div className='w-[50%] h-[2px] bg-gray-500'/>
        </div>
          <text className='text-black text-xl text-center'>{register ? 'Inscrivez-' : 'Connectez-'}vous avec votre adresse mail et votre mot de passe ou <button className='text-customBlue text-xl' onClick={()=>setRegister(!register)}>{register ? 'connectez' : 'inscrivez'} vous ici</button></text>
        <div className='flex flex-col p-2 items-center gap-3 justify-around w-[80%] h-auto'>
            <input onChange={handleEmailChange} className='rounded-md p-2 w-[300px] border-gray-500 border text-center text-black' type='email' name='email' placeholder='Saisissez votre adresse électronique...' value={email}/>
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
            <input onClick={postData} className='rounded-md p-2 border-gray-500 border bg-customBlue text-center text-white' type='submit' value={register ? "S'inscrire" : 'Se connecter'}/>
        </div>
    </div>
  )
}
