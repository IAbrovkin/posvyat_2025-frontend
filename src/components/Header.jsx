import React, { useState } from 'react';
import Logo from '../assets/images/logo.png';
import BtnBlue from '../assets/images/reg_btn.svg';
import BtnGreen from '../assets/images/tickets_btn.svg';
import BtnRed from '../assets/images/ocupation_btn.svg';
import BtnOrange from '../assets/images/transfer_btn.svg';

const Header = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="header">
      <div className="header-inner">
        <a href="/">
          <img src={Logo} alt="Логотип" className="header-logo" />
        </a>
        <nav className="header-nav">
          <a href="/registration" className="header-btn">
            <img src={BtnBlue} alt="регистрация" className="header-btn-img" />
            <span className="header-btn-text">регистрация</span>
          </a>
          <a href="/tickets" className="header-btn">
            <img src={BtnGreen} alt="билеты" className="header-btn-img" />
            <span className="header-btn-text">билеты</span>
          </a>
          <a href="/check-in" className="header-btn">
            <img src={BtnRed} alt="расселение" className="header-btn-img" />
            <span className="header-btn-text">расселение</span>
          </a>
          <a href="/transfer" className="header-btn">
            <img src={BtnOrange} alt="трансфер" className="header-btn-img" />
            <span className="header-btn-text">трансфер</span>
          </a>
        </nav>
        <div className="header-mobile-toggle" onClick={toggleMobileMenu}></div>
      </div>

      {isMobileMenuOpen && (
        <div className="header-mobile">
          <ul className="header-mobile-list">
            <li><a href="/">Главная</a></li>
            <li><a href="/registration">Регистрация</a></li>
            <li><a href="/tickets">Билеты</a></li>
            <li><a href="/check-in">Расселение</a></li>
            <li><a href="/transfer">Трансфер</a></li>
          </ul>
        </div>
      )}
    </header>

  );
};

export default Header;
