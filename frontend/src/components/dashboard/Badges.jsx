import React from 'react';
import { Zap, Trophy } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

const BADGES_DATA = [
    { id: 1, name: 'Early Bird', icon: Zap, color: 'text-yellow-500', desc: 'Booked 5+ morning sessions' },
    { id: 2, name: 'Pro Athlete', icon: Trophy, color: 'text-primary', desc: 'Maintained 95% return rate' },
];

const Badges = () => {
    return (
        <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-8">
                <CardTitle>Badges</CardTitle>
                <Zap className="text-primary w-6 h-6" />
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    {BADGES_DATA.map(badge => (
                        <div key={badge.id} className="relative group cursor-pointer">
                            <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100 flex flex-col items-center hover:bg-primary/5 hover:border-primary/20 transition-all">
                                <badge.icon className={`w-8 h-8 ${badge.color} mb-2`} />
                                <span className="text-[9px] font-black uppercase text-center tracking-tight text-muted group-hover:text-primary transition-colors">{badge.name}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default Badges;
