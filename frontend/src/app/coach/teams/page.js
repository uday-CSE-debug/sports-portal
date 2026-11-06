'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
    Users, Star, TrendingUp, Settings, ChevronRight,
    Search, Award, Shield, UserPlus, MoreVertical,
    BarChart2, Filter, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const CoachTeams = () => {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [teams, setTeams] = useState([
        { id: 1, name: 'Cricket Varsity', players: 16, category: 'Sports', rating: 4.8, status: 'Active' },
        { id: 2, name: 'Valorant Elite', players: 6, category: 'eSports', rating: 4.5, status: 'In Training' },
        { id: 3, name: 'Football 1st XI', players: 22, category: 'Sports', rating: 4.2, status: 'Active' },
    ]);

    useEffect(() => {
        if (!loading && (!user || user.role !== 'coach')) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading || !user) return null;

    return (
        <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0">
                    <div>
                        <h1 className="text-4xl font-black text-foreground tracking-tighter">
                            Team <span className="text-secondary italic">Rosters</span>
                        </h1>
                        <p className="text-muted-foreground font-medium mt-1">Manage athletes, evaluate skills, and optimize performance.</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-foreground/20 group-focus-within:text-secondary transition-colors">
                                <Search className="w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search teams/players..."
                                className="bg-white border border-foreground/5 py-4 pl-14 pr-6 rounded-2xl font-bold text-foreground shadow-premium focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="bg-secondary text-white p-4 rounded-2xl shadow-premium shadow-glow shadow-secondary/20 hover:bg-purple-600 transition-all btn-lift">
                            <UserPlus className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Teams Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {teams.map((team, idx) => (
                        <motion.div
                            key={team.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="glass p-8 rounded-[40px] border border-foreground/5 hover:border-secondary/20 transition-all flex flex-col group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 mt-[-10%] mr-[-10%] bg-secondary/5 rounded-full blur-3xl group-hover:bg-secondary/10 transition-colors" />

                            <div className="flex justify-between items-start mb-8 relative z-10">
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <Award className="w-4 h-4 text-secondary" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">{team.category}</span>
                                    </div>
                                    <h3 className="text-2xl font-black text-foreground">{team.name}</h3>
                                </div>
                                <button className="p-2 text-foreground/20 hover:text-secondary transition-colors">
                                    <MoreVertical className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
                                <div className="p-4 bg-foreground/[0.02] rounded-2xl border border-foreground/5 text-center">
                                    <p className="text-[10px] font-black text-foreground/30 uppercase tracking-widest mb-1">Squad Size</p>
                                    <div className="flex items-center justify-center space-x-2">
                                        <Users className="w-4 h-4 text-foreground/60" />
                                        <span className="text-xl font-black text-foreground">{team.players}</span>
                                    </div>
                                </div>
                                <div className="p-4 bg-foreground/[0.02] rounded-2xl border border-foreground/5 text-center">
                                    <p className="text-[10px] font-black text-foreground/30 uppercase tracking-widest mb-1">Performance</p>
                                    <div className="flex items-center justify-center space-x-2">
                                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                        <span className="text-xl font-black text-foreground">{team.rating}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8 flex-1">
                                <div className="flex items-center justify-between text-xs font-bold px-4 py-3 bg-secondary/5 rounded-xl border border-secondary/10">
                                    <span className="text-secondary opacity-60">Status:</span>
                                    <span className="text-secondary">{team.status}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs font-bold px-4 py-3 bg-foreground/5 rounded-xl">
                                    <span className="text-foreground/40 text-[10px] uppercase">Next Evaluation:</span>
                                    <span className="text-foreground/60 italic">In 4 days</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-foreground/5 space-y-3">
                                <button className="w-full py-4 bg-foreground/[0.03] hover:bg-foreground/[0.06] text-foreground font-black text-xs uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center group/btn">
                                    <span>Manage Roster</span>
                                    <ChevronRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                                <button className="w-full py-4 bg-secondary text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-premium shadow-glow shadow-secondary/20 hover:bg-purple-600 transition-all">
                                    Evaluate Player Skills
                                </button>
                            </div>
                        </motion.div>
                    ))}

                    {/* Quick Stats Helper */}
                    <div className="glass p-10 rounded-[48px] bg-secondary border-none flex flex-col justify-between text-white shadow-2xl overflow-hidden relative group">
                        <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-white/10 rounded-full blur-[80px]" />
                        <div>
                            <div className="bg-white/20 w-16 h-16 rounded-3xl flex items-center justify-center mb-8">
                                <TrendingUp className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-3xl font-black tracking-tight leading-tight">Coaching<br />Analytics</h3>
                            <p className="text-white/60 font-medium mt-4 text-sm leading-relaxed">
                                View detailed skill regression and progress charts for all teams under your supervision.
                            </p>
                        </div>
                        <button className="bg-white text-secondary font-black text-xs px-6 py-4 rounded-2xl uppercase tracking-widest mt-8 hover:bg-gray-100 transition-all flex items-center justify-center w-max">
                            View Charts
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoachTeams;
