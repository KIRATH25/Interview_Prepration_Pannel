import { create } from 'zustand';
import { User, InterviewStat, SkillMetric, CodingQuestion, PreparationRoadmap, UserSkillProfile, SkillLevel, ActivityLog, StreakState, ActivityType } from '../types';
import { LeetCodeService } from './leetcode-service';
import { persist } from 'zustand/middleware';

interface AppState {
  user: User;
  stats: InterviewStat[];
  skills: SkillMetric[];
  codingQuestions: CodingQuestion[];
  isSidebarOpen: boolean;
  isLoadingQuestions: boolean;
  
  // Roadmap History (Legacy support)
  roadmapHistory: PreparationRoadmap[];
  
  // --- Skill Engine State ---
  skillProfiles: Record<string, UserSkillProfile>; // categoryId -> Profile
  
  // --- Analytics & Streak State ---
  activityLogs: ActivityLog[];
  streak: StreakState;
  overallReadiness: number; // 0-100

  // Actions
  setUser: (user: Partial<User>) => void;
  updateProfile: (name: string, avatar: string) => void;
  toggleSidebar: () => void;
  fetchCodingQuestions: () => Promise<void>;
  toggleQuestionStatus: (id: string) => void;
  addRoadmap: (roadmap: PreparationRoadmap) => void;
  deleteRoadmap: (id: string) => void;
  updateRoadmapProgress: (roadmapId: string, updatedRoadmap: PreparationRoadmap) => void;

  // --- Skill Engine Actions ---
  submitDiagnostic: (categoryId: string, score: number) => void;
  completeAssignment: (categoryId: string) => void;
  resetSkillEngine: () => void; // For demo purposes
  
  // --- Analytics Actions ---
  logActivity: (type: ActivityType, categoryId?: string, weight?: number) => void;
}

// Helper to determine level
const determineLevel = (score: number): SkillLevel => {
  if (score >= 95) return 'A';
  if (score >= 75) return 'B';
  return 'C';
};

// Helper: Get Date String YYYY-MM-DD
const getDateString = (date: Date = new Date()) => {
    return date.toISOString().split('T')[0];
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: {
        name: "Guest User",
        role: "Aspiring Engineer",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest",
        isProfileSetup: false
      },
      isSidebarOpen: true,
      isLoadingQuestions: false,
      
      setUser: (userData) => set((state) => ({ user: { ...state.user, ...userData } })),
      
      updateProfile: (name, avatar) => set((state) => ({
          user: { ...state.user, name, avatar, isProfileSetup: true }
      })),

      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      
      stats: [
        { id: '1', date: '2023-10-24', score: 85, type: 'Coding', status: 'Passed', feedbackSummary: 'Strong algorithms, optimize space complexity.' },
        { id: '2', date: '2023-10-26', score: 72, type: 'System Design', status: 'Review', feedbackSummary: 'Good high-level, missed database sharding details.' },
      ],
      skills: [],
      codingQuestions: [], 
      roadmapHistory: [],

      // Initialize with empty object, will be populated as user takes tests
      skillProfiles: {},
      
      // Initialize Analytics
      activityLogs: [],
      streak: {
          currentStreak: 0,
          longestStreak: 0,
          lastActivityDate: '',
          activeDaysHistory: {}
      },
      overallReadiness: 0,

      fetchCodingQuestions: async () => {
          set({ isLoadingQuestions: true });
          try {
              const questions = await LeetCodeService.fetchQuestions();
              set({ codingQuestions: questions, isLoadingQuestions: false });
          } catch (error) {
              console.error("Failed to fetch questions", error);
              set({ isLoadingQuestions: false });
          }
      },

      toggleQuestionStatus: (id: string) => {
          const state = get();
          const question = state.codingQuestions.find(q => q.id === id);
          
          if (question && question.status !== 'Solved') {
             // If marking as solved, log activity
             state.logActivity('CODING_PROBLEM', undefined, 10);
          }

          set((state) => ({
              codingQuestions: state.codingQuestions.map(q => 
                  q.id === id 
                    ? { ...q, status: q.status === 'Solved' ? 'Todo' : 'Solved' } 
                    : q
              )
          }));
      },

      addRoadmap: (roadmap) => set((state) => ({ 
          roadmapHistory: [roadmap, ...state.roadmapHistory] 
      })),

      deleteRoadmap: (id) => set((state) => ({
          roadmapHistory: state.roadmapHistory.filter(r => r.id !== id)
      })),

      updateRoadmapProgress: (roadmapId, updatedRoadmap) => set((state) => ({
          roadmapHistory: state.roadmapHistory.map(r => r.id === roadmapId ? updatedRoadmap : r)
      })),

      // --- Analytics Core Logic ---
      
      logActivity: (type, categoryId, weight = 10) => {
          const now = Date.now();
          const todayStr = getDateString(new Date(now));
          const yesterday = new Date(now);
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = getDateString(yesterday);

          set(state => {
              const newLog: ActivityLog = {
                  id: Math.random().toString(36).substr(2, 9),
                  userId: 'user',
                  type,
                  categoryId,
                  timestamp: now,
                  weight
              };

              // Streak Calculation
              let { currentStreak, longestStreak, lastActivityDate, activeDaysHistory } = state.streak;
              
              // Only meaningful activities count (Login is handled separately usually, but here we count explicit actions)
              // If last activity was yesterday, increment streak
              if (lastActivityDate === yesterdayStr) {
                   if (getDateString(new Date(state.activityLogs[state.activityLogs.length - 1]?.timestamp || 0)) !== todayStr) {
                       // Ensure we haven't already counted today
                       currentStreak += 1;
                   }
              } 
              // If last activity was before yesterday, reset (unless it's already today)
              else if (lastActivityDate !== todayStr) {
                   currentStreak = 1;
              }
              // If last activity was today, streak remains same

              longestStreak = Math.max(longestStreak, currentStreak);
              
              // Record history
              const newHistory = { ...activeDaysHistory, [todayStr]: true };

              // Recalculate Overall Readiness
              // (Average of all profile scores * weights)
              const profiles = Object.values(state.skillProfiles) as UserSkillProfile[];
              let totalScore = 0;
              if (profiles.length > 0) {
                  totalScore = profiles.reduce((acc, p) => acc + p.score, 0) / profiles.length;
              }

              return {
                  activityLogs: [...state.activityLogs, newLog],
                  streak: {
                      currentStreak,
                      longestStreak,
                      lastActivityDate: todayStr,
                      activeDaysHistory: newHistory
                  },
                  overallReadiness: Math.round(totalScore)
              };
          });
      },

      // --- Skill Engine Actions ---

      submitDiagnostic: (categoryId, score) => {
          set((state) => {
            const level = determineLevel(score);
            const prevProfile = state.skillProfiles[categoryId];
            
            // Cooldown: 15 minutes + 10 seconds buffer
            const cooldownMs = 15 * 60 * 1000; 
            
            // Calculate Completion % based on weights
            // Base: 20%. Score contribution: up to 50%. Assignment pending: -20%
            let completion = 20 + (score * 0.5); 
            if (completion > 100) completion = 100;

            const newProfile: UserSkillProfile = {
              categoryId,
              currentLevel: level,
              previousLevel: prevProfile ? prevProfile.currentLevel : undefined,
              score: score,
              attempts: (prevProfile?.attempts || 0) + 1,
              lastAssessedAt: Date.now(),
              nextRetestAvailableAt: Date.now() + cooldownMs,
              isAssignmentPending: true, // Pending immediately after test
              completionPercentage: Math.round(completion),
              history: [
                ...(prevProfile?.history || []),
                { date: Date.now(), score, level }
              ]
            };

            return {
              skillProfiles: {
                ...state.skillProfiles,
                [categoryId]: newProfile
              }
            };
          });
          
          // Log the activity
          get().logActivity('DIAGNOSTIC', categoryId, 50);
      },

      completeAssignment: (categoryId) => {
          set((state) => {
            const profile = state.skillProfiles[categoryId];
            if (!profile) return state;

            // Boost completion percentage on assignment done
            const newCompletion = Math.min(100, profile.completionPercentage + 30);

            return {
              skillProfiles: {
                ...state.skillProfiles,
                [categoryId]: {
                  ...profile,
                  isAssignmentPending: false,
                  completionPercentage: newCompletion
                }
              }
            };
          });
          
          // Log the activity
          get().logActivity('ASSIGNMENT', categoryId, 40);
      },

      resetSkillEngine: () => set({ skillProfiles: {}, activityLogs: [], streak: { currentStreak: 0, longestStreak: 0, lastActivityDate: '', activeDaysHistory: {} } })
    }),
    {
      name: 'interviewx-store',
      partialize: (state) => ({ 
        user: state.user, 
        skillProfiles: state.skillProfiles, 
        roadmapHistory: state.roadmapHistory,
        streak: state.streak,
        activityLogs: state.activityLogs,
        overallReadiness: state.overallReadiness
      }),
    }
  )
);
