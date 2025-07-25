// src/components/layout/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-text-light py-6 text-center text-sm border-t border-border mt-auto">
      <div className="container mx-auto px-4">
        <p>&copy; {new Date().getFullYear()} VoiceCV Builder. All rights reserved.</p>
        <p className="mt-1">
          Made with ❤️ for accessibility.
        </p>
      </div>
    </footer>
  );
};

export default Footer;