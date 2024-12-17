import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/home/Home';
import Connexion from './pages/home/Login';
import Inscription from './pages/home/Register';
import Profil from './pages/home/Profil';
import Nav from './components/nav/Nav';

function App() {
  return (
    <Router>
    <>
        <Nav/>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Connexion />} />
        <Route path="/register" element={<Inscription />} />
        <Route path="/profil" element={<Profil />} />
        </Routes>
    </>
    </Router>
  );
}

export default App;
