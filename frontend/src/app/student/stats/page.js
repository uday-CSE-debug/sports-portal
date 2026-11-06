'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Trophy, TrendingUp, Radar as RadarIcon, Award, Target, Zap } from 'lucide-react';
import axios from 'axios';
import SkillChart from '@/components/SkillChart';

const PlayerStatsPage = () => {
    const { user, token, loading } = useAuth();
    const router = useRouter();
    const [evaluations, setEvaluations] = useState([]);
    const [statsLoading, setStatsLoading] = useState(true);

    useEffect(() => {
        if (!loading && (!user || user.role !== 'student')) {
            router.push('/login');
        } else if (user) {
            fetchStats();
        }
    }, [user, loading, router]);

    const fetchStats = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/evaluations/player/${user.id}`);
            setEvaluations(res.data.data);
        } catch (err) {
            console.error('Failed to fetch stats:', err);
        } finally {
            setStatsLoading(false);
        }
    };

    if (loading || statsLoading) return <div className="min-h-screen flex items-center justify-center">Loading Performance Data...</div>;

    const latest = evaluations.length > 0 ? evaluations[evaluations.length - 1] : null;

    return (
        <div className="min-h-screen bg-background pt-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="bg-white rounded-[32px] p-8 md:p-12 border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Trophy size={160} />
                    </div>
                    <div className="relative z-10">
                        <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">Performance <span className="text-primary italic">Center</span></h1>
                        <p className="text-muted-foreground mt-4 text-lg">Hey {user.full_name}, track your journey to becoming a pro.</p>
                    </div>
                </div>

                {evaluations.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Summary Cards */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                                <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                                    <Target className="text-primary" /> Overall Rating
                                </h3>
                                <div className="flex items-center justify-center py-4">
                                    <div className="relative">
                                        <div className="w-32 h-32 rounded-full border-8 border-gray-50 flex items-center justify-center">
                                            <span className="text-4xl font-black text-primary">{latest.overall_rating.toFixed(1)}</span>
                                        </div>
                                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                                            Top 10%
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-8">
                                    <div className="bg-gray-50 p-4 rounded-2xl text-center">
                                        <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-1">Stamina</p>
                                        <p className="font-black text-foreground">{latest.stamina}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-2xl text-center">
                                        <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-1">Speed</p>
                                        <p className="font-black text-foreground">{latest.speed}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-primary text-white p-8 rounded-[32px] shadow-xl shadow-primary/20">
                                <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                                    <Award /> Coach's Feedback
                                </h3>
                                <p className="text-white/80 italic font-medium leading-relaxed">
                                    "{latest.remarks || 'Keep pushing your limits! Your dedication is showing in every session.'}"
                                </p>
                                <div className="mt-6 flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-black">C</div>
                                    <span className="text-xs font-bold text-white/60">Updated on {new Date(latest.evaluation_date).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Visualizations */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-xl font-black flex items-center gap-2">
                                        <RadarIcon className="text-indigo-500" /> Skill Radar Profile
                                    </h3>
                                    <Zap className="text-yellow-400" />
                                </div>
                                <SkillChart data={evaluations} type="radar" />
                            </div>

                            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-xl font-black flex items-center gap-2">
                                        <TrendingUp className="text-green-500" /> Progress Curve
                                    </h3>
                                    <span className="text-xs font-bold text-muted bg-gray-50 px-3 py-1 rounded-full">{evaluations.length} Evaluations</span>
                                </div>
                                <SkillChart data={evaluations} type="line" />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white py-24 px-8 rounded-[48px] border-2 border-dashed border-gray-100 text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-gray-300">
                            <RadarIcon size={40} />
                        </div>
                        <h2 className="text-2xl font-black text-gray-800">No Assessment Data Yet</h2>
                        <p className="text-muted-foreground mt-2 max-w-sm mx-auto italic">
                            Your skill evaluation will appear here once a coach assesses your performance during sessions.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlayerStatsPage;
