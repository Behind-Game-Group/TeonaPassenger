import React, { createContext, useContext, useState, useEffect, Dispatch, SetStateAction } from 'react';
import { jwtDecode } from 'jwt-decode';

// Définir le type pour les données utilisateur
interface User {
    email: string;
}

// Définir le type du contexte utilisateur
interface UserContextType {
    user: User | null;
    setUser: Dispatch<SetStateAction<User | null>>;
}

// Créez un contexte utilisateur avec les types appropriés
const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => {}, // Fonction vide par défaut
});

// Fournisseur de contexte utilisateur
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    // Vérifier le token dans le localStorage au chargement initial
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                // Décoder le token pour récupérer les données utilisateur
                const decoded: any = jwtDecode(token);
                setUser({ email: decoded.email }); // Mettre à jour le contexte utilisateur
            } catch (error) {
                console.error('Token invalide', error);
            }
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

// Hook pour accéder au contexte utilisateur
export const useUser = () => useContext(UserContext);