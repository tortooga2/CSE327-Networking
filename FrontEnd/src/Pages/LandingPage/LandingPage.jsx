import "./LandingPage.css";
import React, { useState, useEffect, useCallback } from "react";
import Lottie from "lottie-react";
// import { Player } from '@lottiefiles/react-lottie-player';
import { useNavigate } from "react-router-dom";
import heroAnimation from "../../Components/Animations/heroAnimation.json";
import secondAnimation from "../../Components/Animations/secondAnimation.json";
import thirdAnimation from "../../Components/Animations/thirdAnimation.json";
import networkAnimation from "../../Components/Animations/networkAnimation.json";
import landingpgAnimation from "../../Components/Animations/landingpgAnimation.json";
// import bac from "../../Components/Animations/background.json";
import sideAnimation from "../../Components/Animations/sideAnimation.json";
import notesAnimation from "../../Components/Animations/notesAnimation.json";
import network from "../../Components/Animations/network.json";
import networktwo from "../../Components/Animations/networktwo.json";
import { FaArrowCircleUp } from "react-icons/fa";
import Button from "../../Components/Button/Button";
import LoginWindow from "../../Components/LoginDialog/LoginWindow";
import SignupWindow from "../../Components/SingupDialog/SignupDialog";
// import SignupWindow from "./SignupWindow.jsx";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
// import CalendarApp from "./CalendarApp";
// import 'react-calendar/dist/Calendar.css';
// Import Material UI components for the backdrop
// import * as React from 'react';  // Corrected import
// import Backdrop from '@mui/material/Backdrop';
// import CircularProgress from '@mui/material/CircularProgress';
import FrontBackground from "../../Components/FrontBackground";
import { AmbientLight, MeshStandardMaterial } from "three";
//import Button from '@mui/material/Button'; //This import was already present.


function LandingPage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const navigate = useNavigate();
  // const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  // const [isBackdropOpen, setIsBackdropOpen] = useState(false); // State for backdrop

  // const particlesInit = useCallback(async (engine) => {
  //   await loadFull(engine);
  // }, []);

  const particlesLoaded = useCallback(async (container) => {
    // something else can be added here
  }, []);

  const particlesOptions = {
    background: {
      color: {
        value: "#f4f6f8",
      },
    },
    particles: {
      number: {
        value: 30,
        density: {
          enable: true,
          area: 600,
        },
      },
      opacity: {
        value: 0.3,
      },
      size: {
        value: { min: 5, max: 10 },
      },
      move: {
        enable: true,
        speed: 0.5,
        direction: "none",
        random: false,
        straight: false,
        outModes: "bounce",
      },
      shape: {
        type: "circle",
      },
      color: {
        value: "#90a4ae",
      },
      links: {
        enable: true,
        distance: 150,
        color: "#bdbdbd",
        opacity: 0.2,
        width: 1,
      },
    },
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "grab",
        },
      },
      modes: {
        grab: {
          distance: 140,
          links: {
            opacity: 0.5,
          },
        },
      },
    },
    retinaDetect: true,
  };

  const handleScroll = () => {
    const totalHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    if (totalHeight > 0) {
      const currentProgress =
        (document.documentElement.scrollTop / totalHeight) * 100;
      setScrollProgress(currentProgress);
    }
  };

  useEffect(() => {
    // console.log("showLogin:", showLogin);
    const sections = document.querySelectorAll('.fade-in-section');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    sections.forEach((section) => {
      observer.observe(section);
    });
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
    // console.log("Current directory:", process.cwd());
    observer.disconnect();

  }, [showLogin]);

  const handleButtonClick = (type) => {
    if (type === 'login') {
      setShowLogin(true);
      setShowSignUp(false);
    } else if (type === 'signup') {
      setShowSignUp(true);
      setShowLogin(false);
    }
  };
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    console.log("Select the date:", date);
  };

  return (
    <div className="landing-page-container" style={{ position: "relative", overflow: "hidden" }}>
      <Lottie
        animationData={landingpgAnimation}
        loop
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "170vw",
          height: "200vh",
          zIndex: -5,
          opacity: 0.6,
        }}
      />

      <div className="scroll-indicator-container">
        <div
          className="scroll-indicator"
          style={{ width: `${scrollProgress}%` }}
        ></div>
        {/* Closing the div properly */}
      </div>
      <div className="animated-lines-background"></div>
      <header className="landing-header">
        <h1 className="header-title">Networking Application</h1>
        <nav className="header-nav">
          <button className="login-button" onClick={() => handleButtonClick('login')}>
            Log In
          </button>
          <button className="signup-button" onClick={() => handleButtonClick('signup')}>
            Sign Up
          </button>
        </nav>
      </header>

      <main className="landing-main split-background">
        <div className="left-background" style={{ position: 'relative', overflow: 'hidden' }}>
          {/* <Lottie animationData={network} loop={true} style={{ width: "auto", height: "auto", maxWidth: "400px", margin: "0 auto" }} />
        <Lottie animationData={networktwo} loop={true} style={{ width: "100%", maxWidth: "400px", margin: "0 auto" }} />
        <Lottie animationData={sideAnimation} loop={true} style={{ width: "100%", maxWidth: "450px", margin: "0 auto" }} />
        <Lottie animationData={notesAnimation} loop={true} style={{ width: "100%", maxWidth: "400px", margin: "0 auto" }} /> */}
        </div>
        <div className="right-content">
          <div className="main-section-border">
            <section className="main-section capture-info-section">
              <div className="hero-left">
                <h2 className="hero-heading">Capture Your Info</h2>
                <p className="hero-description">
                  Create your personalized layout of information from conferences and expo
                  events that has links, business cards, photos, and detailed description
                  of your links such as date, location, and type.
                </p>
                {/* <button className="start-button" onClick={() => console.log("Start Here Clicked")}>Start Here</button> */}
              </div>
              <div className="hero-right">
                <Lottie animationData={heroAnimation} loop={true} style={{ width: "100%", maxWidth: "400px", margin: "0 auto" }} />
              </div>
            </section>
          </div>

          <div className="main-section-border">
            <section className="main-section organize-section">
              <h2 className="section-heading">Organize</h2>
              <div className="lottie-wrapper">
                <Lottie animationData={secondAnimation} loop={true} style={{ width: "100%", maxWidth: "400px", margin: "0 auto" }} />
                <p className="section-description">
                  Organize your information in a way that makes sense to you. Create
                  custom tags, categories, and notes to keep everything in order.
                </p>
              </div>
            </section>
          </div>
          <div className="main-section-border">
            <section className="main-section share-section">
              <h2 className="section-heading">Share</h2>
              <p className="section-description">
                Curate information and connect with professionals and
                improve your own digital profile. Make sure to save your notes so you can send links about it later.
              </p>
              <div className="lottie-wrapper">
                <Lottie animationData={thirdAnimation} loop={true} style={{ width: "100%", maxWidth: "400px", margin: "0 auto" }} />
                {/* <p className = "section-description">Curate information and connect with the professionals and for improving with your own digital profile.</p> */}
              </div>
            </section>
          </div>

          <div className="main-section-border">
            <section className="main-section network-info-section">
              <h2 className="section-heading">Connections</h2>
              <p className="hero-description">
                Allow yourself for organized and quick access of relevant information
                for a specific topic or entities. This would ensure links, forms, pictures, and other related data to be stored properly.
              </p>
              <div classname="network-left">
                <Lottie
                  animationData={networkAnimation}
                  loop={true}
                  style={{ width: "100%", maxWidth: "400px", margin: "0 auto" }}
                />
              </div>
            </section>
          </div>
          {/* <section className = "main-section calendar-section" style = {{ marginTop: '2rem' }}>
        <h2 className = "section-heading">Calendar</h2>
        <CalendarApp onDateSelect = {handleDateSelect} />
        {selectedDate && (
          <p style = {{ textAlign: 'center', marginTop: '1rem' }}>
            Selected Date: {selectedDate.toLocaleDateString()}
          </p>
        )}
      </section> */}
        </div>
      </main>

      {showLogin && <LoginWindow setState={setShowLogin} />}
      {showSignUp && <SignupWindow setState={setShowSignUp} />}

      <div
        className={"landing-page welcome-section"}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          height: "auto",
          width: "90%",
          maxWidth: "1200px",
          margin: "2rem auto",
          padding: "2rem",
          textAlign: "center",
          boxSizing: "border-box",
        }}
      >
        <div className={"title"}>
          <p className={"special"}> Welcome to </p>
          <h1>
            <span
              style={{
                color: "#cc674b",
              }}
            >
              Connectwork
            </span>
            
          </h1>
        </div>
        {/* <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            gap: "1rem",
            marginTop: "1rem",
          }}
        > */}
        <Button
          style={{
            color: "var(--primary-color)",
            paddingLeft: "0.5rem",
            paddingRight: "0.5rem",
          }}
          onClick={() => {
            handleButtonClick("login");
            // setShowLogin(!showLogin);
            // setShowSignUp(false);
          }}
        >
          {" "}
          Login
        </Button>
        <Button
          style={{
            color: "var(--primary-color)",
            paddingLeft: "0.5rem",
            paddingRight: "0.5rem",
          }}
          onClick={() => {
            handleButtonClick("signup");
            // setShowSignUp(!showSignUp);
            // setShowLogin(false);
          }}
        >
          Sign Up
        </Button>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "0",
          right: "0",
          color: "#cc674b",
          fontSize: "0.8rem",
          fontFamily: `"Playfair Display", serif`,
          padding: "0.5rem",
        }}
      >
        @2025 Bundle,{" "}
        <span style={{ fontStyle: "italic" }}> Networking Application </span>. All
        rights reserved.
      </div>
    </div>
  );
}

export default LandingPage;
