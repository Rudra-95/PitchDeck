import React from 'react';
import { motion } from 'framer-motion';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center rounded-xl font-medium transition-[transform,box-shadow,background-color,border-color] duration-300 border focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-50 cursor-pointer';

  const variants = {
    primary:
      'bg-pitch-accent hover:brightness-110 text-white border-orange-700/20 shadow-md transition-all',
    secondary:
      'bg-white hover:bg-stone-50 text-stone-800 border-stone-200/90 hover:border-stone-300 shadow-sm transition-all',
    glass:
      'glass text-stone-800 hover:bg-white/95 hover:border-orange-300/80 transition-all',
    danger:
      'bg-rose-600 hover:brightness-110 text-white border-rose-700/30 shadow-sm transition-all',
    outline:
      'bg-white/90 hover:bg-stone-50 border-stone-300 text-stone-800 hover:border-stone-400 transition-all',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-8 py-3.5 text-lg font-semibold',
    icon: 'p-2',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};
