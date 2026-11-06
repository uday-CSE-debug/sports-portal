'use client';

import { useAuth } from '@/context/AuthContext';
import { User as UserIcon, Shield, Mail, Hash, ChevronLeft, MapPin, Calendar, Trophy, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const Profile = () => {
    const { user, loading, updateProfile } = useAuth();
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
        if (user) {
            setEditedData({
                full_name: user.full_name,
                email: user.email,
                sports_interests: user.sports_interests || ''
            });
        }
    }, [user, loading, router]);

    const handleSave = async () => {
        setIsSaving(true);
        setMessage({ type: '', text: '' });
        try {
            await updateProfile(editedData);
            setIsEditing(false);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile.' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setEditedData({
            full_name: user.full_name,
            email: user.email,
            sports_interests: user.sports_interests || ''
        });
        setIsEditing(false);
        setMessage({ type: '', text: '' });
    };

    if (loading || !user) return null;

    // Local state for animation/interactions (optional)
    const sportsInterests = user.sports_interests?.split(',') || ['Cricket', 'Football', 'eSports'];

    return (
        <div className="max-w-5xl mx-auto px-4 py-24 md:py-40">
            {/* Breadcrumb */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-12 flex justify-between items-center"
            >
                <Link href="/" className="inline-flex items-center text-xs font-black text-primary uppercase tracking-[0.3em] hover:text-secondary transition-colors group">
                    <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Arena
                </Link>

                <AnimatePresence>
                    {message.text && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className={cn(
                                "text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl",
                                message.type === 'success' ? "bg-green-50 text-green-500" : "bg-rose-50 text-rose-500"
                            )}
                        >
                            {message.text}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            <div className="relative">
                {/* Background Glows */}
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="glass rounded-[32px] md:rounded-[48px] shadow-premium overflow-hidden border-white/40 relative z-10"
                >
                    {/* Premium Header Banner */}
                    <div className="relative h-40 md:h-72 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary via-indigo-600 to-secondary opacity-90"></div>

                        {/* Abstract Background Shapes */}
                        <div className="absolute top-10 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
                        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-black/10 rounded-full blur-3xl" />

                        <div className="absolute inset-0 bg-black/5"></div>

                        {/* Avatar Section */}
                        <div className="absolute -bottom-20 left-10 md:left-16">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="p-3 bg-white rounded-[44px] shadow-2xl relative group"
                            >
                                <div className="bg-slate-50 rounded-[28px] md:rounded-[36px] w-28 h-28 md:w-44 md:h-44 flex items-center justify-center border-4 border-white overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent"></div>
                                    <UserIcon className="w-12 h-12 md:w-24 md:h-24 text-primary group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                {/* Online Badge */}
                                <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 w-6 h-6 md:w-8 md:h-8 bg-success border-4 border-white rounded-full shadow-lg"></div>
                            </motion.div>
                        </div>
                    </div>

                    <div className="pt-20 md:pt-28 pb-10 md:pb-14 px-6 md:px-16">
                        {/* Main Header Info */}
                        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
                            <div className="flex-1">
                                {isEditing ? (
                                    <div className="space-y-4 max-w-xl">
                                        <input
                                            type="text"
                                            value={editedData.full_name}
                                            onChange={(e) => setEditedData({ ...editedData, full_name: e.target.value })}
                                            className="text-3xl md:text-5xl font-black text-foreground tracking-tighter leading-none bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl px-4 py-2 w-full focus:outline-none focus:ring-4 focus:ring-primary/5"
                                            placeholder="Full Name"
                                        />
                                    </div>
                                ) : (
                                    <motion.h1
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="text-4xl md:text-6xl font-black text-foreground tracking-tighter leading-none mb-4"
                                    >
                                        {user.full_name}
                                    </motion.h1>
                                )}
                                <div className="flex flex-wrap gap-3 mt-4">
                                    <span className="bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.2em] px-5 py-2.5 rounded-2xl border border-primary/10">
                                        {user.role} Status
                                    </span>
                                    <span className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] px-5 py-2.5 rounded-2xl border border-slate-100 flex items-center">
                                        <MapPin className="w-3.5 h-3.5 mr-2" /> Vignan Campus
                                    </span>
                                </div>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 }}
                                className="flex gap-4"
                            >
                                {isEditing ? (
                                    <>
                                        <button
                                            onClick={handleSave}
                                            disabled={isSaving}
                                            className="px-8 py-4 bg-primary text-white font-black rounded-2xl hover:bg-primary-hover hover:translate-y-[-2px] hover:shadow-glow transition-all active:scale-95 text-xs uppercase tracking-widest disabled:opacity-50"
                                        >
                                            {isSaving ? 'Saving...' : 'Save Changes'}
                                        </button>
                                        <button
                                            onClick={handleCancel}
                                            className="px-8 py-4 bg-slate-50 text-slate-400 font-bold rounded-2xl hover:bg-white hover:text-foreground transition-all text-xs uppercase tracking-widest border border-slate-100"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="px-8 py-4 bg-primary text-white font-black rounded-2xl hover:bg-primary-hover hover:translate-y-[-2px] hover:shadow-glow transition-all active:scale-95 text-xs uppercase tracking-widest"
                                        >
                                            Edit Account
                                        </button>
                                        <button className="p-4 bg-slate-50 text-slate-400 border border-slate-100 rounded-2xl hover:bg-white hover:text-primary hover:border-primary/20 transition-all">
                                            <Shield className="w-5 h-5" />
                                        </button>
                                    </>
                                )}
                            </motion.div>
                        </div>

                        {/* Bento-style Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                            {/* Primary Details Card */}
                            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="p-6 md:p-8 rounded-[32px] md:rounded-[40px] bg-slate-50/50 border border-slate-100/50 group transition-all duration-300 shadow-sm hover:shadow-xl">
                                    <div className="p-3 md:p-4 rounded-xl md:rounded-2xl w-fit mb-4 md:mb-6 bg-blue-500/10 text-blue-500">
                                        <Hash className="w-5 h-5 md:w-6 md:h-6" />
                                    </div>
                                    <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 md:mb-2">Roll Number / ID</p>
                                    <p className="text-base md:text-lg font-black text-foreground tracking-tight break-all opacity-50">{user.roll_no}</p>
                                </div>

                                <div className="p-6 md:p-8 rounded-[32px] md:rounded-[40px] bg-slate-50/50 border border-slate-100/50 group transition-all duration-300 shadow-sm hover:shadow-xl">
                                    <div className="p-3 md:p-4 rounded-xl md:rounded-2xl w-fit mb-4 md:mb-6 bg-indigo-500/10 text-indigo-500">
                                        <Mail className="w-5 h-5 md:w-6 md:h-6" />
                                    </div>
                                    <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 md:mb-2">Campus Email</p>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            value={editedData.email}
                                            onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                                            className="text-base md:text-lg font-black text-foreground tracking-tight bg-white border border-slate-100 rounded-lg md:rounded-xl px-3 py-1 w-full focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                    ) : (
                                        <p className="text-base md:text-lg font-black text-foreground tracking-tight break-all">{user.email}</p>
                                    )}
                                </div>

                                <DetailCard
                                    icon={Shield}
                                    label="Access Level"
                                    value={`${user.role} Verified`}
                                    color="rose"
                                />
                                <DetailCard
                                    icon={Calendar}
                                    label="Member Since"
                                    value="January 2026"
                                    color="amber"
                                />
                            </div>

                            {/* Sports Interests Sidebar Card */}
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="bg-slate-50/50 p-8 rounded-[40px] border border-slate-100/50 flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center space-x-3 mb-6">
                                        <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center">
                                            <Trophy className="w-5 h-5 text-secondary" />
                                        </div>
                                        <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Sports Interests</h3>
                                    </div>

                                    {isEditing ? (
                                        <textarea
                                            value={editedData.sports_interests}
                                            onChange={(e) => setEditedData({ ...editedData, sports_interests: e.target.value })}
                                            className="text-[10px] font-bold text-slate-600 bg-white border border-slate-100 rounded-xl p-3 w-full h-24 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            placeholder="Cricket, Football, eSports (Comma separated)"
                                        />
                                    ) : (
                                        <div className="flex flex-wrap gap-2">
                                            {sportsInterests.map((sport, i) => (
                                                <span key={i} className="px-4 py-2 bg-white rounded-xl text-[10px] font-bold text-slate-600 border border-slate-100 shadow-sm">
                                                    {sport}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {!isEditing && (
                                    <Link href="/register" className="mt-8 text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:underline flex items-center">
                                        Update Preferences <ChevronRight className="w-3 h-3 ml-1" />
                                    </Link>
                                )}
                            </motion.div>
                        </div>

                        {/* Recent Activity Mini-Section */}
                        <div className="border-t border-slate-100 pt-12">
                            <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.3em] mb-8 text-center">Recent Arena Activity</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <ActivityRow label="Cricket Kit Booking" date="2 Hours Ago" status="Completed" />
                                <ActivityRow label="Football Scrims" date="Yesterday" status="Pending" />
                                <ActivityRow label="Badminton Court" date="2 Days Ago" status="Completed" />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="mt-16 text-center">
                <p className="text-slate-300 text-[10px] font-black uppercase tracking-[0.4em] mb-4">
                    Data Managed by Vignan Sports Network
                </p>
                <div className="w-12 h-1 bg-slate-100 mx-auto rounded-full"></div>
            </div>
        </div>
    );
};

const DetailCard = ({ icon: Icon, label, value, color }) => {
    const colorMap = {
        blue: "text-blue-500 bg-blue-500/10",
        indigo: "text-indigo-500 bg-indigo-500/10",
        rose: "text-rose-500 bg-rose-500/10",
        amber: "text-amber-500 bg-amber-500/10"
    };

    return (
        <motion.div
            whileHover={{ y: -5, backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
            className="p-6 md:p-8 rounded-[32px] md:rounded-[40px] bg-slate-50/50 border border-slate-100/50 group transition-all duration-300 shadow-sm hover:shadow-xl"
        >
            <div className={cn("p-3 md:p-4 rounded-xl md:rounded-2xl w-fit mb-4 md:mb-6 transition-all group-hover:scale-110", colorMap[color])}>
                <Icon className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 md:mb-2">{label}</p>
            <p className="text-base md:text-lg font-black text-foreground tracking-tight break-all">{value}</p>
        </motion.div>
    );
};

const ActivityRow = ({ label, date, status }) => (
    <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-50/30 border border-slate-50 hover:bg-white hover:border-slate-100 transition-all group">
        <div className="flex items-center space-x-4">
            <div className="w-1.5 h-8 bg-slate-200 group-hover:bg-primary transition-colors rounded-full" />
            <div>
                <p className="text-[11px] font-black text-foreground tracking-tight mb-0.5">{label}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{date}</p>
            </div>
        </div>
        <span className={cn(
            "text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md",
            status === 'Completed' ? "bg-green-50 text-green-500" : "bg-amber-50 text-amber-500"
        )}>
            {status}
        </span>
    </div>
);

export default Profile;
