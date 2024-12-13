import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/home/Home';
import Nav from './components/nav/Nav';
import Profile from './pages/Profile/Profile';
import Add from './pages/Add/Add';

function App() {
  return (
    <Router>
    <>
        <Nav/>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/add" element={<Add />} />
        </Routes>
    </>
    </Router>
  );
}

export default App;
