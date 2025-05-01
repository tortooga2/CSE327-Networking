import { useState, useEffect, useRef } from "react";
import Button from "../Button/Button";
import { useUser } from "../Contexts/ctx.user";
// import { GoogleLogin } from 'react-google-login';

const LoginWindow = ({ setState }) => {
    const formRef = useRef(null);
    const { user } = useUser();

    const [style] = useState({
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        padding: "5rem",
        border: "1px solid var(--secondary-color)",
        backdropFilter: "blur(20px)",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        alignItems: "left",
        justifyContent: "left",
    });

    const [formStyle] = useState({
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
    });

    const [inputStyle] = useState({
        padding: "0.5rem",
        borderRadius: "5px",
        border: "1px solid var(--secondary-color)",
        minWidth: "300px",
    });

    const [closeStyle] = useState({
        position: "absolute",
        top: "0",
        right: "0",
        cursor: "pointer",
        margin: "0.5rem",
        fontFamily: "monospace",
    });

    useEffect(() => {
        if (!formRef.current) {
            return;
        }

        formRef.current.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = e.target[0].value;
            const password = e.target[1].value;

            console.log("Login with email:", email, "and password", password);

            try {
                const response = await user.SignIn(email, password);

                if (response && response.data && response.data.accessToken) {

                    localStorage.setItem('authToken', response.data.accessToken);
                    console.log("Logged in!, token stored:", response.data.accessToken);

                    setState(false);
                } else if (response && response.data && response.data.error) {
                    console.error("Try again with logging in:", response.data.error);
                } else {
                    console.error("Failed login: Invalid response");
                }
            } catch (error) {
                console.error("Errors encounter with the login:", error);
            }
        });
    }, [user, setState]);

    return (
        <div style={style}>
            <h1 style={{ width: "fit-content" }}>Login</h1>
            <form style={formStyle} ref={formRef}>
                <input style={inputStyle} type="text" placeholder="Email" />
                <input
                    style={inputStyle}
                    type="password"
                    placeholder="Password"
                />
                <Button
                    style={{ maxWidth: "100px" }}
                    onClick={() => {
                        formRef.current.dispatchEvent(new Event("submit"));
                    }}
                >
                    Login
                </Button>
            </form>
            
            <Button
                style={closeStyle}
                onClick={() => {
                    setState(false);
                }}
            >
                [X]
            </Button>
        </div>
    );
};

export default LoginWindow;
