import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Outlet, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { Sidebar } from './components/ui/Sidebar';
import { Landing } from './pages/Landing';
import { DashboardHome } from './pages/DashboardHome';
import { InterviewResults } from './pages/InterviewResults';
import { HRRound } from './pages/HRRound';
import { CodingQuestions } from './pages/CodingQuestions';
import { FeedbackAI } from './pages/FeedbackAI';
import { Settings } from './pages/Settings';
import { Prepare } from './pages/Prepare';
import { ProfileSetup } from './pages/ProfileSetup';
import { AnimatePresence, motion } from 'framer-motion';
import { supabase } from './lib/supabase';
import { useStore } from './lib/store';
import { IconLoader } from '@tabler/icons-react';

const DashboardLayout = () => {
    const location = useLocation();

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-black text-neutral-200 font-sans selection:bg-cyan-500/30">
            <Sidebar />
            <main className="flex-1 p-6 md:p-8 overflow-y-auto h-screen relative">
                 <div className="max-w-7xl mx-auto">
                    {/* Animated Route Transition */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                 </div>
            </main>
        </div>
    );
};

// Component to handle Auth state and Routing
const AuthHandler = ({ children }: { children?: React.ReactNode }) => {
    const { setUser, user } = useStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check active session on load
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                // Keep existing store data if already set, otherwise sync basic info
                if (user.name === "Guest User") {
                     updateUserFromSession(session.user);
                }
                
                // If on landing page, go to dashboard
                if (location.pathname === '/') {
                    navigate('/dashboard');
                }
            } 
            
            setIsLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                if (user.name === "Guest User") {
                    updateUserFromSession(session.user);
                }
                if (window.location.hash === '#/') {
                    navigate('/dashboard');
                }
            }
        });

        return () => subscription.unsubscribe();
    }, [navigate, setUser]);

    // Profile Setup Check Effect
    useEffect(() => {
        if (!isLoading) {
            if (location.pathname.startsWith('/dashboard')) {
                // If accessing dashboard but profile not set up, go to setup
                if (!user.isProfileSetup) {
                    navigate('/setup-profile');
                }
            }
        }
    }, [isLoading, location.pathname, user.isProfileSetup, navigate]);

    const updateUserFromSession = (sessionUser: any) => {
        // Only update basic info if not already customized via Profile Setup
        // This prevents overwriting the persistent profile with generic Supabase data
        if (!user.isProfileSetup) {
             setUser({
                name: sessionUser.user_metadata.full_name || sessionUser.email?.split('@')[0],
                // We don't overwrite avatar here to let the user choose in Setup
                role: 'Software Engineer' 
            });
        }
    };

    if (isLoading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-neutral-950 text-cyan-500">
                <IconLoader className="animate-spin" size={48} />
            </div>
        );
    }

    return <>{children}</>;
};

const App = () => {
  return (
    <HashRouter>
      <AuthHandler>
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/setup-profile" element={<ProfileSetup />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardHome />} />
                <Route path="prepare" element={<Prepare />} />
                <Route path="results" element={<InterviewResults />} />
                <Route path="hr" element={<HRRound />} />
                <Route path="coding" element={<CodingQuestions />} />
                <Route path="feedback" element={<FeedbackAI />} />
                <Route path="settings" element={<Settings />} />
            </Route>
        </Routes>
      </AuthHandler>
    </HashRouter>
  );
};

export default App;
