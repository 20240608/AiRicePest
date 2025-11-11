
import React, { useEffect, useState } from 'react';
import { AdminUser } from '../../types';
import { mockApiService } from '../../services/mockApiService';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Modal, Spinner } from '../../components/ui';

const AdminUserManagementPage: React.FC = () => {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

    useEffect(() => {
        mockApiService.getAdminUsers()
            .then(setUsers)
            .finally(() => setLoading(false));
    }, []);
    
    const handleUpdateUser = async (updatedUser: AdminUser) => {
        await mockApiService.updateUser(updatedUser);
        setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
        setEditingUser(null);
    }
    
    const handleDeleteUser = async (userId: string) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            await mockApiService.deleteUser(userId);
            setUsers(users.filter(u => u.id !== userId));
        }
    }

    if (loading) return <div className="flex justify-center py-10"><Spinner /></div>;

    return (
        <Card>
            <CardHeader>
                <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted">
                            <tr>
                                <th className="p-4">Username</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Created At</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className="border-b">
                                    <td className="p-4">{user.username}</td>
                                    <td className="p-4">{user.email}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-xs rounded-full ${user.role === 'admin' ? 'bg-green-200 text-green-800' : 'bg-blue-200 text-blue-800'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4">{user.createdAt}</td>
                                    <td className="p-4 space-x-2">
                                        <Button variant="secondary" size="sm" onClick={() => setEditingUser(user)}>Edit</Button>
                                        <Button variant="destructive" size="sm" onClick={() => handleDeleteUser(user.id)}>Delete</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
            {editingUser && (
                <EditUserModal 
                    user={editingUser}
                    onClose={() => setEditingUser(null)}
                    onSave={handleUpdateUser}
                />
            )}
        </Card>
    );
};

const EditUserModal: React.FC<{user: AdminUser, onClose: () => void, onSave: (user: AdminUser) => void}> = ({user, onClose, onSave}) => {
    const [formData, setFormData] = useState(user);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    return (
        <Modal isOpen={true} onClose={onClose} title={`Edit User: ${user.username}`}>
            <div className="space-y-4">
                <div>
                    <label>Username</label>
                    <Input name="username" value={formData.username} onChange={handleChange} />
                </div>
                 <div>
                    <label>Email</label>
                    <Input name="email" type="email" value={formData.email} onChange={handleChange} />
                </div>
                 <div>
                    <label>Role</label>
                    <select name="role" value={formData.role} onChange={handleChange} className="w-full h-10 px-3 py-2 border rounded-md bg-transparent">
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <div className="flex justify-end gap-2">
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button onClick={() => onSave(formData)}>Save Changes</Button>
                </div>
            </div>
        </Modal>
    );
}

export default AdminUserManagementPage;
