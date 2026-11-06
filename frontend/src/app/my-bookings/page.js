'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, Clock, Package, AlertCircle, ChevronLeft, ArrowRight, CheckCircle2, RotateCcw, X, QrCode } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const QRModal = ({ booking, onClose }) => {
    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>
            <div className="relative bg-white w-full max-w-sm rounded-[48px] overflow-hidden shadow-2xl p-10 text-center animate-in zoom-in-95 duration-300">
                <button onClick={onClose} className="absolute top-8 right-8 p-3 bg-gray-50 rounded-2xl">
                    <X className="w-5 h-5 text-muted" />
                </button>

                <div className="mb-8 flex justify-center">
                    <div className="bg-primary/10 p-4 rounded-3xl">
                        <QrCode className="w-10 h-10 text-primary" />
                    </div>
                </div>

                <h3 className="text-2xl font-black tracking-tight mb-2">Gate Pass Verification</h3>
                <p className="text-xs font-bold text-muted uppercase tracking-widest mb-8">Scan at Warehouse Counter</p>

                <div className="bg-gray-50 p-8 rounded-[32px] border-2 border-dashed border-gray-200 mb-8 aspect-square flex items-center justify-center relative group">
                    <QrCode className="w-40 h-40 text-gray-900" strokeWidth={1} />
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary">ID: {booking.id.toString().padStart(6, '0')}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 text-left">
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Equipment</p>
                        <p className="font-black text-foreground">{booking.Equipment?.name}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MyBookings = () => {
    const { user, loading: authLoading } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedQR, setSelectedQR] = useState(null);

    useEffect(() => {
        if (!authLoading && user) {
            fetchMyBookings();
        }
    }, [user, authLoading]);

    const fetchMyBookings = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };
            const { data } = await axios.get('/api/bookings/my', config);
            setBookings(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };
            await axios.put(`/api/bookings/${id}/status`, { status: 'cancelled' }, config);
            fetchMyBookings();
        } catch (err) {
            alert('Failed to cancel booking');
        }
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-400/10 text-yellow-600 border-yellow-400/20';
            case 'issued': return 'bg-blue-400/10 text-blue-600 border-blue-400/20';
            case 'returned': return 'bg-green-400/10 text-green-600 border-green-400/20';
            case 'cancelled': return 'bg-red-400/10 text-red-600 border-red-400/20';
            default: return 'bg-gray-400/10 text-gray-600 border-gray-400/20';
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center relative">
            <div className="absolute inset-0 bg-blue-50/10 backdrop-blur-3xl -z-10"></div>
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-32 md:py-40">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
                <div>
                    <Link href="/" className="inline-flex items-center text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-6 hover:translate-x-[-4px] transition-transform">
                        <ChevronLeft className="w-4 h-4 mr-2" /> Back to Store
                    </Link>
                    <h1 className="text-6xl md:text-8xl font-black text-foreground tracking-tighter leading-[0.85]">
                        Session <br /><span className="text-primary italic">History.</span>
                    </h1>
                </div>
                <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex items-center space-x-6 min-w-[240px]">
                    <div className="bg-primary/10 p-4 rounded-3xl text-primary text-2xl font-black">
                        {bookings.length.toString().padStart(2, '0')}
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-muted uppercase tracking-widest">Active & Past</p>
                        <p className="text-lg font-black text-foreground">Reservations</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {bookings.map((booking) => (
                    <div key={booking.id} className="bg-white rounded-[48px] p-10 border border-gray-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                        <div className="flex flex-col h-full">
                            <div className="flex justify-between items-start mb-12">
                                <div className="flex items-center space-x-6">
                                    <div className="bg-gray-50 p-5 rounded-3xl group-hover:bg-primary/5 transition-colors">
                                        <Package className="w-10 h-10 text-foreground group-hover:text-primary transition-colors" />
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-black tracking-tight mb-2">{booking.Equipment?.name}</h3>
                                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyles(booking.status)}`}>
                                            {booking.status}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-1">Pass ID</p>
                                    <p className="font-black text-foreground">#{booking.id.toString().padStart(4, '0')}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8 mb-12">
                                <div className="bg-gray-50/50 p-6 rounded-[32px] border border-gray-100">
                                    <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-2 flex items-center">
                                        <Calendar className="w-3 h-3 mr-2" /> Booking Date
                                    </p>
                                    <p className="text-lg font-black text-foreground">{booking.booking_date}</p>
                                </div>
                                <div className="bg-gray-50/50 p-6 rounded-[32px] border border-gray-100">
                                    <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-2 flex items-center">
                                        <Clock className="w-3 h-3 mr-2" /> Time Slot
                                    </p>
                                    <p className="text-lg font-black text-foreground truncate">{booking.time_slot}</p>
                                </div>
                            </div>

                            <div className="mt-auto pt-6 flex flex-col sm:flex-row gap-4">
                                {(booking.status === 'pending' || booking.status === 'issued') && (
                                    <button
                                        onClick={() => setSelectedQR(booking)}
                                        className="flex-1 bg-gray-900 text-white py-5 rounded-[28px] font-black uppercase tracking-widest hover:bg-primary transition-all flex items-center justify-center shadow-lg"
                                    >
                                        <QrCode className="w-5 h-5 mr-3" />
                                        Scan for Pickup
                                    </button>
                                )}

                                {booking.status === 'pending' && (
                                    <button
                                        onClick={() => handleCancel(booking.id)}
                                        className="sm:w-20 bg-gray-50 text-muted py-5 rounded-[28px] font-black hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center border border-gray-100"
                                        title="Cancel Request"
                                    >
                                        <RotateCcw className="w-5 h-5" />
                                    </button>
                                )}

                                {booking.status === 'returned' && (
                                    <div className="w-full bg-green-500/5 text-green-600 py-6 rounded-[28px] font-black uppercase tracking-widest text-center flex items-center justify-center">
                                        <CheckCircle2 className="w-5 h-5 mr-3" /> Returned
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {selectedQR && <QRModal booking={selectedQR} onClose={() => setSelectedQR(null)} />}
        </div>
    );
};

export default MyBookings;
