import React, { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';

function Profil() {
    const navigate = useNavigate();
    const { user } = useUser();
    const [hasReloaded, setHasReloaded] = useState(false);

    console.log(user);
    if (user === null) {
        navigate('/login');
    }

    return (
        <div>
            {user ? <h1>Bienvenue, {user.email}!</h1> : <h1>Veuillez vous connecter</h1>}
        </div>
    );
};

export default Profil;