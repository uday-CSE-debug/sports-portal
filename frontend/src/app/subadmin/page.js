'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Trophy, Dribbble, Gamepad2, Compass, Package, RefreshCcw, ClipboardList, User, Calendar, ArrowRightLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const CategoryIcon = ({ category, className }) => {
    switch (category?.toLowerCase()) {
        case 'cricket': return <Trophy className={className} />;
        case 'football': return <Dribbble className={className} />;
        case 'indoor': return <Gamepad2 className={className} />;
        case 'outdoor': return <Compass className={className} />;
        case 'esports': return <Gamepad2 className={className} />;
        case 'pubg': return <img src="/game-icons/pubg.png" className={cn(className, "object-contain")} alt="PUBG" />;
        case 'ff': return <img src="/game-icons/freefire.png" className={cn(className, "object-contain")} alt="Free Fire" />;
        case 'cod': return <img src="/game-icons/cod.png" className={cn(className, "object-contain")} alt="COD" />;
        default: return <Package className={className} />;
    }
};

const SubAdminDashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && (!user || user.role !== 'sub_admin')) {
            router.push('/login');
            return;
        }
        if (user) fetchBookings();
    }, [user, loading, router]);

    const fetchBookings = async () => {
        if (!user?.token) return;
        setIsLoading(true);
        try {
            const { data } = await axios.get('/api/bookings', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setBookings(data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        if (!user?.token) return;
        try {
            await axios.put(`/api/bookings/${id}/status`, { status }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            fetchBookings();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    if (loading || !user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
            {/* Header Section */}
            <div className="mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter mb-2">
                    Staff <span className="text-secondary italic">Dashboard</span>
                </h1>
                <p className="text-foreground/50 font-medium">Manage equipment issue and return protocols.</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {[
                    { label: "Pending Issue", val: bookings.filter(b => b.status === 'pending').length, color: "text-accent", bg: "bg-accent/10" },
                    { label: "Issued Items", val: bookings.filter(b => b.status === 'issued').length, color: "text-primary", bg: "bg-primary/10" },
                    { label: "Returned Items", val: bookings.filter(b => b.status === 'returned').length, color: "text-success", bg: "bg-success/10" },
                    { label: "Total Handled", val: bookings.length, color: "text-foreground/40", bg: "bg-foreground/5" }
                ].map((stat, idx) => (
                    stat && (
                        <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="text-xs font-black text-foreground/30 uppercase tracking-[0.2em] mb-2">{stat.label}</div>
                            <div className={cn("text-3xl font-black tracking-tighter", stat.color)}>{stat.val}</div>
                        </div>
                    )
                ))}
            </div>

            {/* Bookings Queue */}
            <div className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm">
                <div className="p-8 md:p-10 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center">
                            <ClipboardList className="w-6 h-6 text-secondary" />
                        </div>
                        <h3 className="text-2xl font-black tracking-tight">Booking Queue</h3>
                    </div>
                    <button onClick={fetchBookings} className="p-3 bg-white hover:bg-gray-50 rounded-2xl border border-gray-100 transition-all">
                        <RefreshCcw className={cn("w-5 h-5 text-gray-400", isLoading && "animate-spin")} />
                    </button>
                </div>

                <div className="p-4 md:p-8">
                    <div className="space-y-6">
                        <AnimatePresence mode='popLayout'>
                            {bookings.map((booking) => (
                                <motion.div
                                    key={booking.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="relative glass rounded-[32px] p-6 md:p-8 hover:border-secondary/30 transition-all group"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between space-y-6 md:space-y-0 text-foreground">
                                        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-8">
                                            {/* Equipment Info */}
                                            <div className="flex items-center space-x-4 min-w-[200px]">
                                                <div className="w-14 h-14 rounded-2xl bg-foreground/5 flex items-center justify-center group-hover:bg-secondary/10 transition-colors">
                                                    <CategoryIcon category={booking.Equipment?.category} className="w-7 h-7 text-foreground/40 group-hover:text-secondary" />
                                                </div>
                                                <div>
                                                    <span className="text-xs font-black text-secondary uppercase tracking-widest block mb-1">Equipment</span>
                                                    <span className="text-xl font-bold text-foreground leading-none">{booking.Equipment?.name}</span>
                                                </div>
                                            </div>

                                            {/* Student Info */}
                                            <div className="flex items-center space-x-4 min-w-[180px]">
                                                <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center text-foreground/40">
                                                    <User className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-black text-foreground/30 uppercase tracking-widest block mb-0.5">Student ID</span>
                                                    <span className="font-bold text-foreground/80">{booking.user_id}</span>
                                                </div>
                                            </div>

                                            {/* Schedule */}
                                            <div className="flex items-center space-x-4">
                                                <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center text-foreground/40">
                                                    <Calendar className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-black text-foreground/30 uppercase tracking-widest block mb-0.5">Schedule</span>
                                                    <span className="font-bold text-foreground/80">{booking.booking_date} · {booking.time_slot}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center space-x-4">
                                            <span className={cn(
                                                "px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl border",
                                                booking.status === 'pending' ? 'bg-accent/10 text-accent border-accent/20' :
                                                    booking.status === 'issued' ? 'bg-primary/10 text-primary border-primary/20' :
                                                        'bg-success/10 text-success border-success/20'
                                            )}>
                                                {booking.status}
                                            </span>

                                            {booking.status === 'pending' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(booking.id, 'issued')}
                                                    className="bg-primary text-white px-6 py-3 rounded-2xl font-black text-sm shadow-premium shadow-glow hover:bg-primary-hover transition-all flex items-center space-x-2"
                                                >
                                                    <span>Issue Now</span>
                                                    <ArrowRightLeft className="w-4 h-4" />
                                                </button>
                                            )}
                                            {booking.status === 'issued' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(booking.id, 'returned')}
                                                    className="bg-success text-white px-6 py-3 rounded-2xl font-black text-sm shadow-premium shadow-success/20 hover:opacity-90 transition-all flex items-center space-x-2"
                                                >
                                                    <span>Mark Returned</span>
                                                    <CheckCircle2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {bookings.length === 0 && !isLoading && (
                            <div className="py-20 text-center rounded-[32px] border-2 border-dashed border-foreground/5">
                                <AlertCircle className="w-16 h-16 text-foreground/10 mx-auto mb-4" />
                                <h4 className="text-xl font-bold text-foreground/40">No Duty Calls Found</h4>
                                <p className="text-foreground/30">The queue is currently empty.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubAdminDashboard;
