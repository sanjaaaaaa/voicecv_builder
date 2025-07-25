// src/components/builder/VoiceInputField.jsx
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useVoice } from '../../context/VoiceContext';
import { MicrophoneIcon, StopIcon, SparklesIcon, ExclamationCircleIcon, XCircleIcon } from '@heroicons/react/24/solid'; // Added XCircleIcon for Clear button
import InputField from '../ui/InputField';
import Button from '../ui/Button';
import { twMerge } from 'tailwind-merge';
import { getAISuggestion } from '../../services/api';

const countryCodes = [
  { code: "+91", name: "India" },
  { code: "+1", name: "USA/Canada" },
  { code: "+44", name: "UK" },
  { code: "+61", name: "Australia" },
  { code: "+49", name: "Germany" },
  { code: "+33", name: "France" },
  { code: "+81", name: "Japan" },
  { code: "+86", name: "China" },
  { code: "+55", name: "Brazil" },
  { code: "+7", name: "Russia" },
];
const validateInput = (value, type) => {
  if (!value) return true;

  switch (type) {
    case 'email':
      // Relaxed email validation for initial input, but still requires @ and .
      return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(value);
    case 'phone':
      // Relaxed phone validation: allows spaces, dashes, parentheses, then cleans up
      return /^\+?[\d\s\-\(\)]{10,20}$/.test(value); // More flexible regex for raw input
    case 'linkedin':
      return /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+(\/|\/?)$/i.test(value);
    case 'github':
      return /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+(\/|\/?)$/i.test(value);
    default:
      return true;
  }
};


const VoiceInputField = ({
  label,
  id,
  currentValue,
  onUpdate,
  error,
  placeholder,
  textarea,
  inputType,
  aiPromptContext,
  ...props
}) => {
  // Destructure functions from useVoice
  const {
    isListening,
    transcript,
    error: voiceError,
    startListening,
    stopListening,
    clearTranscript,
    normalizeTranscript, // Get normalizeTranscript from VoiceContext
  } = useVoice();

  const [isVoiceActiveForThisField, setIsVoiceActiveForThisField] = useState(false);
  // Access the text property if currentValue is an object
  const [localValue, setLocalValue] = useState(currentValue); // Reverted to string
  // Language for ASR input
  const [selectedLanguage, setSelectedLanguage] = useState('en-US'); // New state for language selection
  const [validationError, setValidationError] = useState(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  // Removed isSpeaking state

  // Ref to store the text that was present when recording started
  const initialTextForRecordingRef = useRef("");

  const displayError = validationError || error || (isVoiceActiveForThisField && voiceError ? voiceError : null);

  useEffect(() => {
    // This effect ensures localValue stays in sync with external changes to currentValue (from CvContext)
    // It also re-validates when currentValue changes.
    // IMPORTANT: Only update localValue if currentValue is different from what's currently in localValue,
    // AND if we are not actively recording (to avoid overwriting user's typing/recording progress).
    if (currentValue !== localValue && !isVoiceActiveForThisField && !isListening) {
      setLocalValue(currentValue);
      const isValid = validateInput(currentValue, inputType);
      if (!isValid && currentValue !== '') {
        setValidationError(`Invalid format for ${label}.`);
      } else {
        setValidationError(null);
      }
    }
  }, [currentValue, inputType, label, localValue, isVoiceActiveForThisField, isListening]);


  useEffect(() => {
    // When recording stops and a transcript is available from VoiceContext
    if (isVoiceActiveForThisField && !isListening && transcript) {
      const normalizedTranscript = normalizeTranscript(transcript, inputType);
      // Append the new segment to the initial text that was present when recording started
      const appendedText = (initialTextForRecordingRef.current.trim() + " " + normalizedTranscript.trim()).trim();

      const isValid = validateInput(appendedText, inputType);
      if (isValid) {
        onUpdate(appendedText); // Pass only text now
        setLocalValue(appendedText); // Update local state
        setValidationError(null);
      } else {
        setValidationError(`Invalid format for ${label}. Please correct manually or try voice again.`);
        // Even if invalid, update localValue so user sees what was transcribed
        setLocalValue(appendedText);
      }
      setIsVoiceActiveForThisField(false);
      clearTranscript(); // Clear transcript in VoiceContext for next recording
    }
  }, [isVoiceActiveForThisField, isListening, transcript, onUpdate, clearTranscript, label, inputType, normalizeTranscript]); // Removed selectedLanguage from dependencies

  const handleManualChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue); // Update local state immediately
    const isValid = validateInput(newValue, inputType);
    if (isValid) {
      onUpdate(newValue); // Pass only text now
      setValidationError(null);
    } else {
      setValidationError(`Invalid format for ${label}.`);
      // Do NOT call onUpdate('') here. Let the parent keep its old valid value
      // until the user enters a valid one or corrects the current one.
    }
  };

  const handleMicClick = () => {
    if (isVoiceActiveForThisField && isListening) {
      // If currently recording for this field, stop it
      stopListening();
      setIsVoiceActiveForThisField(false);
    } else {
      // If not recording, start a new recording session
      setIsVoiceActiveForThisField(true);
      setValidationError(null);
      // Store the current value of the input field before starting a new recording
      initialTextForRecordingRef.current = localValue; // No .text access needed
      startListening(selectedLanguage); // Pass selectedLanguage to startListening
    }
  };

  const handleAISuggestion = async () => {
    setIsGeneratingAI(true);
    setValidationError(null);
    try {
      const prompt = `Generate a professional ${inputType} for a resume. ${aiPromptContext ? `Context: ${aiPromptContext}` : ''}. Keep it concise and impactful.`;
      const suggestion = await getAISuggestion(prompt);
      if (suggestion) {
        onUpdate(suggestion); // Pass only text now
        setLocalValue(suggestion);
      } else {
        setValidationError("Could not generate AI suggestion. Please try again.");
      }
    } catch (err) {
      console.error("AI Suggestion error:", err);
      setValidationError("Failed to get AI suggestion. Please check console.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleClearInput = () => {
    onUpdate(''); // Pass only text now
    setLocalValue(''); // Clear local state
    setValidationError(null); // Clear any validation errors
    clearTranscript(); // Clear any lingering transcript in VoiceContext
    stopListening(); // Ensure recording is stopped if active
    setIsVoiceActiveForThisField(false); // Reset voice active state
  };


  const showAISuggestionButton = inputType === 'summary' || inputType === 'experience-desc' || inputType === 'project-desc';

  const statusIcon = isVoiceActiveForThisField && isListening ? (
    <StopIcon className="h-5 w-5 text-red-500 animate-pulse-microphone" />
  ) : (
    <MicrophoneIcon className="h-5 w-5 text-gray-500 hover:text-primary" />
  );

  const isPhoneInput = inputType === 'phone';
  const inputTypeAttr = useMemo(() => {
    if (isPhoneInput) return 'tel';
    if (inputType === 'email') return 'email';
    if (inputType === 'linkedin' || inputType === 'github') return 'url';
    return 'text';
  }, [inputType, isPhoneInput]);


  return (
    <div className="relative mb-4">
      {isPhoneInput && (
        <div className="flex items-center space-x-2 mb-2">
          <label htmlFor={`${id}-country-code`} className="block text-sm font-medium text-text">
            Country Code
          </label>
          <select
            id={`${id}-country-code`}
            value={localValue.split('-')[0] || countryCodes[0].code}
            onChange={(e) => {
              const newCode = e.target.value;
              const numberPart = localValue.includes('-') ? localValue.split('-')[1] : ''; // Get just the number part
              onUpdate(`${newCode}-${numberPart}`); // Pass only text now
            }}
            className="block w-32 px-2 py-1 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background-input border-border text-text text-sm"
          >
            {countryCodes.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name} ({country.code})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Language Selector for Voice Input */}
      <div className="flex items-center space-x-2 mb-2">
        <label htmlFor={`${id}-lang-select`} className="block text-sm font-medium text-text">
          Speak In:
        </label>
        <select
          id={`${id}-lang-select`}
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="block w-48 px-2 py-1 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background-input border-border text-text text-sm"
        >
          {useVoice().supportedLanguages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>


      <div className="flex items-center relative">
        <InputField
          label={label}
          id={id}
          value={isVoiceActiveForThisField && isListening && transcript === '' ? 'Listening...' : localValue}
          onChange={handleManualChange}
          error={displayError}
          placeholder={placeholder}
          textarea={textarea}
          type={inputTypeAttr}
          className={twMerge(
            'pr-24', // Space for buttons
            isVoiceActiveForThisField && isListening && 'border-primary ring-primary ring-2',
          )}
          {...props}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-1">
          {showAISuggestionButton && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleAISuggestion}
              className="p-1 rounded-full text-secondary hover:bg-secondary/10"
              isLoading={isGeneratingAI}
              disabled={isGeneratingAI || isVoiceActiveForThisField}
              aria-label="Get AI Suggestion"
            >
              <SparklesIcon className="h-5 w-5" />
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleMicClick}
            className="p-1 rounded-full text-gray-500 hover:bg-gray-100"
            disabled={isVoiceActiveForThisField && isListening}
            aria-label="Toggle voice input"
          >
            {statusIcon}
          </Button>
          {localValue && ( // Show clear button only if there's content
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClearInput}
              className="p-1 rounded-full text-gray-500 hover:bg-gray-100"
              aria-label="Clear input"
            >
              <XCircleIcon className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
      {displayError && (
        <p className="mt-1 text-sm text-red-500 flex items-center">
          <ExclamationCircleIcon className="h-4 w-4 mr-1" /> {displayError}
        </p>
      )}
    </div>
  );
};

export default VoiceInputField;