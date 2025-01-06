import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Layout from './Layout';
import Home from './pages/home/Home';
import UserProvider from './context/UserContext';
import Profil from './pages/profil/Profil';
import Resultat from './pages/Résultat/Resultat';
import Parametres from './pages/profil/parametres';
import Preferences from './pages/profil/preferences';
import Voyageurs from './pages/profil/voyageurs';
import AjouterVoyageur from './pages/profil/ajoutervoyageur';
import Favorite from './pages/profil/Favorite';
import UserProfil from './pages/profil/UserProfil';
import ProfileDisplay from './pages/profil/Profil';
import SharedTrips from './pages/sharedtrips/Sharedtrips';
import Trips from './pages/trips/Trips';

function App() {
  return (
    <UserProvider>
      <Router>
        <>
          <Layout>
              <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/:category" element={<Home />} />
              <Route path="/profil" element={<Profil />} />
              <Route path="/profil/parametres.tsx" element={<Parametres/>} />
              <Route path="/profil/preferences.tsx" element={<Preferences/>} />
              <Route path="/profil/voyageurs.tsx" element={<Voyageurs/>} />
              <Route path="/profil/ajoutervoyageur.tsx" element={<AjouterVoyageur/>} />
              <Route path="/resultat" element={<Resultat />} />
              <Route path="/resultat/:city" element={<Resultat />} />
              <Route path='/profil' element={<ProfileDisplay />} />
              <Route path='/favorite' element={<Favorite />} />
              <Route path="/sharedtrips" element={<SharedTrips />} />
              <Route path="/trips" element={<Trips />} />
              {/* Ajout de la route */}
              <Route path='/UserProfil' element={<UserProfil />} />
              </Routes>
          </Layout>
        </>
      </Router>
    </UserProvider>
  );
}

export default App;
