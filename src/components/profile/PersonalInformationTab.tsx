"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Camera, X } from "lucide-react";
// import { setUserInfo as setCookieUserInfo } from "@/lib/utils/cookies";  // Import your cookie utility

interface PersonalInformationProps {
  userInfo: {
    name: string;
    email: string;
    avatar?: string;  // Make avatar optional for backward compatibility
  };
  setUserInfo: React.Dispatch<React.SetStateAction<{ 
    name: string;
    email: string;
    avatar?: string;
  }>>;
}

export const PersonalInformationTab: React.FC<PersonalInformationProps> = ({ userInfo, setUserInfo }) => {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(userInfo.avatar || "/icons/default-avatar.png");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }

      setAvatarFile(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setAvatarPreview("/icons/default-avatar.png");
    setAvatarFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePersonalInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Create a FormData object to handle file uploads
      const formData = new FormData();
      formData.append('name', userInfo.name);
      formData.append('email', userInfo.email);
      
      // Only append avatar if a new one was selected
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }
      
      // Call your API to save the data
      // Replace this with your actual API endpoint
      const response = await fetch('/api/user/profile', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      const data = await response.json();
      
      // Update the user info with the new avatar path returned from the server
      const updatedUserInfo = {
        ...userInfo,
        avatar: data.avatar || avatarPreview
      };
      
      // Update the state
      setUserInfo(updatedUserInfo);
      
      // Update the cookie
      // setCookieUserInfo(updatedUserInfo);
      
      // Notify other components about the avatar change
      window.dispatchEvent(new CustomEvent('avatarChange', {
        detail: { avatar: data.avatar || avatarPreview }
      }));
      
      alert("Personal information updated successfully!");
    } catch (error) {
      console.error('Error updating profile:', error);
      alert("Failed to update personal information. Please try again.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
      <form onSubmit={handlePersonalInfoSubmit}>
        <div className="space-y-6">
          {/* Avatar Upload Section */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative group">
              <Image
                src={avatarPreview || "/icons/default-avatar.png"}
                alt="Profile Picture"
                width={100}
                height={100}
                className="rounded-full object-cover border-2 border-gray-200"
              />
              <div
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                onClick={handleAvatarClick}
              >
                <Camera className="w-6 h-6 text-white" />
              </div>
              
              {/* Show remove button if there's a custom avatar */}
              {avatarPreview !== "/icons/default-avatar.png" && (
                <button
                  type="button"
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  onClick={removeAvatar}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              accept="image/*"
              className="hidden"
            />
            
            <p className="text-sm text-gray-500 mt-2">Click on the image to change your avatar</p>
          </div>

          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input 
              id="fullName" 
              value={userInfo.name}
              onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input 
              id="email" 
              type="email"
              value={userInfo.email}
              onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input 
              id="phoneNumber" 
              type="tel"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="address">Address</Label>
            <Input 
              id="address" 
              className="mt-1"
            />
          </div>
          
          <div className="flex items-center justify-between pt-4">
            <Button variant="outline" type="button">Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </div>
      </form>
    </div>
  );
};