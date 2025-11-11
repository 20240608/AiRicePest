
export type Theme = 'light' | 'dark' | 'theme-blue' | 'theme-green';

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  type: 'image' | 'text' | 'loading' | 'error';
  content: string | RecognitionResult;
  timestamp: string;
}

export interface RecognitionResult {
  id: string;
  diseaseName: string;
  confidence: number;
  description: string;
  cause: string;
  solution: {
    title: string;
    steps: string[];
  };
  imageUrl: string;
}

export interface HistoryItem {
  id: string;
  date: string;
  imageUrl: string;
  diseaseName: string;
  confidence: number;
}

export interface KnowledgeItem {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  symptoms: string[];
}

export interface Feedback {
  id: string;
  userId: string;
  username: string;
  text: string;
  imageUrls?: string[];
  timestamp: string;
  status: 'new' | 'viewed' | 'resolved';
}

export interface AdminStats {
  userCount: number;
  recognitionCount: number;
  feedbackCount: number;
  recognitionsPerDay: { date: string; count: number }[];
}

export interface AdminUser extends User {
  createdAt: string;
  lastLogin: string;
}
