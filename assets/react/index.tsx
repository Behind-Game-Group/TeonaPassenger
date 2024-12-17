import { createRoot } from 'react-dom/client';
import React from 'react';
import App from './App';
import { UserProvider } from './context/UserContext'; // Importez le fournisseur

const container = document.getElementById('root');
const root = createRoot(container!); // createRoot(container!) if you use TypeScript
root.render(
    <React.StrictMode>
        <UserProvider>
            <App />
        </UserProvider>
    </React.StrictMode>
);
