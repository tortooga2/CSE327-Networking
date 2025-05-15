import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../Contexts/ctx.user";

import Button from "../Button/Button";

const SignupWindow = ({ setState }) => {
    const { user } = useUser();

    const formRef = useRef(null);
    const navigate = useNavigate();

    const [style, setStyle] = useState({
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        borderRadius: "0.5rem",
        padding: "5rem",
        border: "1px solid var(--primary-color)",
        backdropFilter: "blur(10px)",

        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        alignItems: "left",
        justifyContent: "left",
        color: "#333",
    });

    const [formStyle, setFormStyle] = useState({
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
    });

    const [inputStyle, setInputStyle] = useState({
        padding: "0.5rem",
        borderRadius: "5px",
        border: "1px solid var(--secondary-color)",
        minWidth: "300px",
    });

    const [closeStyle, setCloseStyle] = useState({
        position: "absolute",
        top: "0",
        right: "0",
        cursor: "pointer",
    });

    const [error, setError] = useState(null);

    useEffect(() => {
        if (!formRef.current) {
            return;
        }

        formRef.current.addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = e.target[0].value;
            const password = e.target[1].value;

            console.log("email:", email, "and password", password);

            const session = await user.SignUp(email, password);
            if (session) {
                console.log("Session", session);
                navigate("/app");
                return;
            }

            console.log("Error", "Failed to sign up");
            setError("Failed to sign up for some reason");
        });
    }, [navigate]);

    return (
        <div style={style}>
            <h2 style={{ width: "fit-content" }}>Sign up</h2>
            {error && (
                <div
                    style={{
                        color: "red",
                        fontSize: "1.2rem",
                        marginBottom: "1rem",
                        backgroundColor: "rgba(255, 200, 200, 0.6)",
                        padding: "1rem",
                        borderRadius: "0.5rem",
                    }}
                >
                    {error}
                </div>
            )}
            <form style={formStyle} ref={formRef}>
                <input style={inputStyle} type="text" placeholder="Email" />
                <input
                    style={inputStyle}
                    type="password"
                    placeholder="Password"
                />

                <Button
                    onClick={() => {
                        formRef.current.dispatchEvent(new Event("submit"));
                    }}
                >
                    Sign up
                </Button>
            </form>
            <Button
                style={{
                    position: "absolute",
                    top: "2rem",
                    right: "2rem",
                    padding: "0.5rem",
                    borderRadius: "0.5rem",
                }}
                onClick={() => {
                    setState(false);
                }}
            >
                Close
            </Button>
        </div>
    );
};

export default SignupWindow;
