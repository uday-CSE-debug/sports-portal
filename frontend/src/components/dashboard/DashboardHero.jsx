import React from 'react';
import { Search, Trophy, Radar as RadarIcon } from 'lucide-react';

const DashboardHero = ({ searchTerm, setSearchTerm }) => {
    return (
        <div className="relative mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-12">
            <div className="max-w-2xl">
                <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-primary/10">
                    <div className="w-2 h-2 bg-primary rounded-full animate-ping"></div>
                    <span>Live Activity Feed</span>
                </div>
                <h1 className="text-6xl md:text-8xl font-black text-foreground tracking-tighter leading-[0.85] mb-8">
                    Ready to <span className="text-primary italic">Elevate</span> <br />
                    Your Game?
                </h1>

                {/* Search Bar */}
                <div className="relative max-w-md group">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-muted group-focus-within:text-primary transition-colors">
                        <Search className="w-5 h-5" />
                    </div>
                    <input
                        type="text"
                        placeholder="Find gear or tournament..."
                        className="w-full bg-white border border-gray-100 py-6 pl-14 pr-6 rounded-[32px] font-bold text-foreground shadow-sm focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Engagement Quick View */}
            <div className="flex flex-wrap gap-4">
                <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 min-w-[200px]">
                    <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-2">My Rank</p>
                    <div className="flex items-center space-x-3">
                        <div className="bg-yellow-100 p-2 rounded-xl text-yellow-600">
                            <Trophy className="w-5 h-5" />
                        </div>
                        <span className="text-2xl font-black text-foreground">#14</span>
                    </div>
                </div>
                <div
                    onClick={() => window.location.href = '/student/stats'}
                    className="bg-primary text-white p-6 rounded-[32px] shadow-lg shadow-primary/20 min-w-[200px] cursor-pointer hover:scale-105 transition-transform"
                >
                    <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-2">My Skills</p>
                    <div className="flex items-center space-x-3">
                        <div className="bg-white/20 p-2 rounded-xl text-white">
                            <RadarIcon className="w-5 h-5" />
                        </div>
                        <span className="text-2xl font-black">View Stats</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHero;
