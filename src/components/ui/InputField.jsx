// src/components/ui/InputField.jsx
import React from 'react';
import { twMerge } from 'tailwind-merge';

const InputField = ({ label, id, error, className, textarea, ...props }) => {
  const commonClasses = twMerge(
    'block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder-text-light',
    error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-border focus:border-primary',
    'bg-background-input text-text', // Light theme specific
    className
  );

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-text mb-1">
        {label}
      </label>
      {textarea ? (
        <textarea
          id={id}
          className={twMerge(commonClasses, 'min-h-[80px]')}
          {...props}
        />
      ) : (
        <input
          id={id}
          type={props.type || 'text'}
          className={commonClasses}
          {...props}
        />
      )}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default InputField;