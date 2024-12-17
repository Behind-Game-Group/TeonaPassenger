import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import axios from 'axios';

export default function Nav() {
    const location = useLocation();
    const navigate = useNavigate();
    const [pathname, setPathname] = useState<string>();
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const { user, setUser, logout } = useUser();

    return (
        <>
            <nav className='w-screen fixed'>
                <ul className='w-[90%] h-full flex flex-wrap justify-around gap-10 items-center text-gray-400'>
                    <button onClick={() => (setShowMenu(!showMenu))} className={`rounded-lg p-2 flex flex-col items-center justify-center gap-2 hover:text-white ${showMenu ? 'border-2 text-white' : 'text-gray-400'}`}>
                        {showMenu ? '✖' : '☰'}
                    </button>
                    <li className={`rounded-lg p-2 flex flex-col items-center justify-center gap-2 hover:text-white ${pathname === "/" || "" ? 'border-2 text-white' : 'text-gray-400'}`}>
                        <Link to="/">Teoana Passenger</Link>
                    </li>
                    {user ? (
                        <>
                            <li className={`rounded-lg p-2 flex flex-col items-center justify-center gap-2 hover:text-white ${pathname === "/profil" ? 'border-2 text-white' : 'text-gray-400'}`}>
                                <Link to="/profil">Profil</Link>
                            </li>
                            <li className={`rounded-lg p-2 flex flex-col items-center justify-center gap-2 hover:text-white ${pathname === "/profil" ? 'border-2 text-white' : 'text-gray-400'}`}>
                                <button onClick={logout}>Déconnexion</button>
                            </li>
                        </>
                        
                    ) : (
                        // Si l'utilisateur n'est pas connecté
                        <>
                            <li className={`rounded-lg p-2 flex flex-col items-center justify-center gap-2 hover:text-white ${pathname === "/connexion" ? 'border-2 text-white' : 'text-gray-400'}`}>
                                <Link to="/login">Connexion</Link>
                            </li>
                            <li className={`rounded-lg p-2 flex flex-col items-center justify-center gap-2 hover:text-white ${pathname === "/register" ? 'border-2 text-white' : 'text-gray-400'}`}>
                                <Link to="/register">Inscription</Link>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
            {showMenu &&
                <div className='w-[30%] h-full top-24 p-5 bg-black text-white fixed'>
                    More
                </div>
            }
        </>
    )
}
