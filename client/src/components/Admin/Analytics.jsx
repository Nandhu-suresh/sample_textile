import React from 'react';

const Analytics = () => {
    // Placeholder data for charts
    const stats = [
        { label: 'Total Sales', value: '₹12,450' },
        { label: 'New Orders', value: '45' },
        { label: 'Total Products', value: '124' },
        { label: 'Active Customers', value: '890' },
    ];

    return (
        <div>
            <h2 className="mb-8 font-playfair text-2xl text-secondary">Dashboard Overview</h2>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-8 mb-16">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-8 rounded-lg shadow-[0_2px_5px_rgba(0,0,0,0.05)] text-center">
                        <h3 className="text-4xl text-secondary mb-4">{stat.value}</h3>
                        <p className="text-gray-500 m-0">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white p-8 rounded-lg shadow-[0_2px_5px_rgba(0,0,0,0.05)] h-[400px] flex items-center justify-center text-gray-400">
                <p>Sales & Analytical Chart Placeholder (Integrate Chart.js or Recharts here)</p>
            </div>
        </div>
    );
};

export default Analytics;
