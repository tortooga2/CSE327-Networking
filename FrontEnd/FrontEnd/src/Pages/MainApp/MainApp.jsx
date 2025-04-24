import { useState, useRef, useEffect } from "react";
import "./MainApp.css";
import FileViewer from "../../Components/Fileviewer/Fileviewer.jsx";
import Dashboard from "../../Components/Dashboard.jsx";
import Sidebar from "../../Components/Sidebar.jsx";
import { useUser } from "../../Components/Contexts/ctx.user.jsx";
import DebugSidebar from "../../Components/debugSidebar.jsx";
import { useStore } from "../../Components/Contexts/zus.fileManager";
import FilePreview from "../../Components/FilePreview/FilePreview.jsx";
import NewPage from "../../Components/UILayout/NewPage.jsx";
import { Header } from "../../Components/header";

const MainApp = () => {
    const { user } = useUser();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        user.ValidateSession();
    }, [user]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <NewPage>
            <div className="flex flex-col h-screen overflow-hidden bg-white">
                {/* Header - Full Width */}
                <div className="w-full flex-shrink-0 border-b border-gray-200 bg-white">
                    <div className="max-w-[1920px] mx-auto">
                        <Header />
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Mobile Sidebar Toggle Button */}
                    <button 
                        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
                        onClick={toggleSidebar}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                        </svg>
                    </button>

                    {/* Sidebar */}
                    <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative w-64 h-full transition-transform duration-300 ease-in-out z-40 bg-white border-r border-gray-200`}>
                        <div className="h-full overflow-y-auto">
                            <DebugSidebar />
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                        {/* File Viewer */}
                        <div className="flex-1 min-w-0 overflow-auto">
                            <FileViewer />
                        </div>
                        
                        {/* File Preview */}
                        <div className="border-t lg:border-t-0 lg:border-l border-gray-200 lg:w-1/3 overflow-auto">
                            <FilePreview />
                        </div>
                    </div>

                    {/* Overlay for mobile sidebar */}
                    {isSidebarOpen && (
                        <div 
                            className="lg:hidden fixed inset-0 z-30"
                            style={{
                                background: "rgba(255,255,255,0.4)",
                                backdropFilter: "blur(8px)",
                                WebkitBackdropFilter: "blur(8px)",
                            }}
                            onClick={() => setIsSidebarOpen(false)}
                        />
                    )}
                </div>
            </div>
        </NewPage>
    );
};

export default MainApp;
