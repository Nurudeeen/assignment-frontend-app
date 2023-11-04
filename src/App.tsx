import React from "react";
import {BrowserRouter, Routes, Route } from 'react-router-dom'
import SignIn from "./pages/signIn";
import Home from "./pages/home";
import Dashboard from "./pages/dashboard";
import AdminDashboard from "./pages/admin";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
