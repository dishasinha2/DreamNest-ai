import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
// Configure axios base URL
axios.defaults.baseURL = 'http://localhost:5000/api';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import DesignForm from './components/DesignForm';
import ProjectCreation from './components/ProjectCreation';
import ProjectDetails from './components/ProjectDetails';
import Results from './components/Results';
import Features from './components/Features';
import Footer from './components/Footer';
import './index.css';



function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <HowItWorks />
              <Features />
            </>
          } />
          <Route path="/dashboard" element={<Dashboard />} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/design" element={<DesignForm />} />
          <Route path="/create-project" element={<ProjectCreation />} />
          <Route path="/project/:id" element={<ProjectDetails />} />
          <Route path="/results" element={<Results />} />
          <Route path="/design" element={<DesignForm />} />
          <Route path="/results" element={<Results />} />
          <Route path="/create-project" element={<ProjectCreation />} />
          


        </Routes>
        <Footer />
      </div>
    </Router>
  );
}


export default App;