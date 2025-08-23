// path: apps/api/src/modules/orders/orders.controller.ts
import { Request, Response } from 'express';
// --- FIX: REMOVED OrderStatus and OrderType from this import ---
import { PrismaClient } from '@prisma/client';
import { paymentService } from '../../services/paymentService';
import { printService } from '../../services/printService';
import { emailService } from '../../services/emailService';

const prisma = new PrismaClient();

// --- FIX: ADDED local type definitions for robustness ---
type OrderStatus = 'PENDING' | 'PAID' | 'IN_DESIGN' | 'AWAITING_APPROVAL' | 'PRINTING' | 'SHIPPED' | 'DELIVERED' | 'CANCELED';
type OrderType = 'DIY' | 'PREMIUM';


// Creates a checkout session for a one-time purchase (DIY or Premium)
export const createOrderCheckoutSession = async (req: Request, res: Response) => {
  const { type, amountInCents, productName, templateId, contentJson, shippingAddressJson } = req.body;
  const userId = req.user!.id;

  try {
    const metadata = {
        userId,
        orderType: type,
        templateId: templateId || '',
        contentJson: contentJson || '',
        shippingAddressJson: shippingAddressJson || '',
        amountPaid: (amountInCents / 100).toString(),
    };
    
    const session = await paymentService.createCheckoutSessionForOneTimePurchase(amountInCents, productName, metadata);
    res.status(200).json({ url: session.url });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create checkout session' });
  }
};

// Get all orders for the currently logged-in user
export const getUserOrders = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { user: true } // It's good practice to include user data
    });
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch user's orders" });
  }
};

// Get a single order by its ID
export const getOrderById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.id;
  const userRole = req.user!.role;

  try {
    const order = await prisma.order.findUnique({ where: { id }, include:{template:true, user: true}, });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.userId !== userId && userRole !== 'ADMIN') {
      return res.status(403).json({ message: 'Access denied to this order' });
    }
    
    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch order' });
  }
};

// An admin or designer updates the status of an order
export const updateOrderStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body as { status: OrderStatus }; // Cast to our local type

    try {
        const updatedOrder = await prisma.order.update({
            where: { id },
            data: { status },
        });

        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update order status' });
    }
};

// Customer approves the design
export const approveOrderForPrint = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.id;

  try {
    const order = await prisma.order.findFirst({ where: { id, userId } });
    if (!order) return res.status(404).json({ message: 'Order not found or access denied' });
    
    if (order.status !== 'AWAITING_APPROVAL') {
      return res.status(400).json({ message: `Order cannot be approved in its current state: ${order.status}` });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status: 'PRINTING' }, // Use string literal
    });

    await printService.sendToPrintify(updatedOrder);
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to approve order', error });
  }
};

// Create a draft order
export const createDraftOrder = async (req: Request, res: Response) => {
  const { templateId, type } = req.body as { templateId: string | null, type: OrderType };
  const userId = req.user!.id;

  try {
    const newOrder = await prisma.order.create({
      data: {
        userId,
        templateId,
        type: type,
        status: 'PENDING',
        amountPaid: 0,
      },
    });
    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Failed to create draft order:', error);
    res.status(500).json({ message: 'Could not create your project.' });
  }
};