import { Route, Routes } from "react-router-dom";
import LandingPage from "./Pages/LandingPage/LandingPage";
import MainApp from "./Pages/MainApp/MainApp";
import FilePage from "./Pages/FilePage/FilePage";

import { UserProvider } from "./Components/Contexts/ctx.user.jsx";
import { MobileProvider } from "./Components/Contexts/ctx.mobile.jsx";
import { ReactLenis } from "lenis/react";

const App = () => {
    return (
        <UserProvider>
            <MobileProvider>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/app" element={<MainApp />} />
                    <Route path="/file/:fileId" element={<FilePage />} />
                </Routes>
            </MobileProvider>
        </UserProvider>
    );
};

export default App;
