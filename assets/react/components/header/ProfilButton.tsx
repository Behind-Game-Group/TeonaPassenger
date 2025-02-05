import React, { useEffect, useState, useRef } from "react";
import { IoMdLogIn } from "react-icons/io";
import { IoCloseCircleOutline } from "react-icons/io5";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { useUserContext } from "../../context/UserContext";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export default function ProfilButton() {
  const { user } = useAuth0();
  const { currentUser, authenticatorView, setAuthenticatorView } =
    useUserContext();
  const { logout } = useAuth0();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null); // Déclaration du type


  // le menu se ferme lorsque l'utilisateur clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) // Vérifie si le clic est à l'extérieur
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      {/* Profil ou Connexion */}
      {currentUser.email ? (
        <div className="flex flex-col items-center">
          {/* Bouton Profil */}
          <button
            onClick={() => setMenuOpen(!isMenuOpen)}
            className="absolute top-1/2 right-6 transform -translate-y-1/2 w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center hover:brightness-95"
            aria-label="Afficher le menu profil"
          >
            <img
              className="w-[25px] rounded-full"
              src={user?.picture || "/img/connexion-icon.png"}
              alt="Profil"
            />
          </button>

          {/* Menu Burger */}
          {isMenuOpen && (
            <div
              ref={menuRef}
              className="absolute top-24 right-2 w-48 bg-white shadow-md rounded-lg py-2"
            >
              <ul className="flex flex-col text-sm text-gray-800">
                <li className="px-4 py-2 hover:bg-gray-100 text-center">
                  <Link to="/trips" onClick={() => setMenuOpen(false)}>
                    Trip
                  </Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 text-center">
                  <Link to="/aide-faq" onClick={() => setMenuOpen(false)}>
                    Aide/FAQ
                  </Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 text-center">
                  <Link to="/profil" onClick={() => setMenuOpen(false)}>
                    Votre compte
                  </Link>
                </li>
                <li className="px-4 py-2 mx-auto text-white bg-orange-500 rounded-md cursor-pointer flex items-center justify-center gap-2 hover:bg-orange-600 transition duration-200 ease-in-out">
                  <a
                    href="/logout"
                    className="flex items-center gap-2"
                    onClick={() => setMenuOpen(false)} // Ferme le menu après la déconnexion
                  >
                    <RiLogoutCircleRLine /> Déconnexion
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => setAuthenticatorView(!authenticatorView)}
          className={`fixed w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center top-[40px] right-8 hover:brightness-95 ${
            authenticatorView && "border border-white"
          }`}
          aria-label="Se connecter"
          title="Se connecter"
        >
          {authenticatorView ? (
            <IoCloseCircleOutline size={30} color="#FFF" />
          ) : (
            <IoMdLogIn size={30} color="#FFF" />
          )}
        </button>
      )}
    </div>
  );
}
