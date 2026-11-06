'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Shield, ChevronRight, Hash, Lock, AlertCircle, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const StaffLogin = () => {
    const [rollNo, setRollNo] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const user = await login(rollNo, password);
            if (user.role === 'admin') {
                router.push('/admin');
            } else if (user.role === 'coach') {
                router.push('/coach');
            } else if (user.role === 'sub_admin') {
                router.push('/subadmin');
            } else {
                setError('Unauthorized access. This portal is for Staff and Coaches only.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid staff credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background py-12 px-4 sm:px-6 lg:px-8">
            {/* Dark Professional Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/5 blur-[120px] rounded-full"></div>

            <div className="max-w-md w-full relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl border border-gray-100"
                >
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center mb-6">
                            <div className="p-5 bg-primary rounded-3xl shadow-lg shrink-0">
                                <Shield className="h-8 w-8 text-white" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-black text-foreground tracking-tight mb-2 uppercase">
                            Staff <span className="text-primary italic">Portal</span>
                        </h2>
                        <p className="text-muted-foreground font-black uppercase tracking-widest text-[10px] opacity-60">
                            Vignan University Administration
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold p-4 rounded-2xl flex items-center space-x-3">
                                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-foreground/20 group-focus-within:text-primary transition-colors">
                                    <Hash className="h-5 w-5" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    className="block w-full pl-12 pr-5 py-5 bg-foreground/[0.03] border border-foreground/5 rounded-2xl text-foreground placeholder-foreground/20 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-semibold"
                                    placeholder="Staff ID / Roll No"
                                    value={rollNo}
                                    onChange={(e) => setRollNo(e.target.value)}
                                />
                            </div>

                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-foreground/20 group-focus-within:text-primary transition-colors">
                                    <Lock className="h-5 w-5" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    className="block w-full pl-12 pr-5 py-5 bg-foreground/[0.03] border border-foreground/5 rounded-2xl text-foreground placeholder-foreground/20 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-semibold"
                                    placeholder="Secure Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center items-center py-5 px-4 border border-transparent font-black rounded-2xl text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all shadow-lg shadow-primary/20 disabled:opacity-70"
                        >
                            {isLoading ? (
                                <div className="h-6 w-6 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <span>Authenticate Session</span>
                                    <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <button
                            onClick={() => router.push('/forgot-password')}
                            className="text-foreground/40 hover:text-primary font-bold transition-all text-[10px] uppercase tracking-widest"
                        >
                            Forgot Password?
                        </button>
                    </div>
                </motion.div>

                <div className="mt-8 text-center">
                    <p className="text-foreground/20 text-[10px] font-black tracking-widest uppercase">
                        &copy; 2026 Secured Staff Authorization
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StaffLogin;
