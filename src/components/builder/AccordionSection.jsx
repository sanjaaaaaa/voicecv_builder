// src/components/builder/AccordionSection.jsx
import React from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import { twMerge } from 'tailwind-merge';

const AccordionSection = ({ title, id, children, isOpen, toggle }) => {
  return (
    <div className="mb-4 border border-gray-200 dark:border-darkbg-default rounded-lg overflow-hidden transition-all duration-300">
      <button
        onClick={toggle}
        className={twMerge(
          "flex justify-between items-center w-full px-6 py-4 font-semibold text-lg text-left transition-colors duration-300",
          isOpen ? "bg-primary text-white" : "bg-gray-100 text-text dark:bg-darkbg-default dark:text-darktext-light hover:bg-gray-200 dark:hover:bg-darkbg-lighter"
        )}
        aria-expanded={isOpen}
        aria-controls={`accordion-content-${id}`}
      >
        {title}
        {isOpen ? (
          <ChevronUpIcon className="h-6 w-6" />
        ) : (
          <ChevronDownIcon className="h-6 w-6" />
        )}
      </button>
      <div
        id={`accordion-content-${id}`}
        className={twMerge(
          "px-6 py-4 bg-white dark:bg-darkbg-lighter transition-all duration-300 ease-in-out",
          isOpen ? "max-h-screen opacity-100 pt-4 pb-4" : "max-h-0 opacity-0 overflow-hidden pt-0 pb-0"
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default AccordionSection;
