import { useState } from "react";

const useFileUpload = () => {
    const [progress, setProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    const uploadFiles = async (files, getPresignedUrls) => {
        setIsUploading(true);
        setProgress(0);
        try {
            const { urls, keys } = await getPresignedUrls(files.length);
            for (let i = 0; i < files.length; i++) {
                await new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest();
                    xhr.open("PUT", urls[i]);
                    xhr.upload.onprogress = (event) => {
                        if (event.lengthComputable) {
                            setProgress(Math.round(((i + event.loaded / event.total) / files.length) * 100));
                        }
                    };
                    xhr.onload = () => resolve();
                    xhr.onerror = () => reject(xhr.statusText);
                    xhr.send(files[i]);
                });
            }
            setProgress(100);
        } finally {
            setIsUploading(false);
        }
    };

    return { uploadFiles, progress, isUploading };
};

export default useFileUpload;
