import { Route, Routes } from "react-router-dom";
import LandingPage from "./Pages/LandingPage/LandingPage";
import MainApp from "./Pages/MainApp/MainApp";


import { UserProvider } from "./Components/Contexts/ctx.user.jsx";

const App = () => {
    return (
        <UserProvider>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/app" element={<MainApp />} />
            </Routes>
        </UserProvider>
    );
};

export default App;
