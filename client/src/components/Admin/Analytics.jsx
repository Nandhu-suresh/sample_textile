import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Analytics = () => {
    const [stats, setStats] = useState({
        totalSales: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalUsers: 0
    });
    const [salesHistory, setSalesHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const headers = { 'x-auth-token': token };

                const statsRes = await axios.get('http://localhost:5000/api/admin/stats', { headers });
                setStats(statsRes.data);

                const historyRes = await axios.get('http://localhost:5000/api/admin/sales-history', { headers });
                setSalesHistory(historyRes.data);

                setLoading(false);
            } catch (error) {
                console.error("Error fetching analytics:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const statCards = [
        { label: 'Total Sales', value: `₹${stats.totalSales.toLocaleString()}`, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Total Orders', value: stats.totalOrders, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Total Products', value: stats.totalProducts, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Total Users', value: stats.totalUsers, color: 'text-orange-600', bg: 'bg-orange-50' },
    ];

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
            </div>
        );
    }

    return (
        <div className="animate-fadeIn">
            <h2 className="mb-8 font-playfair text-2xl text-secondary font-bold">Dashboard Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {statCards.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                    >
                        <h3 className={`text-3xl font-bold mb-2 ${stat.color}`}>{stat.value}</h3>
                        <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
                <h3 className="text-xl font-playfair font-bold text-gray-800 mb-6">Sales Analytics (Last 7 Days)</h3>
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={salesHistory}
                            margin={{
                                top: 10,
                                right: 30,
                                left: 0,
                                bottom: 0,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis
                                dataKey="_id"
                                tick={{ fill: '#6b7280', fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(str) => {
                                    const date = new Date(str);
                                    return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`;
                                }}
                            />
                            <YAxis
                                tick={{ fill: '#6b7280', fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `₹${value}`}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: 'none' }}
                                itemStyle={{ color: '#1f2937' }}
                                formatter={(value) => [`₹${value}`, 'Sales']}
                                labelFormatter={(label) => new Date(label).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            />
                            <Area
                                type="monotone"
                                dataKey="sales"
                                stroke="#D4AF37"
                                fill="url(#colorSales)"
                                strokeWidth={3}
                            />
                            <defs>
                                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
