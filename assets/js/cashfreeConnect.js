async function getCashfreePaymentLink(customerId, customerPhone, orderAmount) {
  const payload = {
    customerId: customerId,
    customerPhone: customerPhone,
    orderAmount: orderAmount
  };

  try {
    const token = localStorage.getItem('token');
    const response = await fetch("https://api.thebirdcart.com/api/cashfree/generate-payment-id", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (response.ok) {

      const sessionId = data.paymentSessionId;
      const orderId = data.orderId;
      console.log("✅ Payment Link:", sessionId);
      // Now you can use the variables elsewhere in your code
      return { sessionId, orderId };
    } else {
      throw new Error(data.error || "Failed to generate payment link.");
    }

  } catch (error) {
    console.error("❌ Error:", error.message);
    return null;
  }
}

async function getCashfreePaymentStatus(order_id) {
  const payload = {
    orderId: order_id
  };

  try {
    const token = localStorage.getItem('token');
    const response = await fetch("https://api.thebirdcart.com/api/cashfree/check-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (response.ok) {

      const status = data.payment_status;
      const amount = data.payment_amount;

      // Now you can use the variables elsewhere in your code
      return { status, amount };
    } else {
      throw new Error(data.error || "Failed to generate payment link.");
    }

  } catch (error) {
    console.error("❌ Error:", error.message);
    return null;
  }
}


async function submitOrder(cartData, addressData) {
  try {
    const name = localStorage.getItem('firstName') || 'Guest';
    const phone = localStorage.getItem('phone') || '';
    let cartTotal = document.getElementById('checkout-total').textContent;

    if (!cartTotal || !phone || !cartData?.items?.length) {
      throw new Error("Missing required order details.");
    }

    // Step 1: Initiate payment session
    const { sessionId, orderId } = await getCashfreePaymentLink(
      name + cartData.items[0].customer_id,
      phone,
      cartTotal
    );

    const checkoutOptions = {
      paymentSessionId: sessionId,
      redirectTarget: "_modal",
    };

    console.log("Starting payment with:", checkoutOptions);

    // Step 2: Launch checkout
    const result = await cashfree.checkout(checkoutOptions);

    // Step 3: Handle user cancellation or failure
    if (result.error) {
      console.warn("Payment error or user cancelled:", result.error);
      const status = await getCashfreePaymentStatus(orderId);
      return { success: false, message: `Payment failed. Status: ${status.status}` };
    }

    // Step 4: Optional redirect handler
    if (result.redirect) {
      console.log("Redirect in process...");
    }

    // Step 5: Confirm success and verify payment
    if (result.paymentDetails) {
      const status = await getCashfreePaymentStatus(orderId);
      console.log("Payment status response:", status);

      if (status.status === "SUCCESS") {
        // Send order to backend (uncomment when API is ready)
        // await postOrder(cartData, addressData);

        return {
          success: true,
          message: result.paymentDetails.paymentMessage || "Payment successful!",
        };
      } else {
        throw new Error(`Payment verification failed. Status: ${status.status}`);
      }
    }

    throw new Error("Unexpected result from checkout.");

  } catch (error) {
    console.error("Payment process error:", error.message);
    return { success: false, message: error.message || "An error occurred during checkout." };
  }
}

// Helper: Parse amount safely
function parseAmount(value) {
  if (!value) return null;
  const cleaned = value.replace(/[^\d.]/g, '');
  return parseFloat(cleaned) || null;
}

// Optional helper: API order submission
async function postOrder(cartData, addressData) {
  const response = await makeApiRequest('/orders', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      items: cartData.items,
      billing_address: formatAddress(addressData.billing),
      shipping_address: formatAddress(addressData.shipping),
      payment_method: getSelectedPaymentMethod(),
      notes: document.getElementById('order-notes')?.value || ''
    })
  });

  return response;
}


// return 'av';
// return await makeApiRequest('/orders', {
//   method: 'POST',
//   headers: getAuthHeaders(),
//   body: JSON.stringify({
//     items: cartData.items,
//     billing_address: formatAddress(addressData.billing),
//     shipping_address: formatAddress(addressData.shipping),
//     payment_method: getSelectedPaymentMethod(),
//     notes: document.getElementById('order-notes')?.value || ''
//   })
// });
