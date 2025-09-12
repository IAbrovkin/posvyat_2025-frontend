import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import TransferForm from '../components/TransferForm';
import Header from '../components/Header'; 

const Transfer = () => {
  return (
    <div className="container" id="root">
      <Header />
      <TransferForm/>
    </div>
  );
};

export default Transfer;