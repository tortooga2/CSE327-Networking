import { createContext, useContext, useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [signedIn, setSignedIn] = useState(true); // Default to signed in
    const navigate = useNavigate();

    const user = useMemo(
        () => ({
            isSignedIn: () => {
                return true; // Always return true to skip auth
            },
            setSignedIn,

            ValidateSession: async () => {
                setSignedIn(true); // Always set to true
                return true;
            },
            SignIn: async (email, password) => {
                try {
                    const response = await fetch(`api/auth/login`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                        body: JSON.stringify({ email, password }),
                    });
                    if (response.ok) {
                        setSignedIn(true);
                    }
                } catch (error) {
                    setSignedIn(false);
                    console.error(error);
                }
            },
            SignOut: async () => {
                try {
                    const response = await fetch(`api/auth/logout`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                    });
                    if (response.ok) {
                        setSignedIn(false);
                    }
                } catch (error) {
                    setSignedIn(false);
                    console.error(error);
                }
            },
            SignUp: async (username, email, password) => {
                try {
                    const response = await fetch(`api/auth/signup`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                        body: JSON.stringify({ email, password, username }),
                    });
                    if (response.ok) {
                        user.ValidateSession();
                    }
                } catch (error) {
                    setSignedIn(false);
                    console.error(error);
                }
            },
        }),
        [signedIn]
    );

    useEffect(() => {
        // Redirect to app immediately
        navigate("/app");
    }, [navigate]);

    return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

UserProvider.propTypes = {
    children: PropTypes.node,
};

export const useUser = () => {
    const user = useContext(UserContext);
    return { user };
};
