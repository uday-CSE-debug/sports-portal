'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import StudentDashboard from '@/components/StudentDashboard';

export default function StudentPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && (!user || user.role !== 'student')) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading || !user || user.role !== 'student') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    return <StudentDashboard />;
}
