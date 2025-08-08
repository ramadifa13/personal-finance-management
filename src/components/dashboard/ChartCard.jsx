/* eslint-disable no-unused-vars */
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import EmptyState from '../common/EmptyState';

export default function ChartCard({ title, data, colors }) {
    return (
        <div className="bg-white dark:bg-zinc-800 p-4 sm:p-6 rounded-2xl shadow-md border border-zinc-200 dark:border-zinc-700">
            <h3 className="text-lg sm:text-xl font-bold mb-4 text-zinc-700 dark:text-zinc-200">{title}</h3>
            {data.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Pie data={data} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}>
                            {data.map((entry, index) => <Cell key={`cell-${index}`} fill={colors[index % colors.length]} className="focus:outline-none" />)}
                        </Pie>
                        <Tooltip formatter={(value, name) => [`Rp${value.toLocaleString('id-ID')}`, name]} contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(5px)', border: '1px solid #e2e8f0', borderRadius: '0.75rem', color: '#334155' }}/>
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            ) : ( <div className="h-[250px] flex items-center justify-center"><EmptyState icon={<PieChart size={48} />} title="No Data" message="Transactions will be summarized here." /></div> )}
        </div>
    );
}