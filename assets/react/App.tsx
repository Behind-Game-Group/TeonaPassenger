import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Layout from './Layout';
import Home from './pages/home/Home';
import UserProvider from './context/UserContext';


function App() {
  return (
    <UserProvider>
      <Router>
        <>
          <Layout>
              <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/:category" element={<Home />} />
              </Routes>
          </Layout>
        </>
      </Router>
    </UserProvider>
  );
}

export default App;
