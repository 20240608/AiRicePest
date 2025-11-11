
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../App';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Modal } from '../components/ui';
import { EyeIcon, EyeOffIcon } from '../components/Icons';
import { mockApiService } from '../services/mockApiService';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAppContext();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);

    const validate = () => {
        if (username.length < 3) {
            setError('Username must be at least 3 characters.');
            return false;
        }
        if (password.length < 8 || password.length > 16) {
            setError('Password must be 8-16 characters.');
            return false;
        }
        setError('');
        return true;
    };

    const handleLogin = async (e: React.FormEvent, asAdmin: boolean = false) => {
        e.preventDefault();
        const userToLogin = asAdmin ? 'admin' : username;
        if (!asAdmin && !validate()) return;
        
        setLoading(true);
        setError('');
        try {
            const { token, user } = await mockApiService.login(userToLogin, password);
            if (asAdmin && user.role !== 'admin') {
              throw new Error("You are not an administrator.");
            }
            login(token, user);
            navigate(user.role === 'admin' ? '/admin' : '/');
        } catch (err: any) {
            setError(err.message || 'Login failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-secondary p-4 bg-cover bg-center" style={{ backgroundImage: "url('https://picsum.photos/seed/bg/1920/1080')" }}>
             <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
            <Card className="w-full max-w-md z-10">
                <CardHeader>
                    <CardTitle className="text-3xl text-center">AI Rice Disease Identifier</CardTitle>
                    <CardDescription className="text-center">Welcome back! Please log in to your account.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="username">Username</label>
                            <Input id="username" value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter your username" required disabled={loading} />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password">Password</label>
                             <div className="relative">
                                <Input 
                                    id="password" 
                                    type={showPassword ? 'text' : 'password'}
                                    value={password} 
                                    onChange={e => setPassword(e.target.value)} 
                                    placeholder="Enter your password" 
                                    required 
                                    disabled={loading}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-muted-foreground">
                                    {showPassword ? <EyeOffIcon className="h-5 w-5"/> : <EyeIcon className="h-5 w-5"/>}
                                </button>
                            </div>
                        </div>
                        {error && <p className="text-sm text-destructive">{error}</p>}
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>
                    </form>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                         <Button variant="secondary" onClick={() => setRegisterModalOpen(true)} disabled={loading}>Register</Button>
                        <Button variant="secondary" onClick={(e) => handleLogin(e, true)} disabled={loading}>Admin Login</Button>
                    </div>
                     <div className="mt-4 text-center text-sm">
                        <a href="#" className="underline text-muted-foreground hover:text-primary">Forgot password?</a>
                    </div>
                </CardContent>
            </Card>
            <RegisterModal isOpen={isRegisterModalOpen} onClose={() => setRegisterModalOpen(false)} />
        </div>
    );
};


const RegisterModal: React.FC<{isOpen: boolean, onClose: () => void}> = ({isOpen, onClose}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (username.length < 3) {
            setError('Username must be at least 3 characters.');
            return;
        }
        if (password.length < 8 || password.length > 16) {
            setError('Password must be 8-16 characters.');
            return;
        }
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            await mockApiService.register(username, password);
            setSuccess('Registration successful! You can now log in.');
            setTimeout(onClose, 2000);
        } catch (err: any) {
            setError(err.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create an Account">
            <div className="space-y-4">
                 <div className="space-y-2">
                    <label htmlFor="reg-username">Username</label>
                    <Input id="reg-username" value={username} onChange={e => setUsername(e.target.value)} placeholder="Choose a username" required disabled={loading} />
                </div>
                <div className="space-y-2">
                    <label htmlFor="reg-password">Password</label>
                    <Input id="reg-password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Create a password" required disabled={loading} />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                {success && <p className="text-sm text-green-600">{success}</p>}
                <Button onClick={handleRegister} className="w-full" disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                </Button>
            </div>
        </Modal>
    )
}

export default LoginPage;
