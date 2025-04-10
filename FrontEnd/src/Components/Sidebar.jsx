"use client";

import React, { useState } from "react";
import "../Components/Sidebar.css"; // Import your CSS file for styling
import {
    Link2,
    Upload,
    Plus,
    Star,
    ChevronDown,
    FileText,
    Image,
    Video,
    Music,
    Code,
} from "lucide-react";

function App() {
    return (
        <div className = "App">
            <div className = "flex h-screen">
                <Sidebar />
                {/* Here is where my main content will do */}
            <div className = "flex-1 bg-gray-100 p-4">
                {/* Something goes here */}
            </div>
            </div>
        </div>
    )
}

const Sidebar = () => {
    const [isFavoritesOpen, setIsFavoritesOpen] = useState(true);
    const [favorites, setFavorites] = useState([]);

    // Sample favorite items with tags
    const favoriteItems = [
        {
            id: "1",
            name: "Documentation",
            icon: <FileText className="w-5 h-5" />,
            tags: ["work", "documentation"],
        },
        {
            id: "2",
            name: "Business ID",
            icon: <Image className="w-5 h-5" />,
            tags: ["personal", "photos"],
        },
        {
            id: "3",
            name: "Expo Vlog",
            icon: <Video className="w-5 h-5" />,
            tags: ["education", "video"],
        },
        {
            id: "4",
            name: "Voice Memo",
            icon: <Music className="w-5 h-5" />,
            tags: ["personal", "music"],
        },
    ];

    // Group items by their first tag
    const groupedItems = favoriteItems.reduce((acc, item) => {
        const category = item.tags[0] || "uncategorized";
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(item);
        return acc;
    }, {});

    // Khushi added code for toggelFavorite

    const toggleFavorite = (itemId) => {
        if (favorites.includes(itemId)) {
            setFavorites(favorites.filter((id) => id !== itemId));
        } else {
            setFavorites([...favorites, itemId]);
        }
    };

    const isItemFavorite = (itemId) => favorites.includes(itemId);

    return (
        <div className="w-auto h-100% bg-white px-4 py-2 rounded border-2 border-purple-500">
            <h1 className="text-black font-bold ">Dashboard</h1>

            <hr />

            {/* Primary Action Buttons */}
            <ul className="text-black font-bold mt-3">
                <li className="mb-4 rounded hover:shadow hover:bg-pink-200 py-2 border-2 border-purple-500">
                    <a href="#" className="px-3 flex items-center">
                        <Link2 className="inline-block w-6 h-6 mr-2" />
                        Connect
                    </a>
                </li>
                <li className="mb-4 rounded hover:shadow hover:bg-pink-200 py-2 border-2 border-purple-500">
                    <a href="#" className="px-3 flex items-center">
                        <Upload className="inline-block w-6 h-6 mr-2" />
                        Upload
                    </a>
                </li>
                <li className="mb-4 rounded hover:shadow hover:bg-pink-200 py-2 border-2 border-purple-500">
                    <a href="#" className="px-3 flex items-center">
                        <Plus className="inline-block w-6 h-6 mr-2" />
                        Create
                    </a>
                </li>
            </ul>

            <hr className="my-4" />

            {/* Favorites Section */}
            <div className="mt-4">
                <button
                    onClick={() => setIsFavoritesOpen(!isFavoritesOpen)}
                    className="w-full flex items-center justify-between px-3 py-2 text-black font-bold rounded hover:bg-pink-200 border-2 border-purple-500"
                >
                    <div className="flex items-center">
                        <Star className="inline-block w-6 h-6 mr-2" />
                        Favorites
                    </div>
                    <ChevronDown
                        className={`w-5 h-5 transition-transform ${
                            isFavoritesOpen ? "rotate-180" : ""
                        }`}
                    />
                </button>

                {isFavoritesOpen && (
                    <div className="mt-2 pl-2">
                        {Object.entries(groupedItems).map(
                            ([category, items]) => (
                                <div key={category} className="mb-3">
                                    <h3 className="text-sm font-semibold uppercase text-gray-600 ml-2 mt-2">
                                        {category}
                                    </h3>
                                    <ul className="mt-1">
                                        {items.map((item) => (
                                            <li
                                                key={item.id}
                                                className="mb-2 rounded hover:shadow hover:bg-pink-200 py-1 border border-purple-500"
                                            >
                                                <a
                                                    href="#"
                                                    className="px-3 flex items-center text-black"
                                                >
                                                    {React.cloneElement(
                                                        item.icon,
                                                        {
                                                            className:
                                                                "inline-block w-5 h-5 mr-2",
                                                        }
                                                    )}
                                                    <span className="truncate">
                                                        {item.name}
                                                    </span>
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sidebar;
