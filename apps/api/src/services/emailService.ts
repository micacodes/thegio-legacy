export const emailService = {
  sendOrderConfirmation: async (email: string, order: any) => {
    console.log(`[EmailService] Sending order confirmation for ${order.id} to ${email}.`);
    // TODO: Implement actual SendGrid/Mailgun call here
    return { success: true };
  },
};