import PropTypes from 'prop-types';
import { FileType } from '../../Tags';
import getFileType from '../../scripts/getFileType';
import { FaShareAlt } from 'react-icons/fa';
import { useStore } from '../../Contexts/ctx.appManager.jsx';
import './FileCard.css';

const FileCard = ({ fileData }) => {
    const isSelected = useStore((state) => state.selectedFiles.has(fileData.id));
    const setIsSelected = useStore((state) => state.selectFile);

    const copyLink = (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(
            `${window.location.origin}/file/owner_id/${fileData.id}`
        );
        alert("Link copied to clipboard");
    };

    const handleSelect = (e) => {
        e.stopPropagation();
        setIsSelected(fileData.id, !isSelected);
    };

    const handleClick = () => {
        useStore.getState().setPreviewedFile(fileData.id);
    };

    const formattedDate = new Date(fileData.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    return (
        <div 
            className={`file-card ${isSelected ? 'file-card-selected' : ''}`} 
            onClick={handleClick}
        >
            <div className="file-card-checkbox">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={handleSelect}
                    onClick={(e) => e.stopPropagation()}
                />
            </div>
            
            <div className="file-card-content">
                <div className="file-card-header">
                    <div className="file-card-type">
                        {FileType(fileData.name)}
                    </div>
                </div>
                
                <h3 className="file-card-name">{fileData.name}</h3>
                <div className="file-card-details">
                    <span className="file-card-creator">{fileData.creator_username}</span>
                    <span className="file-card-date">{formattedDate}</span>
                </div>
                {getFileType(fileData.name) === "Image" && (
                    <div className="file-card-preview">
                        <img src={fileData.metadata.url} alt={fileData.name} />
                    </div>
                )}
            </div>
            {/* IDK If we need it but yeah */}
            <button 
                className="share-icon-button"
                onClick={copyLink}
                aria-label="Share"
            >
                <FaShareAlt />
            </button>
        </div>
    );
};

FileCard.propTypes = {
    fileData: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
        creator_username: PropTypes.string.isRequired,
        metadata: PropTypes.object.isRequired,
    }).isRequired,
};

export default FileCard;