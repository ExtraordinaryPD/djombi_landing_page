import React from 'react';
import { X, LogIn, UserPlus } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  signInUrl?: string;
  signUpUrl?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose,
  signInUrl = "https://djombi.tech/auth/login",
  signUpUrl = "https://djombi.tech/auth/signup"
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 relative">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>
        
        {/* Modal content */}
        <div className="flex flex-col items-center text-center pt-2">
          <div className="flex gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-full">
              <LogIn size={32} className="text-blue-600" />
            </div>
            <div className="bg-green-50 p-4 rounded-full">
              <UserPlus size={32} className="text-green-600" />
            </div>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Access All Features</h3>
          
          <p className="text-gray-600 mb-6">
            Sign up now to access all our powerful tools or sign in if you already have an account.
          </p>
          
          <div className="flex gap-3 w-full">
            <a 
              href={signInUrl}
              className="py-2 px-4 border border-blue-600 rounded-lg flex-1 text-blue-600 hover:bg-blue-50 flex items-center justify-center"
            >
              <LogIn size={16} className="mr-2" />
              Sign In
            </a>
            <a 
              href={signUpUrl}
              className="py-2 px-4 bg-blue-600 text-white rounded-lg flex-1 hover:bg-blue-700 flex items-center justify-center"
            >
              <UserPlus size={16} className="mr-2" />
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
