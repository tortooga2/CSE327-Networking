"use client";

import { useState, useRef, useEffect } from "react";
import { Search, User, LogOut, Settings, ChevronDown } from "lucide-react";
import { useUser } from "./Contexts/ctx.user";

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
        <nav className="w-100% h-25 bg-purple-100  px-4 py-3 flex items-center justify-between">
            {/* Left: Search Bar */}
            <div
                className={`relative transition-all duration-300 ease-in-out ${isSearchExpanded ? "w-64" : "w-10"
                    }`}
            >
                <div className="relative flex items-center">
                    <button
                        onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                        className="absolute left-2 text-gray-500 hover:text-blue-500 focus:outline-none"
                    >
                        <Search className="w-5 h-5" />
                    </button>
                    <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search..."
                        className={`
              pl-10 pr-4 py-2 rounded-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none
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

            {/* Center-Right: Logo */}
            <div className="flex-1 flex justify-center ml-4">
                <h1 className="text-2xl font-bold text-purple-600">
                    connect<span className="text-gray-800">work</span>
                </h1>
            </div>

            {/* Right: User Profile */}
            <div className="flex items-center space-x-4">
                {/* User Profile Dropdown */}
                <div className="relative" ref={profileDropdownRef}>
                    <button
                        onClick={() =>
                            setIsProfileDropdownOpen(!isProfileDropdownOpen)
                        }
                        className="flex items-center space-x-2 text-gray-700 hover:text-purple-500 focus:outline-none"
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
    );
};

export default Dashboard;
