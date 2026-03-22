import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            router.push('/admin/login');
        }
    }, [router]);

    return (
        <div className="flex h-screen overflow-hidden bg-[#020617]">
            <div className="fixed inset-0 z-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
            
            {/* Background Glows */}
            <div className="absolute top-0 right-0 -mr-40 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -ml-40 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>

            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex flex-1 flex-col relative z-10 overflow-hidden">
                <TopNav />
                <main className="flex-1 overflow-y-auto custom-scrollbar p-6">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
