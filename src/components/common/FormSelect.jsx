import React from 'react';

export default function FormSelect({ id, label, value, onChange, children, className }) {
    return (
        <div>
            {label && <label htmlFor={id} className="block text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-1">{label}</label>}
            <select id={id} value={value} onChange={onChange} className={`w-full p-3 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-zinc-50 dark:bg-zinc-700/50 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition appearance-none bg-no-repeat bg-right pr-8 ${className}`} style={{backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`}}>
                {children}
            </select>
        </div>
    );
}