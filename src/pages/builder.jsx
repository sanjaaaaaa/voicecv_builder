// src/pages/builder.jsx
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useCv } from '../context/CvContext';
import VoiceInputField from '../components/builder/VoiceInputField';
import Button from '../components/ui/Button';
import Sidebar from '../components/builder/Sidebar';
import CvSectionEditor from '../components/builder/CvSectionEditor';
import { PlusCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid'; // Removed SparklesIcon
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'; // For download icon

const CVPreview = dynamic(() => import('../components/builder/CVPreview'), { ssr: false });

const BuilderPage = () => {
  const router = useRouter();
  const { cvId } = router.query;
  const {
    cvData,
    currentCvId,
    loadCvById,
    saveCurrentCv,
    isSaving,
    saveError,
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
    updateCvSection,
    resetCvData,
    updateProject, // Ensure updateProject is available
    updateAward,   // Ensure updateAward is available
  } = useCv();
  // const { currentUser, loadingAuth } = useAuth(); // Removed useAuth

  // Removed useVoice hook call as optimization feature is removed
  // const { callBhashiniTranslation, callGeminiForProfessionalCVFormatting } = useVoice();

  const [activeSection, setActiveSection] = useState('personalInfo');
  const [isGeneratingOriginalPdf, setIsGeneratingOriginalPdf] = useState(false); // State for original PDF
  // Removed optimized PDF state
  // Removed optimization state
  // Removed optimized CV data state

  useEffect(() => {
    // Simplified logic for loading/resetting CV as there's no Firebase auth or persistence
    // If a cvId is in the URL, attempt to load it from in-memory. Otherwise, reset for a new CV.
    if (cvId && cvId !== currentCvId) {
      loadCvById(cvId);
    } else if (!cvId && currentCvId) {
      // If navigated away from a loaded CV and back without cvId, keep currentCvId
      // This is a design choice. If you always want a fresh start, uncomment resetCvData()
      // resetCvData();
    } else if (!cvId && !currentCvId) {
      resetCvData();
    }
  }, [cvId, loadCvById, currentCvId, resetCvData]);

  // Removed auth-based redirect, as there's no auth
  // useEffect(() => {
  //   if (!loadingAuth && !currentUser) {
  //     router.push('/');
  //   }
  // }, [currentUser, loadingAuth, router]);


  const handleGeneratePdf = async (targetCvData, setIsGeneratingPdfState) => {
    setIsGeneratingPdfState(true);
    const html2pdfModule = await import('html2pdf.js');
    const html2pdf = html2pdfModule.default; // Access the default export

    try {
      // Create a temporary element to hold the HTML content for html2pdf
      // This approach is more reliable than trying to clone live React DOM elements
      // Access .text property for all text fields
      let htmlContent = `
        <div style="font-family: sans-serif; padding: 20mm; color: #333333;">
          <h1 style="font-size: 24pt; font-weight: bold; margin-bottom: 10pt; color: #3b82f6;">${targetCvData.personalInfo.name || 'Your Name'}</h1>
          <p style="font-size: 10pt; color: #666666; margin-bottom: 20pt;">
            ${targetCvData.personalInfo.email ? `✉️ ${targetCvData.personalInfo.email} ` : ''}
            ${targetCvData.personalInfo.phone ? `📞 ${targetCvData.personalInfo.phone} ` : ''}
            ${targetCvData.personalInfo.linkedin ? `🔗 ${targetCvData.personalInfo.linkedin} ` : ''}
            ${targetCvData.personalInfo.github ? `🐙 ${targetCvData.personalInfo.github}` : ''}
          </p>
          ${targetCvData.summary ? `
            <section style="margin-bottom: 15pt; padding-bottom: 5pt; border-bottom: 1px solid #d1d5db;">
              <h2 style="font-size: 16pt; font-weight: bold; margin-bottom: 5pt; color: #3b82f6;">Summary</h2>
              <p style="font-size: 10pt; line-height: 1.5;">${targetCvData.summary}</p>
            </section>
          ` : ''}
          ${targetCvData.experience.length > 0 ? `
            <section style="margin-bottom: 15pt; padding-bottom: 5pt; border-bottom: 1px solid #d1d5db;">
              <h2 style="font-size: 16pt; font-weight: bold; margin-bottom: 5pt; color: #3b82f6;">Experience</h2>
              ${targetCvData.experience.map(exp => `
                <div style="margin-bottom: 10pt;">
                  <h3 style="font-size: 12pt; font-weight: bold;">${exp.position} at ${exp.company}</h3>
                  <p style="font-size: 10pt; color: #666666;">${exp.startDate} - ${exp.endDate}</p>
                  ${exp.description ? `<ul style="list-style-type: disc; margin-left: 20pt; font-size: 10pt;">${exp.description.split('\n').map(line => `<li>${line.replace(/^(-|\*)\s*/, '')}</li>`).join('')}</ul>` : ''}
                </div>
              `).join('')}
            </section>
          ` : ''}
          ${targetCvData.education.length > 0 ? `
            <section style="margin-bottom: 15pt; padding-bottom: 5pt; border-bottom: 1px solid #d1d5db;">
              <h2 style="font-size: 16pt; font-weight: bold; margin-bottom: 5pt; color: #3b82f6;">Education</h2>
              ${targetCvData.education.map(edu => `
                <div style="margin-bottom: 10pt;">
                  <h3 style="font-size: 12pt; font-weight: bold;">${edu.degree} in ${edu.fieldOfStudy}</h3>
                  <p style="font-size: 10pt; color: #666666;">${edu.university} | ${edu.startDate} - ${edu.endDate}</p>
                  ${edu.description ? `<p style="font-size: 10pt; margin-top: 5pt;">${edu.description}</p>` : ''}
                </div>
              `).join('')}
            </section>
          ` : ''}
          ${targetCvData.skills.length > 0 ? `
            <section style="margin-bottom: 15pt; padding-bottom: 5pt; border-bottom: 1px solid #d1d5db;">
              <h2 style="font-size: 16pt; font-weight: bold; margin-bottom: 5pt; color: #3b82f6;">Skills</h2>
              <p style="font-size: 10pt;">${targetCvData.skills.map(s => s.name).join(', ')}</p>
            </section>
          ` : ''}
          ${targetCvData.projects.length > 0 ? `
            <section style="margin-bottom: 15pt; padding-bottom: 5pt; border-bottom: 1px solid #d1d5db;">
              <h2 style="font-size: 16pt; font-weight: bold; margin-bottom: 5pt; color: #3b82f6;">Projects</h2>
              ${targetCvData.projects.map(proj => `
                <div style="margin-bottom: 10pt;">
                  <h3 style="font-size: 12pt; font-weight: bold;">${proj.title}</h3>
                  ${proj.link ? `<p style="font-size: 10pt; color: #3b82f6;"><a href="${proj.link}" target="_blank">${proj.link}</a></p>` : ''}
                  ${proj.description ? `<ul style="list-style-type: disc; margin-left: 20pt; font-size: 10pt;">${proj.description.split('\n').map(line => `<li>${line.replace(/^(-|\*)\s*/, '')}</li>`).join('')}</ul>` : ''}
                </div>
              `).join('')}
            </section>
          ` : ''}
          ${targetCvData.awards.length > 0 ? `
            <section style="margin-bottom: 15pt; padding-bottom: 5pt; border-bottom: 1px solid #d1d5db;">
              <h2 style="font-size: 16pt; font-weight: bold; margin-bottom: 5pt; color: #3b82f6;">Awards</h2>
              ${targetCvData.awards.map(award => `
                <div style="margin-bottom: 10pt;">
                  <h3 style="font-size: 12pt; font-weight: bold;">${award.title} (${award.year})</h3>
                  ${award.description ? `<p style="font-size: 10pt; margin-top: 5pt;">${award.description}</p>` : ''}
                </div>
              `).join('')}
            </section>
          ` : ''}
        </div>
      `;

      const tempElement = document.createElement('div');
      tempElement.innerHTML = htmlContent;
      document.body.appendChild(tempElement); // Append to body so html2pdf can access it

      setTimeout(async () => {
        await html2pdf().from(tempElement).save(`${targetCvData.personalInfo.name || 'My_CV'}.pdf`); // Simplified filename
        console.log("PDF generation process initiated.");
        setIsGeneratingPdfState(false);
        document.body.removeChild(tempElement); // Clean up the temporary element
      }, 1000);

    } catch (error) {
      console.error("Error generating PDF:", error);
      setIsGeneratingPdfState(false);
      alert("Failed to generate PDF. Please check console for details.");
    }
  };

  // Removed handleOptimizeCv function completely


  const renderEducationItem = (edu, index) => (
    <>
      <VoiceInputField
        label="University/Institution"
        id={`edu-uni-${index}`}
        currentValue={edu.university}
        onUpdate={(val) => updateEducation(index, { university: val })}
        placeholder="University Name"
        inputType="text"
      />
      <VoiceInputField
        label="Degree"
        id={`edu-degree-${index}`}
        currentValue={edu.degree}
        onUpdate={(val) => updateEducation(index, { degree: val })}
        placeholder="Bachelor of Science"
        inputType="text"
      />
      <VoiceInputField
        label="Field of Study"
        id={`edu-field-${index}`}
        currentValue={edu.fieldOfStudy}
        onUpdate={(val) => updateEducation(index, { fieldOfStudy: val })}
        placeholder="Computer Science"
        inputType="text"
      />
      <VoiceInputField
        label="Start Date (e.g., Aug 2020)"
        id={`edu-start-${index}`}
        currentValue={edu.startDate}
        onUpdate={(val) => updateEducation(index, { startDate: val })}
        placeholder="Aug 2020"
        inputType="text"
      />
      <VoiceInputField
        label="End Date (e.g., May 2024 or Present)"
        id={`edu-end-${index}`}
        currentValue={edu.endDate}
        onUpdate={(val) => updateEducation(index, { endDate: val })}
        placeholder="May 2024 or Present"
        inputType="text"
      />
      <VoiceInputField
        label="Description (Optional)"
        id={`edu-desc-${index}`}
        currentValue={edu.description} // Access directly, no .text
        onUpdate={(val) => updateEducation(index, { description: val })} // Pass string
        textarea={true}
        placeholder="Key coursework, honors, or relevant activities."
        inputType="text"
      />
    </>
  );

  const renderExperienceItem = (exp, index) => (
    <>
      <VoiceInputField
        label="Company"
        id={`exp-company-${index}`}
        currentValue={exp.company}
        onUpdate={(val) => updateExperience(index, { company: val })}
        placeholder="Tech Solutions Inc."
        inputType="text"
      />
      <VoiceInputField
        label="Position"
        id={`exp-position-${index}`}
        currentValue={exp.position}
        onUpdate={(val) => updateExperience(index, { position: val })}
        placeholder="Software Engineer"
        inputType="text"
      />
      <VoiceInputField
        label="Start Date (e.g., Jun 2022)"
        id={`exp-start-${index}`}
        currentValue={exp.startDate}
        onUpdate={(val) => updateExperience(index, { startDate: val })}
        placeholder="Jun 2022"
        inputType="text"
      />
      <VoiceInputField
        label="End Date (e.g., Present or Jan 2024)"
        id={`exp-end-${index}`}
        currentValue={exp.endDate}
        onUpdate={(val) => updateExperience(index, { endDate: val })}
        placeholder="Present"
        inputType="text"
      />
      <VoiceInputField
        label="Description (Key achievements, responsibilities)"
        id={`exp-desc-${index}`}
        currentValue={exp.description} // Access directly, no .text
        onUpdate={(val) => updateExperience(index, { description: val })} // Pass string
        textarea={true}
        placeholder="- Developed and maintained..."
        inputType="experience-desc"
        aiPromptContext={`Experience at ${exp.company} as ${exp.position}`}
      />
    </>
  );

  const renderSkillItem = (skill, index) => (
    <VoiceInputField
      label="Skill Name"
      id={`skill-name-${index}`}
      currentValue={skill.name}
      onUpdate={(val) => updateSkill(index, { name: val })}
      placeholder="React.js"
      inputType="text"
    />
  );

  const renderProjectItem = (proj, index) => (
    <>
      <VoiceInputField
        label="Project Title"
        id={`proj-title-${index}`}
        currentValue={proj.title}
        onUpdate={(val) => updateCvSection('projects', cvData.projects.map((p, i) => i === index ? { ...p, title: val } : p))}
        placeholder="My Awesome Project"
        inputType="text"
      />
      <VoiceInputField
        label="Project Link (Optional)"
        id={`proj-link-${index}`}
        currentValue={proj.link}
        onUpdate={(val) => updateCvSection('projects', cvData.projects.map((p, i) => i === index ? { ...p, link: val } : p))}
        placeholder="https://github.com/myproject"
        inputType="github"
      />
      <VoiceInputField
        label="Description"
        id={`proj-desc-${index}`}
        currentValue={proj.description} // Access directly, no .text
        onUpdate={(val) => updateCvSection('projects', cvData.projects.map((p, i) => i === index ? { ...p, description: val } : p))} // Pass string
        textarea={true}
        placeholder="Briefly describe your project, its purpose, and your role."
        inputType="project-desc"
        aiPromptContext={`Project: ${proj.title}`}
      />
    </>
  );

  const renderAwardItem = (award, index) => (
    <>
      <VoiceInputField
        label="Award/Achievement"
        id={`award-title-${index}`}
        currentValue={award.title}
        onUpdate={(val) => updateCvSection('awards', cvData.awards.map((a, i) => i === index ? { ...a, title: val } : a))}
        placeholder="Dean's List"
        inputType="text"
      />
      <VoiceInputField
        label="Year"
        id={`award-year-${index}`}
        currentValue={award.year}
        onUpdate={(val) => updateCvSection('awards', cvData.awards.map((a, i) => i === index ? { ...a, year: val } : a))}
        placeholder="2023"
        inputType="text"
      />
      <VoiceInputField
        label="Description (Optional)"
        id={`award-desc-${index}`}
        currentValue={award.description} // Access directly, no .text
        onUpdate={(val) => updateCvSection('awards', cvData.awards.map((a, i) => i === index ? { ...a, description: val } : a))} // Pass string
        textarea={true}
        placeholder="Briefly describe the award and its significance."
        inputType="text"
      />
    </>
  );

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-background-DEFAULT">
      <Head>
        <title>CV Builder - VoiceCV Builder</title>
      </Head>

      <Sidebar activeSection={activeSection} onSectionClick={setActiveSection} />

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col lg:flex-row p-6 lg:p-8 gap-6 bg-background-DEFAULT">
        {/* Left: CV Editor Sections */}
        <div className="lg:w-1/2 overflow-y-auto custom-scrollbar pr-4"> {/* Added pr-4 for spacing */}
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-primary">Edit Your CV</h1>
              <Button onClick={saveCurrentCv} isLoading={isSaving} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save CV (No Persistence)'}
              </Button>
            </div>

            {saveError && (
              <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 flex items-center border border-red-200">
                <ExclamationCircleIcon className="h-5 w-5 mr-2" />
                {saveError}
              </div>
            )}

            {/* Warning for no persistence */}
            <div className="bg-yellow-100 text-yellow-700 p-3 rounded-md mb-4 flex items-center border border-yellow-200">
              <ExclamationCircleIcon className="h-5 w-5 mr-2" />
              <p className="text-sm">
                **Warning:** Data is NOT saved persistently. If you close or refresh this page, your CV data will be lost.
              </p>
            </div>

            {/* Removed Optimize CV button */}


            {activeSection === 'personalInfo' && (
              <div className="animate-fade-in p-6 bg-background-card rounded-lg shadow-md border border-border">
                <h3 className="text-xl font-bold text-text mb-4 border-b border-border pb-2">Contact Information</h3>
                <VoiceInputField
                  label="Full Name"
                  id="name"
                  currentValue={cvData.personalInfo.name}
                  onUpdate={(val) => updatePersonalInfo({ name: val })}
                  placeholder="John Doe"
                  inputType="text"
                />
                <VoiceInputField
                  label="Email"
                  id="email"
                  currentValue={cvData.personalInfo.email}
                  onUpdate={(val) => updatePersonalInfo({ email: val })}
                  type="email"
                  placeholder="john.doe@gmail.com"
                  inputType="email"
                />
                <VoiceInputField
                  label="Phone"
                  id="phone"
                  currentValue={cvData.personalInfo.phone}
                  onUpdate={(val) => updatePersonalInfo({ phone: val })}
                  type="tel"
                  placeholder="+91-9876543210"
                  inputType="phone"
                />
                <VoiceInputField
                  label="LinkedIn Profile"
                  id="linkedin"
                  currentValue={cvData.personalInfo.linkedin}
                  onUpdate={(val) => updatePersonalInfo({ linkedin: val })}
                  placeholder="https://www.linkedin.com/in/yourprofile"
                  inputType="linkedin"
                />
                <VoiceInputField
                  label="GitHub Profile (Optional)"
                  id="github"
                  currentValue={cvData.personalInfo.github}
                  onUpdate={(val) => updatePersonalInfo({ github: val })}
                  placeholder="https://github.com/yourusername"
                  inputType="github"
                />
              </div>
            )}

            {activeSection === 'summary' && (
              <div className="animate-fade-in p-6 bg-background-card rounded-lg shadow-md border border-border">
                <h3 className="text-xl font-bold text-text mb-4 border-b border-border pb-2">Professional Summary</h3>
                <VoiceInputField
                  label="Summary"
                  id="summary-text"
                  currentValue={cvData.summary} // Access directly, no .text
                  onUpdate={updateSummary} // updateSummary now accepts text only
                  textarea={true}
                  placeholder="A brief, compelling overview of your skills and experience. Use AI suggestion for ideas!"
                  inputType="summary"
                  aiPromptContext={`Current skills: ${cvData.skills.map(s => s.name).join(', ')}. Experience: ${cvData.experience.map(e => e.position).join(', ')}`}
                />
              </div>
            )}

            {activeSection === 'experience' && (
              <CvSectionEditor
                sectionTitle="Experience"
                itemType="Experience"
                items={cvData.experience}
                renderItem={renderExperienceItem}
                onAddItem={() => addExperience({ company: '', position: '', startDate: '', endDate: '', description: '' })} // Initialize description as string
                onRemoveItem={removeExperience}
              />
            )}

            {activeSection === 'education' && (
              <CvSectionEditor
                sectionTitle="Education"
                itemType="Education"
                items={cvData.education}
                renderItem={renderEducationItem}
                onAddItem={() => addEducation({ university: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', description: '' })} // Initialize description as string
                onRemoveItem={removeEducation}
              />
            )}

            {activeSection === 'skills' && (
              <CvSectionEditor
                sectionTitle="Skills"
                itemType="Skill"
                items={cvData.skills}
                renderItem={renderSkillItem}
                onAddItem={() => addSkill({ name: '' })}
                onRemoveItem={removeSkill}
              />
            )}

            {activeSection === 'projects' && (
              <CvSectionEditor
                sectionTitle="Projects"
                itemType="Project"
                items={cvData.projects}
                renderItem={renderProjectItem}
                onAddItem={() => updateCvSection('projects', [...cvData.projects, { title: '', description: '', link: '' }])} // Initialize description as string
                onRemoveItem={(index) => updateCvSection('projects', cvData.projects.filter((_, i) => i !== index))}
              />
            )}

            {activeSection === 'awards' && (
              <CvSectionEditor
                sectionTitle="Awards & Achievements"
                itemType="Award"
                items={cvData.awards}
                renderItem={renderAwardItem}
                onAddItem={() => updateCvSection('awards', [...cvData.awards, { title: '', year: '', description: '' }])} // Initialize description as string
                onRemoveItem={(index) => updateCvSection('awards', cvData.awards.filter((_, i) => i !== index))}
              />
            )}
          </div>
        </div>

        {/* Right: Live CV Preview (Only Original) */}
        <div className="lg:w-1/2 flex flex-col items-center p-4 bg-gray-100 rounded-lg shadow-inner border border-border space-y-6">
          {/* Original CV Preview */}
          <div className="w-full">
            <h2 className="text-2xl font-bold text-primary mb-4 text-center">Live CV Preview</h2>
            <div className="w-full h-[calc(100vh-250px)] overflow-y-auto custom-scrollbar bg-white rounded-lg shadow-md p-4 mb-4">
              <CVPreview cvDataToRender={cvData} /> {/* Pass original cvData */}
            </div>
            <Button onClick={() => handleGeneratePdf(cvData, setIsGeneratingOriginalPdf)} isLoading={isGeneratingOriginalPdf} disabled={isGeneratingOriginalPdf} className="w-full">
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
              {isGeneratingOriginalPdf ? 'Generating PDF...' : 'Download PDF'}
            </Button>
          </div>

          {/* Removed Optimized CV Preview */}
        </div>
      </div>
    </div>
  );
};

export default BuilderPage;