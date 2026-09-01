import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Code2, 
  Layout, 
  Server, 
  Smartphone, 
  Cloud, 
  Database, 
  Brain, 
  CheckCircle2, 
  Terminal 
} from 'lucide-react';
import { techStackData } from '../data/portfolioData';

const categoryColors = ['#27f5a9', '#a3e635', '#f472b6', '#38bdf8', '#fb923c', '#c084fc', '#f87171'];

export default function TechStack() {
  const [selectedCategory, setSelectedCategory] = useState(techStackData[0].category);

  const iconMap = {
    Code2: <Code2 className="w-4 h-4" />,
    Layout: <Layout className="w-4 h-4" />,
    Server: <Server className="w-4 h-4" />,
    Smartphone: <Smartphone className="w-4 h-4" />,
    Cloud: <Cloud className="w-4 h-4" />,
    Database: <Database className="w-4 h-4" />,
    Brain: <Brain className="w-4 h-4" />
  };

  const activeIndex = techStackData.findIndex(c => c.category === selectedCategory);
  const activeCategoryData = techStackData[activeIndex >= 0 ? activeIndex : 0] || techStackData[0];
  const activeColor = categoryColors[(activeIndex >= 0 ? activeIndex : 0) % categoryColors.length];

  return (
    <section id="stack" className="py-20 relative bg-[#fffdf7]">
      {/* Background stripes texture wrapper */}
      <div className="absolute inset-0 bg-stripes pointer-events-none opacity-40" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="neo-section-label mb-4">
            <Terminal className="w-4 h-4" />
            <span>TECH STACK</span>
          </div>

          <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-[#1a1a1a] tracking-tight mb-4">
            Technologies & Tools
          </h2>

          <p className="text-slate-700 text-sm sm:text-base max-w-2xl font-medium leading-relaxed">
            Mastery of state-of-the-art Systems Engineering technologies, cloud architectures, and Artificial Intelligence inference.
          </p>
        </div>

        {/* Tab Buttons Row */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10 max-w-4xl mx-auto">
          {techStackData.map((cat, idx) => {
            const isActive = selectedCategory === cat.category;
            const tabColor = categoryColors[idx % categoryColors.length];
            return (
              <button
                key={cat.category}
                onClick={() => setSelectedCategory(cat.category)}
                className={`neo-tag cursor-pointer text-xs sm:text-sm font-mono font-bold px-4 py-2 transition-all duration-150 ${
                  isActive
                    ? 'scale-105 shadow-[4px_4px_0px_#1a1a1a] translate-x-[-2px] translate-y-[-2px]'
                    : 'bg-white hover:bg-slate-50 hover:translate-x-[-1px] hover:translate-y-[-1px] shadow-[2px_2px_0px_#1a1a1a]'
                }`}
                style={{
                  backgroundColor: isActive ? tabColor : '#ffffff',
                  color: '#1a1a1a'
                }}
              >
                {iconMap[cat.icon]}
                <span>{cat.category}</span>
              </button>
            );
          })}
        </div>

        {/* Items Grid */}
        <motion.div 
          key={selectedCategory}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto"
        >
          {activeCategoryData.items.map((item, idx) => (
            <div 
              key={idx}
              className="neo-card-sm p-4 flex items-center justify-between gap-3 bg-white"
            >
              {/* Left icon & text */}
              <div className="flex items-center gap-3 min-w-0">
                <div 
                  className="w-10 h-10 border-2 border-[#1a1a1a] flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#1a1a1a]"
                  style={{ backgroundColor: activeColor }}
                >
                  <CheckCircle2 className="w-5 h-5 text-[#1a1a1a]" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-heading font-bold text-sm text-[#1a1a1a] truncate">
                    {item.name}
                  </span>
                  <span className="text-[11px] font-mono font-semibold text-slate-600">
                    {item.level}
                  </span>
                </div>
              </div>

              {/* Right shield badge */}
              <img 
                src={item.logo} 
                alt={item.name} 
                className="h-6 object-contain shrink-0"
              />
            </div>
          ))}
        </motion.div>

        {/* Bottom Summary Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Frontend Excellence */}
          <div 
            className="neo-card p-6 bg-white flex flex-col justify-between"
            style={{ borderTop: '4px solid #38bdf8' }}
          >
            <div>
              <div className="w-12 h-12 border-2 border-[#1a1a1a] bg-[#38bdf8] flex items-center justify-center mb-4 shadow-[3px_3px_0px_#1a1a1a]">
                <Layout className="w-6 h-6 text-[#1a1a1a]" />
              </div>
              <h3 className="font-heading font-extrabold text-lg text-[#1a1a1a] mb-2">Frontend Excellence</h3>
              <p className="text-slate-700 text-xs sm:text-sm leading-relaxed font-normal">
                React 19, Next.js (App Router), Zustand for reactive global state, Tailwind CSS v4 for ultra-fast interfaces.
              </p>
            </div>
          </div>

          {/* Backend Architecture */}
          <div 
            className="neo-card p-6 bg-white flex flex-col justify-between"
            style={{ borderTop: '4px solid #a3e635' }}
          >
            <div>
              <div className="w-12 h-12 border-2 border-[#1a1a1a] bg-[#a3e635] flex items-center justify-center mb-4 shadow-[3px_3px_0px_#1a1a1a]">
                <Server className="w-6 h-6 text-[#1a1a1a]" />
              </div>
              <h3 className="font-heading font-extrabold text-lg text-[#1a1a1a] mb-2">Backend Architecture</h3>
              <p className="text-slate-700 text-xs sm:text-sm leading-relaxed font-normal">
                FastAPI for ultra-low latency asynchronous APIs, Flask and Django for complex logic, Node.js and microservices.
              </p>
            </div>
          </div>

          {/* AI & Edge Computing */}
          <div 
            className="neo-card p-6 bg-white flex flex-col justify-between"
            style={{ borderTop: '4px solid #f472b6' }}
          >
            <div>
              <div className="w-12 h-12 border-2 border-[#1a1a1a] bg-[#f472b6] flex items-center justify-center mb-4 shadow-[3px_3px_0px_#1a1a1a]">
                <Brain className="w-6 h-6 text-[#1a1a1a]" />
              </div>
              <h3 className="font-heading font-extrabold text-lg text-[#1a1a1a] mb-2">AI & Edge Computing</h3>
              <p className="text-slate-700 text-xs sm:text-sm leading-relaxed font-normal">
                Quantized Machine Learning models with TensorFlow Lite and PyTorch for offline inference in Android and Vector DBs.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
