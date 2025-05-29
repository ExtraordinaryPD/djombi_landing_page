// WorkspaceSelector.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
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

  // Handle clicks outside of the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleWorkspaceClick = (workspace: Workspace) => {
    // Simulate switching workspace
    setUserInfo({
      ...userInfo,
      name: workspace.name,
      organizationId: workspace.id
    });

    // Close dropdown
    setShowDropdown(false);
  };

  // Generate initials for user's icon
  const userInitials = userInfo.name ? userInfo.name.substring(0, 2).toUpperCase() : "US";

  return (
    <div className={cn("px-3 relative", isCollapsed && !isMobile ? "py-3" : "py-2")} ref={dropdownRef}>
      <div
        className={cn(
          "flex items-center p-1 border rounded-lg cursor-pointer hover:bg-gray-50",
          isCollapsed && !isMobile ? "justify-center" : "justify-between"
        )}
        onClick={toggleDropdown}
      >
        <div className={cn(
          "flex items-center min-w-0",
          isCollapsed && !isMobile ? "justify-center" : "flex-1"
        )}>
          <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {userInitials}
          </div>
          {(!isCollapsed || isMobile) && <span className="font-medium text-sm ml-2 truncate">{userInfo.name}</span>}
        </div>
        {(!isCollapsed || isMobile) && (
          <ChevronDown size={14} className="flex-shrink-0" />
        )}
      </div>

      {/* Workspace Dropdown */}
      {showDropdown && (!isCollapsed || isMobile) && (
        <div className="absolute left-3 right-3 mt-1 bg-white border rounded-lg shadow-lg z-10">
          <div className="p-2">
            <p className="text-xs uppercase text-gray-400 pb-1">Workspaces</p>

            {/* Current workspace */}
            <div className="flex items-center p-1 bg-blue-50 rounded-md mb-1">
              <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center text-white font-medium mr-2 text-xs flex-shrink-0">
                {userInitials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm truncate">{userInfo.name}</p>
                <p className="text-xs text-gray-500">Current workspace</p>
              </div>
            </div>

            {/* Other workspaces */}
            {workspaces.filter(w => w.id !== userInfo.organizationId).map((workspace) => (
              <div
                key={workspace.id}
                className="flex items-center p-1 hover:bg-gray-50 rounded-md cursor-pointer"
                onClick={() => handleWorkspaceClick(workspace)}
              >
                <div className="w-6 h-6 bg-gray-600 rounded-md flex items-center justify-center text-white font-medium mr-2 text-xs flex-shrink-0">
                  {workspace.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm truncate">{workspace.name}</p>
                </div>
              </div>
            ))}

            {/* Add workspace button */}
            <button
              className="w-full mt-1 p-1 bg-gray-100 hover:bg-gray-200 rounded-md text-xs font-medium flex items-center justify-center"
              onClick={() => {
                setShowDropdown(false);
                onShowModal();
              }}
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