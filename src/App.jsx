import React from 'react';
import BackgroundCanvas from './components/BackgroundCanvas';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Projects from './components/Projects';
import TechStack from './components/TechStack';
import EngineeringSkills from './components/EngineeringSkills';
import GithubStats from './components/GithubStats';
import ContactFooter from './components/ContactFooter';

export default function App() {
  return (
    <div className="relative min-h-screen bg-[#fffdf7] text-[#1a1a1a] font-['Inter',sans-serif] overflow-x-hidden">
      <BackgroundCanvas />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <hr className="neo-divider max-w-6xl mx-auto" />
        <Projects />
        <hr className="neo-divider max-w-6xl mx-auto" />
        <TechStack />
        <hr className="neo-divider max-w-6xl mx-auto" />
        <EngineeringSkills />
        <hr className="neo-divider max-w-6xl mx-auto" />
        <GithubStats />
      </main>
      <ContactFooter />
    </div>
  );
}
