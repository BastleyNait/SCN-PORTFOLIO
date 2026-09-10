import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Flame, ExternalLink } from 'lucide-react';
import { Github } from './Icons';
import { useAppContext } from '../context/AppContext';

export default function GithubStats() {
  const { t, data } = useAppContext();
  const personalData = data.personalData;

  return (
    <section id="github" className="py-20 bg-stripes border-t-[3px] border-b-[3px] border-[var(--black-color)] relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="neo-section-label mb-4">
            <Github className="w-4 h-4" />
            <span>{t.github.label}</span>
          </div>

          <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-[var(--black-color)] tracking-tight mb-4">
            {t.github.title}
          </h2>

          <p className="text-[var(--black-color)] font-mono text-xs sm:text-sm max-w-2xl leading-relaxed">
            {t.github.description}{' '}
            <span className="bg-[#27f5a9] px-1.5 py-0.5 border-2 border-[var(--black-color)] font-bold">
              @{personalData.username}
            </span>.
          </p>
        </div>

        {/* GitHub Cards Container */}
        <div className="flex flex-col items-center gap-8 max-w-4xl mx-auto">
         

          {/* Card 3: Streak Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="neo-card border-t-[4px] border-t-[#a3e635] p-6 w-full flex flex-col items-center justify-center"
          >
            <div className="neo-tag bg-[#a3e635] text-[var(--black-color)] mb-4">
              <Flame className="w-3.5 h-3.5" />
              <span>{t.github.streak}</span>
            </div>
            <img 
              src={`https://github-readme-streak-stats.herokuapp.com/?user=${personalData.username}&theme=default&hide_border=false&border=1A1A1A&background=FFFDF7&ring=27f5a9&fire=F87171&currStreakLabel=1A1A1A`} 
              alt="GitHub Streak"
              className="w-full max-w-[650px] h-auto object-contain"
            />
          </motion.div>

          {/* Action Link to GitHub */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-2"
          >
            <a
              href={personalData.github}
              target="_blank"
              rel="noopener noreferrer"
              className="neo-btn bg-[var(--card-color)] text-[var(--black-color)] hover:bg-[#27f5a9]"
            >
              <span>{t.github.viewProfile}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
