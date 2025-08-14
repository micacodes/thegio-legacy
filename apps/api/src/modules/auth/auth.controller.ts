// path: apps/api/src/modules/auth/auth.controller.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { generateToken } from '../../utils/jwt';
import { paymentService } from '../../services/paymentService';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  const { email, password, name, username, phone } = req.body;

  if (!email || !password || !name || !username) {
    return res.status(400).json({ message: 'Name, username, email, and password are required' });
  }

  try {
    const existingUserByEmail = await prisma.user.findUnique({ where: { email } });
    if (existingUserByEmail) {
      return res.status(409).json({ message: 'A user with this email already exists' });
    }

    const existingUserByUsername = await prisma.user.findUnique({ where: { username } });
    if (existingUserByUsername) {
      return res.status(409).json({ message: 'This username is already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const stripeCustomer = await paymentService.createStripeCustomer({ email, name });

    const user = await prisma.user.create({
      data: {
        email,
        username,
        phone,
        password: hashedPassword,
        name,
        stripeCustomerId: stripeCustomer.id,
      },
    });

    const token = await generateToken({ id: user.id, role: user.role });
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) return res.status(401).json({ message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    
    const token = await generateToken({ id: user.id, role: user.role });

    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, email: true, name: true, role: true, username: true, subscription: true },
    });
    if (!user) {
        return res.status(404).json({ message: "User not found."});
    }
    res.status(200).json(user);
  } catch (error) { 
    console.error(error);
    res.status(500).json({ message: 'Server error' }); 
  }
};