'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        const { data, error } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
        });

        if (error) {
            setErrorMsg(error.message);
            return;
        }

        setSuccessMsg('Login successful! Redirecting...');
        setTimeout(() => {
            router.push('/dashboard');
        }, 1500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white">
            <form
                onSubmit={handleLogin}
                className="bg-[#1e293b] p-6 rounded shadow-md w-96 space-y-4"
            >
                <h2 className="text-2xl font-bold text-center">Login</h2>

                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full p-2 rounded bg-gray-800 border border-gray-600"
                />

                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full p-2 rounded bg-gray-800 border border-gray-600"
                />

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
                >
                    Sign In
                </button>

                {errorMsg && (
                    <div className="text-sm text-red-500 text-center">{errorMsg}</div>
                )}

                {successMsg && (
                    <div className="text-sm text-green-400 text-center">{successMsg}</div>
                )}

                <p className="text-center text-sm mt-4">
                    New to SafeHands?{' '}
                    <a
                        href="/register"
                        className="text-blue-400 hover:underline hover:text-blue-300"
                    >
                        Register here
                    </a>
                </p>
            </form>
        </div>
    );
}
