// path: apps/web/pages/admin/orders/[id].tsx
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import * as api from '@/lib/api';
import { Order, OrderStatus } from '@/lib/types'; // <-- CORRECTED IMPORT
import AdminHeader from '@/components/layout/AdminHeader';
import Head from 'next/head';

const AdminOrderDetailPage = () => {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const { id } = router.query;
    const [order, setOrder] = useState<Order | null>(null);
    const [isDataLoading, setIsDataLoading] = useState(true);

    useEffect(() => {
        if (!isLoading && (!user || user.role !== 'ADMIN')) {
            router.push('/login');
        }
        if (user && user.role === 'ADMIN' && typeof id === 'string') {
            api.adminGetOrderDetails(id)
                .then(setOrder)
                .catch(err => console.error("Failed to fetch order details:", err))
                .finally(() => setIsDataLoading(false));
        }
    }, [user, isLoading, router, id]);

    const handleStatusChange = async (newStatus: OrderStatus) => {
        if (!order) return;
        try {
            const updatedOrder = await api.adminUpdateOrderStatus(order.id, newStatus);
            setOrder(updatedOrder);
        } catch (error) {
            console.error("Failed to update status:", error);
            alert("Failed to update order status.");
        }
    };

    if (isLoading || isDataLoading) {
        return <div className="text-center py-20">Loading Order Details...</div>;
    }

    if (!order) {
        return <div className="text-center py-20">Order not found.</div>;
    }

    return (
        <>
            <Head><title>Order #{order.id.substring(0,8)} - Admin</title></Head>
            {/* <AdminHeader /> */}
            <main className="bg-gray-50 min-h-screen p-8">
                <div className="container mx-auto">
                    <h1 className="text-3xl font-bold">Order Details</h1>
                    <p className="text-gray-500">Order ID: {order.id}</p>
                    
                    {/* ... Rest of your component JSX to display order details ... */}
                    <div className="mt-8 bg-white p-6 rounded-lg shadow">
                        <p><strong>Customer:</strong> {order.user?.name || order.user?.email}</p>
                        <p><strong>Status:</strong> {order.status}</p>
                        <p><strong>Amount:</strong> ${order.amountPaid}</p>
                        <p><strong>Type:</strong> {order.type}</p>
                        <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>

                        <div className="mt-6">
                            <label htmlFor="status-select" className="block font-medium mb-2">Change Order Status:</label>
                            <select 
                                id="status-select"
                                value={order.status}
                                onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
                                className="p-2 border rounded-md"
                            >
                                {Object.values(['PENDING', 'PAID', 'IN_DESIGN', 'AWAITING_APPROVAL', 'PRINTING', 'SHIPPED', 'DELIVERED', 'CANCELED']).map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default AdminOrderDetailPage;