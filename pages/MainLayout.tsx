
import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAppContext } from '../App';
import { Button } from '../components/ui';
import { SunIcon, MoonIcon, ChevronDownIcon, MenuIcon, LogOutIcon, XIcon, PlusIcon } from '../components/Icons';
import { Theme } from '../types';

const themes: { name: string; value: Theme }[] = [
    { name: 'Light', value: 'light' },
    { name: 'Dark', value: 'dark' },
    { name: 'Blue', value: 'theme-blue' },
    { name: 'Green', value: 'theme-green' },
];

const MainLayout: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="flex h-screen bg-secondary/50">
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

// --- Header ---
const Header: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
    const { theme, setTheme, user, logout } = useAppContext();
    const navigate = useNavigate();
    const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const themeDropdownRef = useRef<HTMLDivElement>(null);
    const userDropdownRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (themeDropdownRef.current && !themeDropdownRef.current.contains(event.target as Node)) {
                setThemeDropdownOpen(false);
            }
             if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
                setUserDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="flex-shrink-0 bg-card border-b flex items-center justify-between px-4 h-16">
            <Button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden">
                <MenuIcon className="h-6 w-6" />
            </Button>
             <div className="text-lg font-semibold lg:hidden">Rice P&D AI</div>

            <div className="w-full flex items-center justify-end space-x-4">
                <div className="relative" ref={themeDropdownRef}>
                    <Button variant="ghost" size="icon" onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}>
                        {theme === 'dark' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
                    </Button>
                    {themeDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-32 bg-popover border rounded-md shadow-lg z-10">
                            {themes.map(t => (
                                <button key={t.value} onClick={() => { setTheme(t.value); setThemeDropdownOpen(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-accent">
                                    {t.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <div className="relative" ref={userDropdownRef}>
                    <Button variant="ghost" onClick={() => setUserDropdownOpen(!userDropdownOpen)} className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                            {user?.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="hidden md:inline">{user?.username}</span>
                        <ChevronDownIcon className="h-4 w-4" />
                    </Button>
                     {userDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-popover border rounded-md shadow-lg z-10">
                            <NavLink to="/profile" className="block w-full text-left px-4 py-2 text-sm hover:bg-accent">Profile</NavLink>
                            <button onClick={handleLogout} className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-destructive hover:bg-accent">
                                <LogOutIcon className="h-4 w-4" />
                                <span>Logout</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

// --- Sidebar ---
const Sidebar: React.FC<{ isOpen: boolean; setIsOpen: (isOpen: boolean) => void; }> = ({ isOpen, setIsOpen }) => {
    const navigate = useNavigate();
    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
            isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
        }`;
    
    return (
        <>
            <div className={`fixed inset-0 bg-black/50 z-30 lg:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsOpen(false)}></div>
            <nav className={`flex flex-col bg-card border-r w-64 p-4 space-y-2 transition-transform fixed lg:relative lg:translate-x-0 h-full z-40 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                 <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold text-primary">Rice P&D AI</h1>
                     <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="lg:hidden">
                        <XIcon className="h-6 w-6" />
                    </Button>
                </div>

                <Button onClick={() => navigate('/')}>
                    <PlusIcon className="mr-2 h-4 w-4" /> New Chat
                </Button>

                <div className="flex-1 flex flex-col space-y-1 pt-4">
                    <NavLink to="/" end className={navLinkClass}>Chat</NavLink>
                    <NavLink to="/history" className={navLinkClass}>History</NavLink>
                    <NavLink to="/knowledge" className={navLinkClass}>Knowledge Base</NavLink>
                </div>
                 <div className="pt-4 border-t">
                     <NavLink to="/profile" className={navLinkClass}>Profile</NavLink>
                 </div>
            </nav>
        </>
    );
};

export default MainLayout;
