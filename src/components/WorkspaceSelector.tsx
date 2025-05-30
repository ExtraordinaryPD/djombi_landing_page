// WorkspaceSelector.tsx
"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// Define proper TypeScript interfaces
interface UserInfo {
    name: string;
    organizationId?: string;
}

interface Workspace {
    id: string;
    name: string;
    icon: string;
}

// WorkspaceSelector Component
interface WorkspaceSelectorProps {
    userInfo: UserInfo;
    setUserInfo: (userInfo: UserInfo) => void;
    isCollapsed: boolean;
    isMobile: boolean;
    workspaces: Workspace[];
    setWorkspaces: (workspaces: Workspace[]) => void;
    onShowModal: () => void;
}

const WorkspaceSelector: React.FC<WorkspaceSelectorProps> = ({
    userInfo,
    setUserInfo,
    isCollapsed,
    isMobile,
    workspaces,
    setWorkspaces,
    onShowModal
}) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Handle clicks outside of the dropdown with useCallback for better performance
    const handleClickOutside = useCallback((event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setShowDropdown(false);
        }
    }, []);

    useEffect(() => {
        if (showDropdown) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showDropdown, handleClickOutside]);

    const toggleDropdown = useCallback(() => {
        setShowDropdown(prev => !prev);
    }, []);

    const handleWorkspaceClick = useCallback((workspace: Workspace) => {
        // Simulate switching workspace
        setUserInfo({
            ...userInfo,
            name: workspace.name,
            organizationId: workspace.id
        });

        // Close dropdown
        setShowDropdown(false);
    }, [userInfo, setUserInfo]);

    const handleAddWorkspaceClick = useCallback(() => {
        setShowDropdown(false);
        onShowModal();
    }, [onShowModal]);

    // Generate initials for user's icon
    const userInitials = userInfo.name
        ? userInfo.name.trim().substring(0, 2).toUpperCase()
        : "US";

    // Filter other workspaces to avoid duplicates
    const otherWorkspaces = workspaces.filter(w => w.id !== userInfo.organizationId);

    return (
        <div
            className={cn(
                "px-3 relative",
                isCollapsed && !isMobile ? "py-3" : "py-2"
            )}
            ref={dropdownRef}
        >
            <div
                className={cn(
                    "flex items-center p-1 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200",
                    isCollapsed && !isMobile ? "justify-center" : "justify-between"
                )}
                onClick={toggleDropdown}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleDropdown();
                    }
                }}
                aria-expanded={showDropdown}
                aria-haspopup="listbox"
            >
                <div className={cn(
                    "flex items-center min-w-0",
                    isCollapsed && !isMobile ? "justify-center" : "flex-1"
                )}>
                    <div
                        className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        aria-label={`${userInfo.name || 'User'} avatar`}
                    >
                        {userInitials}
                    </div>
                    {(!isCollapsed || isMobile) && (
                        <span className="font-medium text-sm ml-2 truncate">
                            {userInfo.name || 'Unknown User'}
                        </span>
                    )}
                </div>
                {(!isCollapsed || isMobile) && (
                    <ChevronDown
                        size={14}
                        className={cn(
                            "flex-shrink-0 transition-transform duration-200",
                            showDropdown && "rotate-180"
                        )}
                    />
                )}
            </div>

            {/* Workspace Dropdown */}
            {showDropdown && (!isCollapsed || isMobile) && (
                <div className="absolute left-3 right-3 mt-1 bg-white border rounded-lg shadow-lg z-50 animate-in slide-in-from-top-1 duration-200">
                    <div className="p-2">
                        <p className="text-xs uppercase text-gray-400 pb-1 font-medium">
                            Workspaces
                        </p>

                        {/* Current workspace */}
                        <div className="flex items-center p-2 bg-blue-50 rounded-md mb-1 border border-blue-100">
                            <div
                                className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center text-white font-medium mr-2 text-xs flex-shrink-0"
                                aria-label={`${userInfo.name || 'Current user'} workspace avatar`}
                            >
                                {userInitials}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="font-medium text-sm truncate">
                                    {userInfo.name || 'Unknown User'}
                                </p>
                                <p className="text-xs text-gray-500">Current workspace</p>
                            </div>
                        </div>

                        {/* Other workspaces */}
                        {otherWorkspaces.length > 0 && otherWorkspaces.map((workspace) => (
                            <div
                                key={workspace.id}
                                className="flex items-center p-2 hover:bg-gray-50 rounded-md cursor-pointer transition-colors duration-150"
                                onClick={() => handleWorkspaceClick(workspace)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        handleWorkspaceClick(workspace);
                                    }
                                }}
                            >
                                <div
                                    className="w-6 h-6 bg-gray-600 rounded-md flex items-center justify-center text-white font-medium mr-2 text-xs flex-shrink-0"
                                    aria-label={`${workspace.name} workspace avatar`}
                                >
                                    {workspace.icon}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="font-medium text-sm truncate">{workspace.name}</p>
                                </div>
                            </div>
                        ))}

                        {/* Add workspace button */}
                        <button
                            type="button"
                            className="w-full mt-2 p-2 bg-gray-100 hover:bg-gray-200 rounded-md text-xs font-medium flex items-center justify-center transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                            onClick={handleAddWorkspaceClick}
                        >
                            <span>+ Sign into another workspace</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkspaceSelector;