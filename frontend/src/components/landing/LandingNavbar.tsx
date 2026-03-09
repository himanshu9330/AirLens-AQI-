'use client';

import Link from 'next/link';
import { Wind } from 'lucide-react';
import { motion } from 'framer-motion';

export function LandingNavbar() {
    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute top-0 w-full z-50 pt-6 px-6 md:px-12"
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between glass-light px-6 py-4 rounded-2xl border border-white/5 shadow-2xl backdrop-blur-md">

                <Link href="/" className="flex items-center gap-2 group">
                    <div className="h-8 w-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                        <Wind className="h-4 w-4" />
                    </div>
                    <span className="font-display font-bold text-xl tracking-tight text-white">
                        AirLens<span className="text-indigo-400">.</span>
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
                    <Link href="#features" className="hover:text-white transition-colors relative group">
                        Features
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-500 group-hover:w-full transition-all duration-300"></span>
                    </Link>
                    <Link href="#how-it-works" className="hover:text-white transition-colors relative group">
                        How it Works
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-500 group-hover:w-full transition-all duration-300"></span>
                    </Link>
                    <Link href="#impact" className="hover:text-white transition-colors relative group">
                        Impact
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-500 group-hover:w-full transition-all duration-300"></span>
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/admin/login" className="hidden sm:block text-sm font-medium text-slate-300 hover:text-white transition-colors">
                        Admin
                    </Link>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link href="/citizen/login" className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-500 transition-colors shadow-[0_0_20px_rgba(99,102,241,0.3)] block">
                            Citizen
                        </Link>
                    </motion.div>
                </div>
            </div>
        </motion.nav>
    );
}
