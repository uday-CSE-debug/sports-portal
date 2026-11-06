'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UserPlus, ChevronRight, Hash, Lock, Mail, User, AlertCircle, BookOpen, Calendar, ArrowLeft, CheckCircle, Sparkles, Trophy, Activity, Dribbble, Target, Wind, Gamepad2, Swords, CircleDot, Zap, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const InputField = ({ icon: Icon, name, type = "text", placeholder, value, onChange, required = true }) => (
    <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-foreground/20 group-focus-within:text-secondary transition-colors">
            <Icon className="h-5 w-5" />
        </div>
        <input
            name={name}
            type={type}
            required={required}
            className="block w-full pl-12 pr-5 py-5 bg-foreground/[0.03] border border-foreground/5 rounded-2xl text-foreground placeholder-foreground/20 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all font-semibold"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
        />
    </div>
);

const Register = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        role: 'student',
        roll_no: '',
        email: '',
        password: '',
        full_name: '',
        department: '',
        year: '',
        sports_interests: []
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const { register } = useAuth();
    const router = useRouter();

    const sportsList = [
        { id: 'cricket', name: 'Cricket', icon: Trophy },
        { id: 'football', name: 'Football', icon: Activity },
        { id: 'basketball', name: 'Basketball', icon: Dribbble },
        { id: 'volleyball', name: 'Volleyball', icon: Wind },
        { id: 'badminton', name: 'Badminton', icon: Swords },
        { id: 'tt', name: 'Table Tennis', icon: CircleDot },
        { id: 'kabaddi', name: 'Kabaddi', icon: Zap },
        { id: 'chess', name: 'Chess', icon: Target },
        { id: 'athletics', name: 'Athletics', icon: Wind },
        { id: 'indoor', name: 'Indoor Games', icon: Gamepad2 },
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const toggleSport = (sportId) => {
        setFormData(prev => ({
            ...prev,
            sports_interests: prev.sports_interests.includes(sportId)
                ? prev.sports_interests.filter(id => id !== sportId)
                : [...prev.sports_interests, sportId]
        }));
    };

    const nextStep = (e) => {
        e.preventDefault();
        setError('');
        setStep(prev => prev + 1);
    };

    const prevStep = () => {
        setStep(prev => prev - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Email domain validation
        if (!formData.email.toLowerCase().endsWith('@vignan.ac.in')) {
            setError('Email must be in format of college-id@vignan.ac.in');
            setIsLoading(false);
            return;
        }

        try {
            // Convert array to string for backend if needed, or send as array if backend supports JSON/TEXT
            const submissionData = {
                ...formData,
                sports_interests: formData.sports_interests.join(',')
            };
            await register(submissionData);
            setIsSuccess(true);
            setTimeout(() => {
                router.push('/login');
            }, 5000);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please check your details.');
        } finally {
            setIsLoading(false);
        }
    };

    const stepVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background py-12 px-4 sm:px-6 lg:px-8 font-sans">
            {/* Ambient Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/2 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/2 blur-[120px] rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.02] pointer-events-none">
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(var(--primary) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            </div>

            <div className="max-w-md w-full relative z-10">
                <AnimatePresence mode="wait">
                    {!isSuccess ? (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="bg-white rounded-[40px] p-8 md:p-12 shadow-premium border border-gray-100"
                        >
                            <div className="text-center mb-8">
                                <motion.div
                                    initial={{ y: -20 }}
                                    animate={{ y: 0 }}
                                    className="inline-flex items-center justify-center p-4 bg-primary/5 rounded-3xl border border-primary/10 mb-6 shadow-sm"
                                >
                                    <UserPlus className="h-8 w-8 text-primary" />
                                </motion.div>
                                <h2 className="text-3xl font-black text-primary tracking-tight mb-2">
                                    Create Account
                                </h2>
                                <div className="flex justify-center items-center space-x-2 mt-4">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className={`h-2 rounded-full transition-all duration-300 ${step === i ? 'w-8 bg-secondary' : step > i ? 'w-2 bg-green-500' : 'w-2 bg-gray-200'}`}></div>
                                    ))}
                                </div>
                            </div>

                            <form className="space-y-6" onSubmit={step === 4 ? handleSubmit : nextStep}>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-red-50 border border-red-100 text-red-600 text-sm p-4 rounded-2xl flex items-center space-x-3 mb-4 shadow-sm"
                                    >
                                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                        <span>{error}</span>
                                    </motion.div>
                                )}

                                <div className="min-h-[220px] relative overflow-hidden">
                                    <AnimatePresence mode="wait" initial={false}>
                                        <motion.div
                                            key={step}
                                            variants={stepVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                            className="space-y-4"
                                        >
                                            {step === 1 && (
                                                <>
                                                    <h3 className="text-sm font-bold text-gray-400 mb-4 flex items-center gap-2 uppercase tracking-widest opacity-60">
                                                        <User className="w-4 h-4" /> Identity
                                                    </h3>
                                                    <div className="space-y-4">
                                                        <div className="relative group">
                                                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-300 group-focus-within:text-primary transition-colors">
                                                                <User className="h-5 w-5" />
                                                            </div>
                                                            <input
                                                                name="full_name"
                                                                type="text"
                                                                required
                                                                className="block w-full pl-12 pr-5 py-5 bg-gray-50/50 border border-gray-100 rounded-2xl text-primary placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary focus:bg-white transition-all font-semibold"
                                                                placeholder="Full Name"
                                                                value={formData.full_name}
                                                                onChange={handleChange}
                                                            />
                                                        </div>
                                                        <div className="relative group">
                                                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-300 group-focus-within:text-primary transition-colors">
                                                                <Hash className="h-5 w-5" />
                                                            </div>
                                                            <input
                                                                name="roll_no"
                                                                type="text"
                                                                required
                                                                className="block w-full pl-12 pr-5 py-5 bg-gray-50/50 border border-gray-100 rounded-2xl text-primary placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary focus:bg-white transition-all font-semibold"
                                                                placeholder="Roll Number"
                                                                value={formData.roll_no}
                                                                onChange={handleChange}
                                                            />
                                                        </div>
                                                    </div>
                                                </>
                                            )}

                                            {step === 2 && (
                                                <>
                                                    <h3 className="text-sm font-bold text-gray-400 mb-4 flex items-center gap-2 uppercase tracking-widest opacity-60">
                                                        <BookOpen className="w-4 h-4" /> Academic Info
                                                    </h3>
                                                    <div className="space-y-4">
                                                        <div className="relative group">
                                                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-300 group-focus-within:text-primary transition-colors">
                                                                <BookOpen className="h-5 w-5" />
                                                            </div>
                                                            <select
                                                                name="department"
                                                                required
                                                                className="block w-full pl-12 pr-5 py-5 bg-gray-50/50 border border-gray-100 rounded-2xl text-primary placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary focus:bg-white transition-all font-semibold appearance-none"
                                                                value={formData.department}
                                                                onChange={handleChange}
                                                            >
                                                                <option value="" disabled>Select Department</option>
                                                                <option value="CSE">CSE</option>
                                                                <option value="ECE">ECE</option>
                                                                <option value="MECH">MECH</option>
                                                                <option value="CIVIL">CIVIL</option>
                                                                <option value="AI&DS">AI & DS</option>
                                                            </select>
                                                        </div>
                                                        <div className="relative group">
                                                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-300 group-focus-within:text-primary transition-colors">
                                                                <Calendar className="h-5 w-5" />
                                                            </div>
                                                            <select
                                                                name="year"
                                                                required
                                                                className="block w-full pl-12 pr-5 py-5 bg-gray-50/50 border border-gray-100 rounded-2xl text-primary placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary focus:bg-white transition-all font-semibold appearance-none"
                                                                value={formData.year}
                                                                onChange={handleChange}
                                                            >
                                                                <option value="" disabled>Select Year</option>
                                                                <option value="1">1st Year</option>
                                                                <option value="2">2nd Year</option>
                                                                <option value="3">3rd Year</option>
                                                                <option value="4">4th Year</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </>
                                            )}

                                            {step === 3 && (
                                                <>
                                                    <h3 className="text-sm font-bold text-gray-400 mb-4 flex items-center gap-2 uppercase tracking-widest opacity-60">
                                                        <Trophy className="w-4 h-4" /> Sports Interests
                                                    </h3>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {sportsList.map(sport => (
                                                            <button
                                                                key={sport.id}
                                                                type="button"
                                                                onClick={() => toggleSport(sport.id)}
                                                                className={`p-4 rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 ${formData.sports_interests.includes(sport.id)
                                                                    ? 'bg-primary/5 border-primary text-primary shadow-sm'
                                                                    : 'bg-gray-50/50 border-gray-100 text-gray-400 hover:bg-gray-100'
                                                                    }`}
                                                            >
                                                                <sport.icon className="w-6 h-6" />
                                                                <span className="text-xs font-bold">{sport.name}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </>
                                            )}

                                            {step === 4 && (
                                                <>
                                                    <h3 className="text-sm font-bold text-gray-400 mb-4 flex items-center gap-2 uppercase tracking-widest opacity-60">
                                                        <Lock className="w-4 h-4" /> Security
                                                    </h3>
                                                    <div className="space-y-4">
                                                        <div className="relative group">
                                                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-300 group-focus-within:text-primary transition-colors">
                                                                <Mail className="h-5 w-5" />
                                                            </div>
                                                            <input
                                                                name="email"
                                                                type="email"
                                                                required
                                                                className="block w-full pl-12 pr-5 py-5 bg-gray-50/50 border border-gray-100 rounded-2xl text-primary placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary focus:bg-white transition-all font-semibold"
                                                                placeholder="College Email"
                                                                value={formData.email}
                                                                onChange={handleChange}
                                                            />
                                                        </div>
                                                        <div className="relative group">
                                                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-300 group-focus-within:text-primary transition-colors">
                                                                <Lock className="h-5 w-5" />
                                                            </div>
                                                            <input
                                                                name="password"
                                                                type="password"
                                                                required
                                                                className="block w-full pl-12 pr-5 py-5 bg-gray-50/50 border border-gray-100 rounded-2xl text-primary placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary focus:bg-white transition-all font-semibold"
                                                                placeholder="Password"
                                                                value={formData.password}
                                                                onChange={handleChange}
                                                            />
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </motion.div>
                                    </AnimatePresence>
                                </div>

                                <div className="flex space-x-3 pt-4">
                                    {step > 1 && (
                                        <button
                                            type="button"
                                            onClick={prevStep}
                                            className="flex-1 py-4 px-4 border border-gray-100 font-bold rounded-2xl text-gray-400 hover:bg-gray-50 focus:outline-none transition-all flex items-center justify-center gap-2"
                                        >
                                            <ArrowLeft className="w-4 h-4" /> Back
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex-[2] group relative flex justify-center items-center py-4 px-4 border border-transparent font-black rounded-2xl text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all shadow-lg shadow-primary/10 disabled:opacity-70"
                                    >
                                        {isLoading ? (
                                            <div className="h-6 w-6 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <span>{step === 4 ? 'Complete Registration' : 'Next Step'}</span>
                                                {step !== 4 && <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>

                            <div className="mt-8 text-center text-sm font-medium">
                                <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px] opacity-60">Already have an account? </span>
                                <Link href="/login" className="text-primary font-black hover:text-primary-hover transition-colors">
                                    Sign In
                                </Link>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-[40px] p-12 text-center shadow-premium border border-gray-100 relative overflow-hidden"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
                                className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-500/20"
                            >
                                <CheckCircle className="w-12 h-12 text-white" />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <h2 className="text-4xl font-black mb-4 text-primary">Welcome to the Arena!</h2>
                                <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                                    Your account for <strong>{formData.full_name}</strong> is active and ready for victory.
                                </p>

                                <div className="bg-primary/5 border border-primary/10 p-6 rounded-[24px] mb-8">
                                    <div className="flex items-center justify-center gap-3 text-primary font-bold mb-2">
                                        <Trophy className="w-5 h-5" />
                                        <span>Instant Access Granted</span>
                                    </div>
                                    <p className="text-sm text-primary/60 font-medium">
                                        You can now log in to reserve equipment and track your matches immediately.
                                    </p>
                                </div>

                                <Link
                                    href="/login"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-black rounded-2xl shadow-lg hover:shadow-primary/20 hover:gap-4 transition-all duration-300"
                                >
                                    Log In Now <ChevronRight className="w-5 h-5" />
                                </Link>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-8 text-center"
                >
                    <p className="text-gray-300 text-xs font-bold tracking-widest uppercase">
                        &copy; 2026 Vignan Sports Portal
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;
