
import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAppContext } from '../App';
import { Button } from '../components/ui';
import { LogOutIcon } from '../components/Icons';

const AdminLayout: React.FC = () => {
    return (
        <div className="flex h-screen bg-secondary/50">
            <AdminSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <AdminHeader />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

const AdminHeader: React.FC = () => {
    const { user, logout } = useAppContext();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="flex-shrink-0 bg-card border-b flex items-center justify-between px-6 h-16">
            <h1 className="text-xl font-semibold">Admin Panel</h1>
            <div className="flex items-center space-x-4">
                <span>Welcome, {user?.username}</span>
                <Button variant="ghost" onClick={handleLogout} className="text-muted-foreground">
                    <LogOutIcon className="h-5 w-5 mr-2" /> Logout
                </Button>
            </div>
        </header>
    );
}

const AdminSidebar: React.FC = () => {
    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
            isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
        }`;

    return (
        <nav className="flex flex-col bg-card border-r w-64 p-4 space-y-2">
            <div className="px-4 py-2 mb-2">
                <h2 className="text-2xl font-bold text-primary">Admin</h2>
            </div>
            <NavLink to="/admin" end className={navLinkClass}>Dashboard</NavLink>
            <NavLink to="/admin/users" className={navLinkClass}>User Management</NavLink>
            <NavLink to="/admin/feedback" className={navLinkClass}>Feedback</NavLink>
        </nav>
    );
};

export default AdminLayout;
