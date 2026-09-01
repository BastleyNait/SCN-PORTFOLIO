import React from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  ClipboardCheck, 
  ShieldCheck, 
  TestTube2, 
  Kanban, 
  Cloud,
  CheckCircle,
  Cpu
} from 'lucide-react';
import { engineeringPrinciples } from '../data/portfolioData';

const colorCycle = ['#27f5a9', '#a3e635', '#f472b6', '#38bdf8', '#fb923c', '#c084fc'];

export default function EngineeringSkills() {
  const iconMap = {
    Building2: <Building2 className="w-6 h-6" />,
    ClipboardCheck: <ClipboardCheck className="w-6 h-6" />,
    ShieldCheck: <ShieldCheck className="w-6 h-6" />,
    TestTube2: <TestTube2 className="w-6 h-6" />,
    Kanban: <Kanban className="w-6 h-6" />,
    CloudCognitive: <Cloud className="w-6 h-6" />
  };

  return (
    <section id="engineering" className="py-20 relative bg-[#fffdf7]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="neo-section-label mb-4">
            <Cpu className="w-4 h-4" />
            <span>ENGINEERING</span>
          </div>

          <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-[#1a1a1a] tracking-tight mb-4">
            Software Engineering
          </h2>

          <p className="text-slate-700 text-sm sm:text-base max-w-2xl font-medium leading-relaxed">
            Beyond writing code, I bring structured engineering knowledge to build robust, secure, and maintainable products.
          </p>
        </div>

        {/* Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {engineeringPrinciples.map((principle, index) => {
            const color = colorCycle[index % colorCycle.length];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="neo-card p-6 bg-white flex flex-col justify-between"
                style={{ borderLeft: `4px solid ${color}` }}
              >
                <div>
                  {/* Top: Icon and Tag */}
                  <div className="flex items-center justify-between mb-5">
                    <div 
                      className="w-12 h-12 border-2 border-[#1a1a1a] flex items-center justify-center shadow-[2px_2px_0px_#1a1a1a]"
                      style={{ backgroundColor: color }}
                    >
                      {iconMap[principle.icon]}
                    </div>
                    <span 
                      className="neo-tag text-[11px] font-mono font-bold uppercase tracking-wider shadow-[2px_2px_0px_#1a1a1a]"
                      style={{ backgroundColor: color }}
                    >
                      {principle.tag}
                    </span>
                  </div>

                  <h3 className="font-heading font-extrabold text-lg text-[#1a1a1a] mb-2">
                    {principle.title}
                  </h3>

                  <p className="text-slate-700 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                    {principle.description}
                  </p>
                </div>

                {/* Bottom: Dashed separator & Production standards badge */}
                <div className="pt-3 border-t-2 border-dashed border-[#1a1a1a] flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-mono font-bold text-xs text-[#1a1a1a]">
                    Production Standards
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
