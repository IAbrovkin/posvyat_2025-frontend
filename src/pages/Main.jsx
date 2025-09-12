import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Component Imports
import Header from '../components/Header';

// Image & Icon Imports
import tg from '../assets/images/tg.svg';
import vk from '../assets/images/vk.svg';
import up from '../assets/images/up.svg';

import posvyatImg from '../assets/images/posvyat.svg';
import BoomImg from '../assets/images/boom.png';
import sparclyStrip from '../assets/images/spaclyStrip.svg';
import disco from '../assets/images/disco.svg';
import oscar from '../assets/images/oscar.svg';
import poster1 from '../assets/images/poster1.png';
import poster2 from '../assets/images/poster2.png';

import popupImg from '../assets/images/WEB BROWSER POPUP.svg';
import camera from '../assets/images/sony_cam.svg';
import leftCdHalf from '../assets/images/cd_left_lightning_jagged 1.svg';
import rightCdHalf from '../assets/images/cd_right_lightning_jagged 1.svg';
import ticket from '../assets/images/ticket_desck.svg';

// Photos for Slider
import pic11 from '../assets/images/pic11.svg';
import pic12 from '../assets/images/pic12.png';
import pic13 from '../assets/images/pic14.png';
import pic14 from '../assets/images/pic15.png';
import pic15 from '../assets/images/pic17.png';
import pic16 from '../assets/images/pic19.png';
import pic17 from '../assets/images/pic21.png';
import pic18 from '../assets/images/pic24.png';
import pic19 from '../assets/images/pic25.png';
import pic20 from '../assets/images/pic26.png';
import pic21 from '../assets/images/pic28.png';
import pic22 from '../assets/images/pic32.png';

// Brand Logos
import pumpup from '../assets/images/pumpup.png';
import nova from '../assets/images/nova.png';
import ddx from '../assets/images/ddx.png';
import powercell from '../assets/images/powercell.png';
import gigagames from '../assets/images/gigagames.png';

// Theme Section Images
import atmosphereImg from '../assets/images/vibe.svg';
import costumesImg from '../assets/images/outfit.svg';
import gamesImg from '../assets/images/games.svg';

// Popup Content Images
import home from '../assets/images/home.png';
import night from '../assets/images/night.png';
import transfer from '../assets/images/transfer.png';
import welcome from '../assets/images/welcome.png';
import food from '../assets/images/food.png';
import main_program from '../assets/images/main_program.png';

// Data for Popups
const popupInfos = [
  { title: 'Велком-программа', text: ['Провести время с друзьями, найти новых знакомых,', 'поучаствовать в конкурсах, посетить welcome-точки,', 'выиграть призы и погрузиться в атмосферу праздника.'], img: welcome },
  { title: 'Основная программа', text: ['Полное погружение в тематику:', '– квест по командам', '– неожиданные повороты', '– концерт, призы и сюрпризы'], img: main_program },
  { title: 'Ночная программа', text: ['Дискотека с любимыми треками, гитарник,', 'ночные точки и расслабление — время для каждого.'], img: night },
  { title: 'Трансфер', text: ['Доехать можно и самому, но рекомендуем трансфер.', 'Автобусы стартуют с нескольких точек — выбери удобную.'], img: transfer },
  { title: 'Проживание', text: ['После праздника тебя ждёт тёплая и комфортная комната.', 'Можно поспать, оставить вещи, переодеться и отдохнуть.'], img: home },
  { title: 'Ужин и завтрак', text: ['Вечером — ужин со шведского стола.', 'Утром — тёплый завтрак после шумного праздника.'], img: food },
];

const Main = () => {
  const navigate = useNavigate();

  // State for Photo Slider
  const photos = [pic11, pic12, pic13, pic14, pic15, pic16, pic17, pic18, pic19, pic20, pic21, pic22];
  const [photoIndex, setPhotoIndex] = useState(0);
  const prevPhoto = () => setPhotoIndex((i) => (i - 1 + photos.length) % photos.length);
  const nextPhoto = () => setPhotoIndex((i) => (i + 1) % photos.length);

  // State for Logo Scroll
  const images = [pumpup, nova, ddx, powercell, gigagames];
  const duplicatedImages = [...images, ...images, ...images];
  const [offset, setOffset] = useState(0);

  // State for Popups
  const [currentPopupIndex, setCurrentPopupIndex] = useState(0);
  const currentPopup = popupInfos[currentPopupIndex];
  const handlePopupClose = () => setCurrentPopupIndex((prev) => (prev + 1) % popupInfos.length);
  
  // State for CD Separation
  const [diskOffset, setDiskOffset] = useState(0);

  // Refs for scroll-triggered animations
  const themeRef = useRef(null);
  const dateSectionRef = useRef(null);

  // Effect for Logo Scroll Animation
  useEffect(() => {
    let animationFrame;
    const handleLogoScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY || document.documentElement.scrollTop;
      const progress = Math.min(1, scrolled / totalHeight);
      const maxOffset = 300;
      const newOffset = progress * maxOffset;

      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        setOffset(newOffset);
      });
    };
    window.addEventListener("scroll", handleLogoScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleLogoScroll);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  // Combined Effect for Popup Visibility and CD Separation
  useEffect(() => {
    const onScroll = () => {
      const windowHeight = window.innerHeight;



      // Logic for CD Separation
      if (dateSectionRef.current) {
        const { top, height } = dateSectionRef.current.getBoundingClientRect();
        const animationStartPoint = windowHeight * 0.2;
        const animationEndPoint = windowHeight / 2 - height / 2;
        const rawProgress = (animationStartPoint - top) / (animationStartPoint - animationEndPoint);
        const progress = Math.max(0, Math.min(1, rawProgress));
        const maxTranslation = 500;
        setDiskOffset(progress * maxTranslation);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }); // Re-run if popupsVisible changes

  return (
    <>
      <Header />
      <main className="main-background">
        
        {/* Hero Section */}
        <section className="grey-rectangle" style={{ backgroundImage: `url(${BoomImg})` }}>
          <p className="title">ТВОЙ СТАРТ СТУДЕНЧЕСКОЙ <br/> ЖИЗНИ НАЧИНАЕТСЯ ЗДЕСЬ</p>
          <img src={posvyatImg} alt="Posvyat" className="PosvyatImage" />
          <button className="btnn" onClick={() => navigate('/registration')}>
            let’s goooo
          </button>
        </section>

        {/* Info Section */}
        <section className="info">
          <p className="infoTitle" ref={themeRef}>ВСе еще не понял, что такое посвят?</p>
          <img src={sparclyStrip} alt="sparcly" className="strip-img" />
          <div className="imgcontainer">
            <img className="disco" src={disco} alt="disco" />
            <img className="poster1" src={poster1} alt="poster1" />
            <img className="poster2" src={poster2} alt="poster2" />
            <img className="oscar" src={oscar} alt="oscar" />
          </div>
        </section>

        {/* Popup Section */}
        <section className="popup-stack-container">
            <>
              <div className="popup-stack-item" style={{ zIndex: 2, transform: 'rotate(-2deg)', filter: 'brightness(0.9)' }} />
              <div className="popup-stack-item" style={{ zIndex: 3, transform: 'rotate(3deg)', filter: 'brightness(0.9)' }} />
                <motion.div
                  key={currentPopupIndex}
                  className="popup"
                  style={{ zIndex: 4 }}
                  initial={{ opacity: 0, y: -50, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 50, scale: 0.9, transition: { duration: 0.2 } }}
                  transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                >
                  <img src={popupImg} alt="popup-background" className="popup-bg" />
                  <div className="popup-content">
                    {currentPopup.img && <img src={currentPopup.img} alt={currentPopup.title} className="popup-image" />}
                    <div className="popup-text-content">
                      <h3>{currentPopup.title}</h3>
                      {Array.isArray(currentPopup.text)
                        ? currentPopup.text.map((line, idx) => <p key={idx}>{line}</p>)
                        : <p>{currentPopup.text}</p>}
                    </div>
                    <button className="close-btn" onClick={handlePopupClose}>X</button>
                  </div>
                </motion.div>
            </>
        </section>

        {/* Logos Scroll Section */}
        <section className="logos-scroll">
          <div className="logos-inner" style={{ transform: `translateX(-${offset}px)` }}>
            {duplicatedImages.map((img, i) => (
              <img src={img} alt={`brand-${i}`} key={i} className="brand-img" />
            ))}
          </div>
        </section>

        {/* Theme Info Section */}
        <section className="theme-info-section">
          <h2 className="theme-title" style={{color: 'white'}}>нemного про теmатику</h2>
          <div className="theme-cards-container">
            <div className="theme-card">
              <img src={atmosphereImg} alt="Атмосфера 2000-х" className="theme-card-img" />
              <h3 className="theme-card-title">Атмосфера</h3>
              <p className="theme-card-text">
                Почувствуй наш вайб, и пройди через ржачные конкурсы — будет лол, угар и трэш! xD
              </p>
            </div>
            <div className="theme-card">
              <img src={costumesImg} alt="Костюмы в стиле 2000-х" className="theme-card-img" />
              <h3 className="theme-card-title">Костюмы</h3>
              <p className="theme-card-text">
                Замути тематический прикид и няшные аксессуары, чтобы сразу было видно — ты не рандом, а олдовый адепт самого лампового движа. :3
              </p>
            </div>
            <div className="theme-card">
              <img src={gamesImg} alt="Игры из 2000-х" className="theme-card-img" />
              <h3 className="theme-card-title">Игры</h3>
              <p className="theme-card-text">
                Игры будут по кайфу каждому, главное — не быть унылым кактусом и вписываться в движ. Лолшто, ну ты понял!
              </p>
            </div>
          </div>
        </section>

        {/* Camera Slider Section */}
        <h2 className="theme-footer-title" style={{color: 'yellow'}}>КАК ЭТО БЫЛО...</h2>
        <section className="camera-block">
          <div className="camera-frame">
            <img src={camera} alt="camera-frame" className="camera-frame-img" />
            <div className="camera-photo-wrapper">
              <img src={photos[photoIndex]} alt="camera-photo" className="camera-photo" />
            </div>
            <button className="camera-arrow left" onClick={prevPhoto}>&#9664;</button>
            <button className="camera-arrow right" onClick={nextPhoto}>&#9654;</button>
          </div>
        </section>

        {/* Date & Location Section with CD Animation */}
        <section className="date-location-section" ref={dateSectionRef}>
          <img
            src={leftCdHalf}
            alt="Left CD half"
            className="cd-half"
            style={{ transform: `translate(-50%, -50%) translateX(calc(-170px - ${diskOffset}px))` }}
          />
          <div className="date-location-content">
            <h2 className="date-location-text">11-12 октября</h2>
            <h2 className="date-location-text">“лесной городок”</h2>
            <button className="btnn" onClick={() => navigate('/registration')}>
              Погнали!
            </button>
          </div>
          <img
            src={rightCdHalf}
            alt="Right CD half"
            className="cd-half"
            style={{ transform: `translate(-50%, -50%) translateX(calc(170px + ${diskOffset}px))` }}
          />
        </section>

        {/* Ticket Section */}
        <section className="info ticket-area">
          <div className="info-ticket">
            <img src={ticket} alt="ticket" />
            <button className="btnn" onClick={() => navigate('/registration')} style={{padding: '1rem 1rem' }}>
              Уже бегу, покупать билет!
            </button>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="footer-links">
          <div className="links">
            <a href="https://vk.com/miemposvyat" target="_blank" rel="noopener noreferrer">
              <img src={vk} alt="VK" />
            </a>
            <a href="https://t.me/miemposvyat" target="_blank" rel="noopener noreferrer">
              <img src={tg} alt="TG" />
            </a>
          </div>
          <div className="up" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src={up} alt="up" />
          </div>
        </footer>
      </main>
    </>
  );
};

export default Main;