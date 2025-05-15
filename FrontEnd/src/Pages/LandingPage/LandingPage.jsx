import "./LandingPage.css";
import { useState, useEffect, useCallback } from "react";
import Lottie from "lottie-react";
// import { Player } from '@lottiefiles/react-lottie-player';
import { useNavigate } from "react-router-dom";
import heroAnimation from "../../Components/Animations/heroAnimation.json";
import secondAnimation from "../../Components/Animations/secondAnimation.json";
import thirdAnimation from "../../Components/Animations/thirdAnimation.json";
import networkAnimation from "../../Components/Animations/networkAnimation.json";

import Button from "../../Components/Button/Button";
import LoginWindow from "../../Components/LoginDialog/LoginWindow";
import SignupWindow from "../../Components/SingupDialog/SignupDialog";
import VerticalDiv from "../../Components/UILayout/VerticalDiv";
import NewPage from "../../Components/UILayout/NewPage";

function LandingPage() {
    const [showLogin, setShowLogin] = useState(false);
    const [showSignUp, setShowSignUp] = useState(false);

    const handleButtonClick = (type) => {
        if (type === "login") {
            setShowLogin(true);
            setShowSignUp(false);
        } else if (type === "signup") {
            setShowSignUp(true);
            setShowLogin(false);
        }
    };

    return (
        <NewPage>
            <VerticalDiv color={"#efddd5"}>
                <header
                    style={{
                        color: "#333",
                        padding: "4rem",
                        position: "fixed",
                        top: "0",
                        width: "100%",
                        // backgroundColor: "#efddd5",
                        backdropFilter: "blur(10px)",
                    }}
                >
                    <nav
                        className="header-nav"
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <div className="header-title">
                            <h1>ConnectWork</h1>
                            <p></p>
                        </div>
                        <div style={{ display: "flex", gap: "1rem" }}>
                            <Button onClick={() => handleButtonClick("login")}>
                                Log In
                            </Button>
                            <Button onClick={() => handleButtonClick("signup")}>
                                Sign Up
                            </Button>
                        </div>
                    </nav>
                </header>

                <main
                    style={{
                        color: "#333",
                        top: "4rem",
                        paddingTop: "15rem",
                        maxWidth: "1200px",
                        margin: "0 auto",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "2rem",
                    }}
                >
                    <div className="content-section">
                        <div className="hero-description">
                            <h2>Capture Your Info</h2>
                            <p>
                                Create your personalized layout of information
                                from conferences and expo events that has links,
                                business cards, photos, and detailed description
                                of your links such as date, location, and type.
                            </p>
                        </div>
                        <div className="hero-image">
                            <Lottie
                                animationData={heroAnimation}
                                loop={true}
                                style={{
                                    minWidth: "600px",
                                }}
                            />
                        </div>
                    </div>
                    <div className="content-section">
                        <div className="hero-image">
                            <Lottie
                                animationData={networkAnimation}
                                loop={true}
                                style={{
                                    minWidth: "600px",
                                }}
                            />
                        </div>
                        <div className="hero-description">
                            <h2 className="section-heading">Connections</h2>
                            <p className="hero-description">
                                Allow yourself for organized and quick access of
                                relevant information for a specific topic or
                                entities. This would ensure links, forms,
                                pictures, and other related data to be stored
                                properly.
                            </p>
                        </div>
                    </div>

                    <div className="content-section">
                        <div className="hero-description">
                            <h2>Organize</h2>
                            <p>
                                Organize your information in a way that makes
                                sense to you. Create custom tags, categories,
                                and notes to keep everything in order.
                            </p>
                        </div>
                        <div className="hero-image">
                            <Lottie
                                animationData={secondAnimation}
                                loop={true}
                            />
                        </div>
                    </div>
                    <div className="content-section">
                        <div className="hero-image">
                            <Lottie
                                animationData={thirdAnimation}
                                loop={true}
                            />
                            {/* <p className = "section-description">Curate information and connect with the professionals and for improving with your own digital profile.</p> */}
                        </div>
                        <div className="hero-description">
                            <h2>Share</h2>
                            <p>
                                Curate information and connect with
                                professionals and improve your own digital
                                profile. Make sure to save your notes so you can
                                send links about it later.
                            </p>
                        </div>
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
                        position: "fixed",
                        bottom: "0",
                        right: "0",
                        color: "#cc674b",
                        fontSize: "0.8rem",
                        fontFamily: `"Playfair Display", serif`,
                        padding: "0.5rem",
                    }}
                >
                    @2025 Bundle,{" "}
                    <span style={{ fontStyle: "italic" }}>
                        {" "}
                        Networking Application{" "}
                    </span>
                    . All rights reserved.
                </div>
            </VerticalDiv>
        </NewPage>
    );
}

export default LandingPage;
