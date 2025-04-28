import "./LandingPage.css";
import React, { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import heroAnimation from "../../Components/Animations/heroAnimation.json";
import secondAnimation from "../../Components/Animations/secondAnimation.json";
import thirdAnimation from "../../Components/Animations/thirdAnimation.json";
import networkAnimation from "../../Components/Animations/networkAnimation.json";
import { FaArrowCircleUp } from "react-icons/fa";
import Button from "../../Components/Button/Button";
import LoginWindow from "../../Components/LoginDialog/LoginWindow";
import SignupWindow from "../../Components/SingupDialog/SignupDialog";

const ScrollButton = () => {
    const [visible, setVisible] = useState(false);

    const toggleVisible = () => {
        const scrolled = document.documentElement.scrollTop;
        if (scrolled > 300) {
            setVisible(true);
        } else if (scrolled <= 300) {
            setVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    useEffect(() => {
        window.addEventListener("scroll", toggleVisible);
        return () => window.removeEventListener("scroll", toggleVisible);
    }, [])


    return (
        <div className="scroll-to-top-button">
            <FaArrowCircleUp
                onClick={scrollToTop}
                style={{ display: visible ? "inline" : "none", fontSize: "2em", cursor: "pointer", color: "var(--text-color)" }}
            />
        </div>
    );
};

function LandingPage() {
    const [showLogin, setShowLogin] = useState(false);
    const [showSignUp, setShowSignUp] = useState(false);

    const handleButtonClick = (type) => {
        if (type === 'login') {
            setShowLogin(!showLogin);
            setShowSignUp(false);
        } else if (type === 'signup') {
            setShowSignUp(!showSignUp);
            setShowLogin(false);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const heroRight = document.querySelector(".hero-right");
        
            if (heroRight) {
                heroRight.style.transform = `translateY(${scrollY * 0.1}px)`;
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <div className="landing-page-container">
            <div className = "animated-lines-background"></div>
            <header className="landing-header">
                <h1 className="header-title">Networking Application</h1>
                <nav className="header-nav">
                    {/* <a href="#help">Help</a> */}
                    <a href="#login" onClick={() => handleButtonClick("login")}>Log In</a>
                    <button className="signup-button" onClick={() => handleButtonClick("signup")}>Sign Up</button>
                </nav>
            </header>
            <main className="landing-main split-screen">
                <div className = "left-background">
                    <section className = "main-section network-info-section">
                        <h2 className = "section-heading">Connections</h2>
                        <p className="hero-description">
                            Allow yourself for an organized and quick access of relevant information to a specific topic or entities.
                        </p>
                        <div classname = "network-left">
                            <Lottie
                            animationData = {networkAnimation}
                            loop = {true}
                            style = {{ width: "100%", maxWidth: "400px", margin: "0 auto" }}
                            />
                        </div>
                    </section>
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
                            <Lottie
                                animationData = {heroAnimation}
                                loop = {true}
                                style = {{ width: "100%", maxWidth: "400px", margin: "0 auto" }}
                            />
                        </div>
                    </section>

                    <section className = "main-section organize-section">
                        <h2 className = "section-heading">Organize</h2>
                        <div className = "lottie-wrapper">
                            <Lottie
                                animationData = {secondAnimation}
                                loop = {true}
                                style = {{
                                    width: "100%",
                                    maxWidth: "400px",
                                    margin: "0 auto",
                                }}
                            />
                            <p className = "section-description">
                                Organize your information in a way that makes sense to you. Create custom tags, categories, and notes to keep everything in order.</p>
                        </div>
                    </section>

                    <section className = "main-section share-section">
                        <h2 className = "section-heading">Share</h2>
                        <div className = "lottie-wrapper">
                            <Lottie
                                animationData = {thirdAnimation}
                                loop = {true}
                                style = {{
                                    width: "100%",
                                    maxWidth: "400px",
                                    margin: "0 auto",
                                }}
                            />
                            <p className = "section-description">Curate information and connect with the professionals and for improving with your own digital profile.</p>
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
                // flexDirection: "column",
                height: "auto",
                width: "100vw",
                margin: "2rem auto",
                padding: "2rem",
                textAlign: "center",
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
        <ScrollButton />
    </div>
  );
}


        
            {/* {showLogin && (
                <LoginWindow
                    setState={(state) => {
                        setShowLogin(state);
                    }}
                />
            )}

            {showSignUp && (
                <SignupWindow
                    setState={(state) => {
                        setShowSignUp(state);
                    }}
                />
            )} */}

//         <div
//             className={"landing-page"}
//             style={{
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 flexDirection: "column",
//                 height: "100vh",
//                 width: "100vw",
//                 margin: "auto",
//             }}
//         >
//             <div className={"title"}>
//                 <p className={"special"}> Welcome to </p>
//                 <h1>
//                     <span
//                         style={{
//                             color: "#cc674b",
//                         }}
//                     >
//                         Bundle
//                     </span>
//                     ,<span className="miamor"> mio amore</span>
//                 </h1>
//             </div>
//             <div
//                 style={{
//                     display: "flex",
//                     justifyContent: "space-evenly",
//                     gap: "1rem",
//                 }}
//             >
//                 <Button
//                     style={{
//                         color: "var(--primary-color)",
//                         paddingLeft: "0.5rem",
//                         paddingRight: "0.5rem",
//                     }}
//                     onClick={() => {
//                         setShowLogin(!showLogin);
//                         setShowSignUp(false);
//                     }}
//                 >
//                     {" "}
//                     Login
//                 </Button>
//                 <Button
//                     style={{
//                         color: "var(--primary-color)",
//                         paddingLeft: "0.5rem",
//                         paddingRight: "0.5rem",
//                     }}
//                     onClick={() => {
//                         setShowSignUp(!showSignUp);
//                         setShowLogin(false);
//                     }}
//                 >
//                     Sign Up
//                 </Button>
//             </div>

//             {/* {showLogin && (
//                 <LoginWindow
//                     setState={(state) => {
//                         setShowLogin(state);
//                     }}
//                 />
//             )}

//             {showSignUp && (
//                 <SignupWindow
//                     setState={(state) => {
//                         setShowSignUp(state);
//                     }}
//                 />
//             )} */}

//             <div
//                 style={{
//                     position: "absolute",
//                     bottom: "0",
//                     right: "0",
//                     color: "#cc674b",
//                     fontSize: "0.8rem",
//                     fontFamily: `"Playfair Display", serif`,
//                     padding: "0.5rem",
//                 }}
//             >
//                 @2025 Bundle,{" "}
//                 <span style={{ fontStyle: "italic" }}> Networking Application </span>. All
//                 rights reserved.
//             </div>
//         </div>
//     </div>
//   );
// }

export default LandingPage;
