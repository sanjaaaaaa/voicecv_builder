// src/components/layout/Navbar.jsx
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MicrophoneIcon } from '@heroicons/react/24/solid';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline'; // Keep this for the Sign In icon
import Button from '../ui/Button';
import Modal from '../ui/Modal';

const Navbar = () => {
  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(false);
  // Removed showLogoutModal state as logout button is gone

  // Mock login function (as there's no real auth)
  const handleLoginClick = () => {
    console.log("Login functionality is disabled in this non-Firebase version.");
    setShowLoginModal(true); // Show the modal, but it won't actually log in
  };

  const isActive = (pathname) => router.pathname === pathname;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-border py-3 px-4">
      <div className="container mx-auto flex justify-between items-center h-14">
        {/* Left: Logo */}
        <Link
          href="/"
          className="flex items-center space-x-2 text-primary text-2xl font-extrabold mr-auto"
        >
          <MicrophoneIcon className="h-8 w-8 text-primary" />
          <span className="text-gray-800">VoiceCV</span>
        </Link>

        {/* Center: Navigation Links */}
        <div className="flex-grow justify-center hidden md:flex">
          <ul className="flex space-x-8 text-gray-700 text-lg font-medium">
            <li>
              <Link
                href="/"
                className={`hover:text-primary transition-colors duration-200 ${
                  isActive('/') ? 'text-primary' : ''
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard"
                className={`hover:text-primary transition-colors duration-200 ${
                  isActive('/dashboard') ? 'text-primary' : ''
                }`}
              >
                My CVs
              </Link>
            </li>
            <li>
              <Link
                href="/builder"
                className={`hover:text-primary transition-colors duration-200 ${
                  isActive('/builder') ? 'text-primary' : ''
                }`}
              >
                Builder
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className={`hover:text-primary transition-colors duration-200 ${
                  isActive('/about') ? 'text-primary' : ''
                }`}
              >
                About
              </Link>
            </li>
          </ul>
        </div>

        {/* Right: Auth Button (now always a mock Sign In) */}
        <div className="flex items-center space-x-4 ml-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLoginClick} // This will show the mock login modal
            aria-label="Sign In"
            className="text-gray-700 hover:text-primary"
          >
            <ArrowLeftOnRectangleIcon className="h-6 w-6" />
            <span className="ml-2 hidden sm:inline">Sign In</span>
          </Button>
        </div>
      </div>

      {/* Login Modal (now purely informational) */}
      <Modal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} title="Sign In (Mock)" showActions={false}>
        <p className="text-center mb-6 text-text-light">
          Authentication is disabled in this version. This modal is for demonstration.
        </p>
        <Button
          onClick={() => setShowLoginModal(false)}
          className="w-full flex items-center justify-center space-x-2 py-3 bg-primary text-white hover:bg-primary-dark rounded-md shadow-sm"
        >
          Got It
        </Button>
      </Modal>

      {/* Logout Modal is now removed as there's no logout button */}
    </nav>
  );
};

export default Navbar;
