'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const Recommendations = () => {
    const [recommendations, setRecommendations] = useState({ equipment: [], tournaments: [] });
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchRecommendations();
    }, []);

    const fetchRecommendations = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const res = await axios.get('/api/recommendations', {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Map keys from backend response
            setRecommendations({
                equipment: res.data.recommended_equipment || [],
                tournaments: res.data.recommended_tournaments || []
            });
        } catch (error) {
            console.error('Failed to load recommendations', error);
        } finally {
            setLoading(false);
        }
    };

    const handleItemClick = async (item, type) => {
        // Log activity
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/recommendations/activity', {
                activity_type: 'CLICK',
                target_type: type === 'equipment' ? 'EQUIPMENT' : 'TOURNAMENT',
                target_id: item.name || item.id
            }, { headers: { Authorization: `Bearer ${token}` } });
        } catch (e) {
            // ignore logging error
        }

        if (type === 'equipment') {
            // navigate to booking logic if possible, or just push
            router.push('/booking?category=' + item.category);
        } else {
            router.push('/tournaments');
        }
    };

    if (loading) return null;
    if (recommendations.equipment.length === 0 && recommendations.tournaments.length === 0) return null;

    return (
        <div className="recommendations-container mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 w-2 h-8 mr-3 rounded-full"></span>
                Recommended for You
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sports Recommendations */}
                {recommendations.equipment.length > 0 && (
                    <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10">
                        <h3 className="text-lg font-semibold text-gray-200 mb-3">Gear Up</h3>
                        <div className="space-y-3">
                            {recommendations.equipment.map(item => (
                                <div
                                    key={item.id}
                                    onClick={() => handleItemClick(item, 'equipment')}
                                    className="flex items-center p-3 bg-white/5 rounded-xl hover:bg-white/20 transition cursor-pointer group"
                                >
                                    <div className="w-12 h-12 rounded-lg bg-gray-700 overflow-hidden mr-4">
                                        {item.image_url ? (
                                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xl">🏆</div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium text-white group-hover:text-yellow-400">{item.name}</p>
                                        <p className="text-xs text-gray-400">{item.category}</p>
                                    </div>
                                    <div className="ml-auto text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                        →
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tournament/Esports Recommendations */}
                {recommendations.tournaments.length > 0 && (
                    <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10">
                        <h3 className="text-lg font-semibold text-gray-200 mb-3">Join the Action</h3>
                        <div className="space-y-3">
                            {recommendations.tournaments.map(t => (
                                <div
                                    key={t.id}
                                    onClick={() => handleItemClick(t, 'tournament')}
                                    className="flex items-center p-3 bg-gradient-to-r from-purple-900/40 to-blue-900/40 rounded-xl hover:from-purple-800/40 hover:to-blue-800/40 transition cursor-pointer border border-purple-500/30"
                                >
                                    <div className="w-12 h-12 rounded-lg bg-black flex items-center justify-center mr-4 text-purple-400 text-2xl">
                                        🎮
                                    </div>
                                    <div>
                                        <p className="font-medium text-white">{t.name}</p>
                                        <p className="text-xs text-purple-300">Upcoming Tournament</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Recommendations;
