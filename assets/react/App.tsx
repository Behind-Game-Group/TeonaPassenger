import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Layout from './Layout';
import Home from './pages/home/Home';
import VolsPage from './pages/vols/page';
import UserProvider from './context/UserContext';



function App() {
  return (
    <UserProvider>
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
    </UserProvider>
  );
}

export default App;
