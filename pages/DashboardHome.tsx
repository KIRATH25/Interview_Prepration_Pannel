import React, { useState, useMemo } from 'react';
import { useStore } from '../lib/store';
import { motion } from 'framer-motion';
import { LordIcon } from '../components/ui/LordIcon';
import { FireStreak } from '../components/ui/FireStreak';
import { ScoreTrend } from '../components/charts/Charts';
import { 
    IconSearch, 
    IconBell, 
    IconChevronRight, 
    IconPlayerPlay, 
    IconLock, 
    IconClock, 
    IconStar, 
    IconQuote,
    IconCalendarStats,
    IconTrophy,
    IconTrendingUp,
    IconActivity
} from '@tabler/icons-react';
import { clsx } from 'clsx';
import { Link } from 'react-router-dom';
import { SKILL_CATEGORIES } from '../lib/skill-data';
import { UserSkillProfile } from '../types';

const QUOTES = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", author: "Cory House" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
  { text: "Make it work, make it right, make it fast.", author: "Kent Beck" },
  { text: "Fix the cause, not the symptom.", author: "Steve Maguire" }
];

export const DashboardHome = () => {
    const { user, stats, streak, skillProfiles, overallReadiness, codingQuestions } = useStore();
    const [activeTab, setActiveTab] = useState('All');

    // Daily Quote
    const [quote] = useState(() => {
        const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
        return QUOTES[dayOfYear % QUOTES.length];
    });

    // --- Calculated Stats ---
    
    // 1. Weakest Skills (Real-time from profiles)
    const weakestSkills = useMemo(() => {
        const profiles = Object.values(skillProfiles) as UserSkillProfile[];
        return profiles
            .sort((a, b) => a.score - b.score)
            .slice(0, 2)
            .map(p => {
                const cat = SKILL_CATEGORIES.find(c => c.id === p.categoryId);
                return { ...p, name: cat?.name || 'Unknown' };
            });
    }, [skillProfiles]);

    // 2. Activity Calendar (Last 7 Days)
    const weekActivity = useMemo(() => {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const hasActivity = streak.activeDaysHistory[dateStr];
            days.push({ 
                day: d.toLocaleDateString('en-US', { weekday: 'narrow' }), 
                active: !!hasActivity,
                fullDate: dateStr
            });
        }
        return days;
    }, [streak.activeDaysHistory]);

    // 3. Completed Counts
    const solvedQuestions = codingQuestions.filter(q => q.status === 'Solved').length;
    const skillsAssessed = Object.keys(skillProfiles).length;

    return (
        <div className="flex flex-col gap-8 h-full pb-10">
            {/* FULL WIDTH HERO SECTION WITH STREAK */}
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative min-h-[280px] md:h-72 rounded-[2rem] bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-800 border border-white/5 overflow-hidden flex items-center p-8 md:p-12 shadow-2xl shrink-0"
            >
                <div className="z-10 flex flex-col gap-6 max-w-2xl w-full">
                    <div className="flex items-start justify-between w-full">
                        <div>
                            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-2">
                                Hello {user.name.split(' ')[0]}!
                            </h1>
                            <p className="text-neutral-400 text-lg">Keep up the momentum.</p>
                        </div>
                        
                        {/* Desktop Streak Display */}
                        <div className="hidden md:block">
                            <FireStreak streakCount={streak.currentStreak} size={50} className="bg-white/5 p-4 rounded-2xl border border-white/5 backdrop-blur-md" />
                        </div>
                    </div>

                    {/* Daily Quote */}
                    <div className="mt-2 p-4 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm relative group transition-colors hover:bg-white/10 max-w-lg">
                        <IconQuote className="absolute top-2 left-2 text-white/10 -z-10" size={48} />
                        <p className="text-base font-medium text-cyan-100 italic leading-relaxed">"{quote.text}"</p>
                    </div>
                </div>

                {/* Illustration - Using User Avatar Now */}
                <div className="absolute bottom-0 right-0 md:right-10 w-64 h-64 md:w-[450px] md:h-[450px] pointer-events-none flex items-end justify-end">
                     <img 
                        src={user.avatar} 
                        alt="Character" 
                        className="w-full h-full object-contain object-bottom drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] translate-y-10 md:translate-y-20"
                    />
                </div>
            </motion.div>

            {/* TWO COLUMN LAYOUT */}
            <div className="flex flex-col xl:flex-row gap-8">
                
                {/* LEFT COLUMN (Main Stats) */}
                <div className="flex-[2] flex flex-col gap-8 min-w-0">
                    
                    {/* Real-time Readiness Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex flex-col md:flex-row gap-6 items-center justify-between p-6 rounded-[2rem] bg-neutral-900 border border-white/5 hover:border-cyan-500/30 transition-colors"
                    >
                        <div className="flex items-center gap-6 w-full">
                             <div className="w-20 h-20 relative flex items-center justify-center">
                                {/* Animated Circular Progress */}
                                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                    <path className="text-neutral-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                    <motion.path 
                                        className="text-cyan-500 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]" 
                                        initial={{ strokeDasharray: "0, 100" }}
                                        animate={{ strokeDasharray: `${overallReadiness}, 100` }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        strokeWidth="3" 
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-lg font-bold text-white">{overallReadiness}%</span>
                                </div>
                             </div>
                             <div className="flex flex-col gap-1">
                                 <h3 className="text-xl font-bold text-white">Overall Readiness</h3>
                                 <p className="text-sm text-neutral-500">
                                     {skillsAssessed === 0 ? "Start your first diagnostic to see analytics." : 
                                      overallReadiness > 75 ? "You are interview ready!" : 
                                      overallReadiness > 50 ? "Making good progress." : "Keep practicing to improve."}
                                 </p>
                             </div>
                        </div>
                        
                        <div className="flex items-center gap-4 w-full md:w-auto">
                             <div className="text-center px-4 py-2 bg-neutral-800 rounded-xl">
                                 <span className="block text-xl font-bold text-white">{skillsAssessed}</span>
                                 <span className="text-xs text-neutral-500 uppercase">Skills</span>
                             </div>
                             <div className="text-center px-4 py-2 bg-neutral-800 rounded-xl">
                                 <span className="block text-xl font-bold text-white">{solvedQuestions}</span>
                                 <span className="text-xs text-neutral-500 uppercase">Solved</span>
                             </div>
                        </div>
                    </motion.div>

                    {/* Weakness & Improvements */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                        {weakestSkills.length > 0 ? weakestSkills.map((skill, idx) => (
                             <div key={idx} className="p-6 rounded-2xl bg-neutral-900/50 border border-white/5 relative overflow-hidden group hover:bg-neutral-800/50 transition-colors">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <IconTrendingUp size={80} />
                                </div>
                                <h4 className="text-red-400 font-bold mb-2 flex items-center gap-2">
                                    <IconActivity size={18} /> Focus Area
                                </h4>
                                <h3 className="text-xl font-bold text-white mb-1">{skill.name}</h3>
                                <p className="text-sm text-neutral-500 mb-4">Current Level: <span className="text-neutral-300 font-semibold">{skill.currentLevel === 'C' ? 'Beginner' : 'Intermediate'}</span></p>
                                
                                <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden mb-4">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${skill.score}%` }}
                                        className="h-full bg-red-500"
                                    />
                                </div>
                                
                                <Link to="/dashboard/prepare" className="text-sm font-bold text-white hover:text-cyan-400 flex items-center gap-1 transition-colors">
                                    Improve Now <IconChevronRight size={16} />
                                </Link>
                             </div>
                        )) : (
                            <div className="col-span-2 p-8 rounded-2xl bg-neutral-900/50 border border-white/5 text-center">
                                <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-green-400">
                                    <IconStar size={24} />
                                </div>
                                <h3 className="text-white font-bold">No Weaknesses Detected Yet</h3>
                                <p className="text-neutral-500 text-sm mt-2">Complete more diagnostic tests in the Prepare section to get personalized insights.</p>
                                <Link to="/dashboard/prepare" className="inline-block mt-4 px-6 py-2 bg-white text-black font-bold rounded-lg hover:bg-neutral-200 transition-colors">
                                    Start Preparation
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* RIGHT COLUMN (Sidebar Stats) */}
                <div className="flex-1 flex flex-col gap-8 min-w-[320px]">
                    
                    {/* Search & Notifs */}
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1">
                            <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                            <input 
                                type="text" 
                                placeholder="Search..." 
                                className="w-full h-12 pl-12 pr-4 rounded-2xl bg-neutral-900 border border-white/5 text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all"
                            />
                        </div>
                        <button className="w-12 h-12 rounded-2xl bg-neutral-900 border border-white/5 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors relative">
                            <IconBell size={20} />
                            <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-red-500 border-2 border-neutral-900"></span>
                        </button>
                    </div>

                    {/* Weekly Activity Calendar */}
                    <motion.div 
                         initial={{ opacity: 0, scale: 0.95 }}
                         animate={{ opacity: 1, scale: 1 }}
                         transition={{ delay: 0.3 }}
                         className="p-6 rounded-[1.5rem] bg-neutral-900 border border-white/5"
                    >
                        <div className="flex items-center justify-between mb-4">
                             <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <IconCalendarStats className="text-cyan-400" size={20} /> Activity Log
                             </h3>
                             <span className="text-xs text-neutral-500">Last 7 Days</span>
                        </div>
                        
                        <div className="flex justify-between items-end gap-2">
                            {weekActivity.map((day, i) => (
                                <div key={i} className="flex flex-col items-center gap-2 flex-1">
                                    <div 
                                        className={clsx(
                                            "w-full rounded-md transition-all duration-500",
                                            day.active 
                                                ? "bg-gradient-to-t from-cyan-600 to-cyan-400 h-16 shadow-[0_0_10px_rgba(6,182,212,0.4)]" 
                                                : "bg-neutral-800 h-8"
                                        )}
                                    />
                                    <span className={clsx("text-[10px] font-medium uppercase", day.active ? "text-white" : "text-neutral-600")}>
                                        {day.day}
                                    </span>
                                </div>
                            ))}
                        </div>
                        
                        <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <IconTrophy className="text-yellow-500" size={16} />
                                <span className="text-sm text-neutral-400">Longest Streak</span>
                            </div>
                            <span className="text-white font-bold">{streak.longestStreak} Days</span>
                        </div>
                    </motion.div>

                    {/* Statistics Chart */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-white">Score History</h3>
                        </div>
                        <div className="p-4 rounded-[2rem] bg-neutral-900 border border-white/5">
                            <ScoreTrend className="h-[200px]" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};