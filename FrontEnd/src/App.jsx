import { Route, Routes } from "react-router-dom";
import MainApp from "./Pages/MainApp/MainApp";
import FilePage from "./Pages/FilePage/FilePage";
import { UserProvider } from "./Components/Contexts/ctx.user.jsx";

const App = () => {
    return (
        <UserProvider>
            <Routes>
                <Route path="/*" element={<MainApp />} />
                <Route path="/file/:ownerId/:fileId" element={<FilePage />} />
            </Routes>
        </UserProvider>
    );
};

export default App;
