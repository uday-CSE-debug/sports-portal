'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useEquipment } from '@/hooks/useEquipment';
import { useBooking } from '@/hooks/useBooking';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, PartyPopper, X } from 'lucide-react';

// UI Components
import DashboardHero from './dashboard/DashboardHero';
import EquipmentGrid from './dashboard/EquipmentGrid';
import BookingModalContent from './dashboard/BookingModal';

const StudentDashboard = () => {
    const { user } = useAuth();
    const [showSuccess, setShowSuccess] = useState(false);

    // Custom Hooks
    const {
        filteredEquipment,
        loading: equipmentLoading,
        searchTerm,
        setSearchTerm,
        categoryFilter,
        setCategoryFilter,
        refreshEquipment
    } = useEquipment(user?.token);

    const booking = useBooking(user?.token);
    const {
        selectedItem,
        setSelectedItem,
        closeBookingModal
    } = booking;

    const handleBookingSuccess = () => {
        refreshEquipment();
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 5000);
    };

    if (equipmentLoading) return (
        <div className="min-h-screen flex items-center justify-center relative">
            <div className="absolute inset-0 bg-blue-50/10 backdrop-blur-3xl -z-10"></div>
            <div className="flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
                <p className="font-black text-primary uppercase tracking-widest text-sm animate-pulse">Loading Arena...</p>
            </div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-24 md:py-32">
            {/* Success Pop-up */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                        className="fixed bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-[2000] w-full max-w-sm md:max-w-md px-4"
                    >
                        <div className="bg-white rounded-[24px] md:rounded-[32px] shadow-premium border border-primary/20 p-4 md:p-6 flex items-center space-x-4 md:space-x-6 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent"></div>
                            <div className="bg-primary/10 p-3 md:p-4 rounded-xl md:rounded-2xl relative z-10">
                                <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-primary animate-bounce" />
                            </div>
                            <div className="relative z-10 flex-1">
                                <div className="flex items-center space-x-2">
                                    <h4 className="text-sm md:text-base font-black text-foreground tracking-tight">Booking Confirmed!</h4>
                                    <PartyPopper className="w-3 h-3 md:w-4 md:h-4 text-secondary" />
                                </div>
                                <p className="text-[9px] md:text-xs font-bold text-muted uppercase tracking-widest mt-0.5 md:mt-1">Check your mail for details</p>
                            </div>
                            <button
                                onClick={() => setShowSuccess(false)}
                                className="absolute top-4 right-4 text-slate-300 hover:text-slate-600 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hero Section */}
            <DashboardHero
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />

            {/* Equipment Grid Section */}
            <div className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-center md:text-left">Sports Inventory</h2>
                <div className="flex justify-center md:justify-end space-x-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                    {['All', 'Sports'].map(filter => (
                        <button
                            key={filter}
                            onClick={() => setCategoryFilter(filter)}
                            className={`px-6 py-2 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${categoryFilter === filter
                                ? 'bg-primary text-white border-primary shadow-lg'
                                : 'bg-white text-muted border-gray-100 hover:border-primary/50'
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            <EquipmentGrid
                equipment={filteredEquipment}
                onReserve={setSelectedItem}
            />

            {/* Booking Modal */}
            {selectedItem && (
                <BookingModalContent
                    {...booking}
                    onClose={closeBookingModal}
                    onSuccess={handleBookingSuccess}
                />
            )}
        </div>
    );
};

export default StudentDashboard;
