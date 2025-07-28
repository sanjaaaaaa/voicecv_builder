import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCv } from '../context/CvContext';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { PlusCircleIcon, DocumentIcon, TrashIcon, PencilSquareIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';


const DashboardPage = () => {
  // Mock user for non-Firebase version
  const currentUser = { displayName: "Demo User", email: "demo@example.com" };
  const loadingAuth = false;
  const authError = null;
  const userId = "demo-user-id-12345"; // Mock User ID

  const { userCvs, resetCvData, deleteCvById, saveError } = useCv();
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [cvToDeleteId, setCvToDeleteId] = useState(null);
  const [cvToDeleteTitle, setCvToDeleteTitle] = useState('');

  // Removed auth-based redirect, as there's no auth
  // useEffect(() => {
  //   if (!loadingAuth && !currentUser) {
  //     router.push('/');
  //   }
  // }, [currentUser, loadingAuth, router]);

  const handleCreateNewCv = () => {
    resetCvData();
    router.push('/builder');
  };

  const handleDeleteClick = (cvId, cvTitle) => {
    setCvToDeleteId(cvId);
    setCvToDeleteTitle(cvTitle);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (cvToDeleteId) {
      await deleteCvById(cvToDeleteId);
      setShowDeleteModal(false);
      setCvToDeleteId(null);
      setCvToDeleteTitle('');
    }
  };

  if (loadingAuth) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-160px)] text-text">
        <p>Loading user data...</p>
      </div>
    );
  }

  if (authError || !currentUser) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-160px)] text-text">
        <h1 className="text-3xl font-bold text-red-500 mb-4">Access Denied</h1>
        <p className="mb-4 text-text-light">Please sign in to view your CVs.</p>
        <Link href="/" passHref legacyBehavior>
          <Button variant="primary">Go to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 text-text min-h-[calc(100vh-160px)]">
      <Head>
        <title>My CVs - VoiceCV Builder</title>
      </Head>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary">My CVs</h1>
        <Button onClick={handleCreateNewCv} variant="primary">
          <PlusCircleIcon className="h-5 w-5 mr-2" />
          Create New CV
        </Button>
      </div>

      {/* Display current user ID for debugging/info */}
      <div className="bg-blue-100 text-blue-700 p-3 rounded-md mb-4 flex items-center border border-blue-200">
        <p className="font-semibold">Current User ID (Mock): <span className="font-normal break-all">{userId || 'N/A'}</span></p>
      </div>

      {/* Warning for no persistence */}
      <div className="bg-yellow-100 text-yellow-700 p-3 rounded-md mb-4 flex items-center border border-yellow-200">
        <ExclamationCircleIcon className="h-5 w-5 mr-2" />
        <p className="text-sm">
          {`**Warning:** CVs listed here are from the current session only and are NOT saved persistently. If you close or refresh this page, all CV data will be lost.`}
        </p>
      </div>

      {saveError && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 flex items-center border border-red-200">
          <ExclamationCircleIcon className="h-5 w-5 mr-2" />
          {saveError}
        </div>
      )}

      {userCvs.length === 0 ? (
        <div className="bg-background-card p-8 rounded-lg shadow-xl text-center border border-border">
          <DocumentIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-xl text-text-light mb-4">You don&apos;t have any CVs saved yet.</p> {/* Corrected 'don't' */}
          <Button onClick={handleCreateNewCv} variant="secondary">
            Start Your First CV
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userCvs.map((cv) => (
            <div key={cv.id} className="bg-background-card rounded-lg shadow-lg p-6 border border-border flex flex-col justify-between animate-scale-in">
              <div>
                <h2 className="text-xl font-semibold text-text mb-2">{cv.personalInfo?.name || 'Untitled CV'}</h2>
                <p className="text-sm text-text-light mb-4">
                  {/* Removed updatedAt as it's from Firebase Timestamp */}
                  Last updated: N/A (No persistence)
                </p>
                <div className="text-text-light text-sm line-clamp-3 mb-4">
                  {cv.summary || 'No summary provided.'}
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Link href={`/builder?cvId=${cv.id}`} passHref legacyBehavior>
                  <Button variant="outline" size="sm">
                    <PencilSquareIcon className="h-4 w-4 mr-1" /> Edit
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(cv.id, cv.personalInfo?.name || 'Untitled CV')}>
                  <TrashIcon className="h-4 w-4 text-red-500 hover:text-red-700" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Deletion"
        onConfirm={confirmDelete}
        confirmText="Delete"
        cancelText="Cancel"
      >
        {/* Corrected " around cvToDeleteTitle */}
        <p className="text-text">{`Are you sure you want to delete the CV titled "${cvToDeleteTitle}"? This action cannot be undone.`}</p>
      </Modal>
    </div>
  );
};

export default DashboardPage;
