'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        const { firstName, lastName, username, email, password, confirmPassword } = formData;

        if (password !== confirmPassword) {
            setErrorMsg("Passwords don't match!");
            return;
        }

        // 1. Sign up user with Supabase
        const { data: signupData, error: signupError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (signupError) {
            setErrorMsg(signupError.message);
            return;
        }

        const userId = signupData.user?.id;

        // 2. Insert profile info
        const { error: profileError } = await supabase.from('profiles').insert([
            {
                id: userId,
                first_name: firstName,
                last_name: lastName,
                username,
            },
        ]);

        if (profileError) {
            setErrorMsg("User created, but profile insert failed: " + profileError.message);
            return;
        }

        setSuccessMsg('Registered successfully! Redirecting to dashboard...');
        setTimeout(() => {
            router.push('/dashboard');
        }, 2000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white">
            <form
                onSubmit={handleRegister}
                className="bg-[#1e293b] p-6 rounded shadow-md w-96 space-y-4"
            >
                <h2 className="text-2xl font-bold mb-2 text-center">Register</h2>

                <input
                    name="firstName"
                    type="text"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full p-2 rounded bg-gray-800 border border-gray-600"
                />

                <input
                    name="lastName"
                    type="text"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full p-2 rounded bg-gray-800 border border-gray-600"
                />

                <input
                    name="username"
                    type="text"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="w-full p-2 rounded bg-gray-800 border border-gray-600"
                />

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

                <input
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full p-2 rounded bg-gray-800 border border-gray-600"
                />

                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded">
                    Register
                </button>

                {errorMsg && (
                    <div className="text-sm text-red-500 text-center">{errorMsg}</div>
                )}

                {successMsg && (
                    <div className="text-sm text-green-400 text-center">{successMsg}</div>
                )}

                <p className="text-center text-sm mt-4">
                    Already registered?{' '}
                    <a
                        href="/login"
                        className="text-blue-400 hover:underline hover:text-blue-300"
                    >
                        Sign in
                    </a>
                </p>
            </form>
        </div>
    );
}
