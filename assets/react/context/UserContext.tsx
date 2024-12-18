import React, { createContext, useState, useContext, ReactNode, Dispatch, SetStateAction } from 'react';

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

  const updateUser = (newUserData: Partial<User>) => {
    setUser((prevUser) => ({ ...prevUser, ...newUserData }));
  };

  return (
    <UserContext.Provider value={{ user, updateUser, authenticatorView, setAuthenticatorView }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
