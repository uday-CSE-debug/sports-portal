'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LogOut, Trophy, Menu, X, User as UserIcon, Calendar, History, Home as HomeIcon, Gamepad2, Clock, Target, Users, Radar as RadarIcon, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const authPages = ['/login', '/register', '/staff-login', '/forgot-password'];
    if (authPages.includes(pathname)) return null;

    const isActive = (path) => pathname === path;

    const navLinks = user ? [
        {
            name: 'Dashboard',
            href: user.role === 'admin' ? '/admin' :
                (user.role === 'sub_admin' ? '/subadmin' :
                    (user.role === 'coach' ? '/coach' : '/student')),
            icon: HomeIcon,
            show: true
        },
        { name: 'eSports', href: '/esports', icon: Gamepad2, show: true },
        { name: 'My Bookings', href: '/my-bookings', icon: History, show: user.role === 'student' },
        { name: 'My Stats', href: '/student/stats', icon: Trophy, show: user.role === 'student' },
        { name: 'My Matches', href: '/my-matches', icon: Target, show: user.role === 'student' },
        { name: 'Manage Matches', href: '/subadmin/matches', icon: Trophy, show: user.role === 'sub_admin' },
        { name: 'Player Eval', href: '/coach/evaluations', icon: RadarIcon, show: user.role === 'coach' || user.role === 'admin' },
        { name: 'Team Balance', href: '/admin/team-balance', icon: Users, show: user.role === 'admin' || user.role === 'coach' },
        { name: 'Team Hub', href: '/coach/teams', icon: Users, show: user.role === 'coach' },
        { name: 'Profile', href: '/profile', icon: UserIcon, show: true },
    ] : [
        { name: 'Home', href: '/', icon: HomeIcon, show: true },
        { name: 'Login', href: '/login', icon: UserIcon, show: true },
        { name: 'Register', href: '/register', icon: Users, show: true },
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled ? 'py-1' : 'py-3'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`bg-white border-b border-gray-100 shadow-sm transition-all duration-500 rounded-2xl ${scrolled ? 'px-4' : 'px-6'}`}>
                    <div className="flex justify-between h-16 items-center">
                        {/* Logo */}
                        <Link href="/" className="flex items-center group">
                            <img
                                src="/logo.png"
                                alt="Vignan Logo"
                                className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
                            />
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
                            {navLinks.filter(link => link.show).map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`relative px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-200 group flex items-center space-x-2 ${isActive(link.href)
                                        ? 'text-primary bg-primary/5'
                                        : 'text-muted hover:text-primary hover:bg-primary/5'
                                        }`}
                                >
                                    <link.icon className={`h-4 w-4 ${isActive(link.href) ? 'text-primary' : 'text-muted'}`} />
                                    <span>{link.name}</span>
                                </Link>
                            ))}

                            {user && (
                                <>
                                    <div className="flex items-center space-x-2 px-4 py-2 bg-primary/5 rounded-xl border border-primary/10">
                                        <Clock className="h-4 w-4 text-primary" />
                                        <span className="text-[10px] font-black text-primary tracking-widest tabular-nums">
                                            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                        </span>
                                    </div>
                                    <div className="h-6 w-px bg-gray-100 mx-3"></div>
                                    <button
                                        onClick={logout}
                                        className="flex items-center space-x-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all duration-200"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        <span>Logout</span>
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="p-2 rounded-xl text-muted hover:text-primary hover:bg-primary/5 transition-all"
                            >
                                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Dropdown */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden absolute top-full left-4 right-4 mt-2 z-[110]"
                    >
                        <div className="bg-white/90 backdrop-blur-2xl border border-gray-100 rounded-[24px] shadow-2xl p-4 space-y-1">
                            {navLinks.filter(link => link.show).map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`flex items-center justify-between px-4 py-4 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${isActive(link.href)
                                        ? 'bg-primary text-white shadow-glow'
                                        : 'text-muted hover:bg-primary/5 hover:text-primary'
                                        }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <link.icon className={`h-5 w-5 ${isActive(link.href) ? 'text-white' : 'text-muted group-hover:text-primary'}`} />
                                        <span>{link.name}</span>
                                    </div>
                                    <ChevronRight className={`h-4 w-4 opacity-50 ${isActive(link.href) ? 'text-white' : 'text-muted'}`} />
                                </Link>
                            ))}
                            {user && (
                                <div className="px-4 py-4 mb-2 bg-primary/5 rounded-xl border border-primary/10 flex items-center justify-between">
                                    <div className="flex items-center space-x-3 text-primary">
                                        <Clock className="h-5 w-5" />
                                        <span className="text-sm font-black tracking-widest uppercase">System Time</span>
                                    </div>
                                    <span className="text-sm font-black text-primary tabular-nums">
                                        {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                    </span>
                                </div>
                            )}
                            {user && (
                                <div className="pt-2 mt-2 border-t border-gray-100">
                                    <button
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            logout();
                                        }}
                                        className="flex items-center justify-between w-full px-4 py-4 rounded-xl text-sm font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <LogOut className="h-5 w-5" />
                                            <span>Logout</span>
                                        </div>
                                        <ChevronRight className="h-4 w-4 opacity-30" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
