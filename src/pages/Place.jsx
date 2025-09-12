import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PlaceForm from '../components/PlaceForm';
import Header from '../components/Header'; 

const Place = () => {
  return (
    <div className="container" id="root">
      <Header />
      <PlaceForm/>
    </div>
  );
};

export default Place;