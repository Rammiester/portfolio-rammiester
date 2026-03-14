import React from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { Download, ExternalLink, ArrowLeft, Github, Linkedin, Mail } from 'lucide-react';
import { portfolioData } from '../lib/data';
import { useTheme } from '../context/ThemeContext';

export default function RecruiterView({ onBack }) {
  const { profile } = useTheme();
  const data = profile.name ? profile : portfolioData;

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-gray-900 font-sans selection:bg-blue-200">
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
        
        {/* Header / Navigation */}
        <header className="flex justify-between items-center mb-16">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors font-medium"
          >
            <ArrowLeft size={20} />
            Back to Interactive Modes
          </button>
          <a 
            href="/resume.pdf" 
            download
            className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-full font-medium hover:bg-gray-800 transition-colors shadow-md"
          >
            <Download size={18} />
            Download Resume
          </a>
        </header>

        {/* Hero Section */}
        <section className="mb-20">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">{data.name}</h1>
          <h2 className="text-2xl md:text-3xl text-gray-600 font-light mb-8">{data.title}</h2>
          <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mb-10">
            {data.bio}
          </p>
          
          <div className="flex flex-wrap gap-4">
            <a href={`mailto:${data.email}`} className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors">
              <Mail size={20} /> {data.email}
            </a>
            <a href={data.socials?.linkedin || portfolioData.socials.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-gray-600 hover:text-[#0077b5] transition-colors">
              <Linkedin size={20} /> LinkedIn
            </a>
            <a href={data.socials?.github || portfolioData.socials.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors">
              <Github size={20} /> GitHub
            </a>
          </div>
        </section>

        {/* Engineering Highlights & Case Study */}
        <section className="mb-20 grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-xl font-bold uppercase tracking-wider text-gray-400 mb-6 border-b pb-2">Engineering Highlights</h3>
            <ul className="space-y-4">
              {(data.achievements || portfolioData.achievements).map((achievement, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-blue-500 mt-1">▹</span>
                  <span className="text-gray-800 leading-relaxed">{achievement}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold uppercase tracking-wider text-gray-400 mb-6 border-b pb-2">Case Study</h3>
            <h4 className="font-bold text-lg mb-2">{portfolioData.caseStudy.title}</h4>
            <div className="space-y-4 text-sm text-gray-600">
              <p><strong className="text-gray-900">Problem:</strong> {portfolioData.caseStudy.problem}</p>
              <p><strong className="text-gray-900">Before:</strong> {portfolioData.caseStudy.architectureBefore}</p>
              <p><strong className="text-gray-900">After:</strong> {portfolioData.caseStudy.architectureAfter}</p>
              <p className="text-green-700 bg-green-50 p-3 rounded-lg border border-green-100">
                <strong>Result:</strong> {portfolioData.caseStudy.performanceResult}
              </p>
            </div>
          </div>
        </section>

        {/* Experience */}
        <section className="mb-20">
          <h3 className="text-xl font-bold uppercase tracking-wider text-gray-400 mb-8 border-b pb-2">Experience</h3>
          <div className="space-y-12">
            {(data.experience || portfolioData.experience).map((exp, i) => (
              <div key={i} className="relative pl-8 md:pl-0">
                <div className="hidden md:block absolute left-[-2rem] top-1.5 w-3 h-3 bg-blue-500 rounded-full ring-4 ring-blue-50" />
                <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-2">
                  <h4 className="text-xl font-bold text-gray-900">{exp.role} <span className="text-blue-600">@ {exp.company}</span></h4>
                  <span className="text-sm font-medium text-gray-500 font-mono mt-1 md:mt-0">{exp.period}</span>
                </div>
                <p className="text-gray-700 leading-relaxed max-w-3xl">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section className="mb-20">
          <h3 className="text-xl font-bold uppercase tracking-wider text-gray-400 mb-8 border-b pb-2">Selected Projects</h3>
          <div className="grid md:grid-cols-2 gap-8">
            {(data.projects || portfolioData.projects).map((project, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col">
                {project.image && (
                  <div className="w-full h-48 relative mb-6 rounded-xl overflow-hidden bg-gray-100">
                    <Image 
                      src={project.image} 
                      alt={project.title} 
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-xl font-bold text-gray-900">{project.title}</h4>
                  <div className="flex gap-3">
                    {project.link && project.link !== '#' && (
                      <a href={project.link} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-black transition-colors" title="GitHub">
                        <Github size={20} />
                      </a>
                    )}
                    {project.demo && project.demo !== '#' && (
                      <a href={project.demo} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors" title="Live Demo">
                        <ExternalLink size={20} />
                      </a>
                    )}
                  </div>
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed flex-grow">{project.description}</p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.tech.map((t, j) => (
                    <span key={j} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section className="mb-20">
          <h3 className="text-xl font-bold uppercase tracking-wider text-gray-400 mb-8 border-b pb-2">Technical Skills</h3>
          <div className="flex flex-wrap gap-3">
            {(data.skills || portfolioData.skills).map((skill, i) => (
              <span key={i} className="px-4 py-2 bg-white border border-gray-200 text-gray-800 font-medium rounded-lg shadow-sm">
                {skill}
              </span>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
