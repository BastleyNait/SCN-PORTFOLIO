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
  Terminal,
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const categoryColors = ['#27f5a9', '#a3e635', '#f472b6', '#38bdf8', '#fb923c', '#c084fc', '#f87171'];

export default function TechStack() {
  const { t, data } = useAppContext();
  const techStackData = data.techStackData;
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
    <section id="stack" className="py-20 relative bg-[var(--bg-color)]">
      {/* Background stripes texture wrapper */}
      <div className="absolute inset-0 bg-stripes pointer-events-none opacity-40" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="neo-section-label mb-4">
            <Terminal className="w-4 h-4" />
            <span>{t.techStack.label}</span>
          </div>

          <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-[var(--black-color)] tracking-tight mb-4">
            {t.techStack.title}
          </h2>

          <p className="text-slate-700 text-sm sm:text-base max-w-2xl font-medium leading-relaxed">
            {t.techStack.description}
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
                    ? 'scale-105 shadow-[4px_4px_0px_var(--black-color)] translate-x-[-2px] translate-y-[-2px]'
                    : 'bg-[var(--card-color)] hover:bg-slate-50 hover:translate-x-[-1px] hover:translate-y-[-1px] shadow-[2px_2px_0px_var(--black-color)]'
                }`}
                style={{
                  backgroundColor: isActive ? tabColor : '#ffffff',
                  color: 'var(--black-color)'
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
              className="neo-card-sm p-4 flex items-center justify-between gap-3 bg-[var(--card-color)]"
            >
              {/* Left icon & text */}
              <div className="flex items-center gap-3 min-w-0">
                <div 
                  className="w-10 h-10 border-2 border-[var(--black-color)] flex items-center justify-center shrink-0 shadow-[2px_2px_0px_var(--black-color)]"
                  style={{ backgroundColor: activeColor }}
                >
                  <CheckCircle2 className="w-5 h-5 text-[var(--black-color)]" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-heading font-bold text-sm text-[var(--black-color)] truncate">
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
            className="neo-card p-6 bg-[var(--card-color)] flex flex-col justify-between"
            style={{ borderTop: '4px solid #38bdf8' }}
          >
            <div>
              <div className="w-12 h-12 border-2 border-[var(--black-color)] bg-[#38bdf8] flex items-center justify-center mb-4 shadow-[3px_3px_0px_var(--black-color)]">
                <Layout className="w-6 h-6 text-[var(--black-color)]" />
              </div>
              <h3 className="font-heading font-extrabold text-lg text-[var(--black-color)] mb-2">{t.techStack.frontendTitle}</h3>
              <p className="text-slate-700 text-xs sm:text-sm leading-relaxed font-normal">
                {t.techStack.frontendDesc}
              </p>
            </div>
          </div>

          {/* Backend Architecture */}
          <div 
            className="neo-card p-6 bg-[var(--card-color)] flex flex-col justify-between"
            style={{ borderTop: '4px solid #a3e635' }}
          >
            <div>
              <div className="w-12 h-12 border-2 border-[var(--black-color)] bg-[#a3e635] flex items-center justify-center mb-4 shadow-[3px_3px_0px_var(--black-color)]">
                <Server className="w-6 h-6 text-[var(--black-color)]" />
              </div>
              <h3 className="font-heading font-extrabold text-lg text-[var(--black-color)] mb-2">{t.techStack.backendTitle}</h3>
              <p className="text-slate-700 text-xs sm:text-sm leading-relaxed font-normal">
                {t.techStack.backendDesc}
              </p>
            </div>
          </div>

          {/* AI & Edge Computing */}
          <div 
            className="neo-card p-6 bg-[var(--card-color)] flex flex-col justify-between"
            style={{ borderTop: '4px solid #f472b6' }}
          >
            <div>
              <div className="w-12 h-12 border-2 border-[var(--black-color)] bg-[#f472b6] flex items-center justify-center mb-4 shadow-[3px_3px_0px_var(--black-color)]">
                <Brain className="w-6 h-6 text-[var(--black-color)]" />
              </div>
              <h3 className="font-heading font-extrabold text-lg text-[var(--black-color)] mb-2">{t.techStack.aiTitle}</h3>
              <p className="text-slate-700 text-xs sm:text-sm leading-relaxed font-normal">
                {t.techStack.aiDesc}
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
