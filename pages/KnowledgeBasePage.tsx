
import React, { useEffect, useState } from 'react';
import { KnowledgeItem } from '../types';
import { mockApiService } from '../services/mockApiService';
import { Card, CardContent, CardHeader, CardTitle, Input, Spinner } from '../components/ui';

const KnowledgeBasePage: React.FC = () => {
    const [items, setItems] = useState<KnowledgeItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        mockApiService.getKnowledgeBase()
            .then(setItems)
            .finally(() => setLoading(false));
    }, []);

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 md:p-6">
            <Card>
                <CardHeader>
                    <CardTitle>Pest & Disease Knowledge Base</CardTitle>
                    <Input
                        placeholder="Search for diseases, symptoms..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-sm mt-2"
                    />
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center py-10"><Spinner /></div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredItems.map(item => (
                                <Card key={item.id} className="flex flex-col">
                                    <img src={item.imageUrl} alt={item.name} className="h-48 w-full object-cover rounded-t-lg" />
                                    <div className="p-4 flex flex-col flex-1">
                                        <h3 className="text-xl font-bold">{item.name}</h3>
                                        <p className="text-muted-foreground text-sm mt-1 flex-1">{item.description}</p>
                                        <div className="mt-4">
                                            <h4 className="font-semibold text-sm mb-1">Key Symptoms:</h4>
                                            <ul className="list-disc list-inside text-sm space-y-1">
                                                {item.symptoms.map(symptom => <li key={symptom}>{symptom}</li>)}
                                            </ul>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                    {filteredItems.length === 0 && !loading && (
                        <p className="text-center py-10 text-muted-foreground">No items found matching your search.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default KnowledgeBasePage;
