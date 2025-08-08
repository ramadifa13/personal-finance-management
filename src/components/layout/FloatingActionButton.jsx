import React, { useState } from 'react';
import { Plus, Target, FileText } from 'lucide-react';

export default function FloatingActionButton({ onAddTransaction, onAddSavingsGoal }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end">
            <div className={`flex flex-col items-end space-y-3 transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                <button onClick={() => { onAddSavingsGoal(); setIsOpen(false); }} className="flex items-center justify-center w-40 h-12 bg-violet-500 text-white rounded-lg shadow-lg hover:bg-violet-600 transition-all">
                    <Target size={20} className="mr-2" /> New Goal
                </button>
                <button onClick={() => { onAddTransaction(); setIsOpen(false); }} className="flex items-center justify-center w-40 h-12 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600 transition-all">
                    <FileText size={20} className="mr-2" /> New Transaction
                </button>
            </div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="mt-4 w-16 h-16 bg-sky-600 text-white rounded-full flex items-center justify-center shadow-xl hover:bg-sky-700 transition-transform duration-300 transform hover:rotate-180 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
            >
                <Plus size={32} className={`transition-transform duration-300 ${isOpen ? 'rotate-45' : 'rotate-0'}`} />
            </button>
        </div>
    );
}