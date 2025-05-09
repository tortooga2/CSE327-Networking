import PropTypes from 'prop-types';
import './MobileDockButton.css';

const MobileDockButton = ({ icon, label, onClick, isActive }) => {
    return (
        <button 
            className={`mobile-dock-button ${isActive ? 'active' : ''}`}
            onClick={onClick}
        >
            <div className="mobile-dock-icon">{icon}</div>
            <span className="mobile-dock-label">{label}</span>
        </button>
    );
};

MobileDockButton.propTypes = {
    icon: PropTypes.node.isRequired,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    isActive: PropTypes.bool
};

MobileDockButton.defaultProps = {
    onClick: () => {},
    isActive: false
};

export default MobileDockButton;