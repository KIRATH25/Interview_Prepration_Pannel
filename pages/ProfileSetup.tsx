import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../lib/store';
import { motion } from 'framer-motion';
import { IconCheck, IconUser, IconArrowRight, IconSparkles } from '@tabler/icons-react';
import { clsx } from 'clsx';
import { Spotlight } from '../components/ui/Spotlight';

// Using 'avataaars' as closest match for 'Toon Head' since it's the standard playful SVG library in DiceBear API
// Using 'notionists' as requested
const TOON_SEEDS = ["Brian", "Amaya", "Jameson", "Valentina", "Alexander", "Sarah", "Jack", "Sophia"];
const NOTION_SEEDS = [
    "Chase", "Brian", "Amaya", "Jameson", "Wyatt", "Valentina", "Leo", "Alexander", 
    "Caleb", "Katherine", "Christopher", "Aiden", "Sarah", "Jack", "Sara", "Leah", 
    "Sadie", "Sophia", "Robert", "Ryan"
];

const AVATAR_COLLECTIONS = [
    { id: 'toon', name: 'Toon Style', style: 'avataaars', seeds: TOON_SEEDS },
    { id: 'notion', name: 'Notion Style', style: 'notionists', seeds: NOTION_SEEDS }
];

export const ProfileSetup = () => {
    const navigate = useNavigate();
    const { updateProfile, user } = useStore();
    
    const [name, setName] = useState(user.name !== "Guest User" ? user.name : "");
    const [selectedCollection, setSelectedCollection] = useState(0);
    const [selectedAvatar, setSelectedAvatar] = useState(user.avatar || `https://api.dicebear.com/9.x/avataaars/svg?seed=Brian`);

    const handleSave = () => {
        if (!name.trim()) return;
        updateProfile(name, selectedAvatar);
        navigate('/dashboard');
    };

    const getAvatarUrl = (style: string, seed: string) => `https://api.dicebear.com/9.x/${style}/svg?seed=${seed}`;

    return (
        <div className="min-h-screen w-full bg-black/[0.96] bg-grid-white/[0.02] relative overflow-hidden flex items-center justify-center p-4">
            <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-4xl bg-neutral-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[85vh] md:h-[800px]"
            >
                {/* Left Panel: Inputs */}
                <div className="md:w-1/3 p-8 border-r border-white/10 flex flex-col bg-neutral-900/50 backdrop-blur-xl z-10 relative">
                    <div className="mb-8">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 mb-4">
                            <IconUser className="text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-white">Create Your Profile</h1>
                        <p className="text-neutral-400 text-sm mt-2">Choose your identity. This will be persisted across your sessions.</p>
                    </div>

                    <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar">
                        <div>
                            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Display Name</label>
                            <input 
                                type="text" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Alex Johnson"
                                className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Avatar Style</label>
                            <div className="flex gap-2 p-1 bg-neutral-950 rounded-xl border border-white/5">
                                {AVATAR_COLLECTIONS.map((col, idx) => (
                                    <button
                                        key={col.id}
                                        onClick={() => setSelectedCollection(idx)}
                                        className={clsx(
                                            "flex-1 py-2 rounded-lg text-sm font-medium transition-all",
                                            selectedCollection === idx ? "bg-white/10 text-white shadow-sm" : "text-neutral-500 hover:text-white"
                                        )}
                                    >
                                        {col.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 border border-white/5 flex flex-col items-center">
                            <span className="text-xs text-neutral-500 mb-2">Selected Preview</span>
                            <div className="w-32 h-32 rounded-full border-4 border-cyan-500/20 bg-white/5 p-1 shadow-xl shadow-cyan-900/20 relative">
                                <img src={selectedAvatar} alt="Preview" className="w-full h-full rounded-full bg-neutral-800" />
                                <div className="absolute bottom-0 right-0 p-1.5 bg-cyan-500 rounded-full border-2 border-neutral-900">
                                    <IconCheck size={14} className="text-white" stroke={4} />
                                </div>
                            </div>
                            <h3 className="text-white font-bold mt-3 text-lg">{name || "Your Name"}</h3>
                            <p className="text-xs text-neutral-500">Ready to interview</p>
                        </div>
                    </div>

                    <div className="mt-8 pt-4 border-t border-white/5">
                        <button
                            onClick={handleSave}
                            disabled={!name.trim()}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
                        >
                            Save & Continue <IconArrowRight size={18} />
                        </button>
                    </div>
                </div>

                {/* Right Panel: Avatar Grid */}
                <div className="flex-1 bg-neutral-950/50 p-8 overflow-y-auto custom-scrollbar relative">
                    <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-neutral-950 to-transparent pointer-events-none z-10" />
                    
                    <h2 className="text-lg font-bold text-white mb-6 sticky top-0 z-20 flex items-center gap-2">
                        <IconSparkles className="text-yellow-500" size={18} /> 
                        Choose your {AVATAR_COLLECTIONS[selectedCollection].name}
                    </h2>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pb-20">
                        {AVATAR_COLLECTIONS[selectedCollection].seeds.map((seed) => {
                            const url = getAvatarUrl(AVATAR_COLLECTIONS[selectedCollection].style, seed);
                            const isSelected = selectedAvatar === url;

                            return (
                                <button
                                    key={seed}
                                    onClick={() => setSelectedAvatar(url)}
                                    className={clsx(
                                        "group relative aspect-square rounded-2xl p-2 transition-all duration-200",
                                        isSelected 
                                            ? "bg-cyan-500/20 border-2 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)] scale-105" 
                                            : "bg-neutral-900 border border-white/5 hover:border-white/20 hover:bg-neutral-800"
                                    )}
                                >
                                    <img 
                                        src={url} 
                                        alt={seed} 
                                        className="w-full h-full rounded-xl transition-transform group-hover:scale-110" 
                                    />
                                    {isSelected && (
                                        <div className="absolute top-2 right-2 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center">
                                            <IconCheck size={14} className="text-white" stroke={4} />
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                    
                    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-neutral-950 to-transparent pointer-events-none" />
                </div>
            </motion.div>
        </div>
    );
};
