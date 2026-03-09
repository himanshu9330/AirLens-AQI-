import { Bell, Search, User, MapPin, LogOut, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function TopNav() {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        router.push('/admin/login');
    };

    return (
        <header className="sticky top-0 z-40 w-full glass-panel border-x-0 border-t-0 border-b border-slate-800/60 pb-1">
            <div className="flex h-16 items-center px-6 gap-4 font-sans">

                {/* Mobile menu grabber or logo space if collapsed (handled by layout) */}

                <div className="flex flex-1 items-center gap-4">
                    <div className="relative w-full max-w-sm group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search cities, wards, or metrics..."
                            className="w-full h-10 pl-10 pr-4 bg-slate-900/50 border border-slate-700/50 rounded-full text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all placeholder:text-slate-500"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4 justify-end">
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-full border border-slate-700/50">
                        <MapPin className="h-3.5 w-3.5 text-indigo-400" />
                        <span className="text-xs font-medium text-slate-300">Mumbai</span>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-full transition-colors"
                    >
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-slate-950 animate-pulse"></span>
                    </motion.button>

                    <div className="relative">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-[1px] cursor-pointer shadow-lg shadow-indigo-500/20"
                        >
                            <div className="h-full w-full rounded-full bg-slate-900 flex items-center justify-center border border-white/5">
                                <User className="h-4.5 w-4.5 text-indigo-200" />
                            </div>
                        </motion.div>

                        <AnimatePresence>
                            {isProfileOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setIsProfileOpen(false)}
                                    ></div>
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 mt-3 w-56 glass-panel border border-slate-700/50 bg-slate-900/90 backdrop-blur-xl rounded-2xl p-2 shadow-2xl z-20"
                                    >
                                        <div className="px-3 py-2 border-b border-slate-800/50 mb-1">
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Admin Profile</p>
                                            <div className="flex items-center gap-2 text-slate-200">
                                                <Globe className="h-3.5 w-3.5 text-indigo-400" />
                                                <span className="text-sm font-medium">Country: India</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-semibold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all group"
                                        >
                                            <LogOut className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                                            <span>Sign Out</span>
                                        </button>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </header>
    );
}
