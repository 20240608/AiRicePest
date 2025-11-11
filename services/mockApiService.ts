import { AdminStats, AdminUser, Feedback, HistoryItem, KnowledgeItem, RecognitionResult, User } from '../types';

const users: AdminUser[] = [
    { id: '1', username: 'farmer_john', email: 'john@farm.com', role: 'user', createdAt: '2023-10-01', lastLogin: '2024-07-20' },
    { id: '2', username: 'agri_expert', email: 'expert@agri.com', role: 'user', createdAt: '2023-11-15', lastLogin: '2024-07-19' },
    { id: '3', username: 'admin', email: 'admin@system.com', role: 'admin', createdAt: '2023-09-01', lastLogin: '2024-07-21' },
];

const history: HistoryItem[] = [
    { id: 'h1', date: '2024-07-20', imageUrl: 'https://picsum.photos/seed/h1/200/200', diseaseName: 'Rice Blast', confidence: 95.2 },
    { id: 'h2', date: '2024-07-18', imageUrl: 'https://picsum.photos/seed/h2/200/200', diseaseName: 'Bacterial Blight', confidence: 88.9 },
    { id: 'h3', date: '2024-07-15', imageUrl: 'https://picsum.photos/seed/h3/200/200', diseaseName: 'Sheath Blight', confidence: 92.1 },
];

const knowledgeBase: KnowledgeItem[] = [
    { id: 'k1', name: 'Rice Blast', description: 'A fungal disease that affects all parts of the rice plant.', imageUrl: 'https://picsum.photos/seed/k1/400/300', symptoms: ['Spindle-shaped lesions', 'Neck rot'] },
    { id: 'k2', name: 'Bacterial Blight', description: 'Caused by Xanthomonas oryzae pv. oryzae.', imageUrl: 'https://picsum.photos/seed/k2/400/300', symptoms: ['Wilting of seedlings', 'Yellow lesions on leaf tips'] },
    { id: 'k3', name: 'Sheath Blight', description: 'A fungal disease caused by Rhizoctonia solani.', imageUrl: 'https://picsum.photos/seed/k3/400/300', symptoms: ['Lesions on the sheath', 'Lodging of plants'] },
    { id: 'k4', name: 'Brown Spot', description: 'Caused by the fungus Bipolaris oryzae.', imageUrl: 'https://picsum.photos/seed/k4/400/300', symptoms: ['Oval, brown spots on leaves', 'Reduced grain quality'] },
];

const feedbacks: Feedback[] = [
    { id: 'f1', userId: '1', username: 'farmer_john', text: 'The result was accurate, thank you!', timestamp: '2024-07-20T10:00:00Z', status: 'resolved' },
    { id: 'f2', userId: '2', username: 'agri_expert', text: 'I think this was misidentified. It looks more like Tungro virus.', imageUrls: ['https://picsum.photos/seed/f2/200/200'], timestamp: '2024-07-19T14:30:00Z', status: 'new' },
];

const recognitionDetails: { [key: string]: RecognitionResult } = {
    'h1': { id: 'h1', diseaseName: 'Rice Blast', confidence: 95.2, description: '...', cause: '...', solution: { title: 'Control Measures for Rice Blast', steps: ['Use resistant varieties.', 'Apply fungicides like Tricyclazole.', 'Manage nitrogen application.'] }, imageUrl: 'https://picsum.photos/seed/h1/600/400' },
    'h2': { id: 'h2', diseaseName: 'Bacterial Blight', confidence: 88.9, description: '...', cause: '...', solution: { title: 'Managing Bacterial Blight', steps: ['Ensure proper drainage.', 'Use copper-based bactericides.', 'Avoid field flooding.'] }, imageUrl: 'https://picsum.photos/seed/h2/600/400' },
    'h3': { id: 'h3', diseaseName: 'Sheath Blight', confidence: 92.1, description: '...', cause: '...', solution: { title: 'How to Control Sheath Blight', steps: ['Maintain optimal plant spacing.', 'Apply fungicides like Hexaconazole.', 'Remove infected stubble.'] }, imageUrl: 'https://picsum.photos/seed/h3/600/400' },
};

const networkDelay = <T,>(data: T, delay: number = 500): Promise<T> =>
    new Promise(resolve => setTimeout(() => resolve(data), delay));

// Fix: Add Promise<never> as the return type. A promise that always rejects never resolves,
// so its resolved type is `never`. `Promise<never>` is assignable to any `Promise<T>`.
const networkError = (message: string, delay: number = 500): Promise<never> =>
    new Promise((_, reject) => setTimeout(() => reject(new Error(message)), delay));


export const mockApiService = {
    login: (username: string, pass: string): Promise<{ token: string, user: User }> => {
        const user = users.find(u => u.username === username);
        if (user && pass.length >= 8) {
            return networkDelay({ token: `mock-jwt-for-${username}`, user });
        }
        return networkError('Invalid username or password');
    },

    register: (username: string, pass: string): Promise<{ success: boolean }> => {
        if (users.some(u => u.username === username)) {
            return networkError('Username already exists');
        }
        if (username.length < 3 || pass.length < 8) {
            return networkError('Invalid username or password format');
        }
        return networkDelay({ success: true });
    },
    
    getProfile: (): Promise<User> => {
        const token = localStorage.getItem('authToken');
        if (token && token.includes('admin')) {
            return networkDelay(users.find(u => u.role === 'admin')!);
        }
        if(token) {
            return networkDelay(users.find(u => u.role === 'user')!);
        }
        return networkError('Not authenticated');
    },

    updateProfile: (data: Partial<User>): Promise<User> => {
        const currentUser = users.find(u => u.role === 'user')!;
        const updatedUser = { ...currentUser, ...data };
        return networkDelay(updatedUser);
    },

    recognizeImage: (file: File): Promise<RecognitionResult> => {
        const result = recognitionDetails['h1']; // Mock result
        return networkDelay({ ...result, id: `rec-${Date.now()}`, imageUrl: URL.createObjectURL(file) }, 2000);
    },
    
    getHistory: (): Promise<HistoryItem[]> => networkDelay(history),

    getRecognitionResult: (id: string): Promise<RecognitionResult> => {
        const key = Object.keys(recognitionDetails).find(k => id.startsWith(k)) || 'h1';
        const detail = recognitionDetails[key];
        if (detail) {
            return networkDelay({ ...detail, id });
        }
        return networkError('Result not found');
    },
    
    getKnowledgeBase: (): Promise<KnowledgeItem[]> => networkDelay(knowledgeBase),

    submitFeedback: (text: string, images?: File[]): Promise<{ success: true }> => networkDelay({ success: true }),

    getAdminStats: (): Promise<AdminStats> => {
        const stats = {
            userCount: users.length,
            recognitionCount: 157,
            feedbackCount: feedbacks.length,
            recognitionsPerDay: [
                { date: 'Mon', count: 20 },
                { date: 'Tue', count: 35 },
                { date: 'Wed', count: 15 },
                { date: 'Thu', count: 45 },
                { date: 'Fri', count: 25 },
                { date: 'Sat', count: 12 },
                { date: 'Sun', count: 5 },
            ],
        };
        return networkDelay(stats);
    },

    getAdminUsers: (): Promise<AdminUser[]> => networkDelay(users),
    
    updateUser: (user: AdminUser): Promise<AdminUser> => networkDelay(user),

    deleteUser: (userId: string): Promise<{ success: true }> => networkDelay({ success: true }),

    getAdminFeedbacks: (): Promise<Feedback[]> => networkDelay(feedbacks),

    updateFeedbackStatus: (id: string, status: Feedback['status']): Promise<Feedback> => {
        const feedback = feedbacks.find(f => f.id === id)!;
        feedback.status = status;
        return networkDelay(feedback);
    },
};