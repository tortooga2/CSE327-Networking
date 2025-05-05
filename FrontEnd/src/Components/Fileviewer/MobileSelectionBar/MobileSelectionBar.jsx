import { useStore } from '../../Contexts/ctx.appManager';
import './MobileSelectionBar.css';
import { FaShareAlt, FaTrash, FaLink, FaTimes } from 'react-icons/fa';

const MobileSelectionBar = () => {
    const selectedFiles = useStore((state) => state.selectedFiles);
    const unSelectAll = useStore((state) => state.unSelectAll);
    const connectFiles = useStore((state) => state.connectFiles);
    const deleteFiles = useStore((state) => state.deleteFiles);

    if (selectedFiles.size === 0) return null;

    return (
        <div className="mobile-selection-bar">
            <div className="selection-count">
                {selectedFiles.size} selected
                <button onClick={unSelectAll} className="clear-selection">
                    <FaTimes />
                </button>
            </div>
            <div className="selection-actions">
                <button onClick={connectFiles}>
                    <FaLink />
                    <span>Connect</span>
                </button>
                <button onClick={() => {
                    const urls = Array.from(selectedFiles).map(id => 
                        `${window.location.origin}/file/owner_id/${id}`
                    );
                    navigator.clipboard.writeText(urls.join('\n'));
                    alert("Links copied to clipboard");
                }}>
                    <FaShareAlt />
                    <span>Share</span>
                </button>
                <button onClick={deleteFiles}>
                    <FaTrash />
                    <span>Delete</span>
                </button>
            </div>
        </div>
    );
};

export default MobileSelectionBar;