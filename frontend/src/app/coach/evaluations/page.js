'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Search, ChevronRight, User as UserIcon, TrendingUp, Radar as RadarIcon } from 'lucide-react';
import axios from 'axios';
import EvaluationForm from '@/components/EvaluationForm';
import SkillChart from '@/components/SkillChart';

const EvaluationPage = () => {
    const { user, token, loading } = useAuth();
    const router = useRouter();
    const [players, setPlayers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [playerEvaluations, setPlayerEvaluations] = useState([]);
    const [viewMode, setViewMode] = useState('rate'); // 'rate', 'history'

    useEffect(() => {
        if (!loading && (!user || (user.role !== 'coach' && user.role !== 'admin'))) {
            router.push('/login');
        }
    }, [user, loading, router]);

    const handleSearch = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query.length > 2) {
            try {
                const res = await axios.get(`http://localhost:5000/api/admin/users?search=${query}&role=student`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPlayers(res.data.users || []);
            } catch (err) {
                console.error('Search failed:', err);
            }
        } else {
            setPlayers([]);
        }
    };

    const fetchPlayerEvaluations = async (playerId) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/evaluations/player/${playerId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPlayerEvaluations(res.data.data);
        } catch (err) {
            console.error('Failed to fetch evaluations:', err);
        }
    };

    const selectPlayer = (player) => {
        setSelectedPlayer(player);
        fetchPlayerEvaluations(player.id);
        setSearchQuery('');
        setPlayers([]);
    };

    const handleEvaluationSubmit = async (data) => {
        try {
            await axios.post('http://localhost:5000/api/evaluations/rate', data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Evaluation submitted successfully!');
            fetchPlayerEvaluations(selectedPlayer.id);
            setViewMode('history');
        } catch (err) {
            alert('Failed to submit evaluation: ' + (err.response?.data?.message || err.message));
        }
    };

    if (loading || !user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-background pt-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-foreground">Player Skill Evaluation</h1>
                        <p className="text-muted-foreground">Track and analyze player performance over time.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left: Player Selection & Info */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleSearch}
                                placeholder="Search players by name or roll no..."
                                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 bg-white shadow-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            />
                            {players.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 max-h-60 overflow-y-auto">
                                    {players.map(p => (
                                        <button
                                            key={p.id}
                                            onClick={() => selectPlayer(p)}
                                            className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                {p.full_name[0]}
                                            </div>
                                            <div className="text-left">
                                                <p className="font-semibold text-gray-800">{p.full_name}</p>
                                                <p className="text-xs text-gray-500">{p.roll_no} • {p.department}</p>
                                            </div>
                                            <ChevronRight className="ml-auto text-gray-300" size={16} />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {selectedPlayer ? (
                            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                        <UserIcon size={32} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800">{selectedPlayer.full_name}</h2>
                                        <p className="text-gray-500">{selectedPlayer.roll_no}</p>
                                    </div>
                                </div>

                                <div className="flex bg-gray-50 p-1 rounded-xl">
                                    <button
                                        onClick={() => setViewMode('rate')}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${viewMode === 'rate' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        <TrendingUp size={16} /> Rate Skill
                                    </button>
                                    <button
                                        onClick={() => setViewMode('history')}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${viewMode === 'history' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        <RadarIcon size={16} /> Performance
                                    </button>
                                </div>

                                {playerEvaluations.length > 0 && viewMode === 'history' && (
                                    <div className="space-y-4">
                                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                            <RadarIcon size={18} className="text-indigo-600" /> Latest Profile
                                        </h3>
                                        <SkillChart data={playerEvaluations} type="radar" />
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-indigo-50/50 p-8 rounded-3xl border border-dashed border-indigo-100 text-center">
                                <UserIcon className="mx-auto mb-4 text-indigo-200" size={48} />
                                <p className="text-indigo-900 font-semibold">No Player Selected</p>
                                <p className="text-indigo-600/60 text-sm mt-1">Search and select a player to start evaluation</p>
                            </div>
                        )}
                    </div>

                    {/* Right: Main View */}
                    <div className="lg:col-span-8">
                        {selectedPlayer ? (
                            <div className="space-y-6">
                                {viewMode === 'rate' ? (
                                    <EvaluationForm
                                        playerId={selectedPlayer.id}
                                        playerName={selectedPlayer.full_name}
                                        sport="General" // could be dynamic
                                        onSubmit={handleEvaluationSubmit}
                                    />
                                ) : (
                                    <div className="space-y-6">
                                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                                            <h3 className="text-xl font-bold text-gray-800 mb-6">Historical Trend</h3>
                                            <SkillChart data={playerEvaluations} type="line" />
                                        </div>

                                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                                            <div className="p-6 border-b border-gray-50">
                                                <h3 className="font-bold text-gray-800">Evaluation History</h3>
                                            </div>
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left">
                                                    <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider">
                                                        <tr>
                                                            <th className="px-6 py-4 font-semibold">Date</th>
                                                            <th className="px-6 py-4 font-semibold">Rating</th>
                                                            <th className="px-6 py-4 font-semibold">Remarks</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-50">
                                                        {playerEvaluations.map((ev, idx) => (
                                                            <tr key={idx} className="hover:bg-gray-50/30 transition-colors">
                                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                                    {new Date(ev.evaluation_date).toLocaleDateString()}
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold">
                                                                        {ev.overall_rating.toFixed(1)} / 10
                                                                    </span>
                                                                </td>
                                                                <td className="px-6 py-4 text-sm text-gray-500 italic">
                                                                    "{ev.remarks || 'No remarks'}"
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="h-full min-h-[400px] flex items-center justify-center bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100">
                                <p className="text-gray-400">Search for a player on the left to begin</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EvaluationPage;
