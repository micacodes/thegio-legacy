import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import * as api from '@/lib/api';
import AdminHeader from '@/components/layout/AdminHeader';
import Head from 'next/head';
import { OrderStatus } from '@prisma/client';

const AdminOrderDetailPage = () => {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const { id } = router.query; // Get the order ID from the URL
    const [order, setOrder] = useState<any>(null);
    const [newStatus, setNewStatus] = useState<string>('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!isLoading && (!user || user.role !== 'ADMIN')) {
            router.push('/login');
        }
        if (user && user.role === 'ADMIN' && id) {
            api.adminGetOrderDetails(id as string)
                .then(data => {
                    setOrder(data);
                    setNewStatus(data.status);
                })
                .catch(err => console.error("Failed to fetch order details", err));
        }
    }, [user, isLoading, router, id]);

    const handleStatusUpdate = async () => {
        setMessage('');
        try {
            const updatedOrder = await api.adminUpdateOrderStatus(id as string, newStatus);
            setOrder(updatedOrder);
            setMessage('Status updated successfully!');
        } catch (error) {
            setMessage('Failed to update status.');
        }
    };

    if (isLoading || !order) return <div>Loading...</div>;

    const content = order.contentJson ? JSON.parse(order.contentJson) : {};

    return (
        <>
            <Head><title>Order {order.id.substring(0,8)} - Thegio Admin</title></Head>
            <AdminHeader />
            <div className="container mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6">Order Details</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Order #{order.id}</h2>
                        <p><strong>Status:</strong> {order.status}</p>
                        <p><strong>Type:</strong> {order.type}</p>
                        <p><strong>Amount Paid:</strong> ${order.amountPaid}</p>
                        <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                        <hr className="my-4" />
                        <h3 className="font-semibold">Uploaded Content:</h3>
                        {content.storyFileUrl ? <a href={content.storyFileUrl} target="_blank" rel="noopener noreferrer" className="text-brand-orange hover:underline block">View Story File</a> : <p>No story file.</p>}
                        {content.photoZipUrl ? <a href={content.photoZipUrl} target="_blank" rel="noopener noreferrer" className="text-brand-orange hover:underline block">Download Photo ZIP</a> : <p>No photo ZIP.</p>}
                        <h3 className="font-semibold mt-4">Instructions:</h3>
                        <p className="text-gray-600 italic bg-gray-50 p-2 rounded">{content.instructions || 'No special instructions provided.'}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Customer Info</h2>
                        <p><strong>Name:</strong> {order.user.name}</p>
                        <p><strong>Email:</strong> {order.user.email}</p>
                        <p><strong>Phone:</strong> {order.user.phone || 'N/A'}</p>
                        <hr className="my-4" />
                        <h2 className="text-xl font-semibold mb-4">Update Status</h2>
                        <select value={newStatus} onChange={e => setNewStatus(e.target.value)} className="w-full p-2 border rounded-md">
                            {Object.values(OrderStatus).map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                        <button onClick={handleStatusUpdate} className="bg-brand-orange text-white w-full py-2 mt-4 rounded-md hover:opacity-90">
                            Update Order
                        </button>
                        {message && <p className="mt-2 text-sm text-green-600">{message}</p>}
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminOrderDetailPage;