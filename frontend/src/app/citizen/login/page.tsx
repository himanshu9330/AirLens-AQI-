'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import Link from 'next/link';
import { Wind } from 'lucide-react';

export default function CitizenLoginPage() {
    const router = useRouter();
    const [error, setError] = useState('');

    const handleGoogleSuccess = async (credentialResponse: any) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idToken: credentialResponse.credential })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Login failed');
            }

            localStorage.setItem('citizenToken', data.token);
            router.push('/citizen/dashboard');
        } catch (err: any) {
            setError(err.message || 'Authentication error');
        }
    };

    return (
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'dummy-client-id-replace-later'}>
            <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden font-sans">
                {/* Simple Navbar */}
                <nav className="absolute top-0 left-0 w-full z-50 p-6 md:px-12 text-left">
                    <Link href="/" className="inline-flex items-center gap-2 group">
                        <div className="h-8 w-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                            <Wind className="h-4 w-4" />
                        </div>
                        <span className="font-display font-bold text-xl tracking-tight text-white">
                            HyperLocal<span className="text-indigo-400">.</span>
                        </span>
                    </Link>
                </nav>

                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-600/10 blur-[120px] rounded-full"></div>
                </div>

                <div className="relative w-full max-w-md z-10">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 shadow-2xl backdrop-blur-xl flex flex-col items-center">
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center justify-center px-3 py-1 mb-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest">
                                Citizen Access
                            </div>
                            <h1 className="text-3xl font-black text-white tracking-tight mb-2 font-display">
                                Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">HyperLocal</span>
                            </h1>
                            <p className="text-slate-400 font-medium text-sm">
                                Verify your identity to view street-level pollution data in your area.
                            </p>
                        </div>

                        {error && (
                            <div className="w-full p-3 mb-6 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm font-medium text-center">
                                {error}
                            </div>
                        )}

                        <div className="w-full flex justify-center">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => {
                                    setError('Google Login Failed');
                                }}
                                theme="filled_black"
                                shape="pill"
                                size="large"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </GoogleOAuthProvider>
    );
}
