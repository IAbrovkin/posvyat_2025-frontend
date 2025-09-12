import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import RegistrationForm from '../components/RegistrationForm';
import Header from '../components/Header'; 

const Registration = () => {
  return (
    <div className="container" id="root">
      <Header/>
      <RegistrationForm/>
    </div>
  );
};

export default Registration;