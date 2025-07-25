// src/components/builder/CVPreview.jsx
import React, { useRef, useState, useEffect } from 'react';
import { useCv } from '../../context/CvContext'; // Keep useCv for default behavior if prop is not passed
import dynamic from 'next/dynamic';
import { twMerge } from 'tailwind-merge';

const HTML2PDF = dynamic(() => import('html2pdf.js'), { ssr: false });

const getTemplateStyles = (colorTheme, fontFamily) => {
  let primaryColor = '#3b82f6'; // Default blue
  let secondaryColor = '#10b981'; // Default emerald
  let textColor = '#333333'; // Default text for PDF
  let lightBorder = '#d1d5db'; // Default light border for PDF

  switch (colorTheme) {
    case 'blue':
      primaryColor = '#3b82f6';
      secondaryColor = '#10b981';
      break;
    case 'green':
      primaryColor = '#22c55e';
      secondaryColor = '#f59e0b';
      break;
    case 'purple':
      primaryColor = '#a855f7';
      secondaryColor = '#ec4899';
      break;
    case 'red':
      primaryColor = '#ef4444';
      secondaryColor = '#f97316';
      break;
    default:
      break;
  }

  let fontClass = 'font-sans';
  switch (fontFamily) {
    case 'serif':
      fontClass = 'font-serif';
      break;
    case 'mono':
      fontClass = 'font-mono';
      break;
    default:
      fontClass = 'font-sans';
  }

  return { primaryColor, secondaryColor, textColor, lightBorder, fontClass };
};

// Modified to accept cvDataToRender prop
const CVPreview = ({ cvDataToRender }) => {
  const { cvData: defaultCvData } = useCv(); // Get default from context
  // Use cvDataToRender prop if provided, otherwise use default from context
  const cvData = cvDataToRender || defaultCvData;

  const cvRef = useRef(null);

  const { primaryColor, secondaryColor, textColor, lightBorder, fontClass } = getTemplateStyles(cvData.colorTheme, cvData.fontFamily);

  // Helper to format descriptions (e.g., for bullet points)
  const formatDescription = (descriptionText) => { // Now expects a string
    if (!descriptionText) return null;
    
    const lines = descriptionText.split('\n').filter(line => line.trim() !== '');
    if (lines.length === 0) return null;
    if (lines.length === 1 && !lines[0].startsWith('-') && !lines[0].startsWith('*')) {
      return <p className="text-sm mt-1">{lines[0]}</p>;
    }
    return (
      <ul className="list-disc list-inside text-sm mt-1">
        {lines.map((line, i) => (
          <li key={i}>{line.replace(/^(-|\*)\s*/, '')}</li>
        ))}
      </ul>
    );
  };

  return (
    // The actual CV content for PDF generation
    <div
      id="cv-pdf-content" // Keep ID for PDF generation targeting
      ref={cvRef}
      className={twMerge(
        "flex-grow p-8 bg-white rounded-lg shadow-md overflow-y-auto custom-scrollbar text-gray-800",
        fontClass
      )}
      style={{ minHeight: '297mm', minWidth: '210mm', boxSizing: 'border-box' }}
    >
      {/* CV Content - Dynamic styling for PDF */}
      <style jsx>{`
        #cv-pdf-content h1,
        #cv-pdf-content h2,
        #cv-pdf-content h3,
        #cv-pdf-content h4 {
          color: ${primaryColor} !important;
        }
        #cv-pdf-content p,
        #cv-pdf-content ul,
        #cv-pdf-content li,
        #cv-pdf-content span {
          color: ${textColor} !important;
        }
        #cv-pdf-content a {
          color: ${primaryColor} !important;
        }
        #cv-pdf-content section {
          border-bottom-color: ${lightBorder} !important;
        }
        #cv-pdf-content .skill-tag {
          background-color: ${secondaryColor}1A !important;
          color: ${primaryColor} !important;
        }
      `}</style>

      <h1 className="text-3xl font-bold mb-2">{cvData.personalInfo.name || 'Your Name'}</h1>
      <p className="text-sm text-gray-600 mb-4">
        {cvData.personalInfo.email && `✉️ ${cvData.personalInfo.email} `}
        {cvData.personalInfo.phone && `📞 ${cvData.personalInfo.phone} `}
        {cvData.personalInfo.linkedin && `🔗 ${cvData.personalInfo.linkedin} `}
        {cvData.personalInfo.github && `🐙 ${cvData.personalInfo.github}`}
      </p>

      {cvData.summary && ( // No .text check needed, it's a string
        <section className="mb-6 pb-2 border-b-2">
          <h2 className="text-xl font-semibold pb-1 mb-2">Summary</h2>
          <p className="text-sm leading-relaxed">{cvData.summary}</p>
        </section>
      )}

      {cvData.experience.length > 0 && (
        <section className="mb-6 pb-2 border-b-2">
          <h2 className="text-xl font-semibold pb-1 mb-2">Experience</h2>
          {cvData.experience.map((exp, index) => (
            <div key={index} className="mb-3 last:mb-0">
              <h3 className="font-medium text-md">{exp.position} at {exp.company}</h3>
              <p className="text-sm text-gray-600">{exp.startDate} - {exp.endDate}</p>
              {formatDescription(exp.description)} {/* Pass description string */}
            </div>
          ))}
        </section>
      )}

      {cvData.education.length > 0 && (
        <section className="mb-6 pb-2 border-b-2">
          <h2 className="text-xl font-semibold pb-1 mb-2">Education</h2>
          {cvData.education.map((edu, index) => (
            <div key={index} className="mb-3 last:mb-0">
              <h3 className="font-medium text-md">{edu.degree} in {edu.fieldOfStudy}</h3>
              <p className="text-sm text-gray-600">{edu.university} | {edu.startDate} - {edu.endDate}</p>
              {edu.description && <p className="text-sm mt-1">{edu.description}</p>} {/* Access directly */}
            </div>
          ))}
        </section>
      )}

      {cvData.skills.length > 0 && (
        <section className="mb-6 pb-2 border-b-2">
          <h2 className="text-xl font-semibold pb-1 mb-2">Skills</h2>
          <div className="flex flex-wrap gap-2 text-sm">
            {cvData.skills.map((skill, index) => (
              <span key={index} className="skill-tag px-3 py-1 rounded-full">{skill.name}</span>
            ))}
          </div>
        </section>
      )}

      {cvData.projects.length > 0 && (
        <section className="mb-6 pb-2 border-b-2">
          <h2 className="text-xl font-semibold pb-1 mb-2">Projects</h2>
          {cvData.projects.map((proj, index) => (
            <div key={index} className="mb-3 last:mb-0">
              <h3 className="font-medium text-md">{proj.title}</h3>
              {proj.link && <p className="text-sm text-gray-600"><a href={proj.link} target="_blank" rel="noopener noreferrer">{proj.link}</a></p>}
              {formatDescription(proj.description)} {/* Pass description string */}
            </div>
          ))}
        </section>
      )}

      {cvData.awards.length > 0 && (
        <section className="mb-6 pb-2 border-b-2">
          <h2 className="text-xl font-semibold pb-1 mb-2">Awards</h2>
          {cvData.awards.map((award, index) => (
            <div key={index} className="mb-3 last:mb-0">
              <h3 className="font-medium text-md">{award.title} ({award.year})</h3>
              {formatDescription(award.description)} {/* Pass description string */}
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default CVPreview;