import React from 'react';

interface BackButtonProps {
    onClick: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="p-3 rounded-full bg-white/60 backdrop-blur-sm text-gray-700 hover:bg-white/80 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
            aria-label="Go back"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                />
            </svg>
        </button>
    );
};

export default BackButton;
