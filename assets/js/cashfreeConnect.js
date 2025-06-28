async function getCashfreePaymentLink(customerId, customerPhone, orderAmount) {
  const payload = {
    customerId: customerId,
    customerPhone: customerPhone,
    orderAmount: orderAmount
  };

  try {
    const token = sessionStorage.getItem('token');
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
    const token = sessionStorage.getItem('token');
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

async function getOrderTotal() {
  try {
    const cartData = await getCart();
    let subtotal = 0;
    let costs = await updateCheckoutTotalsWithShipping(subtotal, cartData.items);
    return costs.total;
  } catch (error) {
    console.error('Error rendering checkout cart:', error);
    cartBody.innerHTML = '<tr><td colspan="5" class="text-center text-danger">Failed to load cart. Please try again.</td></tr>';
  }
}

async function submitOrder(cartData, addressData) {
  try {
    const name = sessionStorage.getItem('firstName') || 'Guest';
    const phone = sessionStorage.getItem('phone') || '';
    const cartTotal = await getOrderTotal() || document.getElementById('checkout-total')?.textContent;

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

    // Step 2: Launch checkout with timeout
    const result = await Promise.race([
      cashfree.checkout(checkoutOptions),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Payment timeout')), 300000) // 5 minutes timeout
      )
    ]);

    // Handle case where user closes modal/cancels payment
    if (!result) {
      console.log("Payment cancelled by user");
      return {
        success: false,
        message: "Payment was cancelled. Please try again.",
        cancelled: true
      };
    }

    // Check payment status
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
      } else if (status.status === "CANCELLED") {
        message = "Payment was cancelled.";
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

    // Payment successful - create order
    return await makeApiRequest('/orders', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        items: cartData.items,
        billing_address: formatAddress(addressData.billing),
        shipping_address: formatAddress(addressData.shipping),
        payment_method: getSelectedPaymentMethod(),
        notes: document.getElementById('order-notes')?.value || '',
        shipping_charges: parseInt(document.getElementById('checkout-shipping').textContent, 10)
      })
    });

  } catch (error) {
    console.error("Payment process error:", error.message);

    // Handle timeout specifically
    if (error.message === 'Payment timeout') {
      return {
        success: false,
        message: "Payment session timed out. Please try again.",
      };
    }

    return {
      success: false,
      message: error.message || "An unexpected error occurred during payment.",
    };
  }
}
