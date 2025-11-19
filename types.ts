
export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isError?: boolean;
}

export interface Scholarship {
  name: string;
  amount: string;
  deadline: string;
  requirements: string[];
  link?: string;
  country: string;
  fundingType: 'Full' | 'Partial';
}

export interface CountryInfo {
  name: string;
  flagEmoji: string;
  image: string;
  popularDegrees: string[];
  avgCost: string;
  visaDifficulty: 'Easy' | 'Moderate' | 'Hard';
  visaType: string;
  processingTime: string;
  proofOfFunds: string;
}

export interface VisaDetails {
  country: string;
  visaType: string;
  applicationFee: string;
  processingTime: string;
  financialRequirements: string;
  documents: string[];
  embassyLocation: string;
  healthRequirements: string;
}

export interface SATQuestion {
  id: string;
  passage?: string; // For Reading/Writing
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  visualAidPrompt?: string; // Description for generating a diagram if needed
}

export interface TestConfig {
  testId: number;
  section: 'Math' | 'ReadingWriting';
  module: 1 | 2;
  difficulty?: 'Easy' | 'Hard'; // For Module 2 adaptive
}

export interface EssayAnalysis {
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  aiProbability: number; // 0-100
  suggestions: string;
  improvedSnippet: string;
  tone: string;
  humanizeTip: string; // Specific advice to sound more human
}

export enum ViewState {
  HOME = 'HOME',
  SCHOLARSHIPS = 'SCHOLARSHIPS',
  DESTINATIONS = 'DESTINATIONS',
  CONTACT = 'CONTACT',
  VIDEO = 'VIDEO',
  SAT_PREP = 'SAT_PREP',
  ESSAY_REVIEW = 'ESSAY_REVIEW'
}
