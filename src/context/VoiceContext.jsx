// src/context/VoiceContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const VoiceContext = createContext(undefined);

export const VoiceProvider = ({ children }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null); // Use ref for SpeechRecognition instance
  const mediaStreamRef = useRef(null); // Keep mediaStreamRef for microphone access cleanup

  const supportedLanguages = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'en-IN', name: 'English (India)' },
    { code: 'hi-IN', name: 'Hindi (India)' },
    { code: 'kn-IN', name: 'Kannada (India)' },
    { code: 'ta-IN', name: 'Tamil (India)' },
    { code: 'te-IN', name: 'Telugu (India)' }, // Added Telugu
    { code: 'ml-IN', name: 'Malayalam (India)' }, // Added Malayalam
    { code: 'bn-IN', name: 'Bengali (India)' }, // Added Bengali
    { code: 'mr-IN', name: 'Marathi (India)' }, // Added Marathi
    { code: 'gu-IN', name: 'Gujarati (India)' }, // Added Gujarati
    { code: 'pa-IN', name: 'Punjabi (India)' }, // Added Punjabi
    { code: 'or-IN', name: 'Odia (India)' },   // Added Odia
    { code: 'sa-IN', name: 'Sanskrit (India)' }, // Added Sanskrit
    { code: 'ur-IN', name: 'Urdu (India)' },   // Added Urdu
  ];
// Api keys and endpoints

  const BHASHINI_TRANSLATION_ENDPOINT = "YOUR_BHASHINI_TRANSLATION_ENDPOINT_HERE";
  const BHASHINI_TRANSLATION_SERVICE_ID = "ai4bharat/indictrans-v2-all-gpu--t4";
  const INFERENCE_API_KEY = "cRCOxxyLAUrWJo7-6SI5AazYhCfyeeVONNEKL2_Cviag1DD0jEdW4yYj8QmwsTUq";
  const UDYAT_KEY = "C8uy5wo-wa_2ygMx22_X1j4jN8vYX5N_lp8VjkZd5Dfeg72V76vzRwffwHcizuK4";
  const BHASHINI_ASR_SERVICE_ID = "bhashini/ai4bharat/conformer-multilingual-asr";


  // Function to normalize ASR transcript, especially for numbers and emails
  const normalizeTranscript = useCallback((text, inputType) => {
    if (!text) return '';
    let normalized = text.trim();

    if (inputType === 'phone') {
      normalized = normalized
        .replace(/plus/gi, '+')
        .replace(/dash/gi, '-')
        .replace(/minus/gi, '-')
        .replace(/ /g, '');
      if (/^\d/.test(normalized) && normalized.length >= 10 && !normalized.startsWith('+') && normalized.length <= 15) {
        normalized = '+91' + normalized;
      }
      normalized = normalized.replace(/[^+\d-]/g, '');
    } else if (inputType === 'email') {
      normalized = normalized
        .replace(/\s*at\s*/gi, '@')
        .replace(/\s*dot\s*/gi, '.')
        .replace(/ /g, '');
      if (!normalized.includes('@')) {
      } else if (!normalized.includes('.')) {
        normalized += '.com';
      }
    } else {
      normalized = normalized.replace(/\s+/g, ' ');
    }
    return normalized;
  }, []);

  // Removed Bhashini Translation Logic (callBhashiniTranslation)
  // Removed Bhashini TTS Logic (callBhashiniTTS)

  const stopListening = useCallback(() => {
    console.log('stopListening called');
    if (recognitionRef.current) { // Stop browser's SpeechRecognition
      recognitionRef.current.stop();
      console.log('SpeechRecognition stopped by stopListening.');
    }
    if (mediaStreamRef.current) { // Stop microphone tracks
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      console.log('MediaStream tracks stopped by stopListening.');
    }
    setIsListening(false);
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  // --- Browser Native ASR Logic ---
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setError('Web Speech API is not supported by this browser. Please use Chrome or Edge.');
        return;
      }

      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false; // Listen for a single utterance
      recognitionInstance.interimResults = false; // Only return final results

      recognitionInstance.onstart = () => {
        setIsListening(true);
        setTranscript('');
        setError(null);
      };

      recognitionInstance.onresult = async (event) => { // Made async to await translation
        const currentTranscript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join('');
        setTranscript(currentTranscript); // Update with raw transcript directly (no translation)
      };

      recognitionInstance.onerror = (event) => {
        setIsListening(false);
        setError(`Speech recognition error: ${event.error}`);
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setError('Microphone access denied. Please allow microphone access in your browser settings.');
        } else if (event.error === 'no-speech') {
          setError('No speech detected. Please try again.');
        }
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognitionInstance; // Store instance in ref

      // Request microphone access early to prevent issues (optional, can be moved to startListening)
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => mediaStreamRef.current = stream)
        .catch(err => console.warn("Microphone access not granted on load:", err));

      return () => {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach(track => track.stop());
        }
      };
    }
  }, []); // No dependencies related to Bhashini Translation anymore

  const startListening = useCallback((lang = 'en-US') => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = lang;
      setTranscript('');
      setError(null);
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error("Error starting recognition:", e);
        setError("Failed to start listening. Please check microphone permissions.");
        setIsListening(false);
      }
    } else {
      setError('Speech recognition not available.');
    }
  }, []); // Dependencies: recognitionRef.current (implicitly stable after initial useEffect)


  const value = {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    clearTranscript,
    supportedLanguages,
    normalizeTranscript, // Expose normalizeTranscript for VoiceInputField
    // Removed callBhashiniTranslation and callGeminiForProfessionalCVFormatting
  };

  return (
    <VoiceContext.Provider value={value}>
      {children}
    </VoiceContext.Provider>
  );
};

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (context === undefined) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
};