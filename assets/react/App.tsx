import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/home/Home';
import Connexion from './pages/home/Login';
import Inscription from './pages/home/Register';
import Nav from './components/nav/Nav';

function App() {
  return (
    <Router>
    <>
        <Nav/>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/register" element={<Inscription />} />
        </Routes>
    </>
    </Router>
  );
}

export default App;
