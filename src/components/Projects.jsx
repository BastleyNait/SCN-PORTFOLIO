import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Sparkles, Eye } from 'lucide-react';
import { Github } from './Icons';
import { projectsData } from '../data/portfolioData';

const techTagColors = [
  'bg-[#27f5a9]', // Yellow
  'bg-[#a3e635]', // Lime
  'bg-[#38bdf8]', // Blue
  'bg-[#f472b6]', // Pink
  'bg-[#fb923c]', // Orange
  'bg-[#c084fc]', // Purple
];

const getStatusBadgeStyle = (status) => {
  const s = (status || '').toLowerCase();
  if (s.includes('prod')) {
    return 'bg-[#a3e635] text-[#1a1a1a]';
  }
  if (s.includes('mobile') || s.includes('ai')) {
    return 'bg-[#f472b6] text-[#1a1a1a]';
  }
  return 'bg-[#38bdf8] text-[#1a1a1a]';
};

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState('Todos');

  const categories = ['All', 'Systems Engineer / Web', 'E-Commerce & POS', 'AI & Edge ML'];

  const filteredProjects = activeCategory === 'All'
    ? projectsData
    : projectsData.filter(p => p.category === activeCategory);

  return (
    <section id="projects" className="py-20 relative z-10 bg-[#fffdf7]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-14">
          <div className="inline-flex items-center gap-2 neo-section-label mb-4">
            <Sparkles className="w-4 h-4 text-[#1a1a1a]" />
            <span>PORTFOLIO</span>
          </div>

          <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-4 text-[#1a1a1a]">
            Featured Projects
          </h2>

          <p className="text-[#1a1a1a]/80 font-medium text-sm sm:text-base max-w-2xl leading-relaxed">
            Explore production web platforms and mobile apps with artificial intelligence integrated in the cloud. Click any tile to navigate directly to the live demo.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            {categories.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 text-xs sm:text-sm font-heading font-bold uppercase tracking-wider transition-all duration-150 rounded-sm cursor-pointer ${
                    isActive
                      ? 'bg-[#27f5a9] text-[#1a1a1a] border-[3px] border-[#1a1a1a] shadow-[4px_4px_0px_#1a1a1a] translate-x-[-1px] translate-y-[-1px]'
                      : 'bg-white text-[#1a1a1a] border-2 border-[#1a1a1a] shadow-[2px_2px_0px_#1a1a1a] hover:bg-[#27f5a9]/20 hover:shadow-[3px_3px_0px_#1a1a1a] hover:translate-x-[-1px] hover:translate-y-[-1px]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Projects Grid Tiles */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="neo-card rounded-none flex flex-col justify-between overflow-hidden group bg-white"
              >
                
                {/* Tile Top: Browser Bar & Preview Image */}
                <div className="relative w-full border-b-[3px] border-[#1a1a1a]">
                  
                  {/* Fake Browser Bar */}
                  <div className="h-8 bg-[#fffdf7] border-b-2 border-[#1a1a1a] px-3 flex items-center justify-between">
                    {/* 3 Browser Dots with thick borders */}
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#f87171] border-2 border-[#1a1a1a] inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#27f5a9] border-2 border-[#1a1a1a] inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#a3e635] border-2 border-[#1a1a1a] inline-block" />
                    </div>

                    {/* URL text in Mono */}
                    <span className="font-mono text-[10px] text-[#1a1a1a] font-semibold truncate max-w-[170px] bg-white px-2 py-0.5 border border-[#1a1a1a] rounded-none">
                      {project.liveUrl ? project.liveUrl.replace(/^https?:\/\//, '') : `${project.id}.app`}
                    </span>

                    <div className="w-4" />
                  </div>

                  {/* Image Container with Hover Overlay */}
                  <div className="relative w-full h-48 bg-[#fffdf7] overflow-hidden">
                    <img 
                      src={project.previewFallbackImage} 
                      alt={project.title}
                      className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Status Tag (Top-Left) */}
                    <div className="absolute bottom-3 right-3 z-10">
                      <span className={`neo-tag rounded-none shadow-[2px_2px_0px_#1a1a1a] text-[10px] font-mono font-bold uppercase tracking-wider ${getStatusBadgeStyle(project.status)}`}>
                        {project.status}
                      </span>
                    </div>

                    {/* Hover Overlay with ABRIR PÁGINA Button */}
                    <div className="absolute inset-0 bg-[#1a1a1a]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center z-20">
                      <a
                        href={project.liveUrl || project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="neo-btn bg-[#27f5a9] text-[#1a1a1a] text-xs py-2 px-4 shadow-[4px_4px_0px_#1a1a1a] hover:bg-[#fde047]"
                        title={`Visit ${project.title}`}
                      >
                        <Eye className="w-4 h-4" />
                        <span>VIEW PROJECT</span>
                      </a>
                    </div>
                  </div>

                </div>

                {/* Tile Content Area */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Header: Title and Category */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-heading font-black text-xl text-[#1a1a1a] leading-tight">
                        {project.title}
                      </h3>
                      <span className="neo-tag bg-white text-[#1a1a1a] text-[10px] font-mono font-semibold shrink-0">
                        {project.category}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-[#1a1a1a]/85 text-xs sm:text-sm font-medium leading-relaxed mb-4">
                      {project.description}
                    </p>
                  </div>

                  {/* Bottom section: Tech Stack, Divider, Action Buttons */}
                  <div>
                    {/* Tech Stack Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.tech.map((t, idx) => (
                        <span 
                          key={idx}
                          className={`neo-tag rounded-none text-[10px] font-mono font-bold text-[#1a1a1a] shadow-[2px_2px_0px_#1a1a1a] ${
                            techTagColors[idx % techTagColors.length]
                          }`}
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Dashed Separator */}
                    <div className="border-t-2 border-dashed border-[#1a1a1a] my-3" />

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-1">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="neo-btn flex-1 bg-[#27f5a9] text-[#1a1a1a] text-xs py-2 px-3 border-2 border-[#1a1a1a] shadow-[3px_3px_0px_#1a1a1a] hover:bg-[#fde047]"
                        >
                          <span>LIVE DEMO</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}

                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`neo-btn bg-white text-[#1a1a1a] text-xs py-2 px-3 border-2 border-[#1a1a1a] shadow-[3px_3px_0px_#1a1a1a] hover:bg-[#27f5a9]/20 ${
                          !project.liveUrl ? 'flex-1' : ''
                        }`}
                        title="View Code on GitHub"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>REPO</span>
                      </a>
                    </div>
                  </div>

                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}
