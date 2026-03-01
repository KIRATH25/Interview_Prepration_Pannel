import React from 'react';
import { motion } from 'framer-motion';
import { IconUserCheck, IconMessageDots, IconBrain, IconBriefcase } from '@tabler/icons-react';

export const HRRound = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white mb-2">HR Evaluation Round</h1>
            <p className="text-neutral-400 mb-6">Behavioral and soft-skills assessment results.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Score Cards */}
                <div className="md:col-span-2 space-y-6">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-6 rounded-2xl bg-neutral-900 border border-white/5"
                    >
                        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                            <IconMessageDots className="text-cyan-400" /> Communication Score
                        </h3>
                        <div className="flex items-end gap-2 mb-2">
                            <span className="text-4xl font-bold text-white">92</span>
                            <span className="text-neutral-500 mb-1">/ 100</span>
                        </div>
                        <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden mb-4">
                            <div className="h-full bg-gradient-to-r from-green-400 to-cyan-500 w-[92%]" />
                        </div>
                        <p className="text-sm text-neutral-400">
                            Candidate articulates ideas clearly. Uses the STAR method effectively for behavioral questions. 
                            Paused appropriately to structure thoughts.
                        </p>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="p-6 rounded-2xl bg-neutral-900 border border-white/5"
                    >
                         <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                            <IconBrain className="text-violet-400" /> Cultural Fit
                        </h3>
                         <div className="flex items-end gap-2 mb-2">
                            <span className="text-4xl font-bold text-white">88</span>
                            <span className="text-neutral-500 mb-1">/ 100</span>
                        </div>
                        <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden mb-4">
                            <div className="h-full bg-gradient-to-r from-violet-400 to-fuchsia-500 w-[88%]" />
                        </div>
                         <p className="text-sm text-neutral-400">
                            Shows strong alignment with company values of ownership and rapid iteration. 
                            Demonstrated good teamwork in past project examples.
                        </p>
                    </motion.div>
                </div>

                {/* AI Tips Panel */}
                <motion.div 
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     className="p-6 rounded-2xl bg-gradient-to-b from-neutral-900 to-neutral-950 border border-white/10"
                >
                    <div className="flex items-center gap-2 mb-6">
                        <IconBriefcase className="text-amber-400" />
                        <h3 className="text-lg font-semibold text-white">Improvement Tips</h3>
                    </div>

                    <div className="space-y-4">
                        {[
                            "When discussing failures, focus slightly more on the 'Learnings' aspect of the answer.",
                            "Maintain eye contact (camera focus) more consistently during long explanations.",
                            "Your 'Why do you want to join us?' answer was good, but could be more specific to our recent product launches."
                        ].map((tip, idx) => (
                            <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/5 text-sm text-neutral-300">
                                <span className="text-cyan-500 font-bold mr-2">AI</span>
                                {tip}
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};