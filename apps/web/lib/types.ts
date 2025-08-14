// path: apps/web/lib/types.ts
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

// Order Types
export interface Order {
  id: string;
  status: 'PENDING' | 'PAID' | 'IN_DESIGN' | 'AWAITING_APPROVAL' | 'PRINTING' | 'SHIPPED' | 'DELIVERED' | 'CANCELED';
  type: 'DIY' | 'PREMIUM';
  amountPaid: number;
  createdAt: string;
}

// Template Types
export interface Template {
  id: string;
  name: string;
  description: string;
  previewImgUrl: string;
}

// Payment Types
export interface StripeCheckoutParams {
    type: 'DIY' | 'PREMIUM';
    amountInCents: number;
    productName: string;
    templateId?: string;
}