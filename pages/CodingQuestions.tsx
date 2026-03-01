import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useStore } from '../lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    IconBrandLeetcode, 
    IconCheck, 
    IconExternalLink, 
    IconSearch, 
    IconRefresh,
    IconCode,
    IconLoader,
    IconChevronLeft,
    IconChevronRight,
    IconCodeDots,
    IconBulb,
    IconFilter,
    IconX
} from '@tabler/icons-react';
import { CodingQuestion } from '../types';
import { clsx } from 'clsx';
import confetti from 'canvas-confetti';

const DifficultyBadge = ({ difficulty }: { difficulty: string }) => {
    const colors = {
        Easy: "bg-green-500/10 text-green-400 border-green-500/20",
        Medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
        Hard: "bg-red-500/10 text-red-400 border-red-500/20"
    };
    return (
        <span className={clsx("px-2.5 py-0.5 rounded-full text-xs font-medium border", colors[difficulty as keyof typeof colors] || colors.Easy)}>
            {difficulty}
        </span>
    );
};

interface QuestionRowProps {
    q: CodingQuestion;
    onToggle: (id: string) => void;
}

const QuestionRow: React.FC<QuestionRowProps> = ({ q, onToggle }) => {
    const [showSnippet, setShowSnippet] = useState(false);
    const [showHint, setShowHint] = useState(false);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="group flex flex-col p-4 rounded-xl bg-neutral-900/50 border border-white/5 hover:border-cyan-500/30 hover:bg-neutral-900 transition-all duration-200"
        >
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    {/* Status Toggle */}
                    <button 
                        onClick={(e) => { 
                            e.stopPropagation(); 
                            if (q.status !== 'Solved') {
                                confetti({
                                    particleCount: 150,
                                    spread: 70,
                                    origin: { y: 0.6 },
                                    colors: ['#22d3ee', '#8b5cf6', '#3b82f6', '#ffffff'],
                                    disableForReducedMotion: true,
                                    zIndex: 9999,
                                });
                            }
                            onToggle(q.id); 
                        }}
                        className={clsx(
                            "w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center border transition-all",
                            q.status === 'Solved' 
                                ? "bg-green-500 border-green-500 text-black shadow-[0_0_10px_rgba(34,197,94,0.4)]" 
                                : "bg-transparent border-white/20 text-transparent hover:border-white/40"
                        )}
                        title={q.status === 'Solved' ? "Mark as Unsolved" : "Mark as Solved"}
                    >
                        <IconCheck size={16} stroke={3} />
                    </button>

                    <div className="flex flex-col gap-1 min-w-0">
                        <div className="flex items-center gap-2">
                             <h3 className="text-base font-semibold text-neutral-200 group-hover:text-white transition-colors truncate">
                                {q.id}. {q.title}
                            </h3>
                            <div className="flex items-center gap-1">
                                {q.hint && (
                                    <button
                                        onClick={() => { setShowHint(!showHint); setShowSnippet(false); }}
                                        className={clsx(
                                            "p-1 rounded transition-colors",
                                            showHint ? "bg-yellow-500/20 text-yellow-400" : "hover:bg-white/10 text-neutral-500 hover:text-yellow-400"
                                        )}
                                        title="Show Hint"
                                    >
                                        <IconBulb size={16} />
                                    </button>
                                )}
                                {q.snippet && (
                                    <button 
                                        onClick={() => { setShowSnippet(!showSnippet); setShowHint(false); }}
                                        className={clsx(
                                            "p-1 rounded transition-colors",
                                            showSnippet ? "bg-cyan-500/20 text-cyan-400" : "hover:bg-white/10 text-neutral-500 hover:text-cyan-400"
                                        )}
                                        title="Toggle Code Snippet"
                                    >
                                        <IconCodeDots size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                       
                        <div className="flex items-center gap-2 flex-wrap">
                            <DifficultyBadge difficulty={q.difficulty} />
                            <span className="text-xs text-neutral-500 hidden sm:inline-block">•</span>
                            <div className="hidden sm:flex items-center gap-2">
                                 {q.tags.slice(0, 3).map(tag => (
                                    <span key={tag} className="text-xs text-neutral-500 bg-white/5 px-2 py-0.5 rounded-md border border-white/5 whitespace-nowrap">
                                        {tag}
                                    </span>
                                 ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-right hidden md:block">
                        <span className="text-xs text-neutral-500 block">Acceptance</span>
                        <span className="text-sm font-medium text-neutral-300">{q.acceptanceRate}%</span>
                    </div>
                    
                    <a 
                        href={`https://leetcode.com/problems/${q.slug}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-800 hover:bg-white/10 text-neutral-300 hover:text-white transition-all border border-white/5 group-hover:border-cyan-500/30"
                    >
                        <span className="text-sm font-medium hidden sm:inline">Solve</span>
                        <IconExternalLink size={16} />
                    </a>
                </div>
            </div>

            {/* Hint / Concept Section */}
            <AnimatePresence>
                {showHint && q.hint && (
                    <motion.div
                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                        animate={{ height: "auto", opacity: 1, marginTop: 12 }}
                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="rounded-lg bg-[#1e1e1e] border border-white/10 p-4 shadow-inner relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500"></div>
                            <h4 className="text-xs font-bold text-yellow-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                <IconBulb size={14} /> Concept Hint
                            </h4>
                            <p className="text-sm font-mono text-neutral-300 leading-relaxed">
                                {q.hint}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Snippet Preview */}
            <AnimatePresence>
                {showSnippet && q.snippet && (
                    <motion.div
                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                        animate={{ height: "auto", opacity: 1, marginTop: 12 }}
                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="rounded-lg bg-black border border-white/10 p-3 overflow-x-auto relative">
                             <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>
                             <h4 className="text-xs font-bold text-cyan-500 uppercase tracking-wider mb-2 pl-2">
                                Solution Snippet
                            </h4>
                            <pre className="text-xs font-mono text-neutral-400 pl-2">
                                <code>{q.snippet}</code>
                            </pre>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export const CodingQuestions = () => {
    const { codingQuestions, isLoadingQuestions, fetchCodingQuestions, toggleQuestionStatus } = useStore();
    
    // Filters State
    const [statusFilter, setStatusFilter] = useState<'All' | 'Solved' | 'Todo'>('All');
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [isTagFilterOpen, setIsTagFilterOpen] = useState(false);
    const [tagSearch, setTagSearch] = useState('');

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    // Load data on mount
    useEffect(() => {
        if (codingQuestions.length === 0) {
            fetchCodingQuestions();
        }
    }, []);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    // Extract all unique tags
    const uniqueTags = useMemo(() => {
        const tags = new Set<string>();
        codingQuestions.forEach(q => {
            q.tags.forEach(t => tags.add(t));
        });
        return Array.from(tags).sort();
    }, [codingQuestions]);

    const filteredTags = uniqueTags.filter(tag => 
        tag.toLowerCase().includes(tagSearch.toLowerCase())
    );

    // Optimized Filtering Logic
    const filteredQuestions = useMemo(() => {
        return codingQuestions.filter(q => {
            // 1. Search Text (Title or ID)
            const searchLower = debouncedSearch.toLowerCase();
            const matchesSearch = 
                !searchLower || 
                q.title.toLowerCase().includes(searchLower) || 
                q.id.toString().includes(searchLower);

            if (!matchesSearch) return false;

            // 2. Status Filter
            const matchesStatus = statusFilter === 'All' || q.status === statusFilter;
            if (!matchesStatus) return false;

            // 3. Tags Filter (AND logic - question must have ALL selected tags)
            if (selectedTags.length > 0) {
                const hasAllTags = selectedTags.every(tag => q.tags.includes(tag));
                if (!hasAllTags) return false;
            }

            return true;
        });
    }, [codingQuestions, debouncedSearch, statusFilter, selectedTags]);

    // Pagination Calculation
    const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);
    const paginatedQuestions = filteredQuestions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch, statusFilter, selectedTags]);

    // Scroll to top on page change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage]);

    const solvedCount = codingQuestions.filter(q => q.status === 'Solved').length;
    const progressPercentage = codingQuestions.length > 0 
        ? Math.round((solvedCount / codingQuestions.length) * 100) 
        : 0;

    const toggleTag = (tag: string) => {
        setSelectedTags(prev => 
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <span className="bg-[#FFA116] text-black p-1.5 rounded-lg">
                            <IconBrandLeetcode size={28} />
                        </span>
                        LeetCode Tracker
                    </h1>
                    <p className="text-neutral-400 mt-2">
                        Browse all {codingQuestions.length > 0 ? codingQuestions.length.toLocaleString() : '...'} questions.
                        Sync status and track progress.
                    </p>
                </div>
                
                <div className="flex items-center gap-4 bg-neutral-900/50 p-3 rounded-xl border border-white/10 backdrop-blur-sm min-w-[240px]">
                    <div className="flex flex-col flex-1">
                        <span className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Total Solved</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-xl font-bold text-white">{solvedCount}</span>
                            <span className="text-neutral-500 text-sm">/ {codingQuestions.length}</span>
                        </div>
                    </div>
                    <div className="w-24 h-2 bg-neutral-800 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercentage}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-[#FFA116] to-yellow-500" 
                        />
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-xl py-4 -mx-4 px-4 border-b border-white/5 flex flex-col gap-4 shadow-lg">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full sm:w-96 group">
                        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by Title or ID..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-neutral-900 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar">
                        {(['All', 'Solved', 'Todo'] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setStatusFilter(f)}
                                className={clsx(
                                    "px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                                    statusFilter === f 
                                        ? "bg-white/10 text-white shadow-inner border border-white/5" 
                                        : "text-neutral-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                {f}
                            </button>
                        ))}
                         
                         {/* Tag Filter Toggle */}
                         <div className="relative">
                            <button
                                onClick={() => setIsTagFilterOpen(!isTagFilterOpen)}
                                className={clsx(
                                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ml-2",
                                    selectedTags.length > 0 || isTagFilterOpen
                                        ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" 
                                        : "text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent"
                                )}
                            >
                                <IconFilter size={16} />
                                {selectedTags.length > 0 ? `${selectedTags.length} Tags` : "Tags"}
                            </button>

                            {/* Tag Dropdown */}
                            <AnimatePresence>
                                {isTagFilterOpen && (
                                    <>
                                        <div 
                                            className="fixed inset-0 z-10" 
                                            onClick={() => setIsTagFilterOpen(false)}
                                        />
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 top-full mt-2 w-72 md:w-80 max-h-96 bg-neutral-900 border border-white/10 rounded-xl shadow-2xl z-20 flex flex-col overflow-hidden"
                                        >
                                            <div className="p-3 border-b border-white/5">
                                                <input 
                                                    type="text" 
                                                    placeholder="Find a tag..." 
                                                    value={tagSearch}
                                                    onChange={(e) => setTagSearch(e.target.value)}
                                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                                                    autoFocus
                                                />
                                            </div>
                                            <div className="overflow-y-auto flex-1 p-2 space-y-1 custom-scrollbar">
                                                {filteredTags.map(tag => (
                                                    <label 
                                                        key={tag} 
                                                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
                                                    >
                                                        <div className={clsx(
                                                            "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                                                            selectedTags.includes(tag) 
                                                                ? "bg-cyan-500 border-cyan-500" 
                                                                : "border-neutral-600 bg-transparent"
                                                        )}>
                                                            {selectedTags.includes(tag) && <IconCheck size={10} className="text-black" stroke={4} />}
                                                        </div>
                                                        <span className={clsx("text-sm", selectedTags.includes(tag) ? "text-white font-medium" : "text-neutral-400")}>{tag}</span>
                                                    </label>
                                                ))}
                                                {filteredTags.length === 0 && (
                                                    <p className="text-xs text-neutral-500 text-center py-4">No tags found.</p>
                                                )}
                                            </div>
                                            {selectedTags.length > 0 && (
                                                <div className="p-2 border-t border-white/5 bg-black/20">
                                                    <button 
                                                        onClick={() => setSelectedTags([])}
                                                        className="w-full py-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                                                    >
                                                        Clear Selected ({selectedTags.length})
                                                    </button>
                                                </div>
                                            )}
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                         </div>

                        <button 
                            onClick={() => { fetchCodingQuestions(); confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 }}); }}
                            className="p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors ml-2" 
                            title="Force Sync from API"
                        >
                            <IconRefresh size={20} className={clsx(isLoadingQuestions && "animate-spin")} />
                        </button>
                    </div>
                </div>

                {/* Active Filters Display */}
                {selectedTags.length > 0 && (
                    <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-2">
                        {selectedTags.map(tag => (
                            <span key={tag} className="flex items-center gap-1 pl-2 pr-1 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium">
                                {tag}
                                <button 
                                    onClick={() => toggleTag(tag)}
                                    className="p-0.5 hover:bg-cyan-500/20 rounded transition-colors"
                                >
                                    <IconX size={12} />
                                </button>
                            </span>
                        ))}
                        <button 
                            onClick={() => setSelectedTags([])}
                            className="text-xs text-neutral-500 hover:text-white underline px-2"
                        >
                            Clear all
                        </button>
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className="min-h-[600px] relative">
                {isLoadingQuestions && codingQuestions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-neutral-500 gap-4">
                        <IconLoader size={32} className="animate-spin text-cyan-500" />
                        <p>Fetching 3000+ questions from API...</p>
                        <p className="text-xs text-neutral-600">This might take up to 30 seconds on the first load.</p>
                    </div>
                ) : filteredQuestions.length > 0 ? (
                    <div className="space-y-3">
                         <AnimatePresence mode='popLayout'>
                            {paginatedQuestions.map((q) => (
                                <QuestionRow key={q.id} q={q} onToggle={toggleQuestionStatus} />
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-neutral-500">
                        <IconCode size={48} stroke={1} className="mb-4 opacity-20" />
                        <p>No questions found matching your criteria.</p>
                        <button 
                            onClick={() => {setSearch(''); setStatusFilter('All'); setSelectedTags([]);}}
                            className="mt-2 text-cyan-500 hover:underline text-sm"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </div>
            
            {/* Pagination Controls */}
            {!isLoadingQuestions && filteredQuestions.length > 0 && (
                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <p className="text-sm text-neutral-500">
                        Showing <span className="text-white font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-white font-medium">{Math.min(currentPage * itemsPerPage, filteredQuestions.length)}</span> of <span className="text-white font-medium">{filteredQuestions.length}</span>
                    </p>
                    
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white disabled:opacity-50 disabled:hover:text-neutral-400 transition-colors"
                        >
                            <IconChevronLeft size={18} />
                        </button>
                        
                        <div className="flex items-center gap-1 hidden sm:flex">
                             {/* Simplified pagination logic for nicer UI */}
                             <span className="text-sm text-neutral-400 px-2">
                                Page {currentPage} of {totalPages}
                             </span>
                        </div>

                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white disabled:opacity-50 disabled:hover:text-neutral-400 transition-colors"
                        >
                            <IconChevronRight size={18} />
                        </button>
                    </div>
                </div>
            )}

            <div className="flex justify-center mt-8">
                 <p className="text-xs text-neutral-600 flex items-center gap-1">
                    <IconBrandLeetcode size={12} />
                    Powered by alfa-leetcode-api.
                 </p>
            </div>
        </div>
    );
};