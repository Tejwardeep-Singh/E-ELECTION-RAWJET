import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Home from './components/pages/Home';
import HeadLogin from './components/pages/HeadLogin';
import Copywright from './components/Copywright';
import HeadDashboard from './components/pages/HeadDashboard';
import AddAdminForm from './components/pages/addAdminForm';
import ViewAdmins from './components/pages/ViewAdmins';
import EditAdmin from './components/pages/EditAdmin';
import DeleteAdmin from './components/pages/DeleteAdmin';
import AdminDashboard from './components/pages/adminDashboard';
import AdminLogin from './components/pages/AdminLogin';
import AddCandidate from './components/pages/AddCandidate';
import ViewCandidate from './components/pages/ViewCandidate';
import EditCandidate from './components/pages/EditCandidate';
import DeleteCandidate from './components/pages/DeleteCandidate';
import Election from './components/pages/setElection';
import ResultsDashboard from './components/pages/viewResults';
import Timer from './components/pages/Timer';


export default function App() {
  return (
    <>
      <Nav />
      <Timer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/head" element={<HeadLogin />} />
        <Route path="/head/dashboard" element={<HeadDashboard />} />
        <Route path="/head/addAdmin" element={<AddAdminForm />} />
        <Route path="/head/viewAdmins" element={<ViewAdmins />} />
        <Route path="/head/editAdmin/" element={<EditAdmin />} />
        <Route path="/head/election/" element={<Election />} />
        <Route path="/head/deleteAdmin/" element={<DeleteAdmin />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/candidate/add" element={<AddCandidate />} />
        <Route path="/admin/candidate/edit" element={<EditCandidate />} />
        <Route path="/admin/candidate/delete" element={<DeleteCandidate />} />
        <Route path="/admin/candidate/view" element={<ViewCandidate />} />
        <Route path="/admin/results" element={<ResultsDashboard role="admin" />} />
        <Route path="/head/results" element={<ResultsDashboard role="head" />} />
        


      </Routes>
      <Copywright />
    </>
  );
}
