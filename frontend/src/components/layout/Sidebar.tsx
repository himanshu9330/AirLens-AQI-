'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Map, Activity, CloudFog, AlertTriangle, BarChart3, Settings, Wind } from 'lucide-react';
import { motion } from 'framer-motion';

const mainNavigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'AQI Map', href: '#aqi-map', icon: Map },
    { name: 'Sources', href: '#sources', icon: CloudFog },
    { name: 'Predictions', href: '/admin/dashboard/predictions', icon: Activity },
];

const secondaryNavigation = [
    { name: 'Alerts', href: '#alerts', icon: AlertTriangle, status: '3' },
    { name: 'Analytics', href: '/admin/dashboard/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/admin/dashboard/settings', icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();

    const NavItem = ({ item }: { item: any }) => {
        const isActive = pathname === item.href || (item.href.startsWith('#') && false); // Simplified for demo

        return (
            <Link href={item.href} className="block relative group">
                {isActive && (
                    <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-indigo-500/10 border border-indigo-500/20 rounded-xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                )}
                <div className={`relative px-4 py-3 flex items-center gap-3 rounded-xl transition-colors ${isActive
                    ? 'text-indigo-400'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                    }`}>
                    <item.icon className={`h-5 w-5 ${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300 transition-colors'}`} />
                    <span className="text-sm font-medium">{item.name}</span>

                    {item.status && (
                        <span className="ml-auto bg-rose-500/10 text-rose-400 py-0.5 px-2 rounded-full text-[10px] font-bold border border-rose-500/20">
                            {item.status}
                        </span>
                    )}
                </div>
            </Link>
        );
    };

    return (
        <aside className="w-64 h-full hidden lg:flex flex-col glass-panel border-y-0 border-l-0 border-r border-slate-800/60 font-sans z-50">
            <div className="h-16 flex items-center px-6 mb-4">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="h-8 w-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all">
                        <Wind className="h-5 w-5" />
                    </div>
                    <span className="font-display font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-400">
                        AirLens<span className="text-indigo-400">.</span>
                    </span>
                </Link>
            </div>

            <div className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar pb-6">
                <div className="mb-6">
                    <h3 className="px-4 text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-2">Overview</h3>
                    <nav className="space-y-1">
                        {mainNavigation.map((item) => <NavItem key={item.name} item={item} />)}
                    </nav>
                </div>

                <div>
                    <h3 className="px-4 text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-2">System</h3>
                    <nav className="space-y-1">
                        {secondaryNavigation.map((item) => <NavItem key={item.name} item={item} />)}
                    </nav>
                </div>
            </div>

            <div className="p-4 mt-auto">
                <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/20 relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-24 h-24 bg-indigo-500/20 blur-2xl rounded-full"></div>
                    <p className="text-xs font-medium text-slate-300 mb-1 relative z-10">AI Model Status</p>
                    <div className="flex items-center gap-2 relative z-10">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-[10px] text-emerald-400 font-medium tracking-wide">ONLINE & SYNCED</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
