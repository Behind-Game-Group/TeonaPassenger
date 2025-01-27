import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Layout from './Layout';
import Home from './pages/home/Home';
import VolsPage from './pages/vols/page';
import UserProvider from './context/UserContext';
import Favorite from './pages/profil/Favorite';
import Trips from './pages/trips/Trips';
import Profil from './pages/profil/Profil';
import Parametres from './pages/profil/parametres';
import Preferences from './pages/profil/preferences';
import Voyageur from './pages/profil/voyageurs';
import Auth0ProviderWithHistory from './providers/auth0Provider';
import Expeditors from './pages/expeditors/expeditors';

function App() {
  return (
    <UserProvider>
      <Router>
        <Auth0ProviderWithHistory>
          <>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/vols/page" element={<VolsPage />} />
                <Route path='/profil' element={<Profil />} />
                <Route path='/favorite' element={<Favorite />} />
                <Route path="/trips" element={<Trips />} />
                <Route path='/profil/parametres' element={<Parametres />}/>
                <Route path="/profil/preferences" element={<Preferences/>}/>
                <Route path="/profil/voyageurs" element={<Voyageur/>}/>
                <Route path="/profil/expeditors" element={<Expeditors/>}/>
                {/* Ajout de la route */}
              </Routes>
            </Layout>
          </>
        </Auth0ProviderWithHistory>
        </Router>
    </UserProvider>
  );
}

export default App;
