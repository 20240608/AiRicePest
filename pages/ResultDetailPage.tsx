
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RecognitionResult } from '../types';
import { mockApiService } from '../services/mockApiService';
import { Button, Card, CardContent, CardHeader, CardTitle, Modal } from '../components/ui';
import { Spinner } from '../components/ui';

const ResultDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [result, setResult] = useState<RecognitionResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isFeedbackModalOpen, setFeedbackModalOpen] = useState(false);

    useEffect(() => {
        if (id) {
            setLoading(true);
            mockApiService.getRecognitionResult(id)
                .then(data => setResult(data))
                .catch(err => setError(err.message))
                .finally(() => setLoading(false));
        }
    }, [id]);

    if (loading) return <div className="flex justify-center items-center h-full"><Spinner className="h-10 w-10"/></div>;
    if (error) return <div className="p-6 text-destructive">Error: {error}</div>;
    if (!result) return <div className="p-6">Result not found.</div>;

    return (
        <div className="p-4 md:p-6 max-w-4xl mx-auto">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-3xl">{result.diseaseName}</CardTitle>
                            <p className="text-muted-foreground">Confidence Score: {result.confidence}%</p>
                        </div>
                        <Button onClick={() => navigate('/')}>Back to Home</Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <img src={result.imageUrl} alt={result.diseaseName} className="w-full h-auto max-h-96 object-contain rounded-lg border" />
                    
                    <div>
                        <h3 className="text-xl font-semibold mb-2">Description</h3>
                        <p>{result.description || "Detailed description of the disease, its characteristics, and how it affects the rice plant."}</p>
                    </div>

                     <div>
                        <h3 className="text-xl font-semibold mb-2">{result.solution.title}</h3>
                        <ol className="list-decimal list-inside space-y-2 pl-4">
                            {result.solution.steps.map((step, i) => (
                                <li key={i}>{step}</li>
                            ))}
                        </ol>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
                        <Button onClick={() => setFeedbackModalOpen(true)} className="flex-1">Provide Feedback</Button>
                        <Button variant="secondary" className="flex-1">Share Result</Button>
                    </div>
                </CardContent>
            </Card>
            <FeedbackModal 
                isOpen={isFeedbackModalOpen}
                onClose={() => setFeedbackModalOpen(false)}
            />
        </div>
    );
};


const FeedbackModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const [text, setText] = useState('');
    const [images, setImages] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async () => {
        if (!text) {
            setMessage('Feedback text cannot be empty.');
            return;
        }
        setLoading(true);
        setMessage('Submitting your feedback...');
        try {
            await mockApiService.submitFeedback(text, images);
            setMessage('Thank you! Your feedback has been submitted successfully.');
            setTimeout(() => {
                onClose();
                setMessage('');
                setText('');
            }, 2000);
        } catch (error) {
            setMessage('Failed to submit feedback. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Submit Feedback">
            <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Your feedback is valuable and helps us improve our AI model.</p>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Describe if the result was correct, or what you think the issue is... (max 200 chars)"
                    maxLength={200}
                    className="w-full h-24 p-2 border rounded-md bg-transparent"
                    disabled={loading}
                />
                <input type="file" multiple accept="image/*" className="text-sm" disabled={loading} onChange={(e) => setImages(Array.from(e.target.files || []))}/>
                {message && <p className="text-sm">{message}</p>}
                <Button onClick={handleSubmit} disabled={loading} className="w-full">
                    {loading ? 'Submitting...' : 'Submit Feedback'}
                </Button>
            </div>
        </Modal>
    );
};


export default ResultDetailPage;
