'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import {
    PackagePlus, Users, BarChart3, Trash2, Edit, Search,
    Filter, TrendingUp, AlertCircle, CheckCircle2, MoreVertical,
    Plus, X, Trash, Info, Trophy, Dribbble, Gamepad2, Compass, Package,
    AlertTriangle
} from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { History } from 'lucide-react';

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

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('inventory');
    const [users, setUsers] = useState([]);
    const [showUserModal, setShowUserModal] = useState(false);
    const [userModalType, setUserModalType] = useState('subAdmin'); // 'subAdmin' or 'coach'
    const [equipment, setEquipment] = useState([]);
    const [auditLogs, setAuditLogs] = useState([]);
    const [stats, setStats] = useState({ totalItems: 0, totalUsers: 0, activeBookings: 0 });
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        category: 'Cricket',
        total_quantity: 0,
        description: '',
        image_url: ''
    });
    const [userFormData, setUserFormData] = useState({
        roll_no: '',
        email: '',
        password: '',
        full_name: ''
    });
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && (!user || user.role !== 'admin')) {
            router.push('/login');
            return;
        }
        fetchData();
    }, [user, loading, router]);

    const fetchData = async () => {
        if (!user?.token) return;
        setIsLoading(true);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };
            const [{ data: equipData }, { data: userData }, { data: auditData }] = await Promise.all([
                axios.get('/api/equipment', config),
                axios.get('/api/admin/users', config),
                axios.get('/api/audit', config)
            ]);
            setEquipment(equipData);
            setUsers(userData);
            setAuditLogs(auditData);
            setStats({
                totalItems: equipData.length,
                totalUsers: userData.length,
                activeBookings: 0 // Placeholder
            });
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateSubAdmin = async (e) => {
        e.preventDefault();
        if (!user?.token) return;
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };
            await axios.post('/api/admin/users/subadmin', userFormData, config);
            setShowUserModal(false);
            fetchData();
            setUserFormData({ roll_no: '', email: '', password: '', full_name: '' });
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create sub-admin');
        }
    };

    const handleCreateCoach = async (e) => {
        e.preventDefault();
        if (!user?.token) return;
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };
            await axios.post('/api/admin/users/coach', userFormData, config);
            setShowUserModal(false);
            fetchData();
            setUserFormData({ roll_no: '', email: '', password: '', full_name: '' });
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create coach');
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Delete this user?') || !user?.token) return;
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };
            await axios.delete(`/api/admin/users/${id}`, config);
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete user');
        }
    };

    const handleAddEquipment = async (e) => {
        e.preventDefault();
        if (!user?.token) return;
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };
            await axios.post('/api/equipment', formData, config);
            setShowAddModal(false);
            fetchData();
            setFormData({ name: '', category: 'Cricket', total_quantity: 0, description: '', image_url: '' });
        } catch (err) {
            alert('Failed to add equipment');
        }
    };

    const handleUpdateEquipment = async (e) => {
        e.preventDefault();
        if (!user?.token || !selectedItem) return;
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };
            await axios.put(`/api/equipment/${selectedItem.id}`, formData, config);
            setShowEditModal(false);
            setSelectedItem(null);
            fetchData();
            setFormData({ name: '', category: 'Cricket', total_quantity: 0, description: '', image_url: '' });
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update equipment');
        }
    };

    const handleQuickStockAdjustment = async (id, delta) => {
        if (!user?.token) return;
        try {
            const item = equipment.find(e => e.id === id);
            const newTotal = item.total_quantity + delta;
            if (newTotal < 0) return;

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };
            await axios.put(`/api/equipment/${id}`, { total_quantity: newTotal }, config);
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Adjustment failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this item?') || !user?.token) return;
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };
            await axios.delete(`/api/equipment/${id}`, config);
            fetchData();
        } catch (err) {
            alert('Failed to delete item');
        }
    };

    if (loading || !user) return null;

    const filteredEquipment = equipment.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 space-y-6 md:space-y-0">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter mb-2">
                        Admin <span className="text-primary italic">Dashboard</span>
                    </h1>
                    <p className="text-foreground/50 font-medium">Manage sports inventory, student access, and audit logs.</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => router.push('/admin/analytics')}
                        className="bg-white text-indigo-600 border border-indigo-100 font-black px-6 py-4 rounded-2xl shadow-sm hover:border-indigo-300 transition-all flex items-center space-x-3"
                    >
                        <BarChart3 className="w-5 h-5" />
                        <span>Analytics</span>
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-primary text-white font-black px-6 py-4 rounded-2xl shadow-lg hover:bg-primary-hover transition-all flex items-center space-x-3"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Add Equipment</span>
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                {[
                    { label: "Total Asset Types", val: stats.totalItems, icon: PackagePlus, color: "text-primary", bg: "bg-primary/10" },
                    { label: "Onboarded Students", val: stats.totalUsers, icon: Users, color: "text-secondary", bg: "bg-secondary/10" },
                    { label: "Current Operations", val: stats.activeBookings, icon: TrendingUp, color: "text-accent", bg: "bg-accent/10" }
                ].map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="glass p-8 rounded-[40px] flex items-center group hover:border-primary/30 transition-all"
                    >
                        <div className={cn("p-5 rounded-3xl mr-6 group-hover:scale-110 transition-transform", stat.bg)}>
                            <stat.icon className={cn("w-8 h-8", stat.color)} />
                        </div>
                        <div>
                            <p className="text-xs font-black text-foreground/30 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                            <p className="text-4xl font-black text-foreground tracking-tight">{stat.val}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Management Section */}
            <div className="glass rounded-[48px] overflow-hidden shadow-2xl">
                <div className="p-8 md:p-12 border-b border-foreground/5 bg-foreground/[0.02]">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
                        {/* Tab Switcher */}
                        <div className="flex bg-foreground/5 p-2 rounded-2xl overflow-x-auto max-w-full">
                            {['inventory', 'users', 'audit', 'reports', 'roles'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={cn(
                                        "px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all",
                                        activeTab === tab ? "bg-white text-primary shadow-premium" : "text-foreground/40 hover:text-foreground"
                                    )}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-foreground/40 group-focus-within:text-primary transition-colors">
                                    <Search className="w-5 h-5" />
                                </div>
                                <input
                                    type="text"
                                    placeholder={`Search ${activeTab}...`}
                                    className="w-full bg-white border border-foreground/5 py-4 pl-14 pr-6 rounded-2xl font-bold text-foreground shadow-premium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            {activeTab === 'users' && (
                                <button
                                    onClick={() => setShowUserModal(true)}
                                    className="bg-primary text-white p-4 rounded-2xl shadow-glow hover:bg-primary-hover transition-all btn-lift"
                                >
                                    <Plus className="w-6 h-6" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {activeTab === 'inventory' ? (
                        <table className="w-full text-left border-collapse">
                            {/* ... existing table header ... */}
                            <thead>
                                <tr className="bg-foreground/[0.01]">
                                    <th className="px-8 py-6 text-xs font-black text-foreground/30 uppercase tracking-widest">Equipment</th>
                                    <th className="px-8 py-6 text-xs font-black text-foreground/30 uppercase tracking-widest">Category</th>
                                    <th className="px-8 py-6 text-xs font-black text-foreground/30 uppercase tracking-widest text-center">Stock Health</th>
                                    <th className="px-8 py-6 text-xs font-black text-foreground/30 uppercase tracking-widest">Management</th>
                                    <th className="px-8 py-6 text-xs font-black text-foreground/30 uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-6 text-xs font-black text-foreground/30 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-foreground/5">
                                <AnimatePresence mode='popLayout'>
                                    {filteredEquipment.map((item) => (
                                        <motion.tr
                                            key={item.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="hover:bg-foreground/[0.02] transition-colors group"
                                        >
                                            {/* ... existing table row content ... */}
                                            <td className="px-8 py-6 text-foreground">
                                                <div className="flex items-center">
                                                    <div className="w-12 h-12 rounded-xl bg-foreground/5 flex items-center justify-center mr-4 group-hover:bg-primary/10 transition-colors">
                                                        <CategoryIcon category={item.category} className="w-6 h-6 text-foreground/40 group-hover:text-primary" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-foreground leading-tight">{item.name}</span>
                                                        {item.available_quantity <= 3 && item.available_quantity > 0 && (
                                                            <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest mt-0.5">Critical Stock</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center space-x-2">
                                                    <CategoryIcon category={item.category} className="w-3 h-3 text-primary" />
                                                    <span className="bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg">
                                                        {item.category}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col items-center space-y-2">
                                                    <div className="w-24 h-1.5 bg-foreground/5 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${(item.available_quantity / item.total_quantity) * 100}%` }}
                                                            className={cn(
                                                                "h-full rounded-full",
                                                                (item.available_quantity / item.total_quantity) < 0.3 ? "bg-danger" :
                                                                    (item.available_quantity / item.total_quantity) < 0.6 ? "bg-amber-500" : "bg-success"
                                                            )}
                                                        />
                                                    </div>
                                                    <span className="text-[10px] font-black text-foreground/40 uppercase tracking-tighter">
                                                        Health Indicator
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center justify-center space-x-3">
                                                    <button
                                                        onClick={() => handleQuickStockAdjustment(item.id, -1)}
                                                        className="w-10 h-10 rounded-xl bg-foreground/5 text-foreground/40 hover:bg-danger/10 hover:text-danger flex items-center justify-center transition-all border border-transparent hover:border-danger/20"
                                                        title="Decrease Stock"
                                                    >
                                                        <span className="text-lg font-bold">-</span>
                                                    </button>
                                                    <div className="flex flex-col items-center min-w-[50px]">
                                                        <span className="text-lg font-black text-foreground">{item.total_quantity}</span>
                                                        <span className="text-[8px] font-black text-foreground/20 uppercase tracking-widest">Total units</span>
                                                    </div>
                                                    <button
                                                        onClick={() => handleQuickStockAdjustment(item.id, 1)}
                                                        className="w-10 h-10 rounded-xl bg-foreground/5 text-foreground/40 hover:bg-success/10 hover:text-success flex items-center justify-center transition-all border border-transparent hover:border-success/20"
                                                        title="Increase Stock"
                                                    >
                                                        <span className="text-lg font-bold">+</span>
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                {item.available_quantity > 0 ? (
                                                    <div className="flex items-center text-success space-x-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-success"></div>
                                                        <span className="text-[10px] font-black uppercase tracking-widest">In Stock</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center text-danger space-x-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-danger"></div>
                                                        <span className="text-[10px] font-black uppercase tracking-widest">Depleted</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedItem(item);
                                                            setFormData({
                                                                name: item.name,
                                                                category: item.category,
                                                                total_quantity: item.total_quantity,
                                                                description: item.description,
                                                                image_url: item.image_url
                                                            });
                                                            setShowEditModal(true);
                                                        }}
                                                        className="p-2 hover:bg-primary/10 rounded-lg text-foreground/40 hover:text-primary transition-all"
                                                    >
                                                        <Edit className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="p-2 hover:bg-danger/10 rounded-lg text-foreground/40 hover:text-danger transition-all"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    ) : activeTab === 'users' ? (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-foreground/[0.01]">
                                    <th className="px-8 py-6 text-xs font-black text-foreground/30 uppercase tracking-widest">User Profile</th>
                                    <th className="px-8 py-6 text-xs font-black text-foreground/30 uppercase tracking-widest">Roll Number</th>
                                    <th className="px-8 py-6 text-xs font-black text-foreground/30 uppercase tracking-widest">Role</th>
                                    <th className="px-8 py-6 text-xs font-black text-foreground/30 uppercase tracking-widest">Joined</th>
                                    <th className="px-8 py-6 text-xs font-black text-foreground/30 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-foreground/5">
                                <AnimatePresence mode='popLayout'>
                                    {users.filter(u => u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || u.roll_no.toLowerCase().includes(searchTerm.toLowerCase())).map((u) => (
                                        <motion.tr
                                            key={u.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="hover:bg-foreground/[0.02] transition-colors group"
                                        >
                                            <td className="px-8 py-6">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black mr-4 uppercase">
                                                        {u.full_name.charAt(0)}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-foreground leading-tight">{u.full_name}</span>
                                                        <span className="text-[10px] text-foreground/40 font-medium">{u.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 font-bold text-foreground/60">{u.roll_no}</td>
                                            <td className="px-8 py-6">
                                                <span className={cn(
                                                    "text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg",
                                                    u.role === 'admin' ? "bg-primary/10 text-primary" : (u.role === 'sub_admin' ? "bg-secondary/10 text-secondary" : "bg-foreground/5 text-foreground/40")
                                                )}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-xs font-medium text-foreground/40">
                                                {new Date(u.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                {u.role !== 'admin' && (
                                                    <button
                                                        onClick={() => handleDeleteUser(u.id)}
                                                        className="p-2 hover:bg-danger/10 rounded-lg text-foreground/20 hover:text-danger transition-all opacity-0 group-hover:opacity-100"
                                                    >
                                                        <Trash className="w-5 h-5" />
                                                    </button>
                                                )}
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    ) : activeTab === 'audit' ? (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-foreground/[0.01]">
                                    <th className="px-8 py-6 text-xs font-black text-foreground/30 uppercase tracking-widest">Time</th>
                                    <th className="px-8 py-6 text-xs font-black text-foreground/30 uppercase tracking-widest">Admin/User</th>
                                    <th className="px-8 py-6 text-xs font-black text-foreground/30 uppercase tracking-widest">Action</th>
                                    <th className="px-8 py-6 text-xs font-black text-foreground/30 uppercase tracking-widest">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-foreground/5">
                                <AnimatePresence mode='popLayout'>
                                    {auditLogs.filter(log => log.action.toLowerCase().includes(searchTerm.toLowerCase()) || log.details.toLowerCase().includes(searchTerm.toLowerCase())).map((log) => (
                                        <motion.tr
                                            key={log.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="hover:bg-foreground/[0.02] transition-colors"
                                        >
                                            <td className="px-8 py-6 text-xs font-medium text-foreground/40">
                                                {new Date(log.created_at).toLocaleString()}
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-foreground leading-tight text-sm">{log.User?.full_name || 'System'}</span>
                                                    <span className="text-[10px] text-foreground/40 font-medium">{log.User?.role || 'automatic'}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="bg-secondary/10 text-secondary text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md">
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-xs text-foreground/60 font-medium italic max-w-xs truncate">
                                                {log.details}
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    ) : activeTab === 'reports' ? (
                        <div className="p-12 space-y-12">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-6">
                                    <h3 className="text-xl font-black flex items-center space-x-3">
                                        <TrendingUp className="text-primary w-6 h-6" />
                                        <span>Popular Sports Breakdown</span>
                                    </h3>
                                    <div className="space-y-4">
                                        {[
                                            { name: 'Cricket', percent: 85, color: 'bg-primary' },
                                            { name: 'Football', percent: 64, color: 'bg-secondary' },
                                            { name: 'Badminton', percent: 42, color: 'bg-accent' },
                                            { name: 'eSports', percent: 91, color: 'bg-purple-500' }
                                        ].map((item, idx) => (
                                            <div key={idx} className="space-y-2">
                                                <div className="flex justify-between text-xs font-black uppercase tracking-widest text-foreground/40">
                                                    <span>{item.name}</span>
                                                    <span>{item.percent}% Usage</span>
                                                </div>
                                                <div className="h-3 w-full bg-foreground/5 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${item.percent}%` }}
                                                        transition={{ duration: 1, delay: idx * 0.1 }}
                                                        className={cn("h-full rounded-full shadow-glow", item.color)}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <h3 className="text-xl font-black flex items-center space-x-3">
                                        <BarChart3 className="text-secondary w-6 h-6" />
                                        <span>Peak Usage Hours</span>
                                    </h3>
                                    <div className="h-64 flex items-end justify-between px-4 pb-2 border-b border-foreground/5">
                                        {[40, 70, 45, 90, 65, 30, 80].map((h, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ height: 0 }}
                                                animate={{ height: `${h}%` }}
                                                transition={{ duration: 1, delay: i * 0.05 }}
                                                className="w-8 bg-secondary/20 hover:bg-secondary rounded-t-xl transition-all relative group"
                                            >
                                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-secondary text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {h}%
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between text-[10px] font-black text-foreground/20 uppercase tracking-widest px-4">
                                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : activeTab === 'roles' ? (
                        <div className="p-12 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    { role: 'Sub-Admin', roleKey: 'sub_admin', modalType: 'subAdmin', desc: 'Can manage equipment, scan QRs, and update match scores.', color: 'text-secondary', bg: 'bg-secondary/10', count: users.filter(u => u.role === 'sub_admin').length },
                                    { role: 'Coach', roleKey: 'coach', modalType: 'coach', desc: 'Can manage teams, evaluate players, and view analytics.', color: 'text-amber-500', bg: 'bg-amber-50', count: users.filter(u => u.role === 'coach').length },
                                    { role: 'Admin', roleKey: 'admin', modalType: null, desc: 'Full system access, manage personnel, and audit logs.', color: 'text-primary', bg: 'bg-primary/10', count: users.filter(u => u.role === 'admin').length }
                                ].map((r, i) => (
                                    <div key={i} className="glass p-8 rounded-[32px] border border-foreground/5 hover:border-primary/20 transition-all flex justify-between items-center">
                                        <div>
                                            <div className={cn("inline-block px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest mb-4", r.bg, r.color)}>
                                                {r.role}
                                            </div>
                                            <p className="text-xs text-foreground/40 font-medium max-w-[200px]">{r.desc}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-3xl font-black text-foreground mb-2">{r.count}</div>
                                            {r.modalType && (
                                                <button
                                                    onClick={() => {
                                                        setUserModalType(r.modalType);
                                                        setShowUserModal(true);
                                                    }}
                                                    className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
                                                >
                                                    + Create {r.role}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-foreground/[0.01]">
                                    <th className="px-8 py-6 text-xs font-black text-foreground/30 uppercase tracking-widest">Time</th>
                                    <th className="px-8 py-6 text-xs font-black text-foreground/30 uppercase tracking-widest">Admin/User</th>
                                    <th className="px-8 py-6 text-xs font-black text-foreground/30 uppercase tracking-widest">Action</th>
                                    <th className="px-8 py-6 text-xs font-black text-foreground/30 uppercase tracking-widest">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-foreground/5">
                                <AnimatePresence mode='popLayout'>
                                    {auditLogs.filter(log => log.action.toLowerCase().includes(searchTerm.toLowerCase()) || log.details.toLowerCase().includes(searchTerm.toLowerCase())).map((log) => (
                                        <motion.tr
                                            key={log.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="hover:bg-foreground/[0.02] transition-colors"
                                        >
                                            <td className="px-8 py-6 text-xs font-medium text-foreground/40">
                                                {new Date(log.created_at).toLocaleString()}
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-foreground leading-tight text-sm">{log.User?.full_name || 'System'}</span>
                                                    <span className="text-[10px] text-foreground/40 font-medium">{log.User?.role || 'automatic'}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="bg-secondary/10 text-secondary text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md">
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-xs text-foreground/60 font-medium italic max-w-xs truncate">
                                                {log.details}
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Add Gear Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
                            onClick={() => setShowAddModal(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative glass md:w-full max-w-2xl rounded-[48px] overflow-hidden shadow-2xl"
                        >
                            <div className="absolute top-0 left-0 right-0 h-2 bg-primary"></div>
                            <div className="p-10 md:p-14">
                                <div className="flex justify-between items-start mb-12">
                                    <div className="flex items-center space-x-6">
                                        <div className="bg-primary p-5 rounded-3xl shadow-glow">
                                            <Plus className="w-10 h-10 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-1">Stock Addition</h2>
                                            <h3 className="text-4xl font-black text-foreground tracking-tight leading-none">New Equipment</h3>
                                        </div>
                                    </div>
                                    <button onClick={() => setShowAddModal(false)} className="p-3 bg-foreground/5 hover:bg-foreground/10 rounded-2xl transition-colors">
                                        <X className="w-6 h-6 text-foreground/40" />
                                    </button>
                                </div>

                                <form onSubmit={handleAddEquipment} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-xs font-black text-foreground/30 uppercase tracking-widest block px-2">Asset Name</label>
                                            <input type="text" className="w-full bg-foreground/5 border-none rounded-2xl px-6 py-4 font-bold text-foreground focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                                required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-xs font-black text-foreground/30 uppercase tracking-widest block px-2">Category</label>
                                            <select className="w-full bg-foreground/5 border-none rounded-2xl px-6 py-4 font-bold text-foreground focus:ring-4 focus:ring-primary/10 transition-all outline-none appearance-none"
                                                value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                                <option>Cricket</option>
                                                <option>Football</option>
                                                <option>Indoor</option>
                                                <option>Outdoor</option>
                                                <option>eSports</option>
                                                <option>PUBG</option>
                                                <option>FF</option>
                                                <option>COD</option>
                                            </select>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-xs font-black text-foreground/30 uppercase tracking-widest block px-2">Total Units</label>
                                            <input type="number" className="w-full bg-foreground/5 border-none rounded-2xl px-6 py-4 font-bold text-foreground focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                                required value={formData.total_quantity} onChange={e => setFormData({ ...formData, total_quantity: e.target.value === '' ? '' : parseInt(e.target.value) })} />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-xs font-black text-foreground/30 uppercase tracking-widest block px-2">Specs / Info</label>
                                            <input type="text" className="w-full bg-foreground/5 border-none rounded-2xl px-6 py-4 font-bold text-foreground focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                                value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                                        </div>
                                    </div>

                                    <div className="pt-6 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                                        <button type="submit" className="flex-[2] bg-primary text-white font-black py-6 rounded-3xl hover:bg-primary-hover shadow-xl shadow-primary/20 transition-all">
                                            Confirm Deployment
                                        </button>
                                        <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 bg-foreground/5 text-foreground/60 font-black py-6 rounded-3xl hover:bg-foreground/10 transition-all">
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Edit Gear Modal */}
            <AnimatePresence>
                {showEditModal && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
                            onClick={() => {
                                setShowEditModal(false);
                                setSelectedItem(null);
                            }}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative glass md:w-full max-w-2xl rounded-[48px] overflow-hidden shadow-2xl"
                        >
                            <div className="absolute top-0 left-0 right-0 h-2 bg-indigo-500"></div>
                            <div className="p-10 md:p-14">
                                <div className="flex justify-between items-start mb-12">
                                    <div className="flex items-center space-x-6">
                                        <div className="bg-indigo-500 p-5 rounded-3xl shadow-glow">
                                            <Edit className="w-10 h-10 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-xs font-black text-indigo-500 uppercase tracking-[0.2em] mb-1">Asset Modification</h2>
                                            <h3 className="text-4xl font-black text-foreground tracking-tight leading-none">Update Gear</h3>
                                        </div>
                                    </div>
                                    <button onClick={() => {
                                        setShowEditModal(false);
                                        setSelectedItem(null);
                                    }} className="p-3 bg-foreground/5 hover:bg-foreground/10 rounded-2xl transition-colors">
                                        <X className="w-6 h-6 text-foreground/40" />
                                    </button>
                                </div>

                                <form onSubmit={handleUpdateEquipment} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-xs font-black text-foreground/30 uppercase tracking-widest block px-2">Asset Name</label>
                                            <input type="text" className="w-full bg-foreground/5 border-none rounded-2xl px-6 py-4 font-bold text-foreground focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                                                required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-xs font-black text-foreground/30 uppercase tracking-widest block px-2">Category</label>
                                            <select className="w-full bg-foreground/5 border-none rounded-2xl px-6 py-4 font-bold text-foreground focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none appearance-none"
                                                value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                                <option>Cricket</option>
                                                <option>Football</option>
                                                <option>Indoor</option>
                                                <option>Outdoor</option>
                                                <option>eSports</option>
                                                <option>PUBG</option>
                                                <option>FF</option>
                                                <option>COD</option>
                                            </select>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-xs font-black text-foreground/30 uppercase tracking-widest block px-2">Total Units</label>
                                            <input type="number" className="w-full bg-foreground/5 border-none rounded-2xl px-6 py-4 font-bold text-foreground focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                                                required value={formData.total_quantity} onChange={e => setFormData({ ...formData, total_quantity: e.target.value === '' ? '' : parseInt(e.target.value) })} />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-xs font-black text-foreground/30 uppercase tracking-widest block px-2">Specs / Info</label>
                                            <input type="text" className="w-full bg-foreground/5 border-none rounded-2xl px-6 py-4 font-bold text-foreground focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                                                value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                                        </div>
                                    </div>

                                    <div className="pt-6 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                                        <button type="submit" className="flex-[2] bg-indigo-600 text-white font-black py-6 rounded-3xl hover:bg-indigo-700 shadow-xl shadow-indigo-500/20 transition-all">
                                            Save Changes
                                        </button>
                                        <button type="button" onClick={() => {
                                            setShowEditModal(false);
                                            setSelectedItem(null);
                                        }} className="flex-1 bg-foreground/5 text-foreground/60 font-black py-6 rounded-3xl hover:bg-foreground/10 transition-all">
                                            Discard
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Create User Modal */}
            <AnimatePresence>
                {showUserModal && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
                            onClick={() => setShowUserModal(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative glass md:w-full max-w-2xl rounded-[48px] overflow-hidden shadow-2xl"
                        >
                            <div className="absolute top-0 left-0 right-0 h-2 bg-secondary"></div>
                            <div className="p-10 md:p-14">
                                <div className="flex justify-between items-start mb-12">
                                    <div className="flex items-center space-x-6">
                                        <div className={cn("p-5 rounded-3xl shadow-lg", userModalType === 'coach' ? "bg-amber-500" : "bg-secondary")}>
                                            {userModalType === 'coach' ? <Trophy className="w-10 h-10 text-white" /> : <Users className="w-10 h-10 text-white" />}
                                        </div>
                                        <div>
                                            <h2 className="text-xs font-black text-foreground/30 uppercase tracking-[0.2em] mb-1">Personnel Management</h2>
                                            <h3 className="text-4xl font-black text-foreground tracking-tight leading-none">
                                                New {userModalType === 'coach' ? 'Coach' : 'Sub-Admin'}
                                            </h3>
                                        </div>
                                    </div>
                                    <button onClick={() => setShowUserModal(false)} className="p-3 bg-foreground/5 hover:bg-foreground/10 rounded-2xl transition-colors">
                                        <X className="w-6 h-6 text-foreground/40" />
                                    </button>
                                </div>

                                <form onSubmit={userModalType === 'coach' ? handleCreateCoach : handleCreateSubAdmin} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-xs font-black text-foreground/30 uppercase tracking-widest block px-2">Credential ID</label>
                                            <input type="text" className="w-full bg-foreground/5 border-none rounded-2xl px-6 py-4 font-bold text-foreground focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                                required value={userFormData.roll_no} onChange={e => setUserFormData({ ...userFormData, roll_no: e.target.value })} />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-xs font-black text-foreground/30 uppercase tracking-widest block px-2">Official Email</label>
                                            <input type="email" className="w-full bg-foreground/5 border-none rounded-2xl px-6 py-4 font-bold text-foreground focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                                required value={userFormData.email} onChange={e => setUserFormData({ ...userFormData, email: e.target.value })} />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-xs font-black text-foreground/30 uppercase tracking-widest block px-2">Full Name</label>
                                            <input type="text" className="w-full bg-foreground/5 border-none rounded-2xl px-6 py-4 font-bold text-foreground focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                                required value={userFormData.full_name} onChange={e => setUserFormData({ ...userFormData, full_name: e.target.value })} />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-xs font-black text-foreground/30 uppercase tracking-widest block px-2">Password</label>
                                            <input type="password" placeholder="••••••••" className="w-full bg-foreground/5 border-none rounded-2xl px-6 py-4 font-bold text-foreground focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                                required value={userFormData.password} onChange={e => setUserFormData({ ...userFormData, password: e.target.value })} />
                                        </div>
                                    </div>

                                    <div className="pt-6 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                                        <button type="submit" className={cn("flex-[2] text-white font-black py-6 rounded-3xl shadow-xl transition-all", userModalType === 'coach' ? "bg-amber-600 hover:bg-amber-700 shadow-amber-900/10" : "bg-secondary hover:bg-purple-600 shadow-secondary/20")}>
                                            Deploy {userModalType === 'coach' ? 'Coach' : 'Sub-Admin'}
                                        </button>
                                        <button type="button" onClick={() => setShowUserModal(false)} className="flex-1 bg-foreground/5 text-foreground/60 font-black py-6 rounded-3xl hover:bg-foreground/10 transition-all">
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div >
    );
};

export default AdminDashboard;
