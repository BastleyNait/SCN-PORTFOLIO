import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Flame, ExternalLink } from 'lucide-react';
import { Github } from './Icons';
import { personalData } from '../data/portfolioData';

export default function GithubStats() {
  return (
    <section id="github" className="py-20 bg-stripes border-t-[3px] border-b-[3px] border-[#1a1a1a] relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="neo-section-label mb-4">
            <Github className="w-4 h-4" />
            <span>OPEN SOURCE</span>
          </div>

          <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-[#1a1a1a] tracking-tight mb-4">
            Estadísticas de GitHub
          </h2>

          <p className="text-[#1a1a1a] font-mono text-xs sm:text-sm max-w-2xl leading-relaxed">
            Actividad constante en desarrollo, repositorios de código abierto y contribuciones continuas en{' '}
            <span className="bg-[#27f5a9] px-1.5 py-0.5 border-2 border-[#1a1a1a] font-bold">
              @{personalData.username}
            </span>.
          </p>
        </div>

        {/* GitHub Cards Container */}
        <div className="flex flex-col items-center gap-8 max-w-4xl mx-auto">
          
          {/* Top Row: Overall Stats & Top Languages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            
            {/* Card 1: Stats Overview */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="neo-card border-t-[4px] border-t-[#38bdf8] p-6 flex flex-col items-center justify-center"
            >
              <div className="neo-tag bg-[#38bdf8] text-[#1a1a1a] mb-4">
                <Activity className="w-3.5 h-3.5" />
                <span>RESUMEN DE ACTIVIDAD</span>
              </div>
              <img 
                src={`https://github-readme-stats.vercel.app/api?username=${personalData.username}&show_icons=true&theme=default&include_all_commits=true&count_private=true&hide_border=false&border_color=1A1A1A&bg_color=FFFDF7&title_color=1A1A1A&icon_color=27f5a9&text_color=1A1A1A`} 
                alt="GitHub Stats"
                className="w-full max-w-[400px] h-auto object-contain"
              />
            </motion.div>

            {/* Card 2: Top Languages */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="neo-card border-t-[4px] border-t-[#fb923c] p-6 flex flex-col items-center justify-center"
            >
              <div className="neo-tag bg-[#fb923c] text-[#1a1a1a] mb-4">
                <Flame className="w-3.5 h-3.5" />
                <span>LENGUAJES MÁS USADOS</span>
              </div>
              <img 
                src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${personalData.username}&layout=compact&theme=default&hide_border=false&border_color=1A1A1A&bg_color=FFFDF7&title_color=1A1A1A&text_color=1A1A1A&langs_count=8`} 
                alt="Top Languages"
                className="w-full max-w-[400px] h-auto object-contain"
              />
            </motion.div>

          </div>

          {/* Card 3: Streak Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="neo-card border-t-[4px] border-t-[#a3e635] p-6 w-full flex flex-col items-center justify-center"
          >
            <div className="neo-tag bg-[#a3e635] text-[#1a1a1a] mb-4">
              <Flame className="w-3.5 h-3.5" />
              <span>RACHA DE CONTRIBUCIONES</span>
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
              className="neo-btn bg-white text-[#1a1a1a] hover:bg-[#27f5a9]"
            >
              <span>VER PERFIL EN GITHUB</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
