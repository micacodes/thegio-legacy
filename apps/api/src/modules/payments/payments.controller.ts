// path: apps/api/src/modules/payments/payments.controller.ts
import { Request, Response } from 'express';
import { getDarajaToken, initiateDarajaSTKPush } from '../../services/darajaService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const formatPhoneNumberForDaraja = (phone: string): string => {
    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length >= 9) {
        const coreNumber = digitsOnly.slice(-9);
        return `254${coreNumber}`;
    }
    return digitsOnly;
};

export const initiateMpesaPayment = async (req: Request, res: Response) => {
  const { amount, phone, orderId } = req.body;
  const user = await prisma.user.findUnique({ where: { id: req.user!.id }});

  if (!user || !amount || !phone || !orderId) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  const formattedPhone = formatPhoneNumberForDaraja(phone);

  try {
    const token = await getDarajaToken();
    if (!token) {
      return res.status(500).json({ message: 'Could not authenticate with payment provider.' });
    }

    // --- THIS IS THE FIX: The 'user.username' argument is now removed ---
    const stkResponse = await initiateDarajaSTKPush(token, amount, formattedPhone, orderId);

    if (stkResponse.ResponseCode === '0') {
      res.status(200).json({
        status: 'success',
        message: 'STK push initiated successfully. Please enter your M-Pesa PIN.',
        data: stkResponse,
      });
    } else {
      res.status(400).json({
        status: 'failed',
        message: stkResponse.ResponseDescription || 'Failed to initiate STK push.',
        data: stkResponse,
      });
    }
  } catch (error: any) {
    console.error('M-Pesa payment initiation failed:', error.message);
    res.status(500).json({ message: 'An unexpected error occurred during payment initiation.' });
  }
};

export const handleDarajaCallback = async (req: Request, res: Response) => {
  console.log('--- Daraja Callback Received ---');
  console.log(JSON.stringify(req.body, null, 2));
  
  // Later, we will add logic here to update the database
  const callbackData = req.body.Body.stkCallback;
  const resultCode = callbackData.ResultCode;

  if (resultCode === 0) {
    console.log('Payment successful!');
  } else {
    console.log('Payment failed or cancelled. Result Code:', resultCode, 'Description:', callbackData.ResultDesc);
  }
  
  res.status(200).json({ ResultCode: 0, ResultDesc: "Accepted" });
};