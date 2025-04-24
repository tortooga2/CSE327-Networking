import { useState } from "react";

export const Header = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="px-4 py-3 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold text-[#1E0B33] hidden lg:block">Files</h1>
            </div>
            {/* Center the search bar on all screens */}
            <div className="flex-1 flex justify-center max-w-xl w-full">
                <div className="relative w-full max-w-xs sm:max-w-xl">
                    <input
                        type="text"
                        placeholder="Search files..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-200 focus:outline-none focus:border-purple-400 transition-colors"
                    />
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </div>
                </div>
            </div>
            <div className="w-[100px]"></div> {/* Spacer to center search */}
        </div>
    );
};
