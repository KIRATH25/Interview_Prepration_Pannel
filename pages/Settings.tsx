import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { IconBell, IconMoon, IconCheck, IconUser } from '@tabler/icons-react';
import { useStore } from '../lib/store';
import { clsx } from 'clsx';
import { Link } from 'react-router-dom';

const AVATAR_SEEDS_SHORT = ["Brian", "Amaya", "Jameson", "Valentina", "Alexander", "Sarah", "Chase", "Wyatt"];

export const Settings = () => {
    const { user, updateProfile } = useStore();
    const [name, setName] = useState(user.name);
    const [avatar, setAvatar] = useState(user.avatar);
    const [isSaved, setIsSaved] = useState(false);

    const handleSave = () => {
        updateProfile(name, avatar);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    return (
        <div className="space-y-8 max-w-4xl pb-20">
            <h1 className="text-2xl font-bold text-white">Settings</h1>

            {/* Profile Section */}
            <section className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <h2 className="text-lg font-semibold text-neutral-300">Profile Configuration</h2>
                    <Link to="/setup-profile" className="text-xs text-cyan-400 hover:underline">Re-run Full Setup</Link>
                </div>

                <div className="p-6 rounded-2xl bg-neutral-900 border border-white/5 flex flex-col md:flex-row items-start gap-8">
                    {/* Avatar Selection Mini */}
                    <div className="flex flex-col items-center gap-4">
                         <div className="w-24 h-24 rounded-full border-4 border-neutral-800 bg-neutral-800 relative">
                             <img src={avatar} alt="Avatar" className="w-full h-full rounded-full" />
                         </div>
                         <div className="grid grid-cols-4 gap-2">
                             {AVATAR_SEEDS_SHORT.map(seed => {
                                 // Simple mix of styles for quick selection
                                 const url = `https://api.dicebear.com/9.x/${seed === 'Chase' || seed === 'Wyatt' ? 'notionists' : 'avataaars'}/svg?seed=${seed}`;
                                 return (
                                     <button 
                                        key={seed}
                                        onClick={() => setAvatar(url)}
                                        className={clsx(
                                            "w-8 h-8 rounded-full border border-white/10 hover:scale-110 transition-transform overflow-hidden",
                                            avatar === url ? "ring-2 ring-cyan-500" : ""
                                        )}
                                     >
                                         <img src={url} alt={seed} className="w-full h-full" />
                                     </button>
                                 )
                             })}
                         </div>
                    </div>

                    <div className="space-y-4 flex-1 w-full">
                        <div className="space-y-1">
                            <label className="text-xs text-neutral-500 uppercase tracking-wider font-bold">Display Name</label>
                            <input 
                                type="text" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="block w-full bg-neutral-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all"
                            />
                        </div>
                         <div className="space-y-1">
                            <label className="text-xs text-neutral-500 uppercase tracking-wider font-bold">Role Title</label>
                             <input 
                                type="text" 
                                defaultValue={user.role} 
                                disabled
                                className="block w-full bg-neutral-900/50 border border-white/5 rounded-xl px-4 py-3 text-neutral-500 cursor-not-allowed"
                            />
                        </div>

                        <button 
                            onClick={handleSave}
                            className="px-6 py-2 rounded-lg bg-white text-black font-bold hover:bg-neutral-200 transition-colors flex items-center gap-2"
                        >
                            {isSaved ? <IconCheck size={18} /> : null}
                            {isSaved ? "Saved" : "Save Changes"}
                        </button>
                    </div>
                </div>
            </section>

            {/* Preferences */}
            <section className="space-y-4">
                 <h2 className="text-lg font-semibold text-neutral-300 border-b border-white/10 pb-2">Preferences</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="p-4 rounded-xl bg-neutral-900 border border-white/5 flex justify-between items-center">
                         <div className="flex items-center gap-3">
                             <div className="p-2 rounded-lg bg-neutral-800 text-neutral-300">
                                 <IconBell size={20} />
                             </div>
                             <div>
                                 <h4 className="text-sm font-medium text-white">Notifications</h4>
                                 <p className="text-xs text-neutral-500">Email alerts for new feedback</p>
                             </div>
                         </div>
                         <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="w-11 h-6 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                        </label>
                     </div>

                      <div className="p-4 rounded-xl bg-neutral-900 border border-white/5 flex justify-between items-center">
                         <div className="flex items-center gap-3">
                             <div className="p-2 rounded-lg bg-neutral-800 text-neutral-300">
                                 <IconMoon size={20} />
                             </div>
                             <div>
                                 <h4 className="text-sm font-medium text-white">Dark Mode</h4>
                                 <p className="text-xs text-neutral-500">Always on</p>
                             </div>
                         </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked disabled className="sr-only peer" />
                            <div className="w-11 h-6 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600 opacity-50"></div>
                        </label>
                     </div>
                 </div>
            </section>
        </div>
    );
};
