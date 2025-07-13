'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [formData, setFormData] = useState({
        identifier: '',
        password: '',
    });

    const router = useRouter();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        const { identifier, password } = formData;
        let emailToUse = identifier;

        // 🔍 If not an email, assume it's a username → look up email
        if (!identifier.includes('@')) {
            const { data, error } = await supabase
                .from('profiles')
                .select('email')
                .eq('username', identifier)
                .single();

            if (error || !data?.email) {
                alert('No user found with this username.');
                return;
            }

            emailToUse = data.email;
        }

        // 🔐 Sign in with email and password
        const { error: loginError } = await supabase.auth.signInWithPassword({
            email: emailToUse,
            password,
        });

        if (loginError) {
            alert('Login failed: ' + loginError.message);
            return;
        }

        alert('Login successful!');
        router.push('/dashboard');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white">
            <form onSubmit={handleLogin} className="bg-[#1e293b] p-6 rounded shadow-md w-96 space-y-4">
                <h2 className="text-2xl font-bold mb-2 text-center">Login</h2>

                <input
                    name="identifier"
                    type="text"
                    placeholder="Email or Username"
                    value={formData.identifier}
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

                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded">
                    Login
                </button>

                <p className="text-sm text-center mt-2 text-gray-400">
                    New here?{' '}
                    <a href="/register" className="text-blue-400 hover:underline">
                        Register
                    </a>
                </p>

            </form>
        </div>
    );
}
