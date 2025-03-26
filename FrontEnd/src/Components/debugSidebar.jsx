import { useFileManager } from "./Contexts/ctx.file_manager";

const DebugSidebar = () => {
    const { fileManager } = useFileManager();
    return (
        <div className="debug-sidebar">
            <h1>Debug Sidebar</h1>
            <p>Debugging information will be displayed here</p>
            <button onClick={() => fileManager.TestFunction()}>
                Log file manager
            </button>
        </div>
    );
};

export default DebugSidebar;
