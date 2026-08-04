import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Nav from './components/Nav';
import Home from './components/pages/Home';
import VoterLogin from './components/pages/voterLogin';
import VoterRegister from './components/pages/voterRegister';
import Copywright from './components/Copywright';
import VoterDashboard from './components/pages/voterDashboard';
import VoterResults from './components/pages/voterResults';
import Footer from './components/Footer'

export default function App() {
  const location = useLocation();
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/voter/login" element={<VoterLogin />} />
        <Route path="/voter/register" element={<VoterRegister />} />
        <Route path="/voter/dashboard" element={<VoterDashboard />} />
        <Route path="/voter/results/:electionId" element={<VoterResults />} />
      </Routes>
      {location.pathname === "/" && <Footer />}
      <Copywright />
    </>
  );
}
