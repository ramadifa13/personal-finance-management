import React, { useState, useContext } from 'react';
import { DataContext } from '../contexts/DataContext';
import AnimatedListItem from '../components/common/AnimatedListItem';
import FormInput from '../components/common/FormInput';
import { AlertTriangle, Trash2 } from 'lucide-react';

export default function SettingsView({ openModal }) {
    return (
        <div className="space-y-8">
            <AnimatedListItem index={0}><CategoryManager type="income" /></AnimatedListItem>
            <AnimatedListItem index={1}><CategoryManager type="expense" /></AnimatedListItem>
            <AnimatedListItem index={2}>
                <div className="bg-red-50 dark:bg-red-500/10 p-6 rounded-2xl border border-red-200 dark:border-red-500/30">
                    <h3 className="text-xl font-bold text-red-800 dark:text-red-200">Danger Zone</h3>
                    <p className="text-red-600 dark:text-red-300 mt-1 mb-4">These actions are irreversible. Please be certain.</p>
                    <button onClick={() => openModal('confirmDelete', { type: 'allData' })} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors shadow-md">
                        <AlertTriangle size={18} /> <span>Clear All Data</span>
                    </button>
                </div>
            </AnimatedListItem>
        </div>
    );
}

function CategoryManager({ type }) {
    const { categories, handleCategoryUpdate } = useContext(DataContext);
    const [newCategory, setNewCategory] = useState('');
    const title = type === 'income' ? 'Income Categories' : 'Expense Categories';

    const handleAdd = (e) => {
        e.preventDefault();
        if (newCategory && !categories[type].includes(newCategory)) {
            const updatedCategories = { ...categories, [type]: [...categories[type], newCategory] };
            handleCategoryUpdate(updatedCategories);
            setNewCategory('');
        }
    };

    const handleDelete = (categoryToDelete) => {
        const updatedCategories = { ...categories, [type]: categories[type].filter(c => c !== categoryToDelete) };
        handleCategoryUpdate(updatedCategories);
    };

    return (
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-md border border-zinc-200 dark:border-zinc-700">
            <h3 className="text-xl font-bold mb-4 text-zinc-700 dark:text-zinc-200">{title}</h3>
            <div className="space-y-2 mb-4">
                {categories[type].map((cat, index) => (
                    <AnimatedListItem key={cat} index={index}>
                        <div className="flex justify-between items-center bg-zinc-100 dark:bg-zinc-700/50 p-2 rounded-lg">
                            <span className="text-zinc-700 dark:text-zinc-200">{cat}</span>
                            <button onClick={() => handleDelete(cat)} className="text-zinc-400 hover:text-red-500 p-1 rounded-full"><Trash2 size={16} /></button>
                        </div>
                    </AnimatedListItem>
                ))}
            </div>
            <form onSubmit={handleAdd} className="flex gap-2">
                <FormInput id={`newCat-${type}`} type="text" value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="New category name" className="!p-2" />
                <button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg">Add</button>
            </form>
        </div>
    );
}