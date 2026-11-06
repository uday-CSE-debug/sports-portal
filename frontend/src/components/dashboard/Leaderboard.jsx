import React from 'react';
import { Trophy } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

const LEADERBOARD_DATA = [
    { rank: 1, dept: 'CSE', points: 2450, color: 'text-blue-600' },
    { rank: 2, dept: 'MECH', points: 1980, color: 'text-orange-600' },
    { rank: 3, dept: 'ECE', points: 1750, color: 'text-green-600' },
];

const Leaderboard = () => {
    return (
        <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-8">
                <CardTitle>Leaderboard</CardTitle>
                <Trophy className="text-yellow-500 w-6 h-6" />
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {LEADERBOARD_DATA.map(item => (
                        <div key={item.dept} className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <span className="text-lg font-black text-muted w-6">#{item.rank}</span>
                                <span className="font-black text-foreground">{item.dept}</span>
                            </div>
                            <span className={`font-black ${item.color}`}>{item.points}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default Leaderboard;
