
"use client"
import React from 'react';
import Image from 'next/image';
import { Switch } from "@/components/ui/switch";

interface FeatureCardProps {
  title: string;
  isActive: boolean;
  imageUrl: string;
  subtitle?: string;
  link: string;
  onClick: (link: string, isActive: boolean) => void;
}

const LandingPageFeatureCard: React.FC<FeatureCardProps> = ({ 
  title, 
  isActive, 
  imageUrl, 
  link, 
  onClick 
}) => {
  const handleClick = () => {
    onClick(link, isActive);
  };

  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking the toggle
    onClick(link, !isActive); // Toggle the active state
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-sm border border-gray-100 p-4 transition-all duration-200 hover:shadow-md ${
        isActive ? 'cursor-pointer' : 'opacity-75'
      }`}
      onClick={isActive ? handleClick : undefined}
    >
      {/* Top section with toggle */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-500">{isActive ? "ON" : "OFF"}</span>
        <div onClick={handleToggleClick}>
          <Switch checked={isActive} />
        </div>
      </div>

      {/* Center icon */}
      <div className="flex justify-center items-center my-6">
        <div className="relative w-10 h-10">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* Title at bottom */}
      <div className="text-center">
        <h4 className="text-sm font-medium text-gray-800">{title}</h4>
      </div>
    </div>
  );
};

export default LandingPageFeatureCard;