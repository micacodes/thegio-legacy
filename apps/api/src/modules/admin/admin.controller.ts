import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all orders from all users
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      // Include user's name/email to display in the list
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Failed to fetch all orders:", error);
    res.status(500).json({ message: "Failed to fetch all orders" });
  }
};

// Get a single order by ID (for admin view)
export const getOrderDetails = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                user: {
                    select: { name: true, email: true, phone: true }
                }
            }
        });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json(order);
    } catch (error) {
        console.error(`Failed to fetch order ${id}:`, error);
        res.status(500).json({ message: `Failed to fetch order ${id}` });
    }
};