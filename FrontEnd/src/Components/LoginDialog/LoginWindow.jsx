/*
import "./LoginWindow.css";

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../Contexts/ctx.user";

import Button from "../Button/Button";

const LoginWindow = ({ setState }) => {
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
        zIndex: "200",
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

    useEffect(() => {
        if (!formRef.current) {
            return;
        }

        formRef.current.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = e.target[0].value;
            const password = e.target[1].value;

            console.log("email:", email, "and password", password);

            await user.SignIn(email, password);
        });
    }, [navigate]);

    return (
        <div style={style}>
            <h1 style={{ width: "fit-content" }}>Log in</h1>
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
                    Log in
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

export default LoginWindow;
*/

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../Contexts/ctx.user";

import Button from "../Button/Button";

const LoginWindow = ({ setState }) => {
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
        zIndex: "200",
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

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [password, setPassword] = useState("");

    useEffect(() => {
        if (!formRef.current) {
            return;
        }

        const handleSubmit = async (e) => {
            e.preventDefault();
            const email = e.target[0].value;
            const password = e.target[1].value;

            console.log("email:", email, "and password", password);

            await user.SignIn(email, password);
        };

        const form = formRef.current;
        form.addEventListener("submit", handleSubmit);

        return () => {
            form.removeEventListener("submit", handleSubmit);
        };
    }, [navigate, user]);

    return (
        <div style={style}>
            <h1 style={{ width: "fit-content" }}>Log in</h1>
            <form style={formStyle} ref={formRef}>
                <input style={inputStyle} type="text" placeholder="Email" />
                <div style={{ position: "relative" }}>
                    <input
                        style={{ ...inputStyle, paddingRight: "4rem" }}
                        type={passwordVisible ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {password && (
                        <button
                            type="button"
                            style={{
                                position: "absolute",
                                right: "0rem",
                                top: "50%",
                                transform: "translateY(-50%)",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "var(--primary-color)",
                            }}
                            onClick={() =>
                                setPasswordVisible((prev) => !prev)
                            }
                        >
                            {passwordVisible ? "Hide" : "Show"}
                        </button>
                    )}
                </div>

                <Button
                    onClick={() => {
                        formRef.current.dispatchEvent(
                            new Event("submit", { cancelable: true, bubbles: true })
                        );
                    }}
                >
                    Log in
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

export default LoginWindow;

