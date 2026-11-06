import React from 'react';
import { Users } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

const ACTIVITY_DATA = [
    { id: 1, user: 'Rahul S.', sport: 'Cricket', time: '10:15 AM', dept: 'CSE' },
    { id: 2, user: 'Sneha K.', sport: 'Badminton', time: '11:00 AM', dept: 'ECE' },
    { id: 3, user: 'Amit P.', sport: 'BGMI', time: '11:30 AM', dept: 'MECH' },
    { id: 4, user: 'Vikram R.', sport: 'Free Fire', time: '12:00 PM', dept: 'IT' },
    { id: 5, user: 'Arjun M.', sport: 'COD', time: '02:00 PM', dept: 'CSE' },
];

const ActivityFeed = () => {
    return (
        <Card className="lg:col-span-2">
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-8">
                <CardTitle>Who's Playing Today</CardTitle>
                <Users className="text-primary w-6 h-6" />
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {ACTIVITY_DATA.map(act => (
                        <div key={act.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-primary/20 transition-all group">
                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center font-black text-primary text-xs">
                                    {act.user[0]}
                                </div>
                                <div>
                                    <p className="text-sm font-black text-foreground">{act.user}</p>
                                    <p className="text-[10px] font-bold text-muted uppercase tracking-widest">{act.sport} • {act.dept}</p>
                                </div>
                            </div>
                            <span className="text-[10px] font-black text-primary bg-white px-3 py-1 rounded-full">{act.time}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default ActivityFeed;
