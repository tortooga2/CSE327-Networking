import { useState } from "react";
import Button from "../Button/Button";
import { useUser } from "../Contexts/ctx.user";

const LoginWindow = ({ setState }) => {
    const { user } = useUser();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const style = {
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
    };

    const formStyle = {
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
    };

    const inputStyle = {
        padding: "0.5rem",
        borderRadius: "5px",
        border: "1px solid var(--secondary-color)",
        minWidth: "300px",
    };

    const closeStyle = {
        position: "absolute",
        top: "0",
        right: "0",
        cursor: "pointer",
        margin: "0.5rem",
        fontFamily: "monospace",
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

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
    };

    return (
        <div style={style}>
            <h1 style={{ width: "fit-content" }}>Login</h1>
            <form style={formStyle} onSubmit={handleSubmit}>
                <input
                    style={inputStyle}
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    style={inputStyle}
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button type="submit" style={{ maxWidth: "100px" }}>
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
