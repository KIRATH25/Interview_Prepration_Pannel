import { SkillCategory, LevelContent, SkillLevel } from '../types';

export const SKILL_CATEGORIES: SkillCategory[] = [
  { id: 'soft-skills', name: 'Soft Skills', description: 'Communication, Listening, Presentation', totalQuestions: 15, timeLimitMinutes: 20 },
  { id: 'aptitude', name: 'Aptitude & Assessment', description: 'Quant, Logical, Verbal, Psychometric', totalQuestions: 20, timeLimitMinutes: 30 },
  { id: 'coding', name: 'Coding & Technical', description: 'DSA, OOPS, Optimization, Debugging', totalQuestions: 10, timeLimitMinutes: 45 },
  { id: 'core-cs', name: 'Concept & Core Knowledge', description: 'OS, DBMS, Networks, Architecture', totalQuestions: 20, timeLimitMinutes: 25 },
  { id: 'system-design', name: 'System Design', description: 'LLD, HLD, Scalability, Microservices', totalQuestions: 5, timeLimitMinutes: 40 },
  { id: 'projects', name: 'Project & Practical', description: 'Case Studies, Real-time solving', totalQuestions: 8, timeLimitMinutes: 30 },
  { id: 'behavioral', name: 'Behavioral & Situational', description: 'STAR Method, Conflict Resolution', totalQuestions: 12, timeLimitMinutes: 20 },
  { id: 'leadership', name: 'Leadership & Management', description: 'Ownership, Mentorship, Task Mgmt', totalQuestions: 15, timeLimitMinutes: 25 },
  { id: 'hr-fit', name: 'HR & Cultural Fit', description: 'Values, Ethics, Negotiation', totalQuestions: 10, timeLimitMinutes: 15 },
  { id: 'final-rounds', name: 'Final & Special Rounds', description: 'Managerial, Client Interaction', totalQuestions: 5, timeLimitMinutes: 20 },
  { id: 'communication', name: 'Communication Specifics', description: 'Written, Verbal, Comprehension', totalQuestions: 15, timeLimitMinutes: 20 },
];

// Helper to generate content so we don't have 5000 lines of static text for this demo
// In a real app, this would be fetched from a database.
export const getLevelContent = (categoryId: string, level: SkillLevel): LevelContent => {
  const categoryName = SKILL_CATEGORIES.find(c => c.id === categoryId)?.name || 'Skill';
  
  let baseTitle = "";
  let duration = "";
  
  if (level === 'C') { // Beginner
    baseTitle = `Foundations of ${categoryName}`;
    duration = "2-3 Days";
  } else if (level === 'B') { // Intermediate
    baseTitle = `Intermediate ${categoryName} Mastery`;
    duration = "1-2 Weeks";
  } else { // Advanced
    baseTitle = `Advanced ${categoryName} Strategies`;
    duration = "2 Weeks+";
  }

  return {
    level,
    roadmapTitle: baseTitle,
    duration,
    topics: [
      `Core Principles of ${categoryName} (${level})`,
      `Common Interview Pitfalls in ${categoryName}`,
      `Practical Application Scenarios`,
      `Advanced Techniques & Optimization`,
      `Real-world Case Studies`
    ],
    learningObjectives: [
      "Understand the fundamental concepts clearly.",
      "Apply knowledge to solve standard interview problems.",
      "Analyze and debug complex scenarios.",
      "Communicate solutions effectively."
    ],
    resources: [
      { id: '1', title: `${categoryName} Crash Course`, type: 'Video', url: '#' },
      { id: '2', title: 'Top 50 Interview Questions', type: 'Article', url: '#' },
      { id: '3', title: 'Deep Dive PDF Guide', type: 'PDF', url: '#' },
    ],
    assignment: {
      id: `assign-${categoryId}-${level}`,
      title: `${level === 'A' ? 'Expert' : level === 'B' ? 'Practical' : 'Basic'} ${categoryName} Task`,
      description: "Complete the following task to verify your learning and unlock the re-test.",
      tasks: [
        "Read the provided PDF guide fully.",
        "Solve 5 practice problems from the resource link.",
        "Write a summary of your key learnings (100 words).",
        "Prepare a mock answer for the 'Tell me about a time...' question related to this skill."
      ],
      isCompleted: false
    }
  };
};

export const MOCK_QUESTIONS = [
  { q: "What is the primary goal of this skill in an interview?", options: ["Impress the interviewer", "Show technical depth", "Solve the business problem", "Speak loudly"], correct: 2 },
  { q: "Which approach is best for complex problems?", options: ["Jump to coding", "Clarify requirements first", "Guess the answer", "Ask for a different question"], correct: 1 },
  { q: "How do you handle a conflict?", options: ["Ignore it", "Report to HR immediately", "Discuss openly and find middle ground", "Quit"], correct: 2 },
];
