// src/components/layout/Layout.jsx
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background-DEFAULT text-text font-sans relative">
      {/* VisualCV-like subtle background pattern */}
      <div className="absolute inset-0 z-0 visualcv-bg-pattern"></div>
      <Navbar />
      <main className="flex-grow relative z-10"> {/* Ensure content is above background pattern */}
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;