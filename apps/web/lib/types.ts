// path: apps/web/lib/types.ts
export interface Subscription {
  planId: string;
  status: string;
  currentPeriodEnd: string;
}

// User Types - This is already correct
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

// Template Types - This is correct
export interface Template {
  id: string;
  name: string;
  description: string;
  previewImgUrl: string;
}

// Order Types
export interface Order {
  id: string;
  status: 'PENDING' | 'PAID' | 'IN_DESIGN' | 'AWAITING_APPROVAL' | 'PRINTING' | 'SHIPPED' | 'DELIVERED' | 'CANCELED';
  type: 'DIY' | 'PREMIUM';
  amountPaid: number;
  createdAt: string;
  userId?: string;
  template?: Template | null;
  // --- THIS IS THE FIX ---
  // The Order type now correctly includes the User object.
  user?: User | null;
}

// Payment Types - This is correct
export interface StripeCheckoutParams {
    type: 'DIY' | 'PREMIUM';
    amountInCents: number;
    productName: string;
    templateId?: string;
}