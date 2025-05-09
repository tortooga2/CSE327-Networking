import { useMediaQuery } from 'react-responsive';
import { Route, Routes } from "react-router-dom";
import LandingPage from "./Pages/LandingPage/LandingPage";
import MainApp from "./Pages/MainApp/MainApp";
import FilePage from "./Pages/FilePage/FilePage";

import { UserProvider } from "./Components/Contexts/ctx.user.jsx";
import { MobileProvider } from "./Components/Contexts/ctx.mobile.jsx";

const App = () => {
    const isMobile = useMediaQuery({ maxWidth: 767 });

    return (
        <UserProvider>
            <MobileProvider>
                {isMobile ? (
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/app" element={<MainApp />} />
                        <Route path="/file/:fileId" element={<FilePage />} />
                    </Routes>
                ) : (
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/app" element={<MainApp />} />
                        <Route path="/file/:fileId" element={<FilePage />} />
                    </Routes>
                )}
            </MobileProvider>
        </UserProvider>
    );
};

export default App;
