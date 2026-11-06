import { cn } from '@/lib/utils';
import React from 'react';

const Badge = ({ className, variant = 'default', children, ...props }) => {
    const variants = {
        default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
        // Custom variants
        soft: 'bg-primary/10 text-primary border-primary/10',
        chip: 'bg-gray-50 text-muted border-gray-100 uppercase tracking-widest text-[10px] font-black'
    };

    return (
        <div className={cn(
            'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
            variants[variant],
            className
        )} {...props}>
            {children}
        </div>
    );
};

export { Badge };
