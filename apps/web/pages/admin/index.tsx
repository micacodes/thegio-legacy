import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import AdminHeader from '@/components/layout/AdminHeader';
import Head from 'next/head';
import DashboardCard from '@/components/ui/DashboardCard';
import { FaBoxOpen, FaDollarSign, FaUsers } from 'react-icons/fa';
import * as api from '@/lib/api';
import Link from 'next/link';

interface DashboardStats {
  totalRevenue: number;
  newOrdersCount: number;
  totalUsersCount: number;
  inProgressOrdersCount: number;
}

const AdminDashboard = () => {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [isDataLoading, setIsDataLoading] = useState(true);

    useEffect(() => {
        if (!isLoading && (!user || user.role !== 'ADMIN')) {
            // This now tells the login page where to return.
            router.push(`/login?redirect=${router.asPath}`);
        }
        
        if (user && user.role === 'ADMIN') {
            Promise.all([
                api.adminGetStats(),
                api.adminGetAllOrders()
            ]).then(([statsData, ordersData]) => {
                setStats(statsData);
                setRecentOrders(ordersData.slice(0, 5));
            }).catch(err => {
                console.error("Failed to fetch dashboard data:", err);
            }).finally(() => {
                setIsDataLoading(false);
            });
        }
    }, [user, isLoading, router]);

    if (isLoading || !user) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p>Verifying admin session...</p>
            </div>
        );
    }

    return (
        <>
            <Head><title>Admin Dashboard - Thegio</title></Head>
            <AdminHeader />
            <main className="bg-gray-50 min-h-screen p-6 sm:p-8">
                <div className="container mx-auto">
                    <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                    <p className="mt-1 text-gray-500">Welcome, {user.name || user.username}. Here's a real-time overview of your platform.</p>

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <DashboardCard title="Total Revenue">
                            <div className="flex items-center space-x-4">
                                <FaDollarSign className="text-4xl text-green-500" />
                                <div className="text-left">
                                    <p className="text-3xl font-bold">
                                        {isDataLoading ? '...' : `$${stats?.totalRevenue.toFixed(2)}`}
                                    </p>
                                    <p className="text-sm text-gray-500">From all completed orders</p>
                                </div>
                            </div>
                        </DashboardCard>
                        <DashboardCard title="Total Orders">
                            <div className="flex items-center space-x-4">
                                <FaBoxOpen className="text-4xl text-blue-500" />
                                <div className="text-left">
                                    <p className="text-3xl font-bold">
                                        {isDataLoading ? '...' : stats?.totalOrders}
                                    </p>
                                    <p className="text-sm text-gray-500">Across all users</p>
                                </div>
                            </div>
                        </DashboardCard>
                        <DashboardCard title="Total Users">
                            <div className="flex items-center space-x-4">
                                <FaUsers className="text-4xl text-purple-500" />
                                <div className="text-left">
                                    <p className="text-3xl font-bold">
                                        {isDataLoading ? '...' : stats?.totalUsers}
                                    </p>
                                    <p className="text-sm text-gray-500">Registered on the platform</p>
                                </div>
                            </div>
                        </DashboardCard>
                    </div>

                    <div className="mt-8">
                        <DashboardCard title="Recent Orders">
                            {isDataLoading ? (
                                <p className="text-gray-500">Loading recent orders...</p>
                            ) : recentOrders.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <tbody>
                                            {recentOrders.map(order => (
                                                <tr key={order.id} className="border-b last:border-b-0">
                                                    <td className="py-3 pr-3 font-semibold">{order.user?.name || order.user?.email}</td>
                                                    <td className="py-3 px-3 text-gray-500">{order.status}</td>
                                                    <td className="py-3 px-3 text-gray-500">${order.amountPaid}</td>
                                                    <td className="py-3 pl-3 text-right">
                                                        <Link href={`/admin/orders/${order.id}`} className="text-brand-orange font-medium hover:underline">
                                                            View
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-center py-8 text-gray-500">No orders have been placed yet.</p>
                            )}
                        </DashboardCard>
                    </div>
                </div>
            </main>
        </>
    );
};

export default AdminDashboard;