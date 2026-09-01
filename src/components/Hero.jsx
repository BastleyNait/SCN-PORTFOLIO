import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Terminal, 
  MapPin, 
  GraduationCap, 
  ArrowRight, 
  Mail, 
  Code2, 
  Layers, 
  Cpu, 
  UserCheck, 
  Camera 
} from 'lucide-react';
import { Github, Linkedin, Whatsapp } from './Icons';
import { useAppContext } from '../context/AppContext';

const STAT_COLORS = [
  'bg-[#27f5a9]', // Yellow
  'bg-[#a3e635]', // Lime
  'bg-[#3cb371]', // Pink
  'bg-[#38bdf8]', // Blue
];

export default function Hero() {
  const { t, data } = useAppContext();
  const personalData = data.personalData;
  const [textIndex, setTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const lines = personalData.typingLines;

  useEffect(() => {
    const currentLine = lines[textIndex];
    const typingSpeed = isDeleting ? 30 : 60;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(currentLine.substring(0, displayText.length + 1));
        if (displayText.length === currentLine.length) {
          setTimeout(() => setIsDeleting(true), 2200);
        }
      } else {
        setDisplayText(currentLine.substring(0, displayText.length - 1));
        if (displayText.length === 0) {
          setIsDeleting(false);
          setTextIndex((prev) => (prev + 1) % lines.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, textIndex, lines]);

  return (
    <section id="hero" className="relative pt-28 pb-16 bg-[var(--bg-color)] bg-grid-neo overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Grid: 7 / 5 split on lg */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT COLUMN (lg:col-span-7) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 flex flex-col items-start"
          >
            {/* Status & Location Badges
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="neo-tag bg-[#a3e635] text-[var(--black-color)] shadow-[2px_2px_0px_var(--black-color)]">
                <span className="w-2 h-2 rounded-full bg-[var(--black-color)] animate-pulse" />
                AVAILABLE FOR WORK
              </span>
              <span className="neo-tag bg-[var(--card-color)] text-[var(--black-color)] shadow-[2px_2px_0px_var(--black-color)]">
                <MapPin className="w-3.5 h-3.5 text-[var(--black-color)]" />
                {personalData.location}
              </span>
            </div> */}

            {/* Big Heading with Yellow Marker Highlight */}
            <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.15] mb-5 text-[var(--black-color)]">
              {t.hero.greeting} <br />
              <span className="bg-[#27f5a9] px-2.5 py-0.5 border-[3px] border-[var(--black-color)] shadow-[4px_4px_0px_var(--black-color)] inline-block mt-2">
                {personalData.shortName}
              </span>
            </h1>

            {/* Typing Effect Terminal Box */}
            <div className="bg-[var(--card-color)] border-[3px] border-[var(--black-color)] shadow-[4px_4px_0px_var(--black-color)] px-4 py-3 flex items-center gap-2.5 w-full max-w-lg mb-6">
              <div className="bg-[var(--black-color)] p-1 text-[#27f5a9]">
                <Terminal className="w-4 h-4 shrink-0" />
              </div>
              <span className="font-mono text-xs sm:text-sm text-[var(--black-color)] font-bold tracking-wide break-words truncate">
                {displayText}
              </span>
              <span className="w-2 h-4 bg-[var(--black-color)] inline-block shrink-0 animate-pulse" />
            </div>

            {/* University & Degree Badge */}
            <div className="neo-card-sm p-3.5 flex items-center gap-3 mb-6 max-w-xl w-full">
              <div className="p-2 bg-[#27f5a9] border-2 border-[var(--black-color)] shrink-0">
                <GraduationCap className="w-5 h-5 text-[var(--black-color)]" />
              </div>
              <div className="text-xs sm:text-sm text-[var(--black-color)] leading-tight">
                <span className="font-bold">{personalData.degree}</span>
                <span className="text-[var(--black-color)]/80"> — {personalData.status}</span>
              </div>
            </div>

            {/* Bio Paragraph */}
            <p className="text-[var(--black-color)] text-sm sm:text-base leading-relaxed font-normal mb-8 max-w-xl">
              {personalData.bio}
            </p>

            {/* CTA Buttons & Social Links */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <a
                href="#projects"
                className="neo-btn bg-[#27f5a9] text-[var(--black-color)] hover:bg-[#eab308]"
              >
                <span>{t.hero.exploreBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="./resume_2026.pdf"
                download="resume_2026.pdf"
                className="neo-btn bg-[var(--card-color)] text-[var(--black-color)] hover:bg-[#f3f4f6]"
              >
                <span>{t.hero.downloadCv}</span>
              </a>
              {/* Social Icons with Neo-Brutalist Bordered Style */}
              <div className="flex items-center gap-3 ml-auto sm:ml-2 pt-2 sm:pt-0">
                <a
                  href={personalData.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-[var(--card-color)] border-2 border-[var(--black-color)] shadow-[4px_4px_0px_var(--black-color)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_var(--black-color)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center text-[var(--black-color)]"
                  title="GitHub Profile"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href={personalData.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-[var(--card-color)] border-2 border-[var(--black-color)] shadow-[4px_4px_0px_var(--black-color)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_var(--black-color)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center text-[var(--black-color)]"
                  title="LinkedIn Profile"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href={personalData.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-[var(--card-color)] border-2 border-[var(--black-color)] shadow-[4px_4px_0px_var(--black-color)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_var(--black-color)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center text-[var(--black-color)]"
                  title="WhatsApp"
                  aria-label="WhatsApp"
                >
                  <Whatsapp className="w-5 h-5" />
                </a>
              </div>
            </div>

          </motion.div>

          {/* RIGHT COLUMN: Photo Frame (lg:col-span-5) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-5 flex justify-center relative"
          >
            <div className="relative w-full max-w-[340px] sm:max-w-[380px]">
              
              {/* Floating Neo-Badges around Photo */}
              <motion.div 
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -left-4 z-20 neo-tag bg-[#38bdf8] text-[var(--black-color)] shadow-[3px_3px_0px_var(--black-color)]"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>React + Next.js</span>
              </motion.div>

              <motion.div 
                animate={{ y: [5, -5, 5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/2 -right-5 z-20 neo-tag bg-[#a3e635] text-[var(--black-color)] shadow-[3px_3px_0px_var(--black-color)]"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>FastAPI</span>
              </motion.div>

              <motion.div 
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-4 left-4 z-20 neo-tag bg-[#f472b6] text-[var(--black-color)] shadow-[3px_3px_0px_var(--black-color)]"
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Android & Edge AI</span>
              </motion.div>
              <motion.div 
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 right-4 z-20 neo-tag bg-[#f472b6] text-[var(--black-color)] shadow-[3px_3px_0px_var(--black-color)]"
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Node.js & Django</span>
              </motion.div>

              {/* Neo-card Photo Container */}
              <div className="w-full bg-[var(--card-color)] border-[3px] border-[var(--black-color)] shadow-[8px_8px_0px_#27f5a9] p-4 flex flex-col items-center">
                
                {/* Photo Placeholder / Image Area */}
                <div className="relative w-full h-[280px] sm:h-[320px] bg-[var(--bg-color)] border-2 border-[var(--black-color)] flex flex-col items-center justify-center p-6 text-center overflow-hidden">
                  
                  {/* Visual Placeholder when no image is present */}
                  <div className="w-20 h-20 rounded-full bg-[#27f5a9] border-2 border-[var(--black-color)] flex items-center justify-center mb-3 shadow-[3px_3px_0px_var(--black-color)]">
                    <UserCheck className="w-10 h-10 text-[var(--black-color)]" />
                  </div>

                  <div className="neo-tag bg-[#a3e635] text-[var(--black-color)] mb-2 shadow-[2px_2px_0px_var(--black-color)]">
                    <Camera className="w-3.5 h-3.5" />
                    <span>{t.hero.photoPlaceholder}</span>
                  </div>

                  <p className="text-[var(--black-color)] text-xs font-mono leading-tight max-w-[200px]">
                    {t.hero.placeImage} <span className="bg-[#27f5a9] px-1 font-bold">/public/profile.jpg</span>
                  </p>

                  {/* Real Image Overlay */}
                  <img 
                    src="/profile.jpg" 
                    alt={personalData.name}
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    className="absolute inset-0 w-full h-full object-cover object-center z-10"
                  />
                </div>

                {/* Below the Photo: Name & Tag */}
                <div className="w-full mt-3.5 pt-3 border-t-2 border-dashed border-[var(--black-color)] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#a3e635] border border-[var(--black-color)]" />
                    <span className="font-heading font-extrabold text-xs sm:text-sm text-[var(--black-color)] tracking-tight">
                      {personalData.shortName}
                    </span>
                  </div>
                  <span className="neo-tag bg-[#27f5a9] text-[10px] uppercase shadow-[2px_2px_0px_var(--black-color)]">
                    {t.hero.engineerBadge}
                  </span>
                </div>

              </div>

            </div>
          </motion.div>

        </div>

        {/* BOTTOM STATS BAR: Neo-card with 4 stat columns */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 neo-card p-6 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {personalData.stats.map((stat, index) => {
            const colorBg = STAT_COLORS[index % STAT_COLORS.length];
            return (
              <div key={index} className="flex flex-col items-center text-center p-2">
                <span className={`font-heading font-black text-2xl sm:text-3xl text-[var(--black-color)] px-3 py-0.5 border-2 border-[var(--black-color)] shadow-[3px_3px_0px_var(--black-color)] mb-2 ${colorBg}`}>
                  {stat.value}
                </span>
                <span className="font-mono text-xs text-[var(--black-color)] font-bold tracking-tight">
                  {stat.label}
                </span>
              </div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
