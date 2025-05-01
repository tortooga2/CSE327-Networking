 import "./LandingPage.css";
 import React, { useState, useEffect} from "react";
 import Lottie from "lottie-react";
 import { useNavigate } from "react-router-dom";
 import heroAnimation from "../../Components/Animations/heroAnimation.json";
 import secondAnimation from "../../Components/Animations/secondAnimation.json";
 import thirdAnimation from "../../Components/Animations/thirdAnimation.json";
 import networkAnimation from "../../Components/Animations/networkAnimation.json";
 import { FaArrowCircleUp } from "react-icons/fa";
 import Button from "../../Components/Button/Button";
 import LoginWindow from "../../Components/LoginDialog/LoginWindow";


function LandingPage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const handleScroll = () => {
    const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (totalHeight > 0) {
      const currentProgress = (document.documentElement.scrollTop / totalHeight) * 100;
      setScrollProgress(currentProgress);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleButtonClick = (type) => {
    if (type === 'login') {
      setShowLogin(!showLogin);
      setShowSignUp(false);
    } else if (type === 'signup') {
      setShowSignUp(!showSignUp);
      setShowLogin(false);
    }
  };

  return (
    <div className="landing-page-container">
      <div className="scroll-indicator-container">
        <div
          className="scroll-indicator"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>
      <div className = "animated-lines-background"></div>
      <header className="landing-header">
        <h1 className="header-title">Networking Application</h1>
        <nav className="header-nav">
          <a href="#login" onClick={() => handleButtonClick("login")}>Log In</a>
          <button className="signup-button" onClick={() => handleButtonClick("signup")}>Sign Up</button>
        </nav>
      </header>
      <main className="landing-main split-background">
        <div className = "left-background">
          {/* might have to add something here later, make sure to get group's input */}
        </div>
        <div className = "right-content">
          <section className="main-section capture-info-section">
            <div className="hero-left">
              <h2 className="hero-heading">Capture Your Info</h2>
              <p className="hero-description">
                Create your personalized layout of information from conferences and expo
                events that has links, business cards, photos, and detailed description
                of your links such as date, location, and type.
              </p>
              <button className="start-button" onClick={() => console.log("Start Here Clicked")}>Start Here</button>
            </div>
            <div className="hero-right">
              <Lottie animationData= {heroAnimation} loop = {true} style = {{ width:"100%", maxWidth: "400px", margin: "0 auto" }} />
            </div>
          </section>

          <section className = "main-section organize-section">
            <h2 className = "section-heading">Organize</h2>
            <div className = "lottie-wrapper">
              <Lottie animationData= {secondAnimation} loop = {true} style = {{ width: "100%", maxWidth: "400px", margin: "0 auto" }} />
              <p className = "section-description">
                Organize your information in a way that makes sense to you. Create custom tags, categories, and notes to keep everything in order.
              </p>
            </div>
          </section>

          <section className = "main-section share-section">
            <h2 className = "section-heading">Share</h2>
            <p className = "section-description">
                Curate information and connect with the professionals and for improving with your own digital profile.
            </p>
            <div className = "lottie-wrapper">
              <Lottie animationData = {thirdAnimation} loop = {true} style = {{ width: "100%", maxWidth: "400px", margin: "0 auto" }} />
              {/* <p className = "section-description">Curate information and connect with the professionals and for improving with your own digital profile.</p> */}
            </div>
          </section>

          <section className = "main-section network-info-section">
            <h2 className = "section-heading">Connections</h2>
            <p className = "hero-description">
              Allow yourself for organized and quick access of relevant information for a specific topic or entities.
            </p>
            <div classname = "network-left">
                <Lottie animationData = {networkAnimation}
                loop = {true}
                style = {{ width: "100%", maxWidth: "400px", margin: "0 auto" }} />
            </div>
          </section>
        </div>
      </main>

      {showLogin && <LoginWindow setState={(state) => setShowLogin(state)} />}
      {showSignUp && <SignupWindow setState={(state) => setShowSignUp(state)} />}

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
              Bundle
            </span>
            ,<span className="miamor"> mio amore</span>
          </h1>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            gap: "1rem",
            marginTop: "1rem",
          }}
        >
          <Button
            style={{
              color: "var(--primary-color)",
              paddingLeft: "0.5rem",
              paddingRight: "0.5rem",
            }}
            onClick={() => {
              setShowLogin(!showLogin);
              setShowSignUp(false);
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
              setShowSignUp(!showSignUp);
              setShowLogin(false);
            }}
          >
            Sign Up
          </Button>
        </div>

        <div
          style={{
            marginTop: "2rem",
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
      {/* <ScrollButton /> You can keep or remove the scroll-to-top button */}
    </div>
  );
}

export default LandingPage;