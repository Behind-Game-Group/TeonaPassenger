import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/home/Home';
import Nav from './components/nav/Nav';
import Layout from './Layout';

function App() {
  return (
    <Router>
    <>
    <Layout>
        
        <Routes>
        <Route path="/" element={<Home />} />
        </Routes>
    </Layout>
    </>
    </Router>
  );
}

export default App;
