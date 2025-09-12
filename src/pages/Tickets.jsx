import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import TicketsForm from '../components/TicketsForm';
import Header from '../components/Header'; 

const Tickets = () => {
  return (
    <div className="container" id="root">
      <Header />
      <TicketsForm/>
    </div>
  );
};

export default Tickets;