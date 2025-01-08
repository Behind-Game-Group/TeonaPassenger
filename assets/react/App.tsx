import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Layout from './Layout';
import Home from './pages/home/Home';
import VolsPage from './pages/vols/page';
import UserProvider from './context/UserContext';
import Favorite from './pages/profil/Favorite';
import UserProfil from './pages/profil/UserProfil';
import SharedTrips from './pages/sharedtrips/Sharedtrips';
import Trips from './pages/trips/Trips';
import Profil from './pages/profil/Profil';
import Parametres from './pages/profil/parametres';
import Preferences from './pages/profil/preferences';
import Voyageur from './pages/profil/voyageurs';

function App() {
  return (
    <UserProvider>
      <Router>
        <>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/vols/page" element={<VolsPage />} />
              <Route path='/profil' element={<Profil />} />
              <Route path='/favorite' element={<Favorite />} />
              <Route path="/sharedtrips" element={<SharedTrips />} />
              <Route path="/trips" element={<Trips />} />
              <Route path='/UserProfil' element={<UserProfil />} />
              <Route path='/profil/parametres' element={<Parametres />}/>
              <Route path="/profil/preferences" element={<Preferences/>}/>
              <Route path="/profil/voyageurs" element={<Voyageur/>}/>
              {/* Ajout de la route */}
            </Routes>
          </Layout>
        </>
      </Router>
    </UserProvider>
  );
}

export default App;
