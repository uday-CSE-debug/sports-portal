'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
    Activity, Users, Package, AlertTriangle,
    Gamepad2, Zap, TrendingUp, RefreshCw
} from 'lucide-react';
import Heatmap from '@/components/analytics/Heatmap';
import { motion } from 'framer-motion';

const StatCard = ({ label, value, icon: Icon, color, subValue }) => (
    <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 relative overflow-hidden group"
    >
        <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500`}>
            <Icon size={80} className={color} />
        </div>
        <div className="relative z-10">
            <div className={`w-12 h-12 rounded-2xl ${color.replace('text-', 'bg-')}/10 flex items-center justify-center mb-4`}>
                <Icon className={color} />
            </div>
            <h3 className="text-3xl font-black text-gray-900 tracking-tight">{value}</h3>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{label}</p>
            {subValue && (
                <p className={`text-xs font-bold mt-4 ${subValue.includes('+') ? 'text-green-500' : 'text-gray-400'}`}>
                    {subValue}
                </p>
            )}
        </div>
    </motion.div>
);

const AnalyticsDashboard = () => {
    const { user, token, loading } = useAuth();
    const router = useRouter();
    const [liveStats, setLiveStats] = useState(null);
    const [esportsStats, setEsportsStats] = useState(null);
    const [heatmapData, setHeatmapData] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchData = async () => {
        if (!token) return;
        setIsRefreshing(true);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const [liveRes, esportsRes, heatmapRes] = await Promise.all([
                axios.get('http://localhost:5000/api/analytics/live', config),
                axios.get('http://localhost:5000/api/analytics/esports', config),
                axios.get('http://localhost:5000/api/analytics/heatmap', config)
            ]);

            setLiveStats(liveRes.data.data);
            setEsportsStats(esportsRes.data.data);
            setHeatmapData(heatmapRes.data.data);
        } catch (err) {
            console.error('Analytics Error:', err);
        } finally {
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        if (!loading && (!user || (user.role !== 'admin' && user.role !== 'coach'))) {
            router.push('/login');
            return;
        }

        if (user) {
            fetchData();
            // Poll every 30 seconds
            const interval = setInterval(fetchData, 30000);
            return () => clearInterval(interval);
        }
    }, [user, loading, router, token]);

    if (!liveStats || !esportsStats) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                <p className="text-sm font-bold text-gray-400 animate-pulse uppercase tracking-widest">Initializing Analytics Stream...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50/50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                            Live <span className="text-indigo-600 italic">Insights</span>
                        </h1>
                        <p className="text-gray-500 font-medium mt-1">Real-time system monitoring and engagement metrics.</p>
                    </div>
                    <button
                        onClick={fetchData}
                        disabled={isRefreshing}
                        className="flex items-center gap-2 bg-white px-5 py-3 rounded-xl border border-gray-200 font-bold text-gray-600 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm"
                    >
                        <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
                        <span>{isRefreshing ? 'Syncing...' : 'Force Refresh'}</span>
                    </button>
                </div>

                {/* Live Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        label="Active Students"
                        value={liveStats.activeUsers}
                        icon={Users}
                        color="text-blue-500"
                        subValue="Live on platform"
                    />
                    <StatCard
                        label="Active Requests"
                        value={liveStats.activeBookings}
                        icon={Activity}
                        color="text-green-500"
                        subValue="Pending approval"
                    />
                    <StatCard
                        label="Total Inventory"
                        value={liveStats.inventory.total}
                        icon={Package}
                        color="text-purple-500"
                    />
                    <StatCard
                        label="Low Stock Alerts"
                        value={liveStats.inventory.lowStock}
                        icon={AlertTriangle}
                        color="text-red-500"
                        subValue={liveStats.inventory.lowStock > 0 ? 'Action Recommended' : 'Optimal Levels'}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Esports Metrics */}
                    <div className="lg:col-span-1 bg-gray-900 text-white p-8 rounded-[32px] shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-20">
                            <Gamepad2 size={120} />
                        </div>
                        <div className="relative z-10 space-y-8">
                            <div>
                                <h3 className="text-xl font-black flex items-center gap-3">
                                    <Zap className="text-yellow-400" /> Esports Pulse
                                </h3>
                                <p className="text-gray-400 text-sm mt-2">Tournament engagement this season.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-4xl font-black text-white">{esportsStats.activePlayers}</p>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Unique Players</p>
                                </div>
                                <div>
                                    <p className="text-4xl font-black text-yellow-400">{esportsStats.liveMatches}</p>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Live Matches</p>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-gray-800">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-3xl font-black">{esportsStats.matchesPlayed}</p>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Total Matches Completed</p>
                                    </div>
                                    <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                                        {esportsStats.growthRate} Growth
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Heatmap Section */}
                    <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black flex items-center gap-2">
                                <TrendingUp className="text-indigo-600" /> Peak Usage Hours
                            </h3>
                            <div className="flex gap-2">
                                <span className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full">Today</span>
                            </div>
                        </div>

                        <Heatmap data={heatmapData} />

                        <div className="mt-8 pt-8 border-t border-gray-50">
                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Top Categories</h4>
                            <div className="flex flex-wrap gap-3">
                                {heatmapData?.categories?.map((cat, i) => (
                                    <div key={i} className="bg-gray-50 px-4 py-3 rounded-xl flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-lg bg-white shadow-sm flex items-center justify-center text-xs font-black text-indigo-600">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-900">{cat.sport_category}</p>
                                            <p className="text-[10px] font-medium text-gray-400">{cat.count} bookings</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
