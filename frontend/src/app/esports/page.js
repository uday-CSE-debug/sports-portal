'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Trophy, Users, Clock, ChevronRight, Zap, Target, Swords, ShieldCheck, X, Layout, UserPlus, Calendar, Info, Ghost } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const GAMES = [
    {
        id: 'bgmi',
        name: 'BGMI',
        players: '4 Players',
        color: 'from-orange-500 to-red-600',
        logo: '/game-icons/pubg.png',
        icon: Target,
        desc: 'Battlegrounds Mobile India - Squad Combat.',
        roles: ['IGL', 'Entry Fragger', 'Support', 'Sniper']
    },
    {
        id: 'ff',
        name: 'Free Fire',
        players: '4 Players',
        color: 'from-yellow-400 to-orange-500',
        logo: '/game-icons/freefire.png',
        icon: Zap,
        desc: 'Fast-paced survival shooter action.',
        roles: ['IGL', 'Rusher', 'Sniper', 'Healer']
    },
    {
        id: 'valorant',
        name: 'Valorant',
        players: '5 Players',
        color: 'from-red-500 to-rose-700',
        logo: '/game-icons/valorant.png',
        icon: Swords,
        desc: 'Character-based tactical 5v5 shooter.',
        roles: ['Duelist', 'Controller', 'Initiator', 'Sentinel']
    },
    {
        id: 'fifa',
        name: 'FIFA 24',
        players: '1v1 / 2v2',
        color: 'from-blue-500 to-indigo-700',
        logo: '/game-icons/fifa.png',
        icon: ShieldCheck,
        desc: 'The ultimate football simulation experience.',
        roles: ['Attacker', 'Midfielder', 'Defender']
    },
    {
        id: 'cod',
        name: 'COD Mobile',
        players: '5 Players',
        color: 'from-zinc-700 to-zinc-900',
        logo: '/game-icons/cod.png',
        icon: Ghost,
        desc: 'Military grade tactical shooter.',
        roles: ['Slayer', 'Objective', 'Anchor', 'Support']
    }
];

const getMatchStatus = (gameTime) => {
    const [hours, minutes] = gameTime.split(':').map(Number);
    const now = new Date();
    const gameDate = new Date();
    gameDate.setHours(hours, minutes, 0, 0);

    const diffMinutes = (now - gameDate) / (1000 * 60);

    if (diffMinutes < 0) return { label: 'Upcoming', class: 'text-primary' };
    if (diffMinutes >= 0 && diffMinutes <= 60) return { label: 'Live', class: 'text-red-500 flex items-center', pulse: true };
    return { label: 'Finished', class: 'text-muted' };
};

const MATCH_SCHEDULE = [
    { id: 1, game: 'BGMI', time: '18:00', type: 'Scrims', lobby: 'AX782' },
    { id: 2, game: 'Valorant', time: '21:30', type: 'Tournament', lobby: 'VAL-PRO-9' },
    { id: 3, game: 'FIFA', time: '22:30', type: 'Friendly', lobby: 'FIFA-ROOM' }
];

const JoinModal = ({ game, onClose }) => {
    const [step, setStep] = useState(1);
    const [selectedRole, setSelectedRole] = useState('');

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                className="bg-white w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl"
            >
                <div className={cn("h-32 p-8 flex justify-between items-start text-white", game.color)}>
                    <div>
                        <h2 className="text-3xl font-black tracking-tighter uppercase">{game.name}</h2>
                        <p className="text-white/80 text-xs font-bold tracking-widest uppercase">Arena Registration</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-black/20 hover:bg-black/40 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-8">
                    {step === 1 ? (
                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted block mb-4">Select Your Role</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {game.roles?.map(role => (
                                        <button
                                            key={role}
                                            onClick={() => setSelectedRole(role)}
                                            className={cn(
                                                "p-4 rounded-2xl border-2 text-sm font-black transition-all",
                                                selectedRole === role ? "border-primary bg-primary/5 text-primary" : "border-gray-100 text-muted hover:border-gray-200"
                                            )}
                                        >
                                            {role}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button
                                disabled={!selectedRole}
                                onClick={() => setStep(2)}
                                className="w-full bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest disabled:opacity-50"
                            >
                                Continue to Lobby
                            </button>
                        </div>
                    ) : (
                        <div className="text-center space-y-6 py-4">
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ShieldCheck className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-black tracking-tight">Registration Confirmed!</h3>
                            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                                <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-2">Your Lobby Code</p>
                                <p className="text-4xl font-black text-primary tracking-widest tabular-nums">JOIN-99{Math.floor(Math.random() * 99)}</p>
                            </div>
                            <button onClick={onClose} className="w-full bg-black text-white py-4 rounded-2xl font-black uppercase tracking-widest">
                                Go to Arena
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default function EsportsPage() {
    const { user, loading: authLoading } = useAuth();
    const [selectedGame, setSelectedGame] = useState(null);

    if (authLoading) return null;

    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 pt-24 md:pt-32 pb-20">
                {/* Header Section */}
                <div className="relative mb-20 text-center md:text-left">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] mb-8"
                    >
                        <Gamepad2 className="w-5 h-5" />
                        <span>Professional Esports Arena</span>
                    </motion.div>
                    <h1 className="text-4xl md:text-8xl font-black tracking-tighter leading-none mb-6">
                        Dominate <span className="text-primary italic">The</span> <br className="hidden md:block" />
                        Global Circuit
                    </h1>
                </div>

                {/* Games Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {GAMES.map((game, idx) => (
                        <motion.div
                            key={game.id}
                            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all group"
                        >
                            <div className="flex justify-between items-start mb-10">
                                <div className={cn("w-16 h-16 rounded-3xl flex items-center justify-center text-white shadow-lg", game.color)}>
                                    {game.logo ? (
                                        <img src={game.logo} className="w-full h-full object-cover rounded-3xl" alt={game.name} />
                                    ) : (
                                        <game.icon className="w-8 h-8" />
                                    )}
                                </div>
                                <div className="bg-gray-50 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-muted">
                                    {game.players}
                                </div>
                            </div>

                            <h3 className="text-2xl md:text-3xl font-black tracking-tight mb-2">{game.name}</h3>
                            <p className="text-muted text-xs md:text-sm font-medium leading-relaxed mb-6 md:mb-10 h-10 md:h-10 overflow-hidden">{game.desc}</p>

                            <button
                                onClick={() => setSelectedGame(game)}
                                className="w-full bg-gray-900 text-white py-5 rounded-[24px] font-black uppercase tracking-widest flex items-center justify-center space-x-3 group-hover:bg-primary transition-colors"
                            >
                                <span>Join Arena</span>
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* Match Tracker Section */}
                <div className="mt-32 grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2">
                        <div className="flex items-center space-x-4 mb-8">
                            <div className="bg-primary/10 p-3 rounded-2xl text-primary">
                                <Calendar className="w-6 h-6" />
                            </div>
                            <h2 className="text-4xl font-black tracking-tighter">Live Schedules</h2>
                        </div>

                        <div className="space-y-4">
                            {MATCH_SCHEDULE.map(match => {
                                const status = getMatchStatus(match.time);
                                return (
                                    <div key={match.id} className="bg-white p-4 md:p-6 rounded-[24px] md:rounded-[32px] border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 group hover:border-primary/20 transition-all">
                                        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto">
                                            <div className="text-center bg-gray-50 px-4 py-3 rounded-2xl min-w-full sm:min-w-[100px]">
                                                <p className="text-[9px] md:text-[10px] font-black text-muted uppercase tracking-widest">Starts At</p>
                                                <p className="text-lg md:text-xl font-black tracking-tighter text-primary">{match.time}</p>
                                            </div>
                                            <div className="text-center sm:text-left">
                                                <div className="flex items-center justify-center sm:justify-start space-x-2 mb-1">
                                                    <span className={cn("text-[9px] md:text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-gray-50", status.class)}>
                                                        {status.pulse && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse mr-1.5 inline-block" />}
                                                        {status.label}
                                                    </span>
                                                </div>
                                                <h4 className="text-lg md:text-xl font-black tracking-tight">{match.game}</h4>
                                                <p className="text-[10px] md:text-xs font-bold text-muted uppercase tracking-widest">{match.type}</p>
                                            </div>
                                        </div>
                                        <div className="w-full sm:w-auto text-center sm:text-right">
                                            <div className="bg-primary/5 text-primary px-4 py-2 rounded-xl text-[9px] md:text-[10px] font-black tracking-widest uppercase inline-block">
                                                Lobby: {match.lobby}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="bg-gray-900 rounded-[48px] p-10 text-white flex flex-col justify-between overflow-hidden relative">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl"></div>
                        <div>
                            <Trophy className="w-8 h-8 md:w-12 md:h-12 text-primary mb-4 md:mb-6 animate-bounce" />
                            <h4 className="text-2xl md:text-3xl font-black tracking-tighter mb-4">Achievement Badges</h4>
                            <p className="text-white/60 text-xs md:text-sm font-medium mb-8">Register and dominate matches to unlock exclusive digital trophies for your profile.</p>
                            <div className="flex flex-wrap gap-2">
                                {['Clutch Master', 'Ace', 'Team Player'].map(tag => (
                                    <span key={tag} className="bg-white/10 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="mt-10 p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-black uppercase tracking-widest">Total XP</span>
                                <span className="text-2xl font-black text-primary">1,240</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <AnimatePresence>
                {selectedGame && <JoinModal game={selectedGame} onClose={() => setSelectedGame(null)} />}
            </AnimatePresence>
        </div>
    );
}
