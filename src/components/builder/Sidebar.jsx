// src/components/builder/Sidebar.jsx
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { UserIcon, BriefcaseIcon, AcademicCapIcon, CommandLineIcon, CodeBracketIcon, TrophyIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { twMerge } from 'tailwind-merge';

const sections = [
  { id: 'personalInfo', name: 'Contact', icon: UserIcon },
  { id: 'summary', name: 'Summary', icon: DocumentTextIcon },
  { id: 'experience', name: 'Experience', icon: BriefcaseIcon },
  { id: 'education', name: 'Education', icon: AcademicCapIcon },
  { id: 'skills', name: 'Skills', icon: CommandLineIcon },
  { id: 'projects', name: 'Projects', icon: CodeBracketIcon },
  { id: 'awards', name: 'Awards', icon: TrophyIcon },
];

const Sidebar = ({ activeSection, onSectionClick }) => {
  const router = useRouter();

  return (
    <div className="w-64 bg-white border-r border-border p-4 sticky top-0 h-screen overflow-y-auto hidden lg:block shadow-md">
      <h3 className="text-xl font-semibold text-text mb-4">CV Sections</h3>
      <nav>
        <ul>
          {sections.map((section) => (
            <li key={section.id} className="mb-2">
              <button
                onClick={() => onSectionClick(section.id)}
                className={twMerge(
                  "flex items-center w-full px-3 py-2 rounded-md text-text-light hover:bg-gray-100 hover:text-text transition-colors duration-200",
                  activeSection === section.id && "bg-blue-50 text-primary font-medium"
                )}
              >
                <section.icon className="h-5 w-5 mr-3" />
                {section.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
