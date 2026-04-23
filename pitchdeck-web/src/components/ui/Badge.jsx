import React from 'react';

export const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-stone-100 border-stone-200/90 text-stone-700',
    indigo: 'bg-sky-50 border-sky-200/80 text-sky-900 shadow-sm',
    fuchsia: 'bg-orange-50 border-orange-200/80 text-orange-950 shadow-sm',
    emerald: 'bg-emerald-50 border-emerald-200/80 text-emerald-900',
    amber: 'bg-amber-50 border-amber-200/80 text-amber-950',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold backdrop-blur-sm ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
