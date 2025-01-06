import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Layout from './Layout';
import Home from './pages/home/Home';
import VolsPage from './pages/vols/page';
import UserProvider from './context/UserContext';
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
              <Route path="/vols/page" element={<VolsPage />} />
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
