import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconSend, IconSparkles, IconUser, IconRobot } from '@tabler/icons-react';
import { GoogleGenAI, Chat } from '@google/genai';
import { ai, FEEDBACK_MODEL, SYSTEM_INSTRUCTION } from '../lib/gemini';
import { ChatMessage } from '../types';
import { clsx } from 'clsx';
import { useStore } from '../lib/store';

export const FeedbackAI = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: '1', role: 'model', text: 'Hello! I am your AI Interview Coach. I can analyze your past performance, help you practice answers, or explain complex topics. How can I help you today?', timestamp: new Date() }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { user } = useStore();
    
    // Maintain chat session ref
    const chatSessionRef = useRef<Chat | null>(null);

    useEffect(() => {
        // Initialize chat session
        try {
             chatSessionRef.current = ai.chats.create({
                model: FEEDBACK_MODEL,
                config: {
                    systemInstruction: SYSTEM_INSTRUCTION,
                }
            });
        } catch (e) {
            console.error("Failed to init chat", e);
        }
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            text: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            if (!chatSessionRef.current) {
                // Fallback if init failed (e.g. key issue), mostly for demo safety
                 setTimeout(() => {
                     setMessages(prev => [...prev, {
                        id: (Date.now() + 1).toString(),
                        role: 'model',
                        text: "I'm having trouble connecting to the AI service right now. Please check your API key configuration.",
                        timestamp: new Date()
                     }]);
                     setIsLoading(false);
                 }, 1000);
                 return;
            }

            const result = await chatSessionRef.current.sendMessage({ message: userMsg.text });
            const responseText = result.text || "I couldn't generate a response.";

            const aiMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: responseText,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error("AI Error:", error);
            const errorMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: "Sorry, I encountered an error while processing your request.",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="h-[calc(100vh-2rem)] md:h-[calc(100vh-3rem)] flex flex-col bg-neutral-900/50 rounded-2xl border border-white/5 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-white/5 bg-neutral-950/50 backdrop-blur-md flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/20">
                    <IconSparkles className="text-white" size={20} />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-white">Interview Coach AI</h2>
                    <p className="text-xs text-neutral-400 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/> 
                        Online • Powered by Gemini
                    </p>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {messages.map((msg) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={msg.id}
                        className={clsx(
                            "flex w-full",
                            msg.role === 'user' ? "justify-end" : "justify-start"
                        )}
                    >
                        <div className={clsx(
                            "flex max-w-[80%] gap-3",
                            msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                        )}>
                            {/* Avatar */}
                            <div className={clsx(
                                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
                                msg.role === 'user' ? "bg-neutral-800" : "bg-gradient-to-br from-violet-600 to-indigo-600"
                            )}>
                                {msg.role === 'user' ? (
                                    <IconUser size={16} className="text-neutral-400"/>
                                ) : (
                                    <IconRobot size={16} className="text-white"/>
                                )}
                            </div>

                            {/* Bubble */}
                            <div className={clsx(
                                "p-3 rounded-2xl text-sm leading-relaxed",
                                msg.role === 'user' 
                                    ? "bg-neutral-800 text-white rounded-tr-sm" 
                                    : "bg-white/5 border border-white/5 text-neutral-200 rounded-tl-sm shadow-sm backdrop-blur-sm"
                            )}>
                                <div className="whitespace-pre-wrap">{msg.text}</div>
                                <div className="text-[10px] opacity-40 mt-1">
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                         <div className="flex max-w-[80%] gap-3">
                             <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center flex-shrink-0 mt-1">
                                <IconSparkles size={16} className="animate-spin text-white"/>
                             </div>
                             <div className="p-3 rounded-2xl bg-white/5 border border-white/5 rounded-tl-sm backdrop-blur-sm">
                                <div className="flex gap-1 h-5 items-center">
                                    <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce"></span>
                                </div>
                             </div>
                         </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-neutral-950/50 backdrop-blur-md border-t border-white/5">
                <div className="relative flex items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask for feedback, improvements, or interview tips..."
                        className="w-full bg-neutral-900 border border-white/10 text-white placeholder-neutral-500 rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all shadow-inner"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 p-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                    >
                        <IconSend size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};