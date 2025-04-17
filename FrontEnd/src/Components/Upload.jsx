import { useState, useRef } from "react";
import { useStore } from "./Contexts/zus.fileManager";
import "./Upload.css";

const Upload = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const uploadFiles = useStore((state) => state.uploadFiles);

  const handleFileChange = async (event) => {
    const files = event.target.files;
    if (!files.length) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      // Create XMLHttpRequest to track upload progress
      const xhr = new XMLHttpRequest();
      
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          setUploadProgress(Math.round(progress));
        }
      };

      // Upload files using the store's upload function
      await uploadFiles(files);
      
      setUploadProgress(100);
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 1000);
    } catch (error) {
      console.error("Upload failed:", error);
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="upload-container">
      <button 
        className="upload-toggle"
        onClick={() => setIsVisible(!isVisible)}
      >
        {isVisible ? 'Hide Upload' : 'Show Upload'}
      </button>

      {isVisible && (
        <div className="upload-form">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            multiple
            disabled={uploading}
          />

          {uploading && (
            <div className="progress-bar-container">
              <div 
                className="progress-bar"
                style={{ width: `${uploadProgress}%` }}
              />
              <div className="progress-text">
                {uploadProgress}%
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Upload;
