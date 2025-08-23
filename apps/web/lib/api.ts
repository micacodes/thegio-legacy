import { User, LoginCredentials, SignUpCredentials, Order, Template, StripeCheckoutParams } from './types';

// In a deployed environment, Vercel sets this automatically. For local dev, we need a default.
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// --- THIS IS THE FIX ---
// We are explicitly telling TypeScript what the shape of our headers object can be.
// It can have 'Content-Type', and it MIGHT have 'Authorization'.
type ApiHeaders = {
  'Content-Type': 'application/json';
  Authorization?: string; // The '?' makes the Authorization property optional.
};

async function fetcher(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('authToken');
  
  // We initialize the headers object with our defined type.
  const headers: ApiHeaders = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    // This is now type-safe because our ApiHeaders type allows for an Authorization property.
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${url}`, { 
    ...options, 
    // We cast headers to any here to satisfy the built-in 'fetch' type, which is very generic.
    // This is a common and safe practice in this specific scenario.
    headers: headers as any, 
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'An API error occurred');
  }

  return response.json();
}

// --- Auth Endpoints ---
export const registerUser = (data: SignUpCredentials): Promise<{ user: User; token: string }> => {
  return fetcher('/auth/register', { method: 'POST', body: JSON.stringify(data) });
};

export const loginUser = (data: LoginCredentials): Promise<{ user: User; token: string }> => {
  return fetcher('/auth/login', { method: 'POST', body: JSON.stringify(data) });
};

export const getMe = (): Promise<User> => {
  return fetcher('/auth/me');
};

// --- Order Endpoints ---
export const getUserOrders = (): Promise<Order[]> => {
  return fetcher('/orders');
};

export const getOrderById = (orderId: string): Promise<Order> => {
  return fetcher(`/orders/${orderId}`);
};

export const createDraftOrder = (templateId: string | null, type: 'DIY' | 'PREMIUM'): Promise<Order> => {
  return fetcher('/orders/draft', { method: 'POST', body: JSON.stringify({ templateId, type }) });
};


// --- Template Endpoints ---
export const getTemplates = (): Promise<Template[]> => {
  return fetcher('/templates');
};

// --- Payment Endpoints ---
export const createStripeCheckoutSession = (data: StripeCheckoutParams): Promise<{ url: string }> => {
  return fetcher('/orders/create-checkout-session', { method: 'POST', body: JSON.stringify(data) });
};

export const createStripeSubscriptionSession = (priceId: string): Promise<{ url: string }> => {
  return fetcher('/subscriptions/create-checkout-session', { method: 'POST', body: JSON.stringify({ priceId }) });
};

export const initiateMpesaPayment = (data: { amount: number; phone: string; orderId: string; }): Promise<any> => {
  return fetcher('/payments/mpesa/initiate', { method: 'POST', body: JSON.stringify(data) })
};


// --- File Upload Endpoint ---
export const uploadPremiumFiles = async (formData: FormData): Promise<{ storyFileUrl: string; photoZipUrl: string; }> => {
  const token = localStorage.getItem('authToken');
  const response = await fetch(`${API_URL}/uploads/premium-files`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'File upload failed');
  }
  return response.json();
};

// --- Admin Endpoints ---
export const adminGetAllOrders = (): Promise<Order[]> => {
  return fetcher('/admin/orders');
};

export const adminGetOrderDetails = (orderId: string): Promise<Order> => {
  return fetcher(`/admin/orders/${orderId}`);
};

export const adminUpdateOrderStatus = (orderId: string, status: string): Promise<Order> => {
  return fetcher(`/orders/${orderId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
};

export const getAdminStats = (): Promise<{
  totalRevenue: number;
  newOrdersCount: number;
  totalUsersCount: number;
  inProgressOrdersCount: number;
}> => {
  return fetcher('/admin/stats');
};

export const getAdminChartData = (): Promise<{ date: string; count: number }[]> => {
  return fetcher('/admin/chart-data');
};