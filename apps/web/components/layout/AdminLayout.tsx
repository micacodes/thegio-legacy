import { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { FaTachometerAlt, FaBoxOpen, FaUsers, FaSignOutAlt } from 'react-icons/fa';

const AdminLayout = ({ children, title }: { children: ReactNode; title: string }) => {
    const { user, isLoading, logout } = useAuth();
    const router = useRouter();

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center">Loading Admin Session...</div>;
    }

    // This is a robust check to protect the admin area
    if (!user || user.role !== 'ADMIN') {
        // Redirect to login page after a short delay to prevent flash of content
        if (typeof window !== 'undefined') {
            router.push('/login');
        }
        return null;
    }

    const navItems = [
        { href: '/admin', label: 'Dashboard', icon: FaTachometerAlt },
        { href: '/admin/orders', label: 'Orders', icon: FaBoxOpen },
        { href: '/admin/users', label: 'Users', icon: FaUsers },
    ];

    return (
        <>
            <Head><title>{title} - Thegio Admin</title></Head>
            <div className="flex h-screen bg-gray-100 font-sans">
                {/* Sidebar */}
                <aside className="w-64 flex-shrink-0 bg-brand-dark text-white flex flex-col">
                    <div className="h-16 flex items-center justify-center text-2xl font-bold border-b border-gray-700">
                        Thegio Admin
                    </div>
                    <nav className="flex-grow px-4 py-4">
                        {navItems.map(item => (
                            <Link key={item.href} href={item.href}
                                className={`flex items-center px-4 py-3 rounded-lg transition-colors
                                ${router.pathname === item.href ? 'bg-brand-orange text-white' : 'hover:bg-gray-700'}`}>
                                <item.icon className="mr-3" />
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                    <div className="p-4 border-t border-gray-700">
                        <button onClick={logout} className="w-full flex items-center px-4 py-3 rounded-lg hover:bg-red-500 transition-colors">
                            <FaSignOutAlt className="mr-3" />
                            Logout
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-8">
                        {children}
                    </div>
                </main>
            </div>
        </>
    );
};

export default AdminLayout;