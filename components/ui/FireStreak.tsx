import React from 'react';
import { LordIcon } from './LordIcon';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

interface FireStreakProps {
    streakCount: number;
    className?: string;
    size?: number;
}

export const FireStreak = ({ streakCount, className, size = 32 }: FireStreakProps) => {
    return (
        <div className={cn("flex items-center gap-2 relative group", className)}>
            <div className="relative">
                {/* Glow Effect */}
                <motion.div 
                    animate={{ 
                        opacity: [0.4, 0.8, 0.4],
                        scale: [0.9, 1.1, 0.9] 
                    }}
                    transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute inset-0 bg-orange-500 blur-xl rounded-full"
                />
                
                {/* Fire Icon - Using a looping morphing fire/chart icon or generic fire */}
                <LordIcon 
                    src="https://cdn.lordicon.com/hotsuxQw.json" 
                    trigger="loop" 
                    size={size}
                    colors={{ primary: "#f97316", secondary: "#f59e0b" }} 
                />
            </div>
            
            <div className="flex flex-col">
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-500">
                    {streakCount}
                </span>
                <span className="text-[10px] text-orange-200/60 uppercase font-bold tracking-wider -mt-1 group-hover:text-orange-200 transition-colors">
                    Day Streak
                </span>
            </div>
        </div>
    );
};