import React from 'react';

export interface User {
  name: string;
  role: string;
  avatar: string;
  isProfileSetup: boolean;
}

export interface InterviewStat {
  id: string;
  date: string;
  score: number;
  type: 'Coding' | 'System Design' | 'HR';
  status: 'Passed' | 'Review' | 'Failed';
  feedbackSummary: string;
}

export interface CodingQuestion {
  id: string;
  title: string;
  slug: string; // LeetCode URL slug
  difficulty: 'Easy' | 'Medium' | 'Hard';
  status: 'Solved' | 'Todo' | 'Attempted';
  tags: string[];
  platform: 'LeetCode' | 'Custom';
  acceptanceRate?: number;
  snippet?: string; // Preview code
  hint?: string; // Conceptual hint or problem description snippet
  lastPracticed?: Date;
}

export interface SkillMetric {
  subject: string;
  A: number; // Current User
  B: number; // Average
  fullMark: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface HREvaluation {
  communication: number;
  confidence: number;
  technical: number;
  culturalFit: number;
  notes: string[];
}

// --- Skill Diagnostic Engine Types ---

export type SkillLevel = 'A' | 'B' | 'C'; // A=Advanced, B=Intermediate, C=Beginner

export interface SkillCategory {
  id: string;
  name: string;
  description: string;
  totalQuestions: number;
  timeLimitMinutes: number;
}

export interface UserSkillProfile {
  categoryId: string;
  currentLevel: SkillLevel;
  previousLevel?: SkillLevel;
  score: number; // 0-100
  attempts: number;
  lastAssessedAt: number; // Timestamp
  nextRetestAvailableAt: number; // Timestamp (Cooldown)
  isAssignmentPending: boolean;
  completionPercentage: number; // 0-100 Real-time tracker
  history: { date: number; score: number; level: SkillLevel }[];
}

export interface SkillResource {
  id: string;
  title: string;
  type: 'Video' | 'Article' | 'PDF';
  url: string;
  duration?: string;
}

export interface SkillAssignment {
  id: string;
  title: string;
  description: string;
  tasks: string[];
  isCompleted: boolean;
}

export interface LevelContent {
  level: SkillLevel;
  roadmapTitle: string;
  duration: string;
  topics: string[];
  learningObjectives: string[];
  resources: SkillResource[];
  assignment: SkillAssignment;
}

// --- Analytics & Streak Types ---

export type ActivityType = 'LOGIN' | 'DIAGNOSTIC' | 'PRACTICE' | 'ASSIGNMENT' | 'RETEST' | 'CODING_PROBLEM';

export interface ActivityLog {
  id: string;
  userId: string; // For future multi-user support
  type: ActivityType;
  categoryId?: string; // Optional, if related to a specific skill
  timestamp: number;
  weight: number; // Contribution to daily activity score
}

export interface StreakState {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string; // ISO Date String YYYY-MM-DD
  activeDaysHistory: Record<string, boolean>; // map of YYYY-MM-DD -> true
}

// Keep existing roadmap types for backward compatibility if needed, 
// though the new engine replaces the main flow.
export interface PreparationRoadmap {
  id: string;
  createdAt: Date;
  company: string;
  role: string;
  level: string;
  phases: any[];
}
