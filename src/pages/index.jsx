import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Button from '../components/ui/Button';
import { SparklesIcon, CursorArrowRaysIcon, DocumentTextIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

const HomePage = () => {
  // Mock currentUser for non-Firebase version
  const currentUser = true; // Always "logged in" for simplicity without Firebase
  const startBuildingLink = currentUser ? "/dashboard" : "/builder"; // Redirect to dashboard if "logged in"

  return (
    <div className="relative overflow-hidden min-h-screen flex flex-col justify-center items-center py-12 px-4 text-text bg-background-DEFAULT">
      <Head>
        <title>VoiceCV Builder - Voice-Driven Resume Generator</title>
        <meta name="description" content="Simplify CV creation with voice input, AI, and instant PDF export." />
      </Head>

      {/* VisualCV-like subtle background pattern */}
      <div className="absolute inset-0 z-0 visualcv-bg-pattern"></div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-extrabold text-primary leading-tight mb-6 animate-fade-in">
          Your Voice. Your CV. Instantly.
        </h1>
        <p className="text-xl md:text-2xl text-text-light mb-10 animate-fade-in animation-delay-500">
          Effortlessly build professional resumes using multilingual voice input and real-time editing.
        </p>

        <Link href={startBuildingLink} passHref legacyBehavior>
          <Button size="lg" className="mr-4 animate-fade-in animation-delay-1000">
            {currentUser ? "Go to My CVs" : "Start Building My CV"}
          </Button>
        </Link>
        <Link href="/about" passHref legacyBehavior>
          <Button variant="outline" size="lg" className="animate-fade-in animation-delay-1200">Learn More</Button>
        </Link>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<SparklesIcon className="h-10 w-10 text-primary mb-4" />}
            title="Voice Input"
            description="Speak your resume details in multiple languages."
          />
          <FeatureCard
            icon={<CursorArrowRaysIcon className="h-10 w-10 text-primary mb-4" />}
            title="Real-time Editor"
            description="See your CV update instantly as you add content."
          />
          <FeatureCard
            icon={<DocumentTextIcon className="h-10 w-10 text-primary mb-4" />}
            title="PDF Export"
            description="Download your professional CV as a clean PDF."
          />
          <FeatureCard
            icon={<GlobeAltIcon className="h-10 w-10 text-primary mb-4" />}
            title="Multilingual"
            description="Support for Indian & International languages."
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-background-card rounded-lg shadow-xl p-6 flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300 border border-border">
    {icon}
    <h3 className="text-xl font-semibold text-text mb-2">{title}</h3>
    <p className="text-text-light">{description}</p>
  </div>
);

export default HomePage;