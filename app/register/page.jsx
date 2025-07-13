'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const router = useRouter();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        const { firstName, lastName, username, email, password, confirmPassword } = formData;

        if (password !== confirmPassword) {
            alert("Passwords don't match!");
            return;
        }

        // 1. Register user in Supabase Auth
        const { data: signupData, error: signupError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (signupError) {
            alert(signupError.message);
            return;
        }

        // 2. Get user ID from session
        const {
            data: { session },
            error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session?.user?.id) {
            alert("User created but session not found. Please check your email for confirmation.");
            return;
        }

        const userId = session.user.id;

        // 3. Insert into profiles table
        const { error: profileError } = await supabase.from('profiles').insert([
            {
                id: userId,
                first_name: firstName,
                last_name: lastName,
                username,
                email,
            },
        ]);

        if (profileError) {
            alert("User created, but profile insert failed: " + profileError.message);
            return;
        }

        alert('Registered successfully! Please check your email to confirm.');
        router.push('/login');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white">
            <form onSubmit={handleRegister} className="bg-[#1e293b] p-6 rounded shadow-md w-96 space-y-4">
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

                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">
                    Register
                </button>

                <p className="text-sm text-center mt-2 text-gray-400">
                    Already registered?{' '}
                    <a href="/login" className="text-blue-400 hover:underline">
                        Sign in
                    </a>
                </p>

            </form>
        </div>
    );
}
