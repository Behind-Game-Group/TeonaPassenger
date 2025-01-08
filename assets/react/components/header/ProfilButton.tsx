import React, { useEffect, useState } from 'react'
import { IoMdLogIn } from "react-icons/io";
import { IoCloseCircleOutline } from "react-icons/io5";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { useUserContext } from '../../context/UserContext';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

export default function ProfilButton() {
    const { user } = useAuth0();
    const name = user?.name;
    const picture = user?.picture;
    const email = user?.email;
    console.log(name, email, picture);
    const { currentUser, updateUser, authenticatorView, setAuthenticatorView } = useUserContext();
    console.log(currentUser.email);

    useEffect(() => {
        if (user) {
            updateUser({firstName: user.given_name, lastName: user.family_name, email: user.email});
            console.log(user);
        }
      }, [user]);

  return (
    <>
    {/* Profil */}
    {currentUser.email ?
        <div className='flex flex-col w-[30%] h-auto justify-between items-center gap-2'>
            <Link
                to={'/profil'}
                className="relative w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center top-[50px] right-8 hover:brightness-95"
                aria-label="Accéder au profil"
            >
                <img className="w-[25px]" src="/img/connexion-icon.png" alt="" />
            </Link>
            <text className='absolute right-8 text-black'>Bienvenu, <text className='text-customBlue text-bold top-[70px]'>{currentUser.email}</text></text>
            <a
                href="/logout"
                className="absolute w-[100%] h-auto text-red-500 flex flex-row items-center justify-center gap-2 top-[100px] hover:brightness-95"
                aria-label="Se déconnecter"
            >
                <RiLogoutCircleRLine /> <text>Déconnexion</text>
            </a>
        </div>
        : 
        <>
        <button 
        onClick={()=>setAuthenticatorView(!authenticatorView)}
            className={`fixed w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center top-[40px] right-8 hover:brightness-95 hover:border hover:border-white ${authenticatorView && 'border border-white'}`}
            aria-label="Se connecter" title='Se connecter'>
                {authenticatorView ? <IoCloseCircleOutline size={30} color='#FFF'  /> : <IoMdLogIn size={30} color='#FFF' />}
        </button>
        </>
        }
    </>
  )
}
