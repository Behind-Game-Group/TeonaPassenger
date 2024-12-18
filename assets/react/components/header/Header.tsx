import React from 'react'
import { FiMenu } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import ProfilButton from './ProfilButton';

interface HomeProps{
    isSidebarExpanded: boolean;
    toggleExpandSidebar: () => void;
}

export default function Header({isSidebarExpanded, toggleExpandSidebar}: HomeProps) {
  return (
    <>
        {/* Header */}
        <header className="fixed top-0 w-full flex justify-between bg-customOrange border-b border-white z-50">
          <button
            onClick={toggleExpandSidebar}
            className="text-white mb-4 fixed top-[3.5rem] left-[1.5rem] z-50"
            aria-label="Élargir la barre latérale"
          >
            <FiMenu size={24} />
          </button>

          {/* Logo et titre */}
          <div
            className={`relative flex w-full p-4 transition-all duration-300 `}
          >
            <Link to={"/"} className="flex relative left-10">
              <img
                src="/img/logo.svg"
                alt="Logo"
                width={92}
                height={92}
                className="top-[1.3rem]"
              />
              <div className="relative flex flex-col top-7">
                <span className="font-bold text-xl text-white">
                  TEONA PASSENGER
                </span>
                <span className="text-sm text-white">All Wonders Whatever</span>
              </div>
            </Link>
          </div>

          {/* Profil */}
              <ProfilButton />
        </header>
    </>
  )
}
