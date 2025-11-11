
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatMessage, KnowledgeItem, RecognitionResult } from '../types';
import { mockApiService } from '../services/mockApiService';
import { Button, Card, CardContent } from '../components/ui';
import { ImagePlusIcon, SendIcon } from '../components/Icons';

const HomePage: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        mockApiService.getKnowledgeBase().then(data => setKnowledgeItems(data.slice(0, 4)));
    }, []);
    
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const userMessage: ChatMessage = {
            id: `user-${Date.now()}`,
            sender: 'user',
            type: 'image',
            content: URL.createObjectURL(file),
            timestamp: new Date().toISOString(),
        };
        
        const loadingMessage: ChatMessage = {
            id: `loading-${Date.now()}`,
            sender: 'ai',
            type: 'loading',
            content: '',
            timestamp: new Date().toISOString(),
        };

        setMessages(prev => [...prev, userMessage, loadingMessage]);
        setIsLoading(true);

        try {
            const result = await mockApiService.recognizeImage(file);
            const aiMessage: ChatMessage = {
                id: `ai-${Date.now()}`,
                sender: 'ai',
                type: 'text',
                content: result,
                timestamp: new Date().toISOString(),
            };
            setMessages(prev => prev.filter(m => m.type !== 'loading').concat(aiMessage));
        } catch (error) {
             const errorMessage: ChatMessage = {
                id: `error-${Date.now()}`,
                sender: 'ai',
                type: 'error',
                content: 'Failed to analyze image. Please try again.',
                timestamp: new Date().toISOString(),
            };
            setMessages(prev => prev.filter(m => m.type !== 'loading').concat(errorMessage));
        } finally {
            setIsLoading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div className="flex flex-col h-full p-4 md:p-6">
            <div className="flex-1 overflow-y-auto pb-4">
                {messages.length === 0 ? (
                    <WelcomeScreen knowledgeItems={knowledgeItems} />
                ) : (
                    <div className="space-y-6">
                        {messages.map(msg => <ChatMessageComponent key={msg.id} message={msg} />)}
                        <div ref={chatEndRef} />
                    </div>
                )}
            </div>
            <ChatInput onImageUpload={handleImageUpload} fileInputRef={fileInputRef} isLoading={isLoading} />
        </div>
    );
};

const WelcomeScreen: React.FC<{knowledgeItems: KnowledgeItem[]}> = ({ knowledgeItems }) => (
    <div className="flex flex-col items-center justify-center h-full text-center">
        <h1 className="text-4xl font-bold mb-2">Welcome!</h1>
        <p className="text-muted-foreground mb-8">Upload a rice plant image to start identifying pests and diseases.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl">
            {knowledgeItems.map(item => (
                <Card key={item.id} className="text-left hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                        <img src={item.imageUrl} alt={item.name} className="w-full h-32 object-cover rounded-md mb-2"/>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-xs text-muted-foreground">{item.description.slice(0, 50)}...</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    </div>
);


const ChatInput: React.FC<{
    onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    fileInputRef: React.RefObject<HTMLInputElement>;
    isLoading: boolean;
}> = ({ onImageUpload, fileInputRef, isLoading }) => {
    return (
        <div className="flex-shrink-0 mt-auto">
            <div className="max-w-3xl mx-auto">
                <div className="relative flex items-center bg-card border rounded-full shadow-sm p-2">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={onImageUpload}
                        accept="image/jpeg, image/png"
                        className="hidden"
                        disabled={isLoading}
                    />
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-full h-10 w-10"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isLoading}
                        aria-label="Upload Image"
                    >
                        <ImagePlusIcon className="h-5 w-5" />
                    </Button>
                    <div className="flex-1 px-4 text-muted-foreground">
                        {isLoading ? "Analyzing your image..." : "Attach an image to start diagnosis"}
                    </div>
                    <Button size="icon" className="rounded-full h-10 w-10 bg-primary" disabled={true} aria-label="Send">
                        <SendIcon className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

const ChatMessageComponent: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const navigate = useNavigate();
    
    if (message.sender === 'user') {
        return (
            <div className="flex justify-end">
                <div className="max-w-xs md:max-w-md">
                    <img src={message.content as string} alt="User upload" className="rounded-lg shadow-md" />
                </div>
            </div>
        );
    }

    const renderAiContent = () => {
        switch (message.type) {
            case 'loading':
                return (
                    <div className="flex items-center space-x-2">
                        <div className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                        <div className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                        <div className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse"></div>
                    </div>
                );
            case 'error':
                 return <p className="text-destructive">{message.content as string}</p>;
            case 'text':
                const result = message.content as RecognitionResult;
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold">Analysis Complete</h3>
                        <p>I've identified the issue as **{result.diseaseName}** with a confidence of **{result.confidence}%**.</p>
                        <p><span className="font-semibold">Primary Cause:</span> {result.cause}</p>
                        <div>
                            <h4 className="font-semibold mb-2">{result.solution.title}</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                                {result.solution.steps.map((step, i) => <li key={i}>{step}</li>)}
                            </ul>
                        </div>
                        <Button onClick={() => navigate(`/result/${result.id}`)} size="sm" variant="secondary">View Full Details & Provide Feedback</Button>
                    </div>
                );
            default:
                return null;
        }
    };
    
    return (
        <div className="flex justify-start">
            <div className="max-w-2xl bg-card rounded-lg p-4 shadow-sm">
                {renderAiContent()}
            </div>
        </div>
    );
};


export default HomePage;
