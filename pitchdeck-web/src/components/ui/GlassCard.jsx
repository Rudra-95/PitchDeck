import React from 'react';
import { motion } from 'framer-motion';

export const GlassCard = ({ children, className = '', hoverEffect = false, animate = false, delay = 0, ...props }) => {
  const containerType = hoverEffect
    ? 'bg-white border border-stone-200 transition-all duration-300 hover:border-stone-300 hover:shadow-sm'
    : 'bg-white border border-stone-200';

  const Content = (
    <div className={`rounded-2xl p-6 ${containerType} ${className}`} {...props}>
      {children}
    </div>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {Content}
      </motion.div>
    );
  }

  return Content;
};
