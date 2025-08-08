import React from 'react';

export default function StatCard({ title, amount, color, icon, borderColor, subtext }) {
    return (
        <div className={`bg-white dark:bg-zinc-800 p-4 sm:p-6 rounded-2xl shadow-md border-t-4 ${borderColor} transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}>
            <div className="flex justify-between items-start">
                <p className="text-zinc-500 dark:text-zinc-400 font-medium text-sm sm:text-base">{title}</p>
                {icon && <div className={color}>{icon}</div>}
            </div>
            <p className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${color} mt-2 truncate`}>Rp{amount.toLocaleString('id-ID')}</p>
            {subtext && <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 truncate">{subtext}</p>}
        </div>
    );
}