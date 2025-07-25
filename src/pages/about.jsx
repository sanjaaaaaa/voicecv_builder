import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import InputField from '../components/ui/InputField';
import Button from '../components/ui/Button';
import Accordion from '../components/ui/Accordion';
import {
  SparklesIcon,
  LightBulbIcon,
  CodeBracketIcon,
  GlobeAltIcon,
  EnvelopeIcon,
  PhoneIcon as PhoneSolidIcon,
  MicrophoneIcon,
} from '@heroicons/react/24/solid';
import {
  AcademicCapIcon,
} from '@heroicons/react/24/outline';

const AboutPage = () => {
  return (
    <div className="bg-background-DEFAULT text-text py-12 px-4 min-h-[calc(100vh-160px)] relative">
      <Head>
        <title>About Us - VoiceCV Builder</title>
        <meta name="description" content="Learn about VoiceCV Builder's vision, mission, team, and technology." />
      </Head>

      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 visualcv-bg-pattern opacity-50"></div>

      <div className="container mx-auto relative z-10 space-y-16">

        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto mb-16 animate-fade-in">
          <h1 className="text-5xl font-extrabold text-primary leading-tight mb-6">
            Building the Future of Resume Creation
          </h1>
          <p className="text-xl text-text-light max-w-3xl mx-auto">
            At VoiceCV Builder, we believe that creating a professional resume should be intuitive, accessible, and powerful for everyone.
          </p>
        </section>

        {/* Our Vision & Mission */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-background-card p-8 rounded-lg shadow-xl border border-border animate-slide-in-left">
          <div>
            <h2 className="text-3xl font-bold text-text mb-4 flex items-center">
              <LightBulbIcon className="h-8 w-8 text-secondary mr-3" />
              Our Vision
            </h2>
            <p className="text-lg text-text-light leading-relaxed mb-4">
              To empower job seekers globally, especially those facing digital literacy barriers or typing challenges, by offering an innovative, voice-driven platform for professional CV creation. We envision a world where creating your career story is as simple as speaking it.
            </p>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-text mb-4 flex items-center">
              <GlobeAltIcon className="h-8 w-8 text-secondary mr-3" />
              Our Mission
            </h2>
            <p className="text-lg text-text-light leading-relaxed">
              We are committed to building an accessible, multilingual, and AI-enhanced resume generator that streamlines the entire process, from input to PDF export, ensuring every user can present their best self effortlessly.
            </p>
            </div>
        </section>

        {/* Why VoiceCV? (Features Focused) */}
        <section className="text-center animate-fade-in">
          <h2 className="text-4xl font-bold text-text mb-10">Why VoiceCV Builder?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background-card p-6 rounded-lg shadow-md border border-border transform hover:scale-105 transition-transform duration-300">
              <MicrophoneIcon className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-text mb-2">Voice-Driven Efficiency</h3>
              <p className="text-text-light">Fill out your resume fields by simply speaking, significantly reducing typing effort.</p>
            </div>
            <div className="bg-background-card p-6 rounded-lg shadow-md border border-border transform hover:scale-105 transition-transform duration-300">
              <SparklesIcon className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-text mb-2">AI-Powered Suggestions</h3>
              <p className="text-text-light">Get smart suggestions for summaries, skills, and job-tailored content to perfect your CV.</p>
            </div>
            <div className="bg-background-card p-6 rounded-lg shadow-md border border-border transform hover:scale-105 transition-transform duration-300">
              <AcademicCapIcon className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-text mb-2">Accessibility for All</h3>
              <p className="text-text-light">Designed for users preferring local languages, those with disabilities, or limited internet access.</p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-background-card p-8 rounded-lg shadow-xl border border-border animate-fade-in">
          <h2 className="text-3xl font-bold text-text mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <Accordion title="What is VoiceCV Builder?">
              <p>VoiceCV Builder is an innovative online platform that allows you to create professional resumes (CVs) using voice input. You can speak your personal details, experience, education, and skills, and see them instantly populate your CV template.</p>
            </Accordion>
            <Accordion title="What languages does it support?">
              <p>We leverage the Web Speech API to support a wide range of languages, including English (US, India), Hindi, Kannada, Tamil, and more. Our goal is to make resume creation accessible in multiple regional and international languages.</p>
            </Accordion>
            <Accordion title="Can I edit the CV manually after voice input?">
              <p>Absolutely! Voice input is designed to be a quick way to get your content in, but every field is fully editable manually. You can refine, correct, and add details anytime.</p>
            </Accordion>
            <Accordion title="Is it free to use?">
              <p>Yes, VoiceCV Builder offers a robust free tier for creating and downloading your CVs. Advanced features like multiple templates or cloud storage might be part of future premium offerings.</p>
            </Accordion>
            <Accordion title="How do AI suggestions work?">
              <p>Our AI suggestion feature provides smart prompts for sections like your professional summary or experience descriptions. It helps you craft impactful statements quickly. (Currently a mock feature; real AI integration is a future upgrade).</p>
            </Accordion>
          </div>
        </section>

        

      </div>
    </div>
  );
};

export default AboutPage;