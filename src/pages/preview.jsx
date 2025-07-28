// src/pages/preview.jsx
import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Button from '../components/ui/Button';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

const CVPreview = dynamic(() => import('../components/builder/CVPreview'), { ssr: false });

const PreviewPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 bg-background-DEFAULT">
      <Head>
        <title>CV Preview - VoiceCV Builder</title>
      </Head>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Your CV Preview</h1>
        <Link href="/builder" passHref legacyBehavior>
          <Button variant="outline">
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Editor
          </Button>
        </Link>
      </div>

      <CVPreview />
    </div>
  );
};

export default PreviewPage;
