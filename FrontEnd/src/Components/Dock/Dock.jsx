import { useState } from 'react';
import PropTypes from 'prop-types';
import './Dock.css';
import Button from '../Button/Button';
import MobileDockActions from '../DockActions/MobileDockActions';

const isMobile = () => window.innerWidth <= 768;

const Dock = ({ items }) => {
    const [activeItem, setActiveItem] = useState(0);

    if (isMobile()) {
        // Remove original dock items from mobile view
        return <MobileDockActions />;
    }

    // Desktop dock only:
    return (
        <div className="dock">
            {/*
            {items.map((item, index) => (
                <Button
                    key={index}
                    onClick={() => {
                        setActiveItem(index);
                        item.onClick();
                    }}
                    style={{
                        backgroundColor: activeItem === index ? 'var(--primary-color)' : 'transparent',
                        color: activeItem === index ? 'white' : 'var(--text-color)',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.25rem',
                        padding: '0.5rem',
                    }}
                >
                    {item.icon}
                    <span className="dock-label">{item.label}</span>
                </Button>
            ))}
            */}
        </div>
    );
};

Dock.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            icon: PropTypes.node.isRequired,
            label: PropTypes.string.isRequired,
            onClick: PropTypes.func.isRequired,
        })
    ).isRequired,
};

export default Dock;