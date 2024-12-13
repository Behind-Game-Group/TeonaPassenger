import React, { createContext, useContext, useState, Dispatch, SetStateAction } from 'react';

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

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

// Hook pour accéder au contexte utilisateur
export const useUser = () => useContext(UserContext);