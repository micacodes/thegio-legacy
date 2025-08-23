// path: apps/api/src/modules/orders/orders.controller.ts
import { Request, Response } from 'express';
import { PrismaClient, OrderStatus, OrderType } from '@prisma/client';
import { paymentService } from '../../services/paymentService';
import { printService } from '../../services/printService';
import { emailService } from '../../services/emailService';

const prisma = new PrismaClient();

// Creates a checkout session for a one-time purchase (DIY or Premium)
export const createOrderCheckoutSession = async (req: Request, res: Response) => {
  const { type, amountInCents, productName, templateId, contentJson, shippingAddressJson } = req.body;
  const userId = req.user!.id;

  try {
    // We pass metadata to Stripe. When payment is successful, the webhook
    // will use this metadata to create the order correctly in our database.
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

// --- NEW CONTROLLERS ---

// Get all orders for the currently logged-in user
export const getUserOrders = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch user's orders" });
  }
};

// Get a single order by its ID, ensuring it belongs to the logged-in user (or an admin)
export const getOrderById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.id;
  const userRole = req.user!.role;

  try {
    const order = await prisma.order.findUnique({ where: { id }, include:{template:true}, });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // A user can only see their own orders, but an admin can see any order.
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
    const { status } = req.body; // e.g., "IN_DESIGN", "SHIPPED"

    // Validate that the provided status is a valid OrderStatus enum value
    if (!Object.values(OrderStatus).includes(status)) {
        return res.status(400).json({ message: `Invalid status: ${status}` });
    }

    try {
        const updatedOrder = await prisma.order.update({
            where: { id },
            data: { status },
        });

        // Optional: Send an email notification to the user about the status update
        // const user = await prisma.user.findUnique({ where: { id: updatedOrder.userId } });
        // if (user) {
        //     await emailService.sendStatusUpdateEmail(user.email, updatedOrder);
        // }

        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update order status' });
    }
};

// Customer approves the design (for DIY flow or after Premium design is done)
export const approveOrderForPrint = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.id;

  try {
    const order = await prisma.order.findFirst({ where: { id, userId } });
    if (!order) return res.status(404).json({ message: 'Order not found or access denied' });
    
    // Logic to ensure an order can only be approved from the right status
    if (order.status !== OrderStatus.AWAITING_APPROVAL) {
      return res.status(400).json({ message: `Order cannot be approved in its current state: ${order.status}` });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status: OrderStatus.PRINTING },
    });

    // Send to fulfillment service (Printify)
    await printService.sendToPrintify(updatedOrder);

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to approve order', error });
  }
};

export const createDraftOrder = async (req: Request, res: Response) => {
  const { templateId, type } = req.body;
  const userId = req.user!.id;

  if (!type || (type !== 'DIY' && type !== 'PREMIUM')) {
    return res.status(400).json({ message: 'A valid order type (DIY or PREMIUM) is required.' });
  }

  try {
    const newOrder = await prisma.order.create({
      data: {
        userId,
        templateId, // This can be null for Premium orders
        type: type, // Use the type from the request
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