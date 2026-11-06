'use strict';

import React from 'react';
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

const SkillChart = ({ data, type = 'radar' }) => {
    if (!data || data.length === 0) {
        return <div className="p-4 text-center text-gray-500">No data available for chart</div>;
    }

    if (type === 'radar') {
        const latest = data[data.length - 1];
        const radarData = [
            { subject: 'Stamina', A: latest.stamina, fullMark: 10 },
            { subject: 'Technique', A: latest.technique, fullMark: 10 },
            { subject: 'Teamwork', A: latest.teamwork, fullMark: 10 },
            { subject: 'Speed', A: latest.speed, fullMark: 10 },
        ];

        return (
            <div className="w-full h-64 md:h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fill: '#64748b' }} />
                        <Radar
                            name="Skills"
                            dataKey="A"
                            stroke="#6366f1"
                            fill="#6366f1"
                            fillOpacity={0.6}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        );
    }

    if (type === 'line') {
        const trendData = data.map(item => ({
            date: new Date(item.evaluation_date).toLocaleDateString(),
            rating: item.overall_rating
        }));

        return (
            <div className="w-full h-64 md:h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis
                            dataKey="date"
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            domain={[0, 10]}
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="rating"
                            stroke="#6366f1"
                            strokeWidth={3}
                            dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        );
    }

    return null;
};

export default SkillChart;
