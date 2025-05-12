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
        zIndex: "1000",
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const username = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;

        console.log(
            "Signup here:",
            username,
            "email:",
            email,
            "password:",
            password
        );
        await user.SignUp(username, email, password);
    };

    return (
        <div style={style}>
            <h1 style={{ width: "fit-content" }}>Sign up</h1>
            <form style={formStyle} ref={formRef} onSubmit={handleSubmit}>
                <input style={inputStyle} type="text" placeholder="Email" />
                <input
                    style={inputStyle}
                    type="password"
                    placeholder="Password"
                />

                <Button onClick={() => {}}>Sign up</Button>
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
