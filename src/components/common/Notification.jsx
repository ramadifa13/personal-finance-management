import React from 'react';

export default function Notification({ show, message, type }) {
  const baseClasses = "fixed bottom-5 right-5 p-4 rounded-lg shadow-xl text-white transition-all duration-300 transform z-50";
  const typeClasses = { success: 'bg-green-500', error: 'bg-red-500' };
  const visibilityClasses = show ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none';
  return <div className={`${baseClasses} ${typeClasses[type] || 'bg-zinc-800'} ${visibilityClasses}`}>{message}</div>;
}