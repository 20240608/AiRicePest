
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HistoryItem } from '../types';
import { mockApiService } from '../services/mockApiService';
import { Card, CardContent, CardHeader, CardTitle, Input, Spinner } from '../components/ui';

const HistoryPage: React.FC = () => {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        mockApiService.getHistory()
            .then(setHistory)
            .finally(() => setLoading(false));
    }, []);

    const filteredHistory = history.filter(item =>
        item.diseaseName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return (
        <div className="p-4 md:p-6">
            <Card>
                <CardHeader>
                    <CardTitle>Recognition History</CardTitle>
                    <Input 
                        placeholder="Search by disease name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-sm mt-2"
                    />
                </CardHeader>
                <CardContent>
                    {loading ? (
                         <div className="flex justify-center py-10"><Spinner /></div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {filteredHistory.map(item => (
                                <Card 
                                    key={item.id} 
                                    className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                                    onClick={() => navigate(`/result/${item.id}`)}
                                >
                                    <img src={item.imageUrl} alt={item.diseaseName} className="h-40 w-full object-cover" />
                                    <div className="p-4">
                                        <h3 className="font-semibold">{item.diseaseName}</h3>
                                        <p className="text-sm text-muted-foreground">Confidence: {item.confidence}%</p>
                                        <p className="text-xs text-muted-foreground mt-1">{new Date(item.date).toLocaleString()}</p>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                     {filteredHistory.length === 0 && !loading && (
                        <p className="text-center py-10 text-muted-foreground">No history found.</p>
                     )}
                </CardContent>
            </Card>
        </div>
    );
};

export default HistoryPage;
