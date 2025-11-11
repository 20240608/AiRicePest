
import React, { useState } from 'react';
import { useAppContext } from '../App';
import { mockApiService } from '../services/mockApiService';
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '../components/ui';

const ProfilePage: React.FC = () => {
    const { user } = useAppContext();
    const [username, setUsername] = useState(user?.username || '');
    const [email, setEmail] = useState(user?.email || '');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
        setLoading(true);
        setMessage('');
        if (newPassword && newPassword !== confirmPassword) {
            setMessage('Passwords do not match.');
            setLoading(false);
            return;
        }
        try {
            await mockApiService.updateProfile({ username, email });
            setMessage('Profile updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage('Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 md:p-6 max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Your Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="username">Username</label>
                        <Input id="username" value={username} onChange={e => setUsername(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <label htmlFor="email">Email Address</label>
                        <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <label htmlFor="newPassword">New Password</label>
                        <Input id="newPassword" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Leave blank to keep current password"/>
                    </div>
                     <div className="space-y-2">
                        <label htmlFor="confirmPassword">Confirm New Password</label>
                        <Input id="confirmPassword" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                    </div>
                    {message && <p className="text-sm">{message}</p>}
                    <Button onClick={handleUpdate} disabled={loading}>
                        {loading ? 'Updating...' : 'Update Profile'}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProfilePage;
