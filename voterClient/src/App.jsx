import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Home from './components/pages/Home';
import VoterLogin from './components/pages/voterLogin';
import VoterRegister from './components/pages/voterRegister';
import Copywright from './components/Copywrightopywright';
import VoterDashboard from './components/pages/voterDashboard';
import VoterResults from './components/pages/voterResults';
import Timer from './components/pages/Timer';

export default function App() {
  return (
    <>
      <Nav />
      <Timer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/voter/login" element={<VoterLogin />} />
        <Route path="/voter/register" element={<VoterRegister />} />
        <Route path="/voter/dashboard" element={<VoterDashboard />} />
        <Route path="/voter/results" element={<VoterResults />} />
      </Routes>
      <Copywright />
    </>
  );
}
