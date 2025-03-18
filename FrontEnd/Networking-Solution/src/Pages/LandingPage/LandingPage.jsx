import "./LandingPage.css";

import Button from "../../Components/Button";

function LandingPage() {
    console.log("Landing Page");
    return (
        <>
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
                    ,<span className="miamor"> mi amore</span>
                </h1>
            </div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    gap: "1rem",
                }}
            >
                <Button>Login</Button>
                <Button>Sign Up</Button>
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
                <span style={{ fontStyle: "italic" }}> mi amore </span>. All
                rights reserved.
            </div>
        </>
    );
}

export default LandingPage;
