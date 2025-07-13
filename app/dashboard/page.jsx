'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        async function fetchUser() {
            const { data, error } = await supabase.auth.getUser();
            if (error || !data.user) {
                router.push('/login');
            } else {
                setUser(data.user);
            }
        }

        fetchUser();
    }, [router]);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white">
                <p className="text-xl">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f172a] text-white">
            <h1 className="text-4xl font-bold mb-4">Welcome, {user.email}</h1>
            <p className="text-lg text-gray-300">You are now logged in! 🎉</p>
            <button
                onClick={async () => {
                    await supabase.auth.signOut();
                    router.push('/login');
                }}
                className="mt-6 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg shadow-md"
            >
                Logout
            </button>
        </div>
    );
}
