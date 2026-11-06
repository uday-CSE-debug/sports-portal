import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import React from 'react';

/**
 * @typedef {'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'accent'} ButtonVariant
 * @typedef {'default' | 'sm' | 'lg' | 'icon'} ButtonSize
 */

/**
 * @param {Object} props
 * @param {ButtonVariant} [props.variant='default']
 * @param {ButtonSize} [props.size='default']
 * @param {boolean} [props.isLoading=false]
 * @param {string} [props.className]
 * @param {React.ReactNode} props.children
 * @param {React.ButtonHTMLAttributes<HTMLButtonElement>} props
 */
const Button = React.forwardRef(({ className, variant = 'default', size = 'default', isLoading = false, children, ...props }, ref) => {
    const variants = {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        accent: 'bg-primary text-white hover:bg-primary-hover shadow-xl' // Custom matching current design
    };

    const sizes = {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-14 rounded-[24px] px-8 text-lg font-black uppercase tracking-widest', // Custom matched
        icon: 'h-10 w-10 p-2',
    };

    return (
        <button
            className={cn(
                'inline-flex items-center justify-center rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transition-all active:scale-95',
                variants[variant],
                sizes[size],
                className
            )}
            ref={ref}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {children}
        </button>
    );
});

Button.displayName = 'Button';

export { Button };
