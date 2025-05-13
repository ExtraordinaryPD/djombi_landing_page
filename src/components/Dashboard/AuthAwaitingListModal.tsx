import React, {useState} from 'react';
import { X, LogIn, UserPlus } from 'lucide-react';
import Link from 'next/link';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    signInUrl?: string;
    signUpUrl?: string;
}

export const AuthAwaitingListModal: React.FC<AuthModalProps> = ({
    isOpen,
    onClose,
}) => {
    // Move useState hook before any conditional returns
    const [awaitingListModalOpen, setAwaitingListModalOpen] = useState<boolean>(false);
    
    // Return null after the hook declaration
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
                        <button
                            onClick={() => setAwaitingListModalOpen(true)}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm sm:text-base transition-colors"
                        >
                            Join Awaiting List
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};