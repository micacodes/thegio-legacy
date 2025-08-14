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