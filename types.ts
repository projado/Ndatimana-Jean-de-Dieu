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

export enum ViewState {
  HOME = 'HOME',
  SCHOLARSHIPS = 'SCHOLARSHIPS',
  DESTINATIONS = 'DESTINATIONS',
  CONTACT = 'CONTACT'
}