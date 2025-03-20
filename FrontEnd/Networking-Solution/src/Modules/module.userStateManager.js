const UserStateManager = {
    state: {
        user: null,
    },
    setUser: (user) => {
        UserStateManager.state.user = user;
    },
    getUser: () => {
        return UserStateManager.state.user;
    },
    clearUser: () => {
        UserStateManager.state.user = null;
    },
    Login: async (baseURL, email, password) => {
        const response = await (async () => {
            try {
                const response = await fetch(`${baseURL}/auth/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                });
                return response;
            } catch (error) {
                throw new Error("Failed to login", error);
            }
        })();
        if (!response) {
            throw new Error("Failed to login");
        } else {
            console.log("Response: ", response);
        }
        const data = await response.json();
        UserStateManager.setUser("Logged in");
        console.log("User Logged in and returned: ", data);
        return data;
    },
    Signup: async (baseURL, email, password) => {
        const response = await (async () => {
            try {
                const response = await fetch(`${baseURL}/auth/signup`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                });
                return response;
            } catch (error) {
                throw new Error("Failed to signup", error);
            }
        })();
        if (!response) {
            throw new Error("Failed to signup");
        }
        const data = await response.json();
        console.log(data);
        return data;
    },
};

export { UserStateManager };
