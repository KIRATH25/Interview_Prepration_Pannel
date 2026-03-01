import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    IconBrain, 
    IconTargetArrow, 
    IconCheck, 
    IconLock, 
    IconArrowRight,
    IconLoader,
    IconClock,
    IconAlertTriangle,
    IconChartBar,
    IconSchool,
    IconRefresh,
    IconCircleCheck,
    IconBook,
    IconFileText,
    IconVideo
} from '@tabler/icons-react';
import { clsx } from 'clsx';
import confetti from 'canvas-confetti';
import { useStore } from '../lib/store';
import { SKILL_CATEGORIES, getLevelContent, MOCK_QUESTIONS } from '../lib/skill-data';
import { SkillCategory, UserSkillProfile, SkillLevel } from '../types';

// --- Components ---

const LevelBadge = ({ level }: { level: SkillLevel }) => {
    const colors = {
        'A': 'bg-green-500/10 text-green-400 border-green-500/20',
        'B': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
        'C': 'bg-red-500/10 text-red-400 border-red-500/20',
    };
    const labels = { 'A': 'Advanced', 'B': 'Intermediate', 'C': 'Beginner' };

    return (
        <span className={clsx("px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wide", colors[level])}>
            {labels[level]}
        </span>
    );
};

const CooldownTimer = ({ targetDate }: { targetDate: number }) => {
    const [timeLeft, setTimeLeft] = useState(targetDate - Date.now());

    useEffect(() => {
        const interval = setInterval(() => {
            const diff = targetDate - Date.now();
            if (diff <= 0) clearInterval(interval);
            setTimeLeft(diff);
        }, 1000);
        return () => clearInterval(interval);
    }, [targetDate]);

    if (timeLeft <= 0) return <span className="text-green-400 text-xs font-bold">Ready</span>;

    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    return (
        <span className="text-orange-400 font-mono text-xs">
            {minutes}:{seconds.toString().padStart(2, '0')}
        </span>
    );
};

// --- Views ---

// 1. Diagnostic Quiz View
const DiagnosticQuiz = ({ category, onComplete, onCancel }: { category: SkillCategory, onComplete: (score: number) => void, onCancel: () => void }) => {
    const [qIndex, setQIndex] = useState(0);
    const [answers, setAnswers] = useState<number[]>([]);
    
    // In a real app, fetch questions based on category.id
    // Here we duplicate the MOCK_QUESTIONS to simulate length
    const questions = [...MOCK_QUESTIONS, ...MOCK_QUESTIONS, ...MOCK_QUESTIONS].slice(0, 5); 

    const handleAnswer = (optIndex: number) => {
        const newAnswers = [...answers, optIndex];
        setAnswers(newAnswers);
        
        if (qIndex < questions.length - 1) {
            setQIndex(qIndex + 1);
        } else {
            // Calculate Score
            let correct = 0;
            newAnswers.forEach((ans, idx) => {
                if (ans === questions[idx].correct) correct++;
            });
            const score = Math.round((correct / questions.length) * 100);
            onComplete(score);
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto bg-neutral-900 border border-white/10 rounded-3xl p-8 relative overflow-hidden">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white">{category.name} Assessment</h2>
                    <p className="text-neutral-400 text-sm">Question {qIndex + 1} of {questions.length}</p>
                </div>
                <button onClick={onCancel} className="text-neutral-500 hover:text-white">Cancel</button>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1 bg-neutral-800 rounded-full mb-8">
                <motion.div 
                    className="h-full bg-cyan-500" 
                    initial={{ width: 0 }}
                    animate={{ width: `${((qIndex + 1) / questions.length) * 100}%` }}
                />
            </div>

            <AnimatePresence mode="wait">
                <motion.div 
                    key={qIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                >
                    <h3 className="text-xl font-medium text-white mb-6 leading-relaxed">
                        {questions[qIndex].q}
                    </h3>

                    <div className="space-y-3">
                        {questions[qIndex].options.map((opt, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleAnswer(idx)}
                                className="w-full text-left p-4 rounded-xl bg-neutral-800/50 border border-white/5 hover:bg-cyan-500/10 hover:border-cyan-500/50 hover:text-cyan-100 transition-all text-neutral-300"
                            >
                                <span className="inline-block w-6 h-6 rounded-full border border-neutral-600 mr-3 text-center text-xs leading-[22px] text-neutral-500">
                                    {String.fromCharCode(65 + idx)}
                                </span>
                                {opt}
                            </button>
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

// 2. Improvement Hub View
const ImprovementHub = ({ category, profile, onBack }: { category: SkillCategory, profile: UserSkillProfile, onBack: () => void }) => {
    const { completeAssignment, submitDiagnostic } = useStore();
    const content = getLevelContent(category.id, profile.currentLevel);
    const [activeTab, setActiveTab] = useState<'learn' | 'practice'>('learn');
    const [quizMode, setQuizMode] = useState(false);

    // Cooldown check
    const isCooldownActive = Date.now() < profile.nextRetestAvailableAt;
    const isAssignmentDone = !profile.isAssignmentPending;

    const handleRetest = () => {
        if (isCooldownActive) return;
        if (profile.isAssignmentPending) {
            alert("Please complete the assignment first.");
            return;
        }
        setQuizMode(true);
    };

    if (quizMode) {
        return (
            <DiagnosticQuiz 
                category={category} 
                onCancel={() => setQuizMode(false)} 
                onComplete={(score) => {
                    submitDiagnostic(category.id, score);
                    setQuizMode(false);
                    confetti({ particleCount: 150, spread: 70 });
                }} 
            />
        );
    }

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 rounded-lg bg-neutral-800 hover:bg-white/10 text-white transition-colors">
                        <IconArrowRight className="rotate-180" size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                            {category.name} <LevelBadge level={profile.currentLevel} />
                        </h1>
                        <p className="text-neutral-400 text-sm">
                            Score: <span className={profile.score >= 95 ? "text-green-400" : profile.score >= 75 ? "text-yellow-400" : "text-red-400"}>{profile.score}%</span> • Duration: {content.duration}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full min-h-0">
                {/* Left: Roadmap & Content */}
                <div className="lg:col-span-2 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
                    
                    {/* Objectives Card */}
                    <div className="p-6 rounded-2xl bg-neutral-900 border border-white/5">
                        <h3 className="text-lg font-bold text-white mb-4">{content.roadmapTitle}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {content.learningObjectives.map((obj, i) => (
                                <div key={i} className="flex items-start gap-2 text-sm text-neutral-300">
                                    <IconCheck size={16} className="text-cyan-500 mt-0.5 flex-shrink-0" />
                                    {obj}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-4 border-b border-white/10">
                        <button 
                            onClick={() => setActiveTab('learn')}
                            className={clsx("pb-2 px-1 text-sm font-medium transition-colors border-b-2", activeTab === 'learn' ? "text-white border-cyan-500" : "text-neutral-500 border-transparent")}
                        >
                            Learning Resources
                        </button>
                        <button 
                            onClick={() => setActiveTab('practice')}
                            className={clsx("pb-2 px-1 text-sm font-medium transition-colors border-b-2", activeTab === 'practice' ? "text-white border-cyan-500" : "text-neutral-500 border-transparent")}
                        >
                            Practice & Assignment
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        {activeTab === 'learn' ? (
                            <motion.div 
                                key="learn" 
                                initial={{ opacity: 0, y: 10 }} 
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-3"
                            >
                                {content.resources.map(res => (
                                    <a href={res.url} key={res.id} className="flex items-center gap-4 p-4 rounded-xl bg-neutral-900/50 border border-white/5 hover:border-cyan-500/30 transition-colors group">
                                        <div className={clsx("p-3 rounded-lg", res.type === 'Video' ? "bg-red-500/10 text-red-500" : "bg-blue-500/10 text-blue-500")}>
                                            {res.type === 'Video' ? <IconVideo size={24} /> : <IconFileText size={24} />}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-white font-medium group-hover:text-cyan-400 transition-colors">{res.title}</h4>
                                            <p className="text-xs text-neutral-500">{res.type} • Admin Recommended</p>
                                        </div>
                                        <IconArrowRight size={16} className="text-neutral-600 group-hover:text-white" />
                                    </a>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="practice"
                                initial={{ opacity: 0, y: 10 }} 
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-6"
                            >
                                <div className="p-6 rounded-2xl bg-gradient-to-br from-neutral-900 to-black border border-white/10">
                                    <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                                        <IconBook className="text-yellow-500" /> Mandatory Assignment
                                    </h3>
                                    <p className="text-sm text-neutral-400 mb-6">{content.assignment.description}</p>
                                    
                                    <ul className="space-y-3 mb-6">
                                        {content.assignment.tasks.map((task, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm text-neutral-300">
                                                <span className="w-5 h-5 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-bold text-neutral-500 border border-white/10">{i + 1}</span>
                                                {task}
                                            </li>
                                        ))}
                                    </ul>

                                    {profile.isAssignmentPending ? (
                                        <button 
                                            onClick={() => { completeAssignment(category.id); confetti({ particleCount: 100, origin: { y: 0.7 }}); }}
                                            className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all shadow-lg shadow-cyan-900/20"
                                        >
                                            Mark Assignment Complete
                                        </button>
                                    ) : (
                                        <div className="w-full py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 font-bold text-center flex items-center justify-center gap-2">
                                            <IconCircleCheck /> Assignment Submitted
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right: Status Panel */}
                <div className="lg:col-span-1">
                    <div className="sticky top-0 space-y-4">
                        <div className="p-6 rounded-2xl bg-neutral-900 border border-white/10 flex flex-col items-center text-center">
                            <div className="w-24 h-24 rounded-full border-4 border-neutral-800 flex items-center justify-center mb-4 relative">
                                <span className="text-3xl font-bold text-white">{profile.score}%</span>
                                {isCooldownActive && (
                                    <div className="absolute inset-0 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center">
                                        <IconLock className="text-white/50" />
                                    </div>
                                )}
                            </div>
                            
                            <h3 className="text-white font-bold mb-1">Current Status</h3>
                            <p className="text-sm text-neutral-500 mb-6">
                                {profile.currentLevel === 'A' ? "Mastery Level" : profile.currentLevel === 'B' ? "Proficient" : "Needs Improvement"}
                            </p>

                            <button
                                onClick={handleRetest}
                                disabled={isCooldownActive || profile.isAssignmentPending}
                                className={clsx(
                                    "w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all",
                                    (isCooldownActive || profile.isAssignmentPending)
                                        ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                                        : "bg-white text-black hover:bg-cyan-400"
                                )}
                            >
                                {isCooldownActive ? (
                                    <>
                                        <IconClock size={18} /> <CooldownTimer targetDate={profile.nextRetestAvailableAt} />
                                    </>
                                ) : profile.isAssignmentPending ? (
                                    <>Finish Assignment First <IconLock size={18}/></>
                                ) : (
                                    <>Take Re-Test <IconRefresh size={18}/></>
                                )}
                            </button>
                            
                            {isCooldownActive && (
                                <p className="text-xs text-neutral-500 mt-3">
                                    Cooldown active. Review materials while you wait.
                                </p>
                            )}
                        </div>

                        {/* History */}
                        <div className="p-4 rounded-2xl bg-neutral-900/50 border border-white/5">
                            <h4 className="text-sm font-bold text-white mb-3">Attempt History</h4>
                            <div className="space-y-2">
                                {profile.history.slice().reverse().slice(0, 5).map((h, i) => (
                                    <div key={i} className="flex justify-between items-center text-xs p-2 rounded bg-black/20">
                                        <span className="text-neutral-500">{new Date(h.date).toLocaleDateString()}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-white font-bold">{h.score}%</span>
                                            <LevelBadge level={h.level} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main Page ---

export const Prepare = () => {
    const { skillProfiles, submitDiagnostic } = useStore();
    const [view, setView] = useState<'dashboard' | 'quiz' | 'improvement'>('dashboard');
    const [selectedCategory, setSelectedCategory] = useState<SkillCategory | null>(null);

    // Filter Logic for Dashboard
    const assessedCategories = Object.keys(skillProfiles);
    const weakCategories = assessedCategories
        .map(id => skillProfiles[id])
        .filter(p => p.currentLevel === 'C')
        .sort((a, b) => a.score - b.score)
        .slice(0, 2); // Top 2 Weakest

    const handleStartDiagnostic = (category: SkillCategory) => {
        setSelectedCategory(category);
        setView('quiz');
    };

    const handleOpenImprovement = (category: SkillCategory) => {
        setSelectedCategory(category);
        setView('improvement');
    };

    if (view === 'quiz' && selectedCategory) {
        return (
            <div className="h-full flex items-center justify-center p-4">
                <DiagnosticQuiz 
                    category={selectedCategory}
                    onCancel={() => setView('dashboard')}
                    onComplete={(score) => {
                        submitDiagnostic(selectedCategory.id, score);
                        setView('dashboard'); // Return to dash to see updated results
                        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }});
                    }}
                />
            </div>
        );
    }

    if (view === 'improvement' && selectedCategory) {
        const profile = skillProfiles[selectedCategory.id];
        if (!profile) return <div>Error loading profile</div>;
        return (
            <ImprovementHub 
                category={selectedCategory} 
                profile={profile} 
                onBack={() => setView('dashboard')} 
            />
        );
    }

    return (
        <div className="h-full flex flex-col max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <IconBrain className="text-cyan-400" size={32} /> Skill Diagnostic Engine
                </h1>
                <p className="text-neutral-400">
                    A personalized mentor that diagnoses weaknesses, prescribes learning, and tracks improvement.
                </p>
            </div>

            {/* PRIORITY ACTION AREA */}
            {weakCategories.length > 0 && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20"
                >
                    <h2 className="text-red-400 font-bold mb-4 flex items-center gap-2">
                        <IconAlertTriangle size={20} /> Priority Focus Areas
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {weakCategories.map(profile => {
                            const cat = SKILL_CATEGORIES.find(c => c.id === profile.categoryId)!;
                            return (
                                <div key={profile.categoryId} className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-red-500/10">
                                    <div>
                                        <h3 className="text-white font-bold">{cat.name}</h3>
                                        <p className="text-xs text-red-400 mt-1">Score: {profile.score}% (Beginner)</p>
                                    </div>
                                    <button 
                                        onClick={() => handleOpenImprovement(cat)}
                                        className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-colors"
                                    >
                                        Improve Now
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            )}

            {/* CATEGORY GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                {SKILL_CATEGORIES.map((cat, idx) => {
                    const profile = skillProfiles[cat.id];
                    
                    return (
                        <motion.div
                            key={cat.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className="group p-6 rounded-2xl bg-neutral-900 border border-white/5 hover:border-cyan-500/30 transition-all hover:bg-neutral-800/80 relative overflow-hidden"
                        >
                            {/* Decorative Background Icon */}
                            <IconTargetArrow className="absolute -right-4 -bottom-4 text-white/5 w-24 h-24 rotate-[-15deg] group-hover:scale-110 transition-transform" />

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 rounded-lg bg-white/5 text-cyan-400">
                                        <IconChartBar size={24} />
                                    </div>
                                    {profile && <LevelBadge level={profile.currentLevel} />}
                                </div>

                                <h3 className="text-lg font-bold text-white mb-2">{cat.name}</h3>
                                <p className="text-sm text-neutral-400 mb-6 flex-1">{cat.description}</p>

                                {profile ? (
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-xs text-neutral-500">
                                            <span>Current Score</span>
                                            <span className="text-white font-bold">{profile.score}%</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                                            <div 
                                                className={clsx("h-full", profile.score >= 95 ? "bg-green-500" : profile.score >= 75 ? "bg-yellow-500" : "bg-red-500")} 
                                                style={{ width: `${profile.score}%` }} 
                                            />
                                        </div>
                                        <button 
                                            onClick={() => handleOpenImprovement(cat)}
                                            className="w-full mt-2 py-2.5 rounded-lg bg-white text-black font-bold text-sm hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
                                        >
                                            View Roadmap <IconArrowRight size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="mt-auto">
                                        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-4">
                                            <IconClock size={14} /> {cat.timeLimitMinutes} min assessment
                                        </div>
                                        <button 
                                            onClick={() => handleStartDiagnostic(cat)}
                                            className="w-full py-2.5 rounded-lg bg-neutral-800 border border-white/10 text-white font-medium text-sm hover:bg-cyan-500/10 hover:text-cyan-400 hover:border-cyan-500/50 transition-all"
                                        >
                                            Start Diagnostic
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};
