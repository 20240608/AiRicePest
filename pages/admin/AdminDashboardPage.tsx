
import React, { useEffect, useState } from 'react';
import { AdminStats } from '../../types';
import { mockApiService } from '../../services/mockApiService';
import { Card, CardContent, CardHeader, CardTitle, Spinner } from '../../components/ui';

// As recharts is loaded via CDN, we need to declare its components to TypeScript
declare const Recharts: any;
const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = Recharts;

const AdminDashboardPage: React.FC = () => {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        mockApiService.getAdminStats()
            .then(setStats)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="flex justify-center items-center h-full"><Spinner className="h-10 w-10"/></div>;
    if (!stats) return <p>Could not load dashboard data.</p>;

    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
                <StatCard title="Total Users" value={stats.userCount} />
                <StatCard title="Total Recognitions" value={stats.recognitionCount} />
                <StatCard title="Pending Feedback" value={stats.feedbackCount} />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recognitions This Week</CardTitle>
                </CardHeader>
                <CardContent>
                    <div style={{ width: '100%', height: 300 }}>
                         <ResponsiveContainer>
                            <BarChart data={stats.recognitionsPerDay}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip
                                    contentStyle={{ 
                                        backgroundColor: 'hsl(var(--background))',
                                        borderColor: 'hsl(var(--border))'
                                    }}
                                />
                                <Legend />
                                <Bar dataKey="count" fill="hsl(var(--primary))" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

const StatCard: React.FC<{ title: string, value: number }> = ({ title, value }) => (
    <Card>
        <CardHeader>
            <CardTitle className="text-base font-medium text-muted-foreground">{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-4xl font-bold">{value}</p>
        </CardContent>
    </Card>
);

export default AdminDashboardPage;
