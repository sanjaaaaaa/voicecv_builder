// src/components/ui/Modal.jsx
import React, { useEffect, useRef } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import Button from './Button';
import { motion, AnimatePresence } from 'framer-motion';

const Modal = ({ isOpen, onClose, title, children, showActions = true, onConfirm, confirmText = "Confirm", cancelText = "Cancel" }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm p-4"
          onClick={onClose} // Close on backdrop click
        >
          <motion.div
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 50 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-background-card rounded-lg shadow-2xl w-full max-w-md p-6 relative" // Light theme adjustment
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            ref={modalRef}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-text-light hover:text-text" // Light theme adjustment
              aria-label="Close modal"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            {title && <h2 className="text-2xl font-bold text-text mb-4 border-b border-border pb-2">{title}</h2>} {/* Light theme adjustment */}

            <div className="text-text-light mb-6"> {/* Light theme adjustment */}
              {children}
            </div>

            {showActions && (
              <div className="flex justify-end space-x-3 mt-4">
                <Button variant="ghost" onClick={onClose}>
                  {cancelText}
                </Button>
                <Button variant="primary" onClick={onConfirm}>
                  {confirmText}
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;