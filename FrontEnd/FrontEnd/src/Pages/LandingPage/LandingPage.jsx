import "./LandingPage.css";

import { useState } from "react";

import Button from "../../Components/Button/Button";

import LoginWindow from "../../Components/LoginDialog/LoginWindow";
import SignupWindow from "../../Components/SingupDialog/SignupDialog";

function LandingPage() {
    const [showLogin, setShowLogin] = useState(false);
    const [showSignUp, setShowSignUp] = useState(false);

    return (
        <div
            className={"landing-page"}
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                height: "100vh",
                width: "100vw",
                margin: "auto",
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

            {showLogin && (
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
            )}

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
