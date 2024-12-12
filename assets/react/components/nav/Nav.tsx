import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Nav() {
    const location = useLocation();
    const [pathname, setPathname] = useState<string>();
    const [showMenu, setShowMenu] = useState<boolean>(false);
    
  return (
      <>
        <nav className='w-screen fixed'>
            <ul className='w-[90%] h-full flex flex-wrap justify-around gap-10 items-center text-white'>
                <button onClick={()=>(setShowMenu(!showMenu))} className={`rounded-lg p-2 flex flex-col items-center justify-center gap-2 text-white hover:text-white ${showMenu ? 'text-white' : 'text-white'}`}>
                      {showMenu ? '✖' : '☰'}
                </button>
                <li className={`rounded-lg p-2 flex flex-col items-center justify-center gap-2 hover:text-white ${pathname === "/" || "" ? 'border-2 text-white' : 'text-white'}`}>
                    <Link to="/">Teoana Passenger</Link>
                </li>
                <li className={`rounded-lg p-2 flex flex-col items-center justify-center gap-2 hover:text-white ${pathname === "/profil" ? 'border-2 text-white' : 'text-white'}`}>
                    <Link to="/">Profil</Link>
                </li>
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
