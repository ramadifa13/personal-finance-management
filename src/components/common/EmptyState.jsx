import React from 'react';

export default function EmptyState({ icon, title, message }) {
    return (
        <div className="text-center py-12 sm:py-16 px-6 bg-zinc-100/50 dark:bg-zinc-800/50 rounded-2xl">
            <div className="mx-auto text-sky-500 mb-4">{icon}</div>
            <h3 className="text-lg sm:text-xl font-bold text-zinc-700 dark:text-zinc-200">{title}</h3>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm sm:text-base">{message}</p>
        </div>
    );
}