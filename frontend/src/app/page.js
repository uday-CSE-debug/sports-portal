'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Calendar, CheckCircle, ArrowRight, Shield, Zap, Sparkles, Wind, Gamepad2, Dribbble, Target, Activity, Swords, CircleDot } from 'lucide-react';
import Link from 'next/link';
import SportsLoader from '@/components/SportsLoader';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('upcoming');

  const events = [
    { id: 1, title: "Inter-College Cricket Finals", type: "Cricket", status: "upcoming", date: "Jan 28", time: "09:00 AM", location: "Grand Oval Ground", countdown: "04:12:30:15" },
    { id: 2, title: "University Football League", type: "Football", status: "ongoing", date: "Jan 23", time: "04:00 PM", location: "North Stadium", score: "2 - 1" },
    { id: 3, title: "Basketball Championship", type: "Basketball", status: "upcoming", date: "Feb 02", time: "11:00 AM", location: "Indoor Sports Arena", countdown: "10:18:20:45" },
    { id: 4, title: "Annual Athletic Meet", type: "Athletics", status: "completed", date: "Jan 20", time: "08:00 AM", location: "Main Track", result: "Records Broken" },
    { id: 5, title: "Volleyball Open", type: "Volleyball", status: "completed", date: "Jan 18", time: "02:00 PM", location: "Outdoor Courts", result: "Winners: Team A" }
  ];

  const filteredEvents = events.filter(e => activeFilter === 'all' || e.status === activeFilter);

  useEffect(() => {
    if (!loading && user) {
      if (user.role === 'admin') {
        router.push('/admin');
      } else if (user.role === 'sub_admin') {
        router.push('/subadmin');
      } else if (user.role === 'coach') {
        router.push('/coach');
      } else {
        router.push('/student');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <SportsLoader />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-12 overflow-x-hidden bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Simple Background Overlay */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[150px] rounded-full" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-secondary/5 blur-[150px] rounded-full" />
        </div>

        <div className="relative z-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold mb-8 shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>Elevate Your College Sports Experience</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-7xl font-black tracking-tight text-foreground mb-6 md:mb-8 px-2"
          >
            Fueling Champions at <br className="hidden md:block" />
            <span className="text-primary underline decoration-secondary/30 decoration-4 md:decoration-8 underline-offset-4 md:underline-offset-8">
              Vignan University
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base md:text-xl text-muted-foreground/80 max-w-2xl md:max-w-3xl mb-8 md:mb-12 leading-relaxed px-4"
          >
            Book equipment, track availability, and manage inventory with the most advanced sports portal designed for the champions of tomorrow.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-6 w-full sm:w-auto px-4 sm:px-0"
          >
            <Link
              href="/login"
              className="group px-6 md:px-10 py-4 md:py-5 bg-primary hover:bg-primary-hover text-white rounded-[20px] md:rounded-2xl font-black text-lg md:text-xl shadow-lg transition-all flex items-center justify-center space-x-3 hover:scale-105 active:scale-95"
            >
              <span>View Sports</span>
              <Trophy className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:rotate-12" />
            </Link>
            <Link
              href="/register"
              className="px-6 md:px-10 py-4 md:py-5 bg-white hover:bg-gray-50 text-foreground border border-gray-200 rounded-[20px] md:rounded-2xl font-black text-lg md:text-xl shadow-sm transition-all flex items-center justify-center space-x-3 hover:scale-105 active:scale-95"
            >
              <span>Register for Events</span>
              <Calendar className="w-5 h-5 md:w-6 md:h-6 text-secondary" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Sports Categories Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-24 relative">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black mb-4"
          >
            Explore Our <span className="text-[#D4AF37]">Disciplines</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white/60 max-w-xl md:max-w-2xl mx-auto text-base md:text-lg px-4"
          >
            From the field to the board, find your passion and elevate your game at Vignan.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { name: "Cricket", icon: Trophy, color: "from-amber-400 to-orange-600", glow: "rgba(251, 191, 36, 0.4)", desc: "The gentleman's game, played with passion and precision." },
            { name: "Football", icon: Activity, color: "from-emerald-400 to-teal-600", glow: "rgba(52, 211, 153, 0.4)", desc: "Dynamic goals and team spirit on the green pitch." },
            { name: "Basketball", icon: Dribbble, color: "from-orange-400 to-red-600", glow: "rgba(251, 146, 60, 0.4)", desc: "High-flying action and buzzer-beating moments." },
            { name: "Volleyball", icon: Wind, color: "from-blue-400 to-indigo-600", glow: "rgba(96, 165, 250, 0.4)", desc: "Spikes, serves, and intense court coordination." },
            { name: "Badminton", icon: Swords, color: "from-yellow-400 to-amber-600", glow: "rgba(251, 191, 36, 0.4)", desc: "Lightning fast smashes and agile court movement." },
            { name: "Table Tennis", icon: CircleDot, color: "from-red-400 to-rose-600", glow: "rgba(251, 113, 133, 0.4)", desc: "High-speed rallies and precision paddle control." },
            { name: "Kabaddi", icon: Zap, color: "from-orange-600 to-red-800", glow: "rgba(220, 38, 38, 0.4)", desc: "Power, strategy, and breath-holding raids." },
            { name: "Chess", icon: Target, color: "from-slate-400 to-slate-700", glow: "rgba(71, 85, 105, 0.4)", desc: "Master the 64 squares with strategic brilliance." },
            { name: "Athletics", icon: Wind, color: "from-purple-400 to-pink-600", glow: "rgba(192, 132, 252, 0.4)", desc: "Speed, strength, and endurance in every stride." },
            { name: "Indoor Games", icon: Gamepad2, color: "from-cyan-400 to-blue-600", glow: "rgba(34, 211, 238, 0.4)", desc: "Strategy and skill in chess, carrom, and more." }
          ].map((cat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{
                scale: 1.05,
                boxShadow: `0 20px 40px -10px ${cat.glow}`
              }}
              className="group relative bg-white rounded-[24px] md:rounded-[32px] p-6 md:p-8 border border-gray-100 shadow-sm hover:shadow-xl cursor-pointer transition-all duration-300"
            >
              <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-4 md:mb-6 shadow-lg group-hover:rotate-12 transition-transform duration-500`}>
                <cat.icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-black mb-2 md:mb-3 group-hover:text-primary transition-colors text-foreground">{cat.name}</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-medium">
                {cat.desc}
              </p>

              {/* Decorative accent */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-10 rounded-full -mr-16 -mt-16 transition-opacity duration-500 blur-3xl`} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Events & Match Schedule Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-24 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black mb-4 text-foreground"
            >
              Match <span className="text-secondary">Schedule</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground text-lg"
            >
              Don't miss the thrill! Stay updated with upcoming and ongoing matches.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex p-1 bg-gray-100 rounded-2xl border border-gray-200 shadow-sm"
          >
            {['upcoming', 'ongoing', 'completed'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-3 rounded-xl text-sm font-bold capitalize transition-all duration-300 ${activeFilter === filter
                  ? 'bg-white text-primary shadow-md'
                  : 'text-gray-500 hover:text-primary'
                  }`}
              >
                {filter}
              </button>
            ))}
          </motion.div>
        </div>

        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {filteredEvents.map((event) => (
              <motion.div
                key={event.id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.4 }}
                className="bg-white group p-6 md:p-8 rounded-[32px] flex flex-col md:flex-row items-center gap-8 border border-gray-100 shadow-sm hover:shadow-xl hover:border-secondary/20 transition-all"
              >
                {/* Date Card */}
                <div className="w-full md:w-32 flex-shrink-0">
                  <div className="bg-secondary/5 rounded-2xl p-4 text-center border border-secondary/10 group-hover:bg-secondary group-hover:text-white transition-colors duration-300 text-secondary">
                    <div className="text-sm font-black uppercase tracking-widest opacity-60">
                      {event.date.split(' ')[0]}
                    </div>
                    <div className="text-3xl font-black">{event.date.split(' ')[1]}</div>
                    <div className="text-xs font-bold mt-1 opacity-60">{event.time}</div>
                  </div>
                </div>

                {/* Event Info */}
                <div className="flex-grow text-center md:text-left">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-3">
                    <span className="px-3 py-1 rounded-full bg-primary/5 text-primary text-xs font-bold border border-primary/10">
                      {event.type}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${event.status === 'ongoing'
                      ? 'bg-secondary/10 text-secondary border-secondary/20 animate-pulse'
                      : 'bg-gray-50 text-gray-400 border-gray-200'
                      }`}>
                      {event.status}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black mb-1 text-foreground">{event.title}</h3>
                  <div className="text-muted-foreground/60 font-medium flex items-center justify-center md:justify-start space-x-2">
                    <Target className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                </div>

                {/* Status Specific UI */}
                <div className="w-full md:w-auto min-w-[200px] flex flex-col items-center md:items-end gap-4">
                  {event.status === 'upcoming' && (
                    <div className="text-center md:text-right">
                      <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mb-1">Starts in</div>
                      <div className="flex space-x-2 font-mono text-xl font-black text-secondary">
                        {event.countdown.split(':').map((part, i) => (
                          <div key={i} className="flex items-center">
                            <span>{part}</span>
                            {i < 3 && <span className="mx-0.5 animate-pulse">:</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {event.status === 'ongoing' && (
                    <div className="bg-primary/5 border border-primary/10 px-6 py-2 rounded-2xl flex items-center space-x-4">
                      <div className="text-primary font-black text-2xl tracking-tighter">{event.score}</div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
                    </div>
                  )}
                  {event.status === 'completed' && (
                    <div className="font-black italic text-lg px-4 py-2 bg-primary/5 rounded-xl border border-primary/10 text-primary">
                      {event.result}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Smart Booking",
              desc: "Quickly reserve equipment for your preferred time slots with real-time availability checks.",
              icon: Calendar,
              color: "text-primary",
              bg: "bg-primary/5"
            },
            {
              title: "Live Inventory",
              desc: "Transparent tracking of all sports gear, from footballs to badminton rackets.",
              icon: Zap,
              color: "text-secondary",
              bg: "bg-secondary/5"
            },
            {
              title: "RBAC Security",
              desc: "Role-based access ensures secure and efficient management for students and staff.",
              icon: Shield,
              color: "text-emerald-600",
              bg: "bg-emerald-500/5"
            }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-3xl group border border-gray-100 shadow-sm"
            >
              <div className={`${feature.bg} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}>
                <feature.icon className={`w-7 h-7 ${feature.color}`} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed font-medium">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-slate-50 rounded-[24px] md:rounded-[40px] p-8 md:p-12 overflow-hidden relative shadow-hl"
        >
          {/* Decorative Background for Stats */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -ml-32 -mb-32" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
            {[
              { label: "Equipments", val: "500+" },
              { label: "Active Students", val: "2.5k" },
              { label: "Daily Bookings", val: "150+" },
              { label: "Reliability", val: "99.9%" },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="text-3xl md:text-4xl font-black text-primary mb-2">{stat.val}</div>
                <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
