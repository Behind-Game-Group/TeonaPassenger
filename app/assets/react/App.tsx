import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/home/Home';
import Layout from './Layout';
import VolsPage from './pages/vols/page';



function App() {
  return (
    <Router>
    <>
    <Layout>
        
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/vols/page" element={<VolsPage />} />
        </Routes>
    </Layout>
    </>
    </Router>
  );
}

export default App;