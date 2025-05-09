import { useEffect, useState, useRef } from "react";
import { useStore } from "../Contexts/ctx.appManager";
import { useMobile } from "../Contexts/ctx.mobile";
import { FileType } from "../Tags";
import "./MobileFileViewer.css";

const MobileFileViewer = () => {
    const files = useStore((state) => state.files);
    const sortOrder = useStore((state) => state.sortOrder);
    const { isMobileMenuOpen, isSearchOpen } = useMobile();
    const [fileEntries, setFileEntries] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [pullStartY, setPullStartY] = useState(0);
    const [pullMoveY, setPullMoveY] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const refreshIndicatorRef = useRef(null);
    
    const handleTouchStart = (e) => {
        // Only enable pull-to-refresh when scrolled to top
        if (e.currentTarget.scrollTop === 0) {
            setPullStartY(e.touches[0].clientY);
            setPullMoveY(e.touches[0].clientY);
        }
    };

    const handleTouchMove = (e) => {
        if (pullStartY === 0 || e.currentTarget.scrollTop > 0) return;
        
        setPullMoveY(e.touches[0].clientY);
        const pullDistance = e.touches[0].clientY - pullStartY;
        
        if (pullDistance > 0 && pullDistance < 150) {
            if (refreshIndicatorRef.current) {
                refreshIndicatorRef.current.style.transform = `translateY(${pullDistance}px)`;
            }
            e.preventDefault();
            setIsRefreshing(pullDistance > 100);
        }
    };

    const handleTouchEnd = async () => {
        if (isRefreshing && !isLoading) {
            setIsLoading(true);
            await useStore.getState().loadFiles();
            setIsLoading(false);
        }
        
        if (refreshIndicatorRef.current) {
            refreshIndicatorRef.current.style.transform = 'translateY(0)';
        }
        setPullStartY(0);
        setPullMoveY(0);
        setIsRefreshing(false);
    };

    useEffect(() => {
        const loadAndRefresh = async () => {
            await useStore.getState().loadFiles();
        };

        loadAndRefresh(); // Initial load

        // Set up periodic refresh
        const intervalId = setInterval(loadAndRefresh, 5000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const fileArray = Array.from(files.values()).sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setFileEntries(fileArray);
    }, [files, sortOrder]);

    if (isMobileMenuOpen || isSearchOpen) {
        return null;
    }

    return (
        <div 
            className="mobile-file-viewer"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <div className="pull-to-refresh-indicator" ref={refreshIndicatorRef}>
                {isRefreshing ? 
                    <div className="refresh-spinner"></div> : 
                    'Pull to refresh'
                }
            </div>
            
            {fileEntries.length === 0 ? (
                <div className="mobile-empty-state">
                    <p>No files yet</p>
                    <p>Files you upload or create will appear here</p>
                </div>
            ) : (
                fileEntries.map((file) => (
                    <div 
                        key={file.id} 
                        className="mobile-file-card"
                        onClick={() => useStore.getState().setPreviewedFile(file.id)}
                        role="button"
                        tabIndex={0}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                useStore.getState().setPreviewedFile(file.id);
                            }
                        }}
                    >
                        <div className="mobile-file-type">
                            {FileType(file.name, false)}
                        </div>
                        <div className="mobile-file-info">
                            <h3 className="mobile-file-name">{file.name}</h3>
                            <p className="mobile-file-date">
                                {new Date(file.createdAt).toLocaleDateString()} {new Date(file.createdAt).toLocaleTimeString()}
                            </p>
                        </div>
                        <div className="mobile-file-creator">
                            <div className="mobile-creator-avatar">
                                {file.creator_username?.[0]?.toUpperCase() || 'U'}
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default MobileFileViewer;
