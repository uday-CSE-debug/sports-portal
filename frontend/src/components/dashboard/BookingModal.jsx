import React from 'react';
import { Trophy, X, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBooking } from '@/hooks/useBooking';

const BookingModal = ({ selectedItem, user, onClose, onSuccess }) => {
    const {
        bookingDate, setBookingDate,
        timeSlot, setTimeSlot,
        skillLevel, setSkillLevel,
        slotStats,
        conflictInfo, setConflictInfo,
        isSubmitting,
        submitBooking
    } = useBooking(user?.token);

    // Initial setup with selected item passed as prop, but the hook manages internal state. 
    // We need to bridge the prop to the hook or modify the hook to accept it.
    // For now, let's assume the Dashboard uses the hook and passes all necessary props down OR 
    // we refactor the hook to accept initial state.
    // Actually, looking at the previous hook design, it manages `selectedItem` itself.
    // To make this component purely presentational or "smart" enough, let's adjust.

    // Better Approach: The parent dashboard manages the "is modal open" state (via selectedItem).
    // This component should just receive the `useBooking` return values or call the hook itself BUT the hook was designed to manage the modal state too.
    // Let's make this component *receive* the hook values from the parent to avoid double-state.

    // Wait, the hook `useBooking` has `selectedItem` in it. 
    // So the parent `StudentDashboard` calls `useBooking`, gets `selectedItem`, and if it's not null, renders this modal.
    // So this modal receiving `selectedItem` as a prop is redundant if we pass the whole hook object, or we just pass the necessary functions.

    return null; // Placeholder, I will write the actual code below based on the parent-child relationship plan.
};

// Re-writing the actual component to accept props from the parent hook execution
const BookingModalContent = ({
    selectedItem,
    bookingDate, setBookingDate,
    timeSlot, setTimeSlot,
    skillLevel, setSkillLevel,
    slotStats,
    conflictInfo, setConflictInfo,
    isSubmitting,
    submitBooking,
    onClose,
    onSuccess
}) => {
    if (!selectedItem) return null;

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const result = await submitBooking();
        if (result?.success) {
            if (onSuccess) onSuccess();
        }
    };

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white w-full max-w-2xl rounded-[32px] md:rounded-[48px] overflow-hidden shadow-2xl animate-in zoom-in-95 fade-in duration-300">
                <div className="h-4 bg-primary"></div>

                <div className="p-6 md:p-14">
                    <div className="flex justify-between items-start mb-8 md:mb-12">
                        <div className="flex items-center space-x-4 md:space-x-6">
                            <div className="bg-primary/10 p-3 md:p-5 rounded-2xl md:rounded-3xl text-primary">
                                <Trophy className="w-6 h-6 md:w-10 md:h-10" />
                            </div>
                            <div>
                                <p className="text-[8px] md:text-[10px] font-black text-primary uppercase tracking-widest mb-1">Confirm Session</p>
                                <h3 className="text-2xl md:text-4xl font-black tracking-tighter">{selectedItem.name}</h3>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors">
                            <X className="w-6 h-6 text-muted" />
                        </button>
                    </div>

                    <form onSubmit={handleFormSubmit} className="space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] block px-2">Play Date</label>
                                <input
                                    type="date"
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-[18px] md:rounded-[24px] px-6 py-4 md:px-8 md:py-5 font-black text-foreground focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all outline-none text-sm md:text-base"
                                    value={bookingDate}
                                    onChange={(e) => setBookingDate(e.target.value)}
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] block px-2">Skill Level</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['Beginner', 'Intermediate', 'Advanced'].map(lvl => (
                                        <button
                                            key={lvl}
                                            type="button"
                                            onClick={() => setSkillLevel(lvl)}
                                            className={cn(
                                                "py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all",
                                                skillLevel === lvl ? "bg-primary text-white border-primary" : "bg-gray-50 text-muted border-gray-100 hover:border-primary/20"
                                            )}
                                        >
                                            {lvl}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {conflictInfo && (
                            <div className="bg-red-50 border border-red-100 rounded-[32px] p-8 space-y-4 animate-in slide-in-from-top-4 duration-300">
                                <div className="flex items-center space-x-3 text-red-600">
                                    <AlertTriangle className="w-6 h-6" />
                                    <p className="font-black uppercase tracking-widest text-xs">Booking Conflict Detected</p>
                                </div>
                                <p className="text-sm font-bold text-red-900/70 leading-relaxed">{conflictInfo.message}</p>

                                {conflictInfo.suggestions && conflictInfo.suggestions.length > 0 && (
                                    <div className="pt-4 border-t border-red-100">
                                        <p className="text-[10px] font-black text-red-900/50 uppercase tracking-widest mb-4">Suggested Alternates</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {conflictInfo.suggestions.map(s => (
                                                <button
                                                    key={s.slot}
                                                    type="button"
                                                    onClick={() => {
                                                        setTimeSlot(s.slot);
                                                        setConflictInfo(null);
                                                    }}
                                                    className="flex items-center justify-between px-6 py-4 bg-white border border-red-100 rounded-2xl hover:border-red-400 transition-all group"
                                                >
                                                    <span className="text-xs font-black text-red-900">{s.slot.split(' ')[0]}</span>
                                                    <span className="text-[10px] font-bold text-red-900/40">{s.available} left</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] block px-2">Timing Slot</label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {['Morning (9-11 AM)', 'Afternoon (2-4 PM)', 'Evening (5-7 PM)'].map(slot => {
                                    const stat = slotStats.find(s => s.slot === slot);
                                    return (
                                        <button
                                            key={slot}
                                            type="button"
                                            onClick={() => {
                                                setTimeSlot(slot);
                                                setConflictInfo(null);
                                            }}
                                            className={cn(
                                                "px-4 py-3 md:px-6 md:py-4 rounded-2xl md:rounded-3xl text-[10px] md:text-xs font-black transition-all border relative overflow-hidden group/slot",
                                                timeSlot === slot ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" : "bg-gray-50 text-muted border-gray-100 hover:bg-gray-100"
                                            )}
                                        >
                                            <span className="relative z-10">{slot.split(' ')[0]}</span>
                                            {stat && (
                                                <>
                                                    <div className={cn(
                                                        "absolute bottom-0 right-0 px-2 py-0.5 text-[8px] font-black uppercase tracking-tighter",
                                                        stat.demand === 'Critical' ? "bg-red-500 text-white" :
                                                            stat.demand === 'High' ? "bg-orange-500 text-white" : "bg-green-500/10 text-green-600"
                                                    )}>
                                                        {stat.demand}
                                                    </div>
                                                    {stat.isRecommended && (
                                                        <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-sm shadow-blue-500/50" title="Recommended" />
                                                    )}
                                                </>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={!bookingDate || !timeSlot || conflictInfo || isSubmitting}
                            className="w-full bg-primary text-white font-black py-4 md:py-6 rounded-[20px] md:rounded-[28px] hover:bg-primary-hover transition-all shadow-xl disabled:opacity-50 flex justify-center items-center text-xs md:text-base uppercase tracking-widest"
                        >
                            {isSubmitting ? 'Confirming...' : 'Complete Reservation'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BookingModalContent;
