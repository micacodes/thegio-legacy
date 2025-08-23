// path: apps/api/src/services/darajaUrlService.ts
import axios from 'axios';
import { config } from '../config';
import { getDarajaToken } from './darajaService'; // We will reuse our token function

const DARAJA_URL_REGISTER_API = 'https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl';

export const registerDarajaUrls = async () => {
  console.log('[Daraja] Attempting to register callback URLs...');
  
  const token = await getDarajaToken();
  if (!token) {
    console.error('[Daraja] Could not get token. URL registration failed.');
    return;
  }

  const payload = {
    ShortCode: config.daraja.shortcode,
    ResponseType: 'Completed', // Or 'Cancelled'
    ConfirmationURL: config.daraja.callbackUrl,
    ValidationURL: config.daraja.callbackUrl,
  };

  try {
    const response = await axios.post(DARAJA_URL_REGISTER_API, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('[Daraja] URL Registration successful:', response.data);
  } catch (error: any) {
    console.error('[Daraja] URL Registration failed:', error.response?.data || error.message);
  }
};