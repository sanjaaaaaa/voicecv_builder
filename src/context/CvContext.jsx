// src/context/CvContext.jsx
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useAuth } from './AuthContext'; // Import AuthContext

// Initial structure for a new CV
const initialCvData = {
  personalInfo: { name: '', email: '', phone: '', linkedin: '', github: '' },
  summary: '', // Reverted to simple string
  education: [],
  experience: [],
  skills: [], // Skills remain array of {name: ''}
  projects: [],
  awards: [],
  template: 'modern', // Default template for styling
  colorTheme: 'blue', // Default color theme for CV preview
  fontFamily: 'sans', // Default font family for CV preview
};

const CvContext = createContext(undefined);

export const CvProvider = ({ children }) => {
  // Mock userId and loadingAuth as Firebase is removed
  const { currentUser, userId, loadingAuth } = useAuth();
  const [cvData, setCvData] = useState(initialCvData); // Current CV data being edited
  const [currentCvId, setCurrentCvId] = useState(null); // ID of the currently loaded/saved CV
  const [isSaving, setIsSaving] = useState(false); // State for saving process
  const [saveError, setSaveError] = useState(null); // Any error during save/load/delete
  const [userCvs, setUserCvs] = useState([]); // Array of all CVs for the current user (in-memory)

  // In-memory "database" for CVs
  // This will NOT persist across page refreshes or browser closes.
  const [inMemoryCvs, setInMemoryCvs] = useState([]);

  // --- Utility functions for updating specific sections of cvData ---
  const updateCvSection = useCallback((section, data) => {
    setCvData((prev) => ({ ...prev, [section]: data }));
  }, []);

  const updatePersonalInfo = useCallback((info) => {
    updateCvSection('personalInfo', { ...cvData.personalInfo, ...info });
  }, [cvData.personalInfo, updateCvSection]);

  // Now accepts just text
  const updateSummary = useCallback((text) => {
    updateCvSection('summary', text);
  }, [updateCvSection]);

  // Description is a simple string
  const addEducation = useCallback((edu) => {
    updateCvSection('education', [...cvData.education, { ...edu, description: edu.description || '' }]);
  }, [cvData.education, updateCvSection]);

  // Description is a simple string
  const updateEducation = useCallback((index, edu) => {
    const newEducation = [...cvData.education];
    newEducation[index] = { 
      ...newEducation[index], 
      ...edu,
      description: edu.description || newEducation[index].description // Ensure it's a string
    };
    updateCvSection('education', newEducation);
  }, [cvData.education, updateCvSection]);

  const removeEducation = useCallback((index) => {
    updateCvSection('education', cvData.education.filter((_, i) => i !== index));
  }, [cvData.education, updateCvSection]);

  // Description is a simple string
  const addExperience = useCallback((exp) => {
    updateCvSection('experience', [...cvData.experience, { ...exp, description: exp.description || '' }]);
  }, [cvData.experience, updateCvSection]);

  // Description is a simple string
  const updateExperience = useCallback((index, exp) => {
    const newExperience = [...cvData.experience];
    newExperience[index] = { 
      ...newExperience[index], 
      ...exp,
      description: exp.description || newExperience[index].description // Ensure it's a string
    };
    updateCvSection('experience', newExperience);
  }, [cvData.experience, updateCvSection]);

  const removeExperience = useCallback((index) => {
    updateCvSection('experience', cvData.experience.filter((_, i) => i !== index));
  }, [cvData.experience, updateCvSection]);

  const addSkill = useCallback((skill) => {
    updateCvSection('skills', [...cvData.skills, skill]);
  }, [cvData.skills, updateCvSection]);

  const updateSkill = useCallback((index, skill) => {
    const newSkills = [...cvData.skills];
    newSkills[index] = { ...newSkills[index], ...skill };
    updateCvSection('skills', newSkills);
  }, [cvData.skills, updateCvSection]);

  const removeSkill = useCallback((index) => {
    updateCvSection('skills', cvData.skills.filter((_, i) => i !== index));
  }, [cvData.skills, updateCvSection]);

  // Description is a simple string
  const updateProject = useCallback((index, project) => {
    const newProjects = [...cvData.projects];
    newProjects[index] = {
      ...newProjects[index],
      ...project,
      description: project.description || newProjects[index].description // Ensure it's a string
    };
    updateCvSection('projects', newProjects);
  }, [cvData.projects, updateCvSection]);

  // Description is a simple string
  const updateAward = useCallback((index, award) => {
    const newAwards = [...cvData.awards];
    newAwards[index] = {
      ...newAwards[index],
      ...award,
      description: award.description || newAwards[index].description // Ensure it's a string
    };
    updateCvSection('awards', newAwards);
  }, [cvData.awards, updateCvSection]);


  // Update template and color theme settings for CV preview
  const updateTemplateSettings = useCallback((settings) => {
    setCvData(prev => ({ ...prev, ...settings }));
  }, []);

  // --- Core CV Management Functions (In-Memory) ---

  // Resets the current CV data to initial state (for creating a new CV)
  const resetCvData = useCallback(() => {
    setCvData(initialCvData);
    setCurrentCvId(null);
    setSaveError(null);
  }, []);

  // Loads a specific CV by its ID from in-memory storage
  const loadCvById = useCallback(async (cvIdToLoad) => {
    setSaveError(null);
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 300));
    const loadedData = inMemoryCvs.find(cv => cv.id === cvIdToLoad);
    if (loadedData) {
      setCvData(loadedData);
      setCurrentCvId(cvIdToLoad);
      console.log("CV loaded from memory:", loadedData);
    } else {
      setSaveError("CV not found in current session.");
      setCvData(initialCvData);
      setCurrentCvId(null);
      console.warn("CV not found in memory for ID:", cvIdToLoad);
    }
  }, [inMemoryCvs]);

  // Saves the current CV data to in-memory storage (creates new or updates existing)
  const saveCurrentCv = useCallback(async () => {
    setIsSaving(true);
    setSaveError(null);
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 500));
    try {
      let idToSave = currentCvId;
      if (!idToSave) {
        idToSave = `cv-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`; // Generate a unique ID
      }

      const updatedCv = {
        ...cvData,
        id: idToSave,
        userId: userId, // Attach mock userId
        updatedAt: new Date(), // Mock timestamp
        createdAt: cvData.createdAt || new Date(), // Mock timestamp
      };

      setInMemoryCvs(prevCvs => {
        const existingIndex = prevCvs.findIndex(cv => cv.id === idToSave);
        if (existingIndex > -1) {
          // Update existing
          const newCvs = [...prevCvs];
          newCvs[existingIndex] = updatedCv;
          return newCvs;
        } else {
          // Add new
          return [...prevCvs, updatedCv];
        }
      });
      setCurrentCvId(idToSave);
      console.log("CV saved to memory:", updatedCv);
      console.log("CV saved successfully! (Not persistent)");
    } catch (error) {
      console.error("Error saving CV to memory:", error);
      setSaveError("Failed to save CV to memory.");
    } finally {
      setIsSaving(false);
    }
  }, [cvData, currentCvId, userId]);

  // Deletes a CV by its ID from in-memory storage
  const deleteCvById = useCallback(async (cvIdToDelete) => {
    setSaveError(null);
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 300));
    try {
      setInMemoryCvs(prevCvs => prevCvs.filter(cv => cv.id !== cvIdToDelete));
      console.log("CV deleted from memory:", cvIdToDelete);
      console.log("CV deleted successfully! (Not persistent)");
      if (currentCvId === cvIdToDelete) {
        resetCvData(); // If the deleted CV was the one currently being edited, reset the builder
      }
    } catch (error) {
      console.error("Error deleting CV from memory:", error);
      setSaveError("Failed to delete CV from memory.");
    }
  }, [currentCvId, resetCvData]);

  // Simulate real-time listener for user's CVs (just update from inMemoryCvs)
  useEffect(() => {
    // This effect runs whenever inMemoryCvs changes
    setUserCvs(inMemoryCvs);
  }, [inMemoryCvs]);


  // --- Value provided by the context ---
  const value = {
    cvData,
    currentCvId,
    userCvs, // Now sourced from inMemoryCvs
    isSaving,
    saveError,
    loadCvById,
    saveCurrentCv,
    deleteCvById,
    updatePersonalInfo,
    updateSummary,
    addEducation,
    updateEducation,
    removeEducation,
    addExperience,
    updateExperience,
    removeExperience,
    addSkill,
    updateSkill,
    removeSkill,
    updateTemplateSettings,
    resetCvData,
    updateCvSection,
    updateProject, // Expose updateProject
    updateAward,   // Expose updateAward
  };

  return <CvContext.Provider value={value}>{children}</CvContext.Provider>;
};

export const useCv = () => {
  const context = useContext(CvContext);
  if (context === undefined) {
    throw new Error('useCv must be used within a CvProvider');
  }
  return context;
};