
import React, { useEffect, useState } from 'react';
import { Feedback } from '../../types';
import { mockApiService } from '../../services/mockApiService';
import { Button, Card, CardContent, CardHeader, CardTitle, Modal, Spinner } from '../../components/ui';

const AdminFeedbackPage: React.FC = () => {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);

    useEffect(() => {
        loadFeedbacks();
    }, []);
    
    const loadFeedbacks = () => {
        setLoading(true);
        mockApiService.getAdminFeedbacks()
            .then(setFeedbacks)
            .finally(() => setLoading(false));
    }

    const handleStatusChange = async (id: string, status: Feedback['status']) => {
        await mockApiService.updateFeedbackStatus(id, status);
        loadFeedbacks();
    };
    
    const getStatusColor = (status: Feedback['status']) => {
        switch (status) {
            case 'new': return 'bg-red-200 text-red-800';
            case 'viewed': return 'bg-yellow-200 text-yellow-800';
            case 'resolved': return 'bg-green-200 text-green-800';
        }
    }

    if (loading) return <div className="flex justify-center py-10"><Spinner /></div>;

    return (
        <Card>
            <CardHeader>
                <CardTitle>User Feedback Management</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted">
                            <tr>
                                <th className="p-4">User</th>
                                <th className="p-4">Feedback</th>
                                <th className="p-4">Timestamp</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {feedbacks.map(fb => (
                                <tr key={fb.id} className="border-b">
                                    <td className="p-4">{fb.username}</td>
                                    <td className="p-4 truncate max-w-xs">{fb.text}</td>
                                    <td className="p-4">{new Date(fb.timestamp).toLocaleString()}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(fb.status)}`}>
                                            {fb.status}
                                        </span>
                                    </td>
                                    <td className="p-4 space-x-2">
                                        <Button variant="secondary" size="sm" onClick={() => setSelectedFeedback(fb)}>View</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
             {selectedFeedback && (
                <FeedbackDetailModal
                    feedback={selectedFeedback}
                    onClose={() => setSelectedFeedback(null)}
                    onStatusChange={handleStatusChange}
                />
            )}
        </Card>
    );
};


const FeedbackDetailModal: React.FC<{
    feedback: Feedback,
    onClose: () => void,
    onStatusChange: (id: string, status: Feedback['status']) => void
}> = ({feedback, onClose, onStatusChange}) => {
    return (
        <Modal isOpen={true} onClose={onClose} title={`Feedback from ${feedback.username}`}>
            <div className="space-y-4">
                <p className="text-muted-foreground">"{feedback.text}"</p>
                {feedback.imageUrls && (
                    <div>
                        <h4 className="font-semibold mb-2">Attached Images:</h4>
                        <div className="flex gap-2">
                            {feedback.imageUrls.map(url => <img key={url} src={url} className="w-24 h-24 object-cover rounded"/>)}
                        </div>
                    </div>
                )}
                <div className="flex items-center gap-4 pt-4 border-t">
                    <label>Set Status:</label>
                    <select
                        value={feedback.status}
                        onChange={(e) => onStatusChange(feedback.id, e.target.value as Feedback['status'])}
                        className="p-2 border rounded-md bg-transparent"
                    >
                        <option value="new">New</option>
                        <option value="viewed">Viewed</option>
                        <option value="resolved">Resolved</option>
                    </select>
                </div>
                 <div className="flex justify-end">
                    <Button variant="secondary" onClick={onClose}>Close</Button>
                </div>
            </div>
        </Modal>
    )
}

export default AdminFeedbackPage;
