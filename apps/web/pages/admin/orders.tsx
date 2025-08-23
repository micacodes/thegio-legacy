import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import * as api from '@/lib/api';
import { Order } from '@/lib/types';
import AdminHeader from '@/components/layout/AdminHeader';
import Head from 'next/head';
import Link from 'next/link';

const AdminOrdersPage = () => {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<any[]>([]); // Using 'any' to include user details

    useEffect(() => {
        if (!isLoading && (!user || user.role !== 'ADMIN')) {
            router.push('/login');
        }
        if (user && user.role === 'ADMIN') {
            api.adminGetAllOrders()
                .then(setOrders)
                .catch(err => console.error("Failed to fetch orders", err));
        }
    }, [user, isLoading, router]);

    if (isLoading || !user) return <div>Loading...</div>;

    return (
        <>
            <Head><title>Manage Orders - Thegio Admin</title></Head>
            <AdminHeader />
            <div className="container mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6">All Customer Orders</h1>
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <table className="w-full">
                        <thead className="border-b">
                            <tr>
                                <th className="text-left p-3">Order ID</th>
                                <th className="text-left p-3">Date</th>
                                <th className="text-left p-3">Customer</th>
                                <th className="text-left p-3">Status</th>
                                <th className="text-left p-3">Total</th>
                                <th className="text-left p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3 font-mono text-sm">{order.id.substring(0, 8)}...</td>
                                    <td className="p-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td className="p-3">{order.user.name || order.user.email}</td>
                                    <td className="p-3">{order.status}</td>
                                    <td className="p-3">${order.amountPaid}</td>
                                    <td className="p-3">
                                        <Link href={`/admin/orders/${order.id}`} className="text-brand-orange font-semibold hover:underline">
                                            View Details
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default AdminOrdersPage;