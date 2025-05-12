import { create } from "zustand";

import { useUser } from "./ctx.user";

const useStore = create((set) => ({
    userProfile: {},
    setUserProfile: (state) => set({ userProfile: state }),

    userSettings: {},
    setUserSettings: (state) => set({ userSettings: state }),
    updateUserSettings: async (state) => {
        const response = await fetch("api/user/settings/update", {
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                ...useStore.getState().userSettings,
            }),
        });
        if (response.ok) {
            const { data } = await response.json();
            useStore.getState().setUserSettings(data);
        } else {
            useStore.getState().user.ValidateSession();
            console.error("failed to update settings");
        }
    },

    layoutState: 0,
    setLayoutState: (state) => set({ layoutState: state }),
    
    coordinates: null,

    getCoordinates: () => {
        return new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const coords = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    };
                    set({ coordinates: coords, geolocationFailed: false });
                    resolve(coords);
                },
                (err) => {
                    console.error("Geolocation error:", err);
                    set({ coordinates: null, geolocationFailed: true });
                    resolve(null); // Still resolve, just with null
                }
            );
        });
        
        {/*
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const coords = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    };
                    set({ coordinates: coords });
                    resolve(coords);
                },
                (err) => {
                    console.error("Geolocation error:", err);
                    reject(err);
                }
            );
        });
        */}
    
        {/*
        new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const coords = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              };
              set({ coordinates: coords });
              resolve(coords);
            },
            (err) => {
              console.error("Geolocation error:", err);
              reject(err);
            }
          );
        }),
        */}
        
        {/*
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    console.log("User coordinates:", position.coords);
                    useStore.getState().setCoordinates({ latitude, longitude });
                },
                (error) => {
                    console.error("Error getting coordinates: ", error);
                    useStore.getState().setCoordinates("Coordinates unavailable");
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
        */}
    },

    /*
    getIpCoordinates: async () => {
        const apiKey = 'aec9182b8dbd8f';
        try {
            const response = await fetch(`https://ipinfo.io?token=${apiKey}`);
            const data = await response.json();
            console.log("IP-based coordinates:", data);

            const [latitude, longitude] = data.loc.split(',');
            useStore.getState().setCoordinates({ latitude, longitude });
        } catch (error) {
            console.error("Error getting IP-based coordinates:", error);
        }
    },
    */

    getPlaceFromCoordinates: async (latitude, longitude) => {
        const apiKey = '32659073e1594643a51f7b9fe8676c0f';
        
        {/*
        try {
            const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`);
            const data = await response.json();
            console.log("Place details:", data);

            if (data && data.results && data.results.length > 0) {
                const components = data.results[0].components;

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
            }
        } catch (error) {
            console.error("Error fetching place from coordinates:", error);
        }
        */}
        
        return new Promise((resolve, reject) => {
        fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                console.log("Place details:", data);

                if (data && data.results && data.results.length > 0) {
                    const components = data.results[0].components;

                    const placeName =
                        components.university ||
                        components.college ||
                        components.school ||
                        components.building ||
                        components.city ||
                        components.town ||
                        components.village ||
                        "undetermined";

                    //console.log("Place name:", placeName);
                    resolve(placeName); // Resolve the promise with the place name
                } else {
                    reject("No results found");
                }
            })
            .catch(error => {
                console.error("Error fetching place from coordinates:", error);
                reject(error); // Reject the promise in case of an error
            });
    });
    },

    files: new Map(),
    setFiles: (files) => set({ files }),
    updateFiles: (data) => {
        set((state) => {
            const filesMap = new Map(state.files);
            data.forEach((file) => filesMap.set(file.id, file));
            return { files: filesMap };
        });
    },

    newFiles: new Array(),

    appendNewFiles: (state) => {
        set((prevState) => ({
            newFiles: [...prevState.newFiles, state],
        }));
    },
    popNewFiles: () => {
        set((prevState) => ({
            newFiles: prevState.newFiles.slice(0, -1),
        }));
    },

    sortOrder: { field: "id", order: "desc" },
    setSortOrder: (state) => set({ sortOrder: state }),

    selectedFiles: new Set(),
    selectFile: (fileID, selectionState) => {
        set((state) => {
            const newSelectedFiles = new Set(state.selectedFiles);
            if (selectionState) {
                newSelectedFiles.add(fileID);
            } else {
                newSelectedFiles.delete(fileID);
            }
            return { selectedFiles: newSelectedFiles };
        });
    },
    unSelectAll: () => {
        set({ selectedFiles: new Set() });
    },
    previewedFile: null,
    setPreviewedFile: (fileID) => {
        if (fileID === null) {
            set({ layoutState: 0 });
        } else {
            set({ layoutState: 1 });
        }
        set({ previewedFile: fileID });
    },
    loading: false,

    loadFiles: async () => {
        set({ loading: true });
        try {
            const response = await fetch("/api/file/all", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                const filesArray = data.data;

                set((state) => {
                    const newFiles = new Map(state.files);
                    for (const file of filesArray) {
                        newFiles.set(file.id, file);
                    }
                    return { files: newFiles };
                });
                set({ loading: false });
            }
        } catch (error) {
            console.error(error);
        }
    },

    SortOrder: {
        DESC: "desc",
        ASC: "asc",
    },

    searchFiles: async (
        searchString = null,
        sortColumn = null,
        sortOrder = null,
        filter
    ) => {
        ///api/file/load?limit=5&chunk=1&order=asc&search=flowers&type=png&sort=createdAt

        let endpoint = `/api/file/load?limit=99999&chunk=1&`;
        if (searchString) {
            endpoint += `search=${searchString}&`;
        }
        if (sortColumn) {
            endpoint += `sort=${sortColumn}&`;
        }
        if (sortOrder) {
            endpoint += `order=${sortOrder}&`;
        }
        if (filter) {
            endpoint += `type=${filter}`;
        }
        try {
            const response = await fetch(endpoint, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            const { files } = await response.json();
            const newMap = new Map();
            files.forEach((f) => {
                newMap.set(f.id, f);
            });
            useStore.getState().setFiles(newMap);
        } catch (err) {
            throw new Error("failed to search files", err);
        }
    },

    connectFiles: async () => {
        if (useStore.getState().selectedFiles.size == 0) {
            useStore
                .getState()
                .setError("Oh no, no files to connect :(", "bad");
            return;
        }
        try {
            const selectedFileIDs = Array.from(useStore.getState().selectedFiles);
            const selectedFileObjects = selectedFileIDs
            .map((id) => useStore.getState().files.get(id))
            .filter((file) => file && file.type !== "bundle");
            
            if (selectedFileObjects.length === 0) {
                console.log("No files selected. Skipping connection.");
                return;
            }
            
            const filteredFileIDs = selectedFileObjects.map((file) => file.id);
            
            const waitForCoordinates = () => {
                return new Promise((resolve, reject) => {
                    const checkCoordinates = () => {
                        const { coordinates, geolocationFailed } = useStore.getState();
                        console.log(coordinates);
                        
                        if (geolocationFailed) return resolve(null); // stop loop on failure
                        if (coordinates && coordinates.latitude && coordinates.longitude) return resolve(coordinates);

                        setTimeout(checkCoordinates, 50);
                        
                        {/*
                        if (coordinates && coordinates.latitude && coordinates.longitude) {
                            resolve(coordinates);  // Resolve once coordinates are available
                        }
                        else {
                            setTimeout(checkCoordinates, 50);  // Retry after 500ms if coordinates aren't available
                        }
                        */}
                    };
                    checkCoordinates();  // Start checking for coordinates
                });
            };
                                                                
            await useStore.getState().getCoordinates(); // ensure it kicks off
            const coordinates = await waitForCoordinates();
            {/*
            console.log("Coords", coordinates);
            console.log("lat: ", coordinates.latitude, "long: ", coordinates.longitude);
                                    
            const { getPlaceFromCoordinates } = useStore.getState();
            const locationName = await getPlaceFromCoordinates(coordinates.latitude, coordinates.longitude);
            console.log("Name of place: ", locationName);
            */}
            let locationName = "Undetermined";
            if (coordinates && coordinates.latitude && coordinates.longitude) {
                console.log("Coords", coordinates);
                console.log("lat: ", coordinates.latitude, "long: ", coordinates.longitude);
                const { getPlaceFromCoordinates } = useStore.getState();
                locationName = await getPlaceFromCoordinates(coordinates.latitude, coordinates.longitude);
                console.log("Name of place: ", locationName);
            }
                                    
            const response = await fetch("/api/file/connect", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    file_ids: filteredFileIDs,
                    location: locationName,
                }),
            });

            if (response.ok) {
                const data = await response.json();

                useStore.getState().updateFiles(data.data);
                useStore.getState().unSelectAll();
            }
        } catch (error) {
            console.error(error);
        }
    },

    uploadFiles: async (files, onProgress = null) => {
        //Separate name from each file
        const fileNames = [];
        for (let index = 0; index < files.length; index++) {
            fileNames.push(files[index].name);
        }

        try {
            const response = await fetch(
                `/api/file/upload-helper?count=${files.length}`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );

            if (!response.ok) {
                console.error(
                    "An error occurred when attempting to fetch from upload-helper"
                );
            }

            const { urls, keys } = await response.json();

            //Push each file to s3
            for (let index = 0; index < files.length; index++) {
                await (async () => {
                    return new Promise((resolve, reject) => {
                        const xhr = new XMLHttpRequest();
                        xhr.open("PUT", urls[index]);

                        xhr.onload = async () => {
                            if (xhr.status === 200) {
                                onProgress
                                    ? onProgress(files[index].name, 100)
                                    : null;
                                await (async () => {
                                    onProgress?.(files[index].name, 100);
                                    
                                    const waitForCoordinates = () => {
                                        return new Promise((resolve, reject) => {
                                            const checkCoordinates = () => {
                                                const { coordinates, geolocationFailed } = useStore.getState();
                                                console.log(coordinates);
                                                
                                                if (geolocationFailed) return resolve(null); // stop loop on failure
                                                if (coordinates && coordinates.latitude && coordinates.longitude) return resolve(coordinates);

                                                setTimeout(checkCoordinates, 100);
                                                
                                                {/*
                                                if (coordinates && coordinates.latitude && coordinates.longitude) {
                                                    resolve(coordinates);  // Resolve once coordinates are available
                                                }
                                                else {
                                                    setTimeout(checkCoordinates, 50);  // Retry after 500ms if coordinates aren't available
                                                }
                                                */}
                                            };
                                            checkCoordinates();  // Start checking for coordinates
                                        });
                                    };
                                                                
                                    await useStore.getState().getCoordinates(); // ensure it kicks off
                                    const coordinates = await waitForCoordinates();
                                    {/*
                                    console.log("Coords", coordinates);
                                    console.log("lat: ", coordinates.latitude, "long: ", coordinates.longitude);
                                    */}
                                    let locationName = "Undetermined";
                                    if (coordinates && coordinates.latitude && coordinates.longitude) {
                                        console.log("Coords", coordinates);
                                        console.log("lat: ", coordinates.latitude, "long: ", coordinates.longitude);
                                        const { getPlaceFromCoordinates } = useStore.getState();
                                        locationName = await getPlaceFromCoordinates(coordinates.latitude, coordinates.longitude);
                                        console.log("Name of place: ", locationName);
                                    }
                                    
                                    {/*
                                    const { getPlaceFromCoordinates } = useStore.getState();
                                    const locationName = await getPlaceFromCoordinates(coordinates.latitude, coordinates.longitude);
                                    console.log("Name of place: ", locationName);
                                    */}
                                    
                                    const fileVerResponse = await fetch(
                                        "/api/file/verify",
                                        {
                                            method: "POST",
                                            credentials: "include",
                                            headers: {
                                                "Content-Type":
                                                    "application/json",
                                            },
                                            body: JSON.stringify({
                                                keys: [keys[index]],
                                                fileNames: [fileNames[index]],
                                                location: locationName,
                                            }),
                                        }
                                    );

                                    if (!fileVerResponse.ok) {
                                        throw new Error(
                                            "An error occurred when verifying your files"
                                        );
                                    }

                                    const { data } =
                                        await fileVerResponse.json();
                                    console.log(data);
                                    useStore.getState().updateFiles(data);
                                })();
                                useStore
                                    .getState()
                                    .setError(
                                        `✅ Uploaded File: ${files[index].name}`,
                                        "good"
                                    );
                                resolve(xhr.responseText);
                            } else {
                                useStore
                                    .getState()
                                    .setError(
                                        `❌ Failed to Upload File: ${files[index].name}`,
                                        "bad"
                                    );
                                reject(new Error("Upload failed"));
                            }
                        };

                        xhr.onerror = () => {
                            useStore.getState().user.ValidateSession();
                            reject(new Error("XHR error"));
                        };

                        xhr.upload.onprogress = (event) => {
                            if (event.lengthComputable && onProgress) {
                                const percent =
                                    (event.loaded / event.total) * 100;

                                onProgress(files[index].name, percent);
                            }
                        };

                        xhr.send(files[index]);
                    });
                })();
            }
        } catch (error) {
            console.error(error);
        }

        //Now check to see if the files were uploaded successfully and if so, save to db
    },
    deleteFiles: async () => {
        const files = useStore.getState().files;
        const selectedFiles = useStore.getState().selectedFiles;
        try {
            const response = await fetch("/api/file/delete/", {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    file_ids: Array.from(selectedFiles),
                }),
            });

            if (!response.ok) {
                throw new Error("failed to delete files");
            }
            const newFiles = new Map(files);
            Array.from(selectedFiles).forEach((key) => {
                console.log(key);
                newFiles.delete(key);
            });
            useStore.getState().setFiles(newFiles);
        } catch (err) {
            console.error(err);
        }
    },

    Error: {},
    setError: (message, errorType) => {
        set({ Error: { message, errorType } });
    },
}));

export { useStore };
