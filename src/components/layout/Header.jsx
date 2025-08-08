import React from 'react';
import { Sun, Moon } from 'lucide-react';

export default function Header({ theme, onToggleTheme }) {
    return (
        <header className="mb-10 relative">
            <div className="text-center">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-zinc-800 to-zinc-600 dark:from-zinc-100 dark:to-zinc-300 pb-2"> Finance Dashboard </h1>
                <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm sm:text-base">Take control of your financial journey.</p>
            </div>
            {/* <button onClick={onToggleTheme} className="absolute top-0 right-0 p-2 rounded-full bg-zinc-200/50 dark:bg-zinc-700/50 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-300/70 dark:hover:bg-zinc-600/70 transition-colors">
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button> */}
        </header>
    );
}