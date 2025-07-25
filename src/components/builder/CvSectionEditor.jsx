// src/components/builder/CvSectionEditor.jsx
import React from 'react';
import VoiceInputField from './VoiceInputField';
import Button from '../ui/Button';
import { TrashIcon } from '@heroicons/react/24/outline';

const CvSectionEditor = ({
  sectionTitle,
  items,
  renderItem, // Function to render individual item fields
  onAddItem,
  onRemoveItem,
  itemType, // e.g., "Education", "Experience"
}) => {
  return (
    <div className="mb-8 p-6 bg-background-card rounded-lg shadow-md border border-border">
      <h3 className="text-xl font-bold text-text mb-4 border-b border-border pb-2">
        {sectionTitle}
      </h3>
      {items.length === 0 && (
        <p className="text-text-light mb-4">No {itemType} entries added yet.</p>
      )}
      {items.map((item, index) => (
        <div key={item.id || index} className="bg-background-DEFAULT p-4 rounded-md mb-4 relative border border-border animate-scale-in">
          <h4 className="font-semibold text-text mb-3">{itemType} Entry {index + 1}</h4>
          {renderItem(item, index)}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemoveItem(index)}
            className="absolute top-2 right-2 text-red-500 hover:bg-red-50 p-1 rounded-full"
            aria-label={`Remove ${itemType} entry ${index + 1}`}
          >
            <TrashIcon className="h-5 w-5" />
          </Button>
        </div>
      ))}
      <Button variant="secondary" onClick={onAddItem} className="w-full mt-4">
        Add {itemType}
      </Button>
    </div>
  );
};

export default CvSectionEditor;