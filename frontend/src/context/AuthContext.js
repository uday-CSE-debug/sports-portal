'use client';

import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Set base URL for axios (Removed hardcoded URL to allow Next.js proxy to work)
// axios.defaults.baseURL = 'http://localhost:5000';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            axios.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
        }
        setLoading(false);
    }, []);

    const login = async (roll_no, password) => {
        const { data } = await axios.post('/api/auth/login', { roll_no, password });
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        return data;
    };

    const register = async (userData) => {
        const { data } = await axios.post('/api/auth/register', userData);
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        return data;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
    };

    const updateProfile = async (updatedData) => {
        const { data } = await axios.put('/api/auth/profile', updatedData);
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
        return data;
    };

    return (
        <AuthContext.Provider value={{ user, token: user?.token, loading, login, register, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
