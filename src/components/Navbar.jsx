import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { Github, Linkedin, Whatsapp } from './Icons';
import { personalData } from '../data/portfolioData';

const navLinks = [
  { name: 'Home', href: '#hero', id: 'hero' },
  { name: 'Projects', href: '#projects', id: 'projects' },
  { name: 'Tech Stack', href: '#stack', id: 'stack' },
  { name: 'Engineering', href: '#engineering', id: 'engineering' },
  { name: 'GitHub Stats', href: '#github', id: 'github' },
  { name: 'Contact', href: '#contact', id: 'contact' },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      // Section observer logic
      const sections = navLinks.map(link => document.getElementById(link.id));
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navLinks[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#fffdf7] border-b-[3px] border-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <a
            href="#hero"
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="w-10 h-10 bg-[#27f5a9] border-[3px] border-[#1a1a1a] shadow-[3px_3px_0px_#1a1a1a] flex items-center justify-center font-mono font-black text-base text-[#1a1a1a] uppercase group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:shadow-[5px_5px_0px_#1a1a1a] transition-all">
              SC
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-black text-base sm:text-lg tracking-tight text-[#1a1a1a] leading-none">
                {personalData.shortName}
              </span>
              <span className="text-[11px] font-mono font-bold text-[#1a1a1a]/75 uppercase tracking-wider mt-1">
                Systems Engineer 
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  className="relative px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider border-2 border-[#1a1a1a] shadow-[2px_2px_0px_#1a1a1a] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#1a1a1a] transition-all bg-white text-[#1a1a1a] overflow-hidden"
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-[#27f5a9]"
                      transition={{ type: "spring", stiffness: 450, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10">{link.name}</span>
                </a>
              );
            })}
          </nav>

          {/* Social Icons & CTA */}
          <div className="hidden md:flex items-center gap-2.5">
            <a
              href={personalData.github}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 flex items-center justify-center bg-white border-2 border-[#1a1a1a] shadow-[2px_2px_0px_#1a1a1a] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#1a1a1a] hover:bg-[#38bdf8] transition-all text-[#1a1a1a]"
              title="GitHub"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href={personalData.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 flex items-center justify-center bg-white border-2 border-[#1a1a1a] shadow-[2px_2px_0px_#1a1a1a] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#1a1a1a] hover:bg-[#38bdf8] transition-all text-[#1a1a1a]"
              title="LinkedIn"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href={personalData.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 flex items-center justify-center bg-white border-2 border-[#1a1a1a] shadow-[2px_2px_0px_#1a1a1a] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#1a1a1a] hover:bg-[#38bdf8] transition-all text-[#1a1a1a]"
              title="WhatsApp"
              aria-label="WhatsApp"
            >
              <Whatsapp className="w-4 h-4" />
            </a>
            <a
              href="#contact"
              className="neo-btn !py-2 !px-4 !text-xs bg-[#27f5a9] text-[#1a1a1a] hover:bg-[#fde047] ml-1"
            >
              <span>CONTACT</span>
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center bg-white border-[3px] border-[#1a1a1a] shadow-[3px_3px_0px_#1a1a1a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all text-[#1a1a1a]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 stroke-[2.5]" />
            ) : (
              <Menu className="w-5 h-5 stroke-[2.5]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden border-t-[3px] border-[#1a1a1a] bg-[#fffdf7] px-4 py-4 space-y-3 overflow-hidden"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.id}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-2.5 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider border-2 border-[#1a1a1a] shadow-[3px_3px_0px_#1a1a1a] transition-all flex items-center justify-between ${
                      isActive
                        ? 'bg-[#27f5a9] text-[#1a1a1a]'
                        : 'bg-white text-[#1a1a1a] hover:bg-[#27f5a9]/20'
                    }`}
                  >
                    <span>{link.name}</span>
                    {isActive && <span className="font-mono text-xs">●</span>}
                  </a>
                );
              })}
            </div>

            <div className="pt-3 border-t-2 border-dashed border-[#1a1a1a] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <a
                  href={personalData.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center bg-white border-2 border-[#1a1a1a] shadow-[2px_2px_0px_#1a1a1a] text-[#1a1a1a]"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href={personalData.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center bg-white border-2 border-[#1a1a1a] shadow-[2px_2px_0px_#1a1a1a] text-[#1a1a1a]"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>

              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="neo-btn !py-2 !px-4 !text-xs bg-[#27f5a9] text-[#1a1a1a]"
              >
                <span>CONTACT</span>
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
