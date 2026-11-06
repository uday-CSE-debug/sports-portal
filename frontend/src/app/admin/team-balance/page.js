'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Users, Search, RefreshCw, Trophy, UserPlus, X } from 'lucide-react';
import axios from 'axios';

const TeamBalancePage = () => {
    const { user, token, loading } = useAuth();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [balancedTeams, setBalancedTeams] = useState(null);
    const [generating, setGenerating] = useState(false);

    const handleSearch = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query.length > 2) {
            try {
                const res = await axios.get(`http://localhost:5000/api/admin/users?search=${query}&role=student`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSearchResults(res.data.users.filter(u => !selectedPlayers.find(sp => sp.id === u.id)));
            } catch (err) {
                console.error('Search failed:', err);
            }
        } else {
            setSearchResults([]);
        }
    };

    const addPlayer = (player) => {
        setSelectedPlayers([...selectedPlayers, player]);
        setSearchQuery('');
        setSearchResults([]);
    };

    const removePlayer = (playerId) => {
        setSelectedPlayers(selectedPlayers.filter(p => p.id !== playerId));
    };

    const handleBalanceTeams = async () => {
        if (selectedPlayers.length < 2) {
            alert('Select at least 2 players');
            return;
        }
        setGenerating(true);
        try {
            const playerIds = selectedPlayers.map(p => p.id).join(',');
            const res = await axios.get(`http://localhost:5000/api/evaluations/team-balance?player_ids=${playerIds}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBalancedTeams(res.data.data);
        } catch (err) {
            alert('Failed to balance teams: ' + (err.response?.data?.message || err.message));
        } finally {
            setGenerating(false);
        }
    };

    if (loading || !user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-background pt-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-black text-foreground">AI Team Balancer</h1>
                    <p className="text-muted-foreground">Automatically generate balanced teams based on player skill ratings.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Player Selection */}
                    <div className="lg:col-span-12">
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-1 relative">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Add Players to Pool</label>
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={handleSearch}
                                            placeholder="Search by name or roll no..."
                                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        />
                                    </div>
                                    {searchResults.length > 0 && (
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-50">
                                            {searchResults.map(p => (
                                                <button
                                                    key={p.id}
                                                    onClick={() => addPlayer(p)}
                                                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
                                                >
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                                                        {p.full_name[0]}
                                                    </div>
                                                    <span className="text-sm font-medium">{p.full_name}</span>
                                                    <UserPlus className="ml-auto text-primary" size={16} />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Player Pool ({selectedPlayers.length})</label>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedPlayers.map(p => (
                                            <div key={p.id} className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-sm font-bold">
                                                {p.full_name}
                                                <button onClick={() => removePlayer(p.id)} className="hover:text-red-500">
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                        {selectedPlayers.length === 0 && <p className="text-gray-400 text-sm italic">No players selected yet</p>}
                                    </div>
                                </div>
                                <div className="flex items-end">
                                    <button
                                        onClick={handleBalanceTeams}
                                        disabled={selectedPlayers.length < 2 || generating}
                                        className="w-full md:w-auto px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        <RefreshCw size={18} className={generating ? 'animate-spin' : ''} />
                                        Balance Teams
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Team Results */}
                    {balancedTeams && (
                        <div className="lg:col-span-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {balancedTeams.map(team => (
                                    <div key={team.team_number} className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                                        <div className="p-6 bg-indigo-600 text-white flex justify-between items-center">
                                            <h3 className="text-xl font-bold flex items-center gap-2">
                                                <Trophy size={20} /> Team {team.team_number}
                                            </h3>
                                            <div className="text-right">
                                                <p className="text-xs opacity-80 uppercase tracking-wider font-bold">Avg. Skill</p>
                                                <p className="text-lg font-black">{team.average_rating.toFixed(2)}</p>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <div className="space-y-4">
                                                {team.players.map(player => (
                                                    <div key={player.id} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/50 border border-gray-100 group hover:border-indigo-200 transition-all">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-indigo-600 font-bold border border-gray-100">
                                                                {player.name[0]}
                                                            </div>
                                                            <span className="font-bold text-gray-800">{player.name}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1 text-amber-500">
                                                            <span className="text-sm font-black">{player.rating.toFixed(1)}</span>
                                                            <RefreshCw size={14} className="text-gray-300 group-hover:text-indigo-400" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeamBalancePage;
