import { useEffect, useRef, useState } from "react";

import {
    FaUpload,
    FaLink,
    FaTimes,
    FaTrash,
    FaStickyNote,
} from "react-icons/fa";
import { useStore } from "./Contexts/ctx.appManager";

// import NoteCreation from "./NoteCreation";
import VerticalDiv from "./UILayout/VerticalDiv";

import NoteCreation from "./NoteCreation";
import Button from "./Button/Button";
import UploadArea from "./UploadArea";

const Sidebar = () => {
    const selectedFiles = useStore((state) => state.selectedFiles);
    const UnSelectAll = useStore((state) => state.unSelectAll);
    const connectFiles = useStore((state) => state.connectFiles);
    const uploadFile = useStore((state) => state.uploadFiles);
    const deleteFiles = useStore((state) => state.deleteFiles);

    const formRef = useRef(null);
    
    const [coordinates, setCoordinates] = useState(null);
    
    const getCoordinates = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    console.log("User coordinates:", position.coords);
                    setCoordinates({ latitude, longitude });
                },
                (error) => {
                    console.error("Error getting coordinates: ", error);
                    setCoordinates("Coordinates unavailable");
                },
                {
                    enableHighAccuracy: true,
                    timeout: Infinity,
                    maximumAge: Infinity,
                }
            );
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    };
    
    const getIpCoordinates = async () => {
        const apiKey = 'aec9182b8dbd8f';
        try {
            const response = await fetch(`https://ipinfo.io?token=${apiKey}`);
            const data = await response.json();
            console.log("IP-based coordinates:", data);
            console.log("Coordinates: ", data.loc.split(','));
            
            const [latitude, longitude] = data.loc.split(',');
            setCoordinates({ latitude, longitude });
        } catch (error) {
            console.error("Error getting IP-based coordinates:", error);
        }
    }
    
    const getPlaceFromCoordinates = async (latitude, longitude) => {
        const apiKey = '32659073e1594643a51f7b9fe8676c0f';
        try {
            const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`);
            const data = await response.json();
            console.log("Place details:", data);
            
            // Assuming the response contains 'results' with the place details
            if (data && data.results && data.results.length > 0) {
                const components = data.results[0].components
                
                const placeName =
                    components.university ||
                    components.college ||
                    components.school ||
                    components.building ||
                    components.city ||
                    components.town ||
                    components.village ||
                    "undetermined";
                
                console.log("Place name:", placeName);
                
                return placeName;
                
                //console.log(data.results[0].components);  // Update the place state with the first result
            }
        } catch (error) {
            console.error("Error fetching place from coordinates:", error);
        }
    }
    
    /*
    useEffect(() => {
        if (coordinates) {
            console.log("Updated coordinates:", coordinates);
            //console.log(getPlaceFromCoordinates(coordinates.latitude, coordinates.longitude));
            console.log(getPlaceFromCoordinates(37.36307795584273, -120.424845109885));
        }
    }, [coordinates]);
    */
    
    useEffect(() => {
        getCoordinates();
        //getIpCoordinates();
    }, []);

    useEffect(() => {
        if (!formRef.current) {
            return;
        }
        formRef.current.addEventListener("submit", async (e) => {
            e.preventDefault();

            const fileInput = e.target.querySelector('input[type="file"]');
            const files = fileInput.files;
            if (!files || files.length === 0) {
                console.error("No files selected");
                return;
            }

            try {
                const p = "hello";
                await uploadFile(files, "v", null);
                //             let filesArray = [];
                //             try {
                //                 for (let i = 0; i < files.length; i++) {
                //                     const file = files[i];
                //                     console.log("Uploading file:", file.name);
                //                     const fileResponse = await uploadFile(file, p);
                //                     filesArray.push(fileResponse);
                //                 }

                fileInput.value = "";

                alert("Files uploaded successfully!");
            } catch (error) {
                console.error("Error during upload:", error);
                alert("Error uploading files. Please try again.");
            }
        });
    }, [uploadFile]);

    return (
        <div
            style={{
                // border: "1px solid",
                // borderRadius: "1rem",
                // borderImageSlice: 1,
                // borderImageSource:
                //     "linear-gradient(130deg, #FFEEDB 60%, #dd614a)",
                padding: "1rem",

                gap: "1rem",
                flexDirection: "column",
                justifyContent: "space-between",
                display: "flex",
            }}
        >
            <Button
                onClick={connectFiles}
                style={{
                    color: "var(--bundle-color-2)",
                }}
            >
                <FaLink />
                Bundle Files
            </Button>
            <Button
                onClick={(e) => {
                    useStore.getState().setLayoutState(2);
                }}
                style={{
                    color: "var(--note-color-2)",
                }}
            >
                <FaStickyNote />
                New Note
            </Button>

            <UploadArea />
            
            <button onClick={getCoordinates}>Get my Coords</button>

            {/* <form
                id="fileForm"
                ref={formRef}
                style={{
                    padding: "1.5rem",
                    backgroundColor: "#ffffff",
                    borderRadius: "0.5rem",
                    border: "1px solid black",
                }}
            >
                <input
                    type="file"
                    style={{
                        padding: "0.75rem",
                        border: "1px solid black",
                        borderRadius: "6px",
                        width: "100%",
                        fontSize: "0.9rem",
                        backgroundColor: "#F7FAFC",
                        marginBottom: "1rem",
                    }}
                    multiple
                />
                <button
                    type="submit"
                    style={{
                        padding: "0.75rem 1rem",
                        backgroundColor: "#8BFFB0",
                        color: "#1E0B33",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        transition: "background-color 0.2s",
                        width: "100%",
                        fontSize: "0.9rem",
                    }}
                >
                    Upload
                </button>
            </form> */}
        </div>
    );
};

export default Sidebar;
