import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api/api';
import MatrixRain from '../components/Layout/MatrixRain';
import CRTOverlay from '../components/Layout/CRTOverlay';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true); // Toggle Login/Signup
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            if (isLogin) {
                // LOGIN LOGIC
                const { data } = await authAPI.login(formData);
                // Save token to browser storage
                localStorage.setItem('cyber_token', data.token);
                localStorage.setItem('cyber_username', data.username);
                navigate('/terminal'); // Go to chat
            } else {
                // SIGNUP LOGIC
                await authAPI.signup(formData);
                setIsLogin(true); // Switch to login view
                setError('IDENTITY CREATED. PLEASE LOG IN.');
            }
        } catch (err) {
            setError(err.response?.data?.msg || 'CONNECTION REFUSED');
        }
    };

    return (
        <div className="min-h-screen bg-dark-bg font-mono text-neon flex items-center justify-center relative overflow-hidden">
            <MatrixRain />
            <CRTOverlay />
{/* <div className="z-10 bg-black/90 border border-dim p-8 rounded shadow-[0_0_20px_rgba(0,255,0,0.2)] w-96 backdrop-blur-sm"></div> */}
            <div className="z-10 bg-black border border-green-800 p-8 w-96">

                <h1 className="text-2xl mb-6 text-center tracking-widest border-b border-dim pb-4">
                    {isLogin ? 'SYSTEM ACCESS' : 'NEW IDENTITY'}
                </h1>

                {error && (
                    <div className="mb-4 text-red-500 border border-red-900 bg-red-900/20 p-2 text-sm text-center animate-pulse">
                        ! {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs opacity-70 mb-1">USERNAME</label>
                        <input
                            name="username"
                            type="text"
                            className="w-full bg-black border border-dim p-2 text-neon outline-none focus:border-neon transition-colors"
                            value={formData.username}
                            onChange={handleChange}
                            autoComplete="off"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-xs opacity-70 mb-1">PASSWORD</label>
                        <input
                            name="password"
                            type="password"
                            className="w-full bg-black border border-dim p-2 text-neon outline-none focus:border-neon transition-colors"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-dim/30 hover:bg-neon hover:text-black border border-neon py-2 mt-4 transition-all duration-200 font-bold tracking-wider"
                    >
                        {isLogin ? 'AUTHENTICATE' : 'INITIALIZE'}
                    </button>
                </form>

                <div className="mt-6 text-center text-xs opacity-50 hover:opacity-100 cursor-pointer" onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? '[ CREATE NEW ID ]' : '[ ACCESS EXISTING ID ]'}
                </div>

            </div>
        </div>
    );
};

export default AuthPage;