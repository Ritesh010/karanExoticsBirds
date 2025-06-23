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
    const cartTotal = document.getElementById('checkout-total')?.textContent;

    if (!cartTotal || !phone || !cartData?.items?.length) {
      return { success: false, message: "Missing required order details." };
    }

    // Step 1: Create payment session
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

    // Process Steps 3–6 only if result exists
    if (result) {
      const status = await getCashfreePaymentStatus(orderId);
      console.log("Payment status:", status);

      // Handle errors or unsuccessful payment
      if (result.error || status.status !== "SUCCESS") {
        let message = "Payment failed or was not completed.";

        if (result.error?.message) {
          message = result.error.message;
        } else if (status.status === "FAILED") {
          message = "Payment failed. Please try again.";
        } else if (status.status === "PENDING") {
          message = "Payment is pending. Please wait or contact support.";
        }

        return {
          success: false,
          message: `${message} (Status: ${status.status})`,
        };
      }

      // Optional: log redirect
      if (result.redirect) {
        console.log("Payment redirect in progress...");
      }

      // Payment successful
      return {
        success: true,
        message: result.paymentDetails?.paymentMessage || "Payment successful!",
      };
    }

    // If result is null or undefined
    return {
      success: false,
      message: "No response from payment gateway. Please try again.",
    };

  } catch (error) {
    console.error("Payment process error:", error.message);
    return {
      success: false,
      message: error.message || "An unexpected error occurred during payment.",
    };
  }
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
