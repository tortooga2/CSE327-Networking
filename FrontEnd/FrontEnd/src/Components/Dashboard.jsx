"use client";

import { useState, useRef, useEffect } from "react";
import { Search, User, LogOut, Settings, ChevronDown, Upload, Plus, Link } from "lucide-react";
import { useUser } from "./Contexts/ctx.user";

// Color constants
const COLORS = {
    primary: "#1E0B33",
    background: "#F8F6FD",
    accent: {
        notes: "#F87D7D",
        bundles: "#C8B0FF",
        images: "#8BFFB0",
        videos: "#B0D4FF"
    }
};

const Dashboard = () => {
    const { user } = useUser();

    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const searchInputRef = useRef(null);
    const profileDropdownRef = useRef(null);

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                profileDropdownRef.current &&
                !profileDropdownRef.current.contains(event.target)
            ) {
                setIsProfileDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Focus search input when expanded
    useEffect(() => {
        if (isSearchExpanded && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchExpanded]);

    return (
        <div className="flex h-screen bg-white">
            {/* Sidebar */}
            <div className="w-64 bg-[#F8F6FD] p-4 flex flex-col">
                <div className="space-y-4">
                    {/* Primary Actions */}
                    <button className="w-full bg-[#1E0B33] text-white rounded-lg p-3 flex items-center gap-2 hover:opacity-90">
                        <Link className="w-5 h-5" />
                        Connect
                    </button>
                    <button className="w-full bg-[#1E0B33] text-white rounded-lg p-3 flex items-center gap-2 hover:opacity-90">
                        <Upload className="w-5 h-5" />
                        Upload
                    </button>
                    <button className="w-full bg-[#1E0B33] text-white rounded-lg p-3 flex items-center gap-2 hover:opacity-90">
                        <Plus className="w-5 h-5" />
                        Create
                    </button>

                    {/* Favorites Section */}
                    <div className="mt-8">
                        <h2 className="text-lg font-semibold mb-4">Favorites</h2>
                        <div className="space-y-2">
                            <div className="p-2 hover:bg-purple-100 rounded cursor-pointer">Category 1</div>
                            <div className="p-2 hover:bg-purple-100 rounded cursor-pointer">Category 2</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Navigation Bar */}
                <nav className="bg-[#1E0B33] px-4 py-3 flex items-center justify-between">
                    {/* Left: Search Bar */}
                    <div className={`relative transition-all duration-300 ease-in-out ${isSearchExpanded ? "w-64" : "w-10"}`}>
                        <div className="relative flex items-center">
                            <button
                                onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                                className="absolute left-2 text-white hover:text-purple-300 focus:outline-none"
                            >
                                <Search className="w-5 h-5" />
                            </button>
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Search..."
                                className={`
                                    pl-10 pr-4 py-2 rounded-full border-2 border-purple-300 focus:border-purple-400 focus:outline-none
                                    bg-white/10 text-white placeholder-purple-300
                                    transition-all duration-300 ease-in-out
                                    ${isSearchExpanded ? "w-full opacity-100" : "w-10 opacity-0"}
                                `}
                                onBlur={() => {
                                    if (!searchInputRef.current.value) {
                                        setIsSearchExpanded(false);
                                    }
                                }}
                            />
                        </div>
                    </div>

                    {/* Center: Logo */}
                    <div className="flex-1 flex justify-center">
                        <h1 className="text-2xl font-bold">
                            <span className="text-purple-300">connect</span>
                            <span className="text-white">work</span>
                        </h1>
                    </div>

                    {/* Right: User Profile */}
                    <div className="flex items-center space-x-4">
                        <div className="relative" ref={profileDropdownRef}>
                            <button
                                onClick={() =>
                                    setIsProfileDropdownOpen(!isProfileDropdownOpen)
                                }
                                className="flex items-center space-x-2 text-white hover:text-purple-300 focus:outline-none"
                            >
                                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white">
                                    <User className="w-5 h-5" />
                                </div>
                                <span className="hidden md:inline font-medium">
                                    Ary
                                </span>
                                <ChevronDown
                                    className={`w-4 h-4 transition-transform ${isProfileDropdownOpen ? "rotate-180" : ""
                                        }`}
                                />
                            </button>

                            {isProfileDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border-2 border-purple-500 z-10">
                                    <div className="py-1">
                                        <a
                                            href="#"
                                            className="block px-4 py-2 text-gray-700 hover:bg-pink-200 flex items-center"
                                        >
                                            <User className="w-4 h-4 mr-2" />
                                            <span>Profile</span>
                                        </a>
                                        <a
                                            href="#"
                                            className="block px-4 py-2 text-gray-700 hover:bg-pink-200 flex items-center"
                                        >
                                            <Settings className="w-4 h-4 mr-2" />
                                            <span>Settings</span>
                                        </a>
                                        <hr className="my-1 border-gray-200" />
                                        <a
                                            href="#"
                                            className="block px-4 py-2 text-gray-700 hover:bg-pink-200 flex items-center"
                                            onClick={async () => {
                                                user.SignOut();
                                            }}
                                        >
                                            <LogOut className="w-4 h-4 mr-2" />
                                            <span>Sign Out</span>
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </nav>

                {/* Content Area - You can add your table/list view here */}
                <div className="flex-1 p-6">
                    {/* Add your main content here */}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
