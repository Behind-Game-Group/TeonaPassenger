import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Nav() {
    const location = useLocation();
    const [pathname, setPathname] = useState<string>(location.pathname); // Initialiser correctement
    const [showMenu, setShowMenu] = useState<boolean>(false);

    useEffect(() => {
        setPathname(location.pathname); // Met à jour le chemin quand l'utilisateur navigue
    }, [location.pathname]);

    return (
        <>
            {/* Navbar principale */}
            <nav className="w-screen fixed top-0 bg-white shadow-md z-10">
                <ul className="w-[90%] mx-auto h-16 flex flex-wrap justify-around items-center text-gray-400">
                    {/* Bouton pour afficher/cacher le menu */}
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className={`rounded-lg p-2 flex items-center justify-center gap-2 hover:text-white ${
                            showMenu ? "border-2 text-white" : "text-gray-400"
                        }`}
                    >
                        {showMenu ? "✖" : "☰"}
                    </button>

                    {/* Lien vers l'accueil */}
                    <li
                        className={`rounded-lg p-2 flex items-center justify-center hover:text-white ${
                            pathname === "/" ? "border-2 text-white" : "text-gray-400"
                        }`}
                    >
                        <Link to="/">Teoana Passenger</Link>
                    </li>

                    {/* Lien vers le profil */}
                    <li
                        className={`rounded-lg p-2 flex items-center justify-center hover:text-white ${
                            pathname === "/profile" ? "border-2 text-white" : "text-gray-400"
                        }`}
                    >
                        <Link to="/profile">Profil</Link>
                    </li>
                </ul>
            </nav>

            {/* Menu déroulant (visible quand `showMenu` est actif) */}
            {showMenu && (
                <div className="w-[30%] h-full top-16 bg-black text-white fixed z-20">
                    <div className="p-5">More</div>
                </div>
            )}
        </>
    );
}
