'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
    Trophy, Gamepad2, Plus, Users, Calendar,
    MoreVertical, CheckCircle2, XCircle, Clock,
    Share2, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SubAdminMatches = () => {
    const { user, loading } = useAuth();
    const router = useRouter();
    const getMatchStatus = (gameTime) => {
        const [hours, minutes] = gameTime.split(':').map(Number);
        const now = new Date();
        const gameDate = new Date();
        gameDate.setHours(hours, minutes, 0, 0);

        const diffMinutes = (now - gameDate) / (1000 * 60);

        if (diffMinutes < 0) return 'Scheduled';
        if (diffMinutes >= 0 && diffMinutes <= 90) return 'Live';
        return 'Finished';
    };

    const [matches, setMatches] = useState([
        { id: 1, sport: 'Valorant', role: 'eSports', teamA: 'Ravens', teamB: 'Shadows', time: '21:30', status: 'Live', code: 'VLR-7821' },
        { id: 2, sport: 'Football', role: 'Outdoors', teamA: 'Mechanical', teamB: 'Civil', time: '16:00', status: 'Finished', code: null },
        { id: 3, sport: 'FIFA 24', role: 'eSports', teamA: 'Aryan', teamB: 'Rahul', time: '22:15', status: 'Scheduled', code: 'FIFA-9901' },
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            setMatches(prev => prev.map(m => ({
                ...m,
                status: getMatchStatus(m.time)
            })));
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!loading && (!user || user.role !== 'sub_admin')) {
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
                            Match <span className="text-primary">Arena</span>
                        </h1>
                        <p className="text-muted-foreground font-medium mt-1">Organize lobbies and track match results.</p>
                    </div>
                    <button className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-premium shadow-glow hover:bg-primary-hover transition-all flex items-center space-x-3">
                        <Plus className="w-5 h-5" />
                        <span>Host New Match</span>
                    </button>
                </div>

                {/* Match Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {matches.map((match, idx) => (
                        <motion.div
                            key={match.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="glass p-8 rounded-[40px] border border-foreground/5 hover:border-primary/20 transition-all flex flex-col group"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-primary/10 p-2.5 rounded-xl">
                                        {match.role === 'eSports' ? <Gamepad2 className="w-5 h-5 text-primary" /> : <Trophy className="w-5 h-5 text-primary" />}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">{match.role}</span>
                                        <span className="text-lg font-black text-foreground">{match.sport}</span>
                                    </div>
                                </div>
                                <span className="p-2 text-foreground/20 group-hover:text-primary transition-colors">
                                    <MoreVertical className="w-5 h-5" />
                                </span>
                            </div>

                            <div className="flex items-center justify-between mb-8">
                                <div className="text-center flex-1">
                                    <div className="w-12 h-12 bg-foreground/5 rounded-full flex items-center justify-center mx-auto mb-2 font-black text-foreground/40 text-lg">
                                        {match.teamA.charAt(0)}
                                    </div>
                                    <p className="font-bold text-sm truncate">{match.teamA}</p>
                                </div>
                                <div className="px-4 text-xs font-black text-foreground/20 italic">VS</div>
                                <div className="text-center flex-1">
                                    <div className="w-12 h-12 bg-foreground/5 rounded-full flex items-center justify-center mx-auto mb-2 font-black text-foreground/40 text-lg">
                                        {match.teamB.charAt(0)}
                                    </div>
                                    <p className="font-bold text-sm truncate">{match.teamB}</p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center justify-between text-xs font-bold px-4 py-3 bg-foreground/5 rounded-xl">
                                    <span className="text-foreground/40">Status:</span>
                                    <span className={match.status === 'Live' ? 'text-red-500 flex items-center' : 'text-primary'}>
                                        {match.status === 'Live' && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse mr-2" />}
                                        {match.status}
                                    </span>
                                </div>
                                {match.code && (
                                    <div className="flex items-center justify-between text-xs font-bold px-4 py-3 bg-primary/5 border border-primary/10 rounded-xl">
                                        <span className="text-primary/60">Lobby Code:</span>
                                        <span className="text-primary flex items-center">
                                            {match.code}
                                            <Share2 className="w-3.5 h-3.5 ml-2 cursor-pointer hover:scale-110 transition-transform" />
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3 mt-auto">
                                <button className="py-3 bg-foreground/5 hover:bg-foreground/10 text-foreground/60 rounded-xl font-bold text-xs transition-colors">
                                    Update Info
                                </button>
                                <button className="py-3 bg-secondary text-white rounded-xl font-bold text-xs shadow-glow shadow-secondary/20 hover:bg-purple-600 transition-colors">
                                    Enter Score
                                </button>
                            </div>
                        </motion.div>
                    ))}

                    {/* Placeholder for "Add Match" card */}
                    <div className="border-2 border-dashed border-foreground/5 rounded-[40px] flex flex-col items-center justify-center p-12 text-foreground/20 hover:border-primary/20 hover:text-primary transition-all cursor-pointer group">
                        <div className="bg-foreground/5 group-hover:bg-primary/10 p-6 rounded-full transition-colors mb-4">
                            <Plus className="w-8 h-8" />
                        </div>
                        <p className="font-black uppercase tracking-widest text-xs text-center">Schedule New<br />Championship Match</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubAdminMatches;
