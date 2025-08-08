import React from 'react';

export default function FormInput({ id, label, className, ...props }) {
    return (
        <div>
            {label && <label htmlFor={id} className="block text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-1">{label}</label>}
            <input id={id} {...props} className={`w-full p-3 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-zinc-50 dark:bg-zinc-700/50 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition ${className}`} />
        </div>
    );
}