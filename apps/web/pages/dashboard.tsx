import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import * as api from '@/lib/api';
import { Order } from '@/lib/types';
import Head from 'next/head';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import DashboardCard from '@/components/ui/DashboardCard';
import { FaBook, FaPlusCircle, FaEnvelope, FaIdCard, FaCreditCard } from 'react-icons/fa';

const DashboardPage = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    // This effect handles authentication and redirects.
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    // This effect fetches data only when a user is confirmed.
    if (user) {
      setIsDataLoading(true);
      api.getUserOrders()
        .then(setOrders)
        .catch(error => {
          console.error("Failed to fetch orders:", error);
          // Optionally set an error state here to show in the UI
        })
        .finally(() => {
          setIsDataLoading(false);
        });
    }
  }, [user]);

  // Main loading state while checking auth
  if (isLoading || !user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-xl font-semibold text-gray-500">Securing your session...</div>
      </div>
    );
  }
  
  // Helper function to create styled status chips
  const getStatusChip = (status: Order['status']) => {
    const statusMap: { [key in Order['status']]: string } = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PAID: 'bg-blue-100 text-blue-800',
      IN_DESIGN: 'bg-indigo-100 text-indigo-800',
      AWAITING_APPROVAL: 'bg-purple-100 text-purple-800',
      PRINTING: 'bg-cyan-100 text-cyan-800',
      SHIPPED: 'bg-green-100 text-green-800',
      DELIVERED: 'bg-gray-200 text-gray-800',
      CANCELED: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusMap[status]}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  return (
    <>
      <Head>
        <title>Your Dashboard - Thegio</title>
      </Head>
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-6 py-12">
          
          {/* Header Section */}
          <div className="mb-10">
            <h1 className="text-4xl font-extrabold text-brand-dark">Welcome back, {user.name || user.username}!</h1>
            <p className="mt-2 text-gray-500">Here's a summary of your legacy book journey.</p>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Main Content Column */}
            <div className="lg:col-span-2">
              <DashboardCard title="Recent Orders">
                {isDataLoading ? (
                  <p className="text-gray-500">Loading your orders...</p>
                ) : orders.length > 0 ? (
                  <ul className="space-y-4">
                    {orders.slice(0, 5).map(order => (
                      <li key={order.id} className="flex justify-between items-center border-b pb-3 last:border-b-0">
                        <div className="flex items-center space-x-4">
                          <div className="bg-brand-peach/30 p-3 rounded-full">
                            <FaBook className="text-brand-orange" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">Order #{order.id.substring(0, 8)}...</p>
                            <p className="text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        {getStatusChip(order.status)}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-10 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 mb-4">You haven't created any books yet.</p>
                    <Link href="/pricing">
                      <Button>Create Your First Book</Button>
                    </Link>
                  </div>
                )}
              </DashboardCard>
            </div>

            {/* Sidebar Column */}
            <div className="space-y-8">
              <DashboardCard title="Quick Actions">
                <Link href="/pricing">
                  <Button className="w-full flex items-center justify-center space-x-2 text-base">
                    <FaPlusCircle />
                    <span>Create a New Book</span>
                  </Button>
                </Link>
              </DashboardCard>

              <DashboardCard title="Account Details">
                <ul className="space-y-4 text-gray-700">
                  <li className="flex items-center">
                    <FaIdCard className="w-5 h-5 mr-4 text-gray-400 flex-shrink-0" />
                    <div>
                      <span className="text-xs text-gray-500">Username</span>
                      <p className="font-semibold">{user.username}</p>
                    </div>
                  </li>
                  <li className="flex items-center">
                    <FaEnvelope className="w-5 h-5 mr-4 text-gray-400 flex-shrink-0" />
                    <div>
                      <span className="text-xs text-gray-500">Email</span>
                      <p className="font-semibold">{user.email}</p>
                    </div>
                  </li>
                   <li className="flex items-center">
                    <FaCreditCard className="w-5 h-5 mr-4 text-gray-400 flex-shrink-0" />
                    <div>
                      <span className="text-xs text-gray-500">Subscription</span>
                      <p className="font-semibold text-green-600">Free Plan</p>
                    </div>
                  </li>
                </ul>
                <div className="mt-6 border-t pt-4">
                    {/* This link is a placeholder for a future settings page */}
                    <a href="#" className="text-sm font-medium text-brand-orange hover:underline">
                        Manage Account
                    </a>
                </div>
              </DashboardCard>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;