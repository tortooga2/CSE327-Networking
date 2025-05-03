import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../Contexts/ctx.user";

import Button from "../Button/Button";

const SignupWindow = ({ setState }) => {
    const { user } = useUser();

    const formRef = useRef(null);
    const navigate = useNavigate();

    const [style, setStyle] = useState({
        position: "absolute",
        top: "20%",
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

            const email = e.target[1].value;
            const password = e.target[2].value;

            console.log("email:", email, "and password", password);

            await user.SignUp(email, password);
        });
    }, [navigate]);

    return (
        <div style={style}>
            <h1 style={{ width: "fit-content" }}>Sign up</h1>
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
