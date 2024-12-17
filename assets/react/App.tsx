import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/home/Home';
import Nav from './components/nav/Nav';
// Ajouter l'import
import UserProfile from './pages/profile/UserProfile';

function App() {
  return (
    <Router>
    <>
        <Nav/>
        <Routes>
        <Route path="/" element={<Home />} />
        {/* Ajouter la route */}
        <Route path="/profile" element={<UserProfile />} />
        </Routes>
    </>
    </Router>
  );
}

export default App;
