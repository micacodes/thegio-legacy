// path: apps/web/lib/types.ts

// --- THIS IS THE FIX ---
// We are defining the possible OrderStatus values on the frontend,
// so we don't need to import them from the backend.
export type OrderStatus = 'PENDING' | 'PAID' | 'IN_DESIGN' | 'AWAITING_APPROVAL' | 'PRINTING' | 'SHIPPED' | 'DELIVERED' | 'CANCELED';

export interface Subscription {
  planId: string;
  status: string;
  currentPeriodEnd: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  username: string;
  name?: string;
  role: 'CUSTOMER' | 'DESIGNER' | 'ADMIN';
  subscription?: Subscription | null;
}

export type SignUpCredentials = {
  email: string;
  password: string;
  name: string;
  username: string;
  phone?: string;
};

export type LoginCredentials = Omit<SignUpCredentials, 'name' | 'username' | 'phone'>;

// Template Types
export interface Template {
  id: string;
  name: string;
  description: string;
  previewImgUrl: string;
}

// Order Types
export interface Order {
  id: string;
  status: OrderStatus; // It now uses our locally defined OrderStatus type
  type: 'DIY' | 'PREMIUM';
  amountPaid: number;
  createdAt: string;
  userId?: string;
  template?: Template | null;
  user?: User | null;
}

// Payment Types
export interface StripeCheckoutParams {
    type: 'DIY' | 'PREMIUM';
    amountInCents: number;
    productName: string;
    templateId?: string;
}