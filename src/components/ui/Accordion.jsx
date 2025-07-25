// src/components/ui/Accordion.jsx
import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import { twMerge } from 'tailwind-merge';

const Accordion = ({ title, children, isOpen: defaultIsOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultIsOpen);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="mb-4 border border-border rounded-lg overflow-hidden bg-background-card shadow-sm">
      <button
        className="flex justify-between items-center w-full px-6 py-4 text-lg font-semibold text-text hover:bg-gray-50 transition-colors duration-200"
        onClick={toggleAccordion}
        aria-expanded={isOpen}
        aria-controls={`accordion-content-${title.replace(/\s/g, '-')}`}
      >
        {title}
        {isOpen ? (
          <ChevronUpIcon className="h-6 w-6 text-primary" />
        ) : (
          <ChevronDownIcon className="h-6 w-6 text-text-light" />
        )}
      </button>
      <div
        id={`accordion-content-${title.replace(/\s/g, '-')}`}
        className={twMerge(
          "px-6 py-0 transition-all duration-300 ease-in-out overflow-hidden text-text-light",
          isOpen ? "max-h-96 opacity-100 pt-2 pb-4" : "max-h-0 opacity-0"
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default Accordion;

