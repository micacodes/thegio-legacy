import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import * as api from '@/lib/api';
import { Order } from '@/lib/types';
import Button from '@/components/ui/Button';
import Image from 'next/image';

// A new, reusable component for displaying status messages elegantly.
const PaymentStatus = ({ message, type }: { message: string; type: 'info' | 'error' | 'success' }) => {
  if (!message) return null;

  const colorClasses = {
    info: 'bg-blue-100 text-blue-800',
    error: 'bg-red-100 text-red-800',
    success: 'bg-green-100 text-green-800',
  };

  return (
    <div className={`text-center mt-4 p-3 rounded-md text-sm font-semibold ${colorClasses[type]}`}>
      {message}
    </div>
  );
};





const CheckoutPage = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const { projectId } = router.query;

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'mpesa'>('stripe');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // State for the new status messaging system
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState<'info' | 'error' | 'success'>('info');
  
  const TEST_PRICE_KES = 1;
  const TEST_PRICE_USD_CENTS = 100;

  useEffect(() => {
    if (!isAuthLoading && !user) {
      if (projectId) { router.push(`/login?redirect=/checkout/${projectId}`); }
    }
    if (user && typeof projectId === 'string') {
      api.getOrderById(projectId as string)
        .then(setOrder)
        .catch(() => router.push('/dashboard'))
        .finally(() => setIsLoading(false));
    }
  }, [user, isAuthLoading, projectId, router]);

  const handleStripeCheckout = async () => {
    setIsProcessing(true);
    setStatusMessage('');
    try {
      const bookTitle = localStorage.getItem(`project_${projectId}_title`) || 'My Legacy Book';
      const session = await api.createStripeCheckoutSession({
        type: 'DIY',
        amountInCents: TEST_PRICE_USD_CENTS,
        productName: bookTitle,
      });
      window.location.href = session.url;
    } catch (err) {
      setStatusMessage('Stripe checkout failed. Please try again.');
      setStatusType('error');
      setIsProcessing(false);
    }
  };

  const handleMpesaCheckout = async () => {
    if (!phone || !/^\d{10,12}$/.test(phone)) {
        setStatusMessage('Please enter a valid phone number (e.g., 254712345678).');
        setStatusType('error');
        return;
    }
    setIsProcessing(true);
    setStatusMessage('Sending payment request to your phone...');
    setStatusType('info');

    try {
        const response = await api.initiateMpesaPayment({
            amount: TEST_PRICE_KES,
            phone,
            orderId: projectId as string,
        });

        if (response.status === 'success') {
          const responseData = response.data;
          if (responseData && responseData.ResponseCode === '0') {
            setStatusMessage('Success! A request has been sent to your phone. Please enter your M-Pesa PIN to complete the payment.');
            setStatusType('success');
          } else {
            setStatusMessage(responseData.ResponseDescription || 'The request was rejected by the provider.');
            setStatusType('error');
          }
        } else {
           setStatusMessage(response.message || 'An unknown error occurred.');
           setStatusType('error');
        }
    } catch (err: any) {
        setStatusMessage(err.message || 'M-Pesa checkout failed. Please try again.');
        setStatusType('error');
    } finally {
        setIsProcessing(false);
    }
  };

  if (isAuthLoading || isLoading) {
    return <div className="text-center py-20">Loading Checkout...</div>;
  }

  return (
    <>
      <Head>
        <title>Checkout - Thegio</title>
      </Head>
      <div className="bg-gray-50 min-h-screen flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800">Complete Your Order</h1>
                    <p className="text-gray-500 mt-1">Choose your preferred payment method below.</p>
                </div>

                <div className="mt-6 border-t border-b py-4">
                    <div className="flex justify-between items-center text-lg">
                        <span className="font-medium text-gray-600">DIY Legacy Book</span>
                        <span className="font-bold text-gray-800">
                            {paymentMethod === 'stripe' ? `$${(TEST_PRICE_USD_CENTS / 100).toFixed(2)} USD` : `${TEST_PRICE_KES} KES`}
                        </span>
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 my-6">
                    <button 
                        onClick={() => setPaymentMethod('stripe')} 
                        className={`py-3 px-4 flex justify-center items-center transition-all duration-200 rounded-lg font-semibold border-2 ${paymentMethod === 'stripe' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                    >
                    <Image src="/assets/stripeIcon.png" alt="Stripe" width={80} height={30} />
                    </button>
                    <button 
                        onClick={() => setPaymentMethod('mpesa')} 
                        className={`py-3 px-4 flex justify-center items-center transition-all duration-200 rounded-lg font-semibold border-2 ${paymentMethod === 'mpesa' ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                    >
                        <Image src="/assets/Mpesa.png" alt="M-Pesa" width={80} height={30} />
                    </button>
                </div>

                {paymentMethod === 'stripe' && (
                    <div className="space-y-4">
                        <Button 
                            onClick={handleStripeCheckout} 
                            disabled={isProcessing} 
                            className="w-full !rounded-md bg-indigo-600 hover:bg-indigo-700 !py-4 text-lg"
                        >
                            {isProcessing ? 'Redirecting...' : 'Pay with Stripe'}
                        </Button>
                    </div>
                )}

                {paymentMethod === 'mpesa' && (
                    <div className="space-y-4">
                        <label htmlFor="phone" className="block font-medium text-gray-700">M-Pesa Phone Number</label>
                        <input 
                            type="tel"
                            id="phone"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            placeholder="e.g., 254712345678"
                            className="w-full p-3 border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none focus:border-green-500"
                        />
                        <Button 
                            onClick={handleMpesaCheckout} 
                            disabled={isProcessing} 
                            className="w-full !rounded-md bg-green-600 hover:bg-green-700 !py-4 text-lg"
                        >
                            {isProcessing ? 'Processing...' : `Pay ${TEST_PRICE_KES} KES`}
                        </Button>
                    </div>
                )}
                
                <PaymentStatus message={statusMessage} type={statusType} />
            </div>
            <p className="text-center text-xs text-gray-400 mt-4">Powered by Stripe & Safaricom Daraja</p>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;