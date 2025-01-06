import axios from 'axios';
import React, { createContext, useState, useContext, ReactNode, Dispatch, SetStateAction, useEffect } from 'react';

// Définition des types des données utilisateur avec les champs supplémentaires
interface User {
  firstName?: string;
  lastName?: string;
  email?: string;
}

// Crée le contexte pour l'utilisateur avec le type User
interface UserContextType {
    user: User;
    authenticatorView: boolean;
    setAuthenticatorView: Dispatch<SetStateAction<boolean>>;
    updateUser: (newUserData: Partial<User>) => void;
    csrfToken: string | null;
    setCsrfToken: Dispatch<SetStateAction<string | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User>({});
  const [authenticatorView, setAuthenticatorView] = useState<boolean>(false);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

    useEffect(() => {
        // Récupérer l'utilisateur courant et le token CSRF
        axios.get('/getCurrentUser')
            .then(response => {
                setUser(response.data.user);
                // console.log(response);
                // Récupérer le token CSRF et le stocker dans les cookies et le contexte
                setCsrfToken(response.data.user.csrfToken);
                localStorage.setItem('csrfToken', response.data.user.csrfToken);
            })
            .catch(error => {
                console.error('Error fetching current user:', error.response?.data || error.message);
            });
        // console.log(csrfToken)
    }, []);

  const updateUser = (newUserData: Partial<User>) => {
    setUser((prevUser) => ({ ...prevUser, ...newUserData }));
  };

  return (
    <UserContext.Provider value={{ user, updateUser, csrfToken, setCsrfToken, authenticatorView, setAuthenticatorView }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;