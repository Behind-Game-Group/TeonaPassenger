import React from 'react';
import { useUser } from '../../service/context';
import { useNavigate } from 'react-router-dom';

function Profil() {
    const navigate = useNavigate();
    const { user } = useUser();

    console.log(user?.email);

    if (user === null) {
        navigate('/connexion');
    }

    return (
        <div>
            {user ? <h1>Bienvenue, {user.email}!</h1> : <h1>Veuillez vous connecter</h1>}
        </div>
    );
};

export default Profil;