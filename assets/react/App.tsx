import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Layout from './Layout';
import Home from './pages/home/Home';
import UserProvider from './context/UserContext';
import Profil from './pages/profil/Profil';
import Resultat from './pages/Résultat/Resultat';


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
              <Route path="/resultat" element={<Resultat />} />
              <Route path="/resultat/:city" element={<Resultat />} />
              </Routes>
          </Layout>
        </>
      </Router>
    </UserProvider>
  );
}

export default App;
