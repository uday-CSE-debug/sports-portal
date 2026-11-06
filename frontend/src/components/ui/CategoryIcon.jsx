import React from 'react';
import {
    Trophy, Activity, Swords, Target, CircleDot,
    Gamepad2, Compass, Package, Wind, Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const CategoryIcon = ({ category, className }) => {
    switch (category?.toLowerCase()) {
        case 'cricket': return <Trophy className={className} />;
        case 'football': return <Activity className={className} />;
        case 'badminton': return <Swords className={className} />;
        case 'chess': return <Target className={className} />; // Placeholder until icon/image is ready
        case 'carrom': return <CircleDot className={className} />;
        case 'table tennis': return <CircleDot className={className} />;
        case 'volleyball': return <Wind className={className} />;
        case 'kabaddi': return <Zap className={className} />;
        case 'indoor': return <Gamepad2 className={className} />;
        case 'outdoor': return <Compass className={className} />;
        case 'esports': return <Gamepad2 className={className} />;
        case 'pubg': return <img src="/game-icons/pubg.png" className={cn(className, "object-contain")} alt="PUBG" />;
        case 'ff': return <img src="/game-icons/freefire.png" className={cn(className, "object-contain")} alt="Free Fire" />;
        case 'cod': return <img src="/game-icons/cod.png" className={cn(className, "object-contain")} alt="COD" />;
        default: return <Package className={className} />;
    }
};
