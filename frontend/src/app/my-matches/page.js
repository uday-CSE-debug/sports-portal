'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
    Trophy, Gamepad2, Calendar, Target,
    Zap, Award, ChevronRight, Activity,
    History, MapPin, Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const MyMatches = () => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && (!user || user.role !== 'student')) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading || !user) return null;

    const MATCHES = [
        { id: 1, type: 'Upcoming', sport: 'Valorant', role: 'eSports', vs: 'Mechanical Titans', time: 'Tomorrow, 6:30 PM', venue: 'Esports Lab 1', icon: Gamepad2, color: 'text-purple-500', bg: 'bg-purple-50' },
        { id: 2, type: 'Recent', sport: 'Cricket', role: 'Sports', vs: 'ECE Warriors', time: '2 days ago', result: 'Won (MVP)', venue: 'Cricket Ground', icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-50' },
        { id: 3, type: 'Recent', sport: 'Football', role: 'Sports', vs: 'Civil Kings', time: '1 week ago', result: 'Draw', venue: 'Football Turf', icon: Target, color: 'text-blue-500', bg: 'bg-blue-50' },
    ];

    return (
        <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0">
                    <div>
                        <h1 className="text-4xl font-black text-foreground tracking-tighter">
                            My <span className="text-primary italic">Matches</span>
                        </h1>
                        <p className="text-muted-foreground font-medium mt-1">Track your tournament progress and match history.</p>
                    </div>
                </div>

                {/* Match List */}
                <div className="space-y-8">
                    {MATCHES.map((match, idx) => (
                        <motion.div
                            key={match.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="glass p-6 md:p-10 rounded-[40px] border border-foreground/5 hover:border-primary/20 transition-all flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-10 group"
                        >
                            {/* Icon & Category */}
                            <div className={cn("p-6 rounded-[32px] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-glow shadow-primary/5", match.bg)}>
                                <match.icon className={cn("w-10 h-10", match.color)} />
                            </div>

                            {/* Details */}
                            <div className="flex-1 text-center md:text-left space-y-2">
                                <div className="flex items-center justify-center md:justify-start space-x-2">
                                    <span className={cn(
                                        "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full",
                                        match.type === 'Upcoming' ? "bg-primary text-white" : "bg-foreground/5 text-foreground/40"
                                    )}>
                                        {match.type}
                                    </span>
                                    <span className="text-foreground/20">•</span>
                                    <span className="text-xs font-bold text-foreground/40">{match.venue}</span>
                                </div>
                                <h3 className="text-2xl font-black text-foreground">{match.sport} vs {match.vs}</h3>
                                <div className="flex items-center justify-center md:justify-start space-x-4 text-sm font-medium text-foreground/50">
                                    <div className="flex items-center">
                                        <Clock className="w-4 h-4 mr-2 opacity-40" />
                                        {match.time}
                                    </div>
                                    {match.result && (
                                        <div className="flex items-center font-black text-success">
                                            <Award className="w-4 h-4 mr-2" />
                                            {match.result}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action */}
                            <button className="bg-foreground/5 hover:bg-foreground/10 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all text-foreground/60 flex items-center group/btn">
                                <span>Details</span>
                                <ChevronRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* Empty State / Bottom Info */}
                <div className="p-12 rounded-[48px] bg-primary/[0.02] border-2 border-dashed border-primary/10 flex flex-col items-center text-center space-y-4">
                    <Activity className="w-12 h-12 text-primary opacity-20" />
                    <h4 className="text-xl font-black text-foreground/40 italic">Waiting for new fixtures?</h4>
                    <p className="text-sm text-foreground/30 font-medium max-w-sm">
                        Registration for the Intra-College eSports League is now open. Register your team today!
                    </p>
                    <Link href="/esports" className="text-primary font-black text-xs uppercase tracking-widest hover:underline mt-4">
                        Register for eSports →
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default MyMatches;
