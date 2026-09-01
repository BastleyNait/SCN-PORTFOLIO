import React from 'react';
import { motion } from 'framer-motion';

export default function BackgroundCanvas() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Neobrutalist subtle grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-neo" />

      {/* Decorative Neobrutalist Floating Geometric Shapes */}
      {/* Shape 1: Yellow Circle - Top Left */}
      <motion.div
        className="absolute -top-12 left-[4%] w-60 h-60 rounded-full bg-[#27f5a9] border-[3px] border-[#1a1a1a] opacity-20"
        animate={{ y: [0, -25, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Shape 2: Pink Tilted Square - Top Right */}
      <motion.div
        className="absolute top-[14%] right-[7%] w-48 h-48 bg-[#f472b6] border-[3px] border-[#1a1a1a] opacity-20 rotate-12"
        animate={{ y: [0, 22, 0], rotate: [12, 16, 12] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      {/* Shape 3: Lime Circle - Mid Left */}
      <motion.div
        className="absolute top-[42%] -left-16 w-72 h-72 rounded-full bg-[#a3e635] border-[3px] border-[#1a1a1a] opacity-15"
        animate={{ y: [0, -30, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {/* Shape 4: Cyan Diamond - Mid Right */}
      <motion.div
        className="absolute top-[55%] right-[5%] w-52 h-52 bg-[#38bdf8] border-[3px] border-[#1a1a1a] opacity-20 -rotate-12"
        animate={{ y: [0, 26, 0], rotate: [-12, -8, -12] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      />

      {/* Shape 5: Purple Circle - Bottom Center-Left */}
      <motion.div
        className="absolute bottom-[18%] left-[18%] w-64 h-64 rounded-full bg-[#c084fc] border-[3px] border-[#1a1a1a] opacity-15"
        animate={{ y: [0, -22, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
      />

      {/* Shape 6: Orange Rotated Square - Bottom Right */}
      <motion.div
        className="absolute bottom-[6%] right-[16%] w-44 h-44 bg-[#fb923c] border-[3px] border-[#1a1a1a] opacity-20 rotate-45"
        animate={{ y: [0, 20, 0], rotate: [45, 50, 45] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 2.5 }}
      />
    </div>
  );
}
