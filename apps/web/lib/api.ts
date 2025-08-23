import { User, LoginCredentials, SignUpCredentials, Order, Template, StripeCheckoutParams } from './types';

const API_URL = 'http://localhost:3001/api'; // Our backend URL

async function fetcher(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('authToken');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${url}`, { ...options, headers });

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

export const uploadPremiumFiles = async (formData: FormData): Promise<{ storyFileUrl: string; photoZipUrl: string; }> => {
  const token = localStorage.getItem('authToken');
  const response = await fetch(`${API_URL}/uploads/premium-files`, {
    method: 'POST',
    headers: {
      // DO NOT set 'Content-Type'. The browser sets it automatically for FormData.
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

export const getOrderById = (orderId: string): Promise<Order> => {
  return fetcher(`/orders/${orderId}`);
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



// --- NEW ANALYTICS FUNCTIONS ---
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


export const createDraftOrder = (templateId: string | null, type: 'DIY' | 'PREMIUM'): Promise<Order> => {
  return fetcher('/orders/draft', { method: 'POST', body: JSON.stringify({ templateId, type }) });
};

export const adminGetStats = (): Promise<{ totalOrders: number; totalUsers: number; totalRevenue: number; }> => {
  return fetcher('/admin/stats');
};

export interface User {
  id: string;
  email: string;
  username: string; // Already here, but good to confirm
  name?: string | null; // Make sure 'name' is included and can be null
  role: 'CUSTOMER' | 'DESIGNER' | 'ADMIN';
}

export interface Order {
  id: string;
  status: 'PENDING' | 'PAID' | 'IN_DESIGN' | 'AWAITING_APPROVAL' | 'PRINTING' | 'SHIPPED' | 'DELIVERED' | 'CANCELED';
  type: 'DIY' | 'PREMIUM';
  amountPaid: number;
  createdAt: string;
  template?: Template | null; 
}

export const initiateMpesaPayment = (data: { amount: number; phone: string; orderId: string; }): Promise<any> => {
  return fetcher('/payments/mpesa/initiate', { method: 'POST', body: JSON.stringify(data) })
};