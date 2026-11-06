'use client';

import React from 'react';
import { motion } from 'framer-motion';

const Heatmap = ({ data }) => {
    // data.hourly is expected to be [count0, count1, ... count23]
    const maxVal = Math.max(...(data?.hourly || [0]), 1);

    const getIntensity = (val) => {
        const percent = val / maxVal;
        if (percent === 0) return 'bg-gray-100';
        if (percent < 0.25) return 'bg-indigo-100';
        if (percent < 0.5) return 'bg-indigo-300';
        if (percent < 0.75) return 'bg-indigo-500';
        return 'bg-indigo-700';
    };

    return (
        <div className="w-full">
            <div className="grid grid-cols-12 gap-2 mb-2">
                {/* 12 columns for 24 hours (2 hours per block visually or 2 rows) */}
                {/* Let's do 24 blocks in a single row for wide screens, or grid for smaller */}

                {data?.hourly?.map((val, hour) => (
                    <motion.div
                        key={hour}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: hour * 0.02 }}
                        className="col-span-1 flex flex-col items-center group cursor-pointer"
                    >
                        <div
                            className={`w-full h-16 rounded-lg ${getIntensity(val)} transition-all group-hover:opacity-80 relative`}
                        >
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none whitespace-nowrap">
                                {hour}:00 - {val} Bookings
                            </div>
                        </div>
                        <span className="text-[10px] text-gray-400 mt-2 font-mono">{hour}</span>
                    </motion.div>
                ))}
            </div>

            <div className="flex justify-between items-center mt-6 p-4 bg-gray-50 rounded-xl">
                <span className="text-secondary text-xs font-bold uppercase tracking-widest">Usage Intensity</span>
                <div className="flex gap-2">
                    <div className="w-4 h-4 rounded bg-gray-100"></div>
                    <div className="w-4 h-4 rounded bg-indigo-100"></div>
                    <div className="w-4 h-4 rounded bg-indigo-300"></div>
                    <div className="w-4 h-4 rounded bg-indigo-500"></div>
                    <div className="w-4 h-4 rounded bg-indigo-700"></div>
                </div>
            </div>
        </div>
    );
};

export default Heatmap;
