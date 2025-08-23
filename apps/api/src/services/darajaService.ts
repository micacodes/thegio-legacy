// path: apps/api/src/services/darajaService.ts
import axios from 'axios';
import { config } from '../config';

// getDarajaToken function remains correct
export const getDarajaToken = async (): Promise<string | null> => {
  const key = config.daraja.consumerKey;
  const secret = config.daraja.consumerSecret;
  const auth = Buffer.from(`${key}:${secret}`).toString('base64');

  try {
    const response = await axios.get(config.daraja.authUrl, {
      headers: { Authorization: `Basic ${auth}` },
    });
    return response.data.access_token;
  } catch (error: any) {
    console.error('Failed to get Daraja token:', error.response?.data || error.message);
    return null;
  }
};

// --- THIS IS THE FIX ---
// The 'username: string' parameter has been REMOVED from the function signature.
export const initiateDarajaSTKPush = async (token: string, amount: number, phone: string, orderId: string) => {
  const shortcode = config.daraja.shortcode;
  const passkey = config.daraja.passkey;
  
  const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
  const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');

  const payload = {
    BusinessShortCode: shortcode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: amount,
    PartyA: phone,
    PartyB: shortcode,
    PhoneNumber: phone,
    CallBackURL: config.daraja.callbackUrl,
    AccountReference: 'thegiolegacy', // Using the static brand name
    TransactionDesc: `Payment for Order #${orderId.substring(0, 5)}`,
  };

  try {
    const response = await axios.post(config.daraja.stkPushUrl, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Daraja STK Push Error:', error.response?.data || error.message);
    throw new Error('Failed to initiate STK push.');
  }
};