import { useEffect, useRef } from "react";
import { FaUpload, FaLink, FaTimes, FaTrash } from "react-icons/fa";
import { useStore } from "./Contexts/zus.fileManager";
import VerticalDiv from "../Components/UILayout/VerticalDiv";

const DebugSidebar = () => {
    const selectedFiles = useStore((state) => state.selectedFiles);
    const UnSelectAll = useStore((state) => state.unSelectAll);
    const connectFiles = useStore((state) => state.connectFiles);
    const uploadFile = useStore((state) => state.uploadFiles);
    const deleteFiles = useStore((state) => state.deleteFiles);
    const formRef = useRef(null);

    useEffect(() => {
        if (!formRef.current) return;
        formRef.current.addEventListener("submit", async (e) => {
            e.preventDefault();
            const fileInput = e.target.querySelector('input[type="file"]');
            if (!fileInput.files?.length) {
                console.error("No files selected");
                return;
            }
            try {
                await uploadFile(fileInput.files);
                fileInput.value = "";
                alert("Files uploaded successfully!");
            } catch (error) {
                console.error("Error during upload:", error);
                alert("Error uploading files. Please try again.");
            }
        });
    }, [uploadFile]);

    return (
        <div className="h-full flex flex-col p-4 space-y-4">
            <h2 className="text-xl font-semibold text-[#1E0B33] px-2">
                Debug Console
            </h2>

            <div className="space-y-3">
                <button
                    onClick={UnSelectAll}
                    className="w-full flex items-center gap-2 px-4 py-3 bg-[#1E0B33] text-white rounded-lg hover:bg-opacity-90 transition-colors"
                >
                    <FaTimes className="flex-shrink-0" />
                    <span className="truncate">Unselect All ({selectedFiles.size})</span>
                </button>

                <button
                    onClick={connectFiles}
                    className="w-full flex items-center gap-2 px-4 py-3 bg-[#C8B0FF] text-[#1E0B33] rounded-lg hover:bg-opacity-90 transition-colors"
                >
                    <FaLink className="flex-shrink-0" />
                    <span className="truncate">Connect Files</span>
                </button>
            </div>

            <hr className="border-gray-200" />

            <form
                ref={formRef}
                className="p-4 bg-white rounded-lg border border-gray-200 space-y-3"
            >
                <label className="block text-sm text-gray-600">
                    <div className="flex items-center gap-2 mb-2">
                        <FaUpload className="flex-shrink-0" />
                        <span>Upload File</span>
                    </div>
                    <input
                        type="file"
                        multiple
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400 transition-colors"
                    />
                </label>
                <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#8BFFB0] text-[#1E0B33] rounded-lg hover:bg-opacity-90 transition-colors"
                >
                    Upload
                </button>
            </form>

            <button
                onClick={deleteFiles}
                className="w-full flex items-center gap-2 px-4 py-3 bg-[#FF8A8A] text-white rounded-lg hover:bg-opacity-90 transition-colors"
            >
                <FaTrash className="flex-shrink-0" />
                <span className="truncate">Delete Files ({selectedFiles.size})</span>
            </button>
        </div>
    );
};

export default DebugSidebar;
