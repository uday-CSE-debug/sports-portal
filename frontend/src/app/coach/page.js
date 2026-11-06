'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Users, Activity, Calendar, Trophy } from 'lucide-react';

const CoachDashboard = () => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && (!user || user.role !== 'coach')) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading || !user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    const STATS = [
        { label: 'My Teams', value: '4', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Active Sessions', value: '12', icon: Activity, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Upcoming Matches', value: '3', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Tournament Wins', value: '7', icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-50' },
    ];

    return (
        <div className="min-h-screen bg-background pt-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
                    <h1 className="text-3xl font-black text-foreground">
                        Welcome, Coach <span className="text-primary">{user.full_name}</span>
                    </h1>
                    <p className="text-muted-foreground mt-2">Manage your teams and player performance.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {STATS.map((stat, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-[24px] border border-gray-100 flex items-center space-x-4 hover:border-primary/20 transition-all">
                            <div className={`p-4 rounded-xl ${stat.bg}`}>
                                <stat.icon className={`w-8 h-8 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                                <p className="text-2xl font-black text-foreground">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Content Area (Placeholder) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Team Management */}
                    <div className="lg:col-span-2 bg-white rounded-[32px] p-8 border border-gray-100 h-96 flex flex-col justify-center items-center text-center space-y-4">
                        <Users className="w-12 h-12 text-gray-300" />
                        <h3 className="text-xl font-bold text-gray-400">Team Management Module</h3>
                        <p className="text-gray-400 max-w-sm">Manage rosters, assign training schedules, and track player attendance.</p>
                        <button className="px-6 py-2 bg-primary/10 text-primary font-bold rounded-xl hover:bg-primary/20 transition-colors">
                            Launch Manager
                        </button>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-[32px] p-8 border border-gray-100 h-96">
                        <h3 className="text-xl font-black mb-6">Quick Actions</h3>
                        <div className="space-y-4">
                            <button className="w-full text-left p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors font-medium text-foreground">
                                + Create New Drill
                            </button>
                            <button className="w-full text-left p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors font-medium text-foreground">
                                Schedule Team Meeting
                            </button>
                            <button
                                onClick={() => router.push('/coach/evaluations')}
                                className="w-full text-left p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors font-medium text-foreground"
                            >
                                Evaluate Player Skills
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoachDashboard;
