// path: apps/api/src/services/printService.ts
import axios from 'axios';

// This would come from your Printify account after you select a specific product
const PRINTIFY_BLUEPRINT_ID = 6; // Example: "Hardcover Book"
const PRINTIFY_PROVIDER_ID = 39; // Example: "Sublivale"

// This is a placeholder for your Printify Shop ID, found in your Printify settings
const PRINTIFY_SHOP_ID = process.env.PRINTIFY_SHOP_ID!; 

export const printService = {
  sendToPrintify: async (order: any) => {
    console.log(`[PrintService] Submitting order ${order.id} to Printify.`);

    const printifyApiKey = process.env.PRINTIFY_API_KEY;
    if (!printifyApiKey) {
      console.error("[PrintService] PRINTIFY_API_KEY is not set.");
      return { success: false, error: "Printify API key not configured." };
    }
    
    // The shipping address is stored as a JSON string in our DB, so we parse it.
    const shippingAddress = JSON.parse(order.shippingAddressJson);

    const orderData = {
      external_id: order.id,
      line_items: [
        {
          blueprint_id: PRINTIFY_BLUEPRINT_ID,
          provider_id: PRINTIFY_PROVIDER_ID,
          quantity: 1,
          variant_id: 21332, // This needs to be a specific variant from the chosen blueprint
          print_areas: {
            // This structure depends heavily on the blueprint.
            // For a book, it might look like this:
            "front_cover": [{ "type": "image", "src": order.finalPdfUrl }],
            "back_cover": [{ "type": "image", "src": order.finalPdfUrl }],
            "inside": [{ "type": "pdf", "src": order.finalPdfUrl }]
          },
        },
      ],
      shipping_method: 1, // Standard shipping
      send_shipping_notification: true,
      address_to: {
        first_name: shippingAddress.firstName,
        last_name: shippingAddress.lastName,
        email: shippingAddress.email,
        phone: shippingAddress.phone,
        country: shippingAddress.country,
        region: shippingAddress.region,
        address1: shippingAddress.address1,
        address2: shippingAddress.address2 || "",
        city: shippingAddress.city,
        zip: shippingAddress.zip,
      },
    };

    try {
      const response = await axios.post(
        `https://api.printify.com/v1/shops/${PRINTIFY_SHOP_ID}/orders.json`,
        orderData,
        {
          headers: {
            'Authorization': `Bearer ${printifyApiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(`[PrintService] Order ${order.id} successfully created on Printify. Printify ID: ${response.data.id}`);
      return { success: true, printifyOrderId: response.data.id };
    } catch (error: any) {
      console.error('[PrintService] Error sending order to Printify:', error.response?.data || error.message);
      return { success: false, error: "Failed to submit order to Printify." };
    }
  },
};