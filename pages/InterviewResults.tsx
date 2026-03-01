import React from 'react';
import { useStore } from '../lib/store';
import { ScoreTrend, TypeDistribution } from '../components/charts/Charts';
import { motion } from 'framer-motion';

export const InterviewResults = () => {
    const { stats } = useStore();

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white mb-6">Interview Analytics</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-2xl bg-neutral-900/50 border border-white/5"
                 >
                     <h3 className="text-lg font-semibold text-white mb-4">Score Progression</h3>
                     <ScoreTrend />
                 </motion.div>

                 <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-6 rounded-2xl bg-neutral-900/50 border border-white/5"
                 >
                     <h3 className="text-lg font-semibold text-white mb-4">Performance by Type</h3>
                     <TypeDistribution />
                 </motion.div>
            </div>

            <div className="mt-8">
                <h3 className="text-lg font-semibold text-white mb-4">Detailed History</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={stat.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className="group p-5 rounded-2xl bg-neutral-900 border border-white/5 hover:border-cyan-500/30 transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <span className="text-4xl font-bold">{stat.score}</span>
                            </div>
                            
                            <div className="flex justify-between items-start mb-3">
                                <span className={`px-2 py-1 rounded-md text-xs font-semibold ${
                                     stat.status === 'Passed' ? 'bg-green-500/10 text-green-400' :
                                     stat.status === 'Review' ? 'bg-yellow-500/10 text-yellow-400' :
                                     'bg-red-500/10 text-red-400'
                                }`}>
                                    {stat.status}
                                </span>
                                <span className="text-xs text-neutral-500">{new Date(stat.date).toLocaleDateString()}</span>
                            </div>

                            <h4 className="text-xl font-bold text-white mb-1">{stat.type} Round</h4>
                            <div className="w-full bg-neutral-800 h-1.5 rounded-full mt-2 mb-4 overflow-hidden">
                                <div 
                                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500" 
                                    style={{ width: `${stat.score}%` }}
                                />
                            </div>

                            <p className="text-sm text-neutral-400 line-clamp-2">{stat.feedbackSummary}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};