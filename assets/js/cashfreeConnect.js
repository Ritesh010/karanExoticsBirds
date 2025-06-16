async function getCashfreePaymentLink(customerId, customerPhone, orderAmount) {
  const payload = {
    customerId: customerId,
    customerPhone: customerPhone,
    orderAmount: orderAmount
  };

  try {
    const token = localStorage.getItem('token');
    const response = await fetch("http://localhost:3000/api/cashfree/generate-payment-id", {
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
    const response = await fetch("http://localhost:3000/api/cashfree/check-payment", {
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
  let name = localStorage.getItem('firstName');
  let phone = localStorage.getItem('phone');
  let cartTotal = document.getElementById('checkout-total').textContent;
  console.log(cartTotal)
  try {
    // Step 1: Get payment session and order ID
    let { sessionId, orderId } = await getCashfreePaymentLink(
      name + cartData.items[0].customer_id,
      phone,
      cartTotal
    );

    let checkoutOptions = {
      paymentSessionId: sessionId,
      redirectTarget: "_modal",
    };

    console.log(checkoutOptions);

    // Step 2: Start the checkout process
    const result = await cashfree.checkout(checkoutOptions);

    // Step 3: Handle errors in result
    if (result.error) {
      console.error("Popup closed or payment error:", result.error);
      let status = await getCashfreePaymentStatus(orderId);
      throw new Error(`Payment failed. Status: ${status.status}`);
    }

    // Step 4: Handle redirect (optional logic)
    if (result.redirect) {
      console.log("Payment is being redirected...");
    }

    // Step 5: Handle successful payment
    if (result.paymentDetails) {
      console.log("Payment completed. Verifying status...");
      let status = await getCashfreePaymentStatus(orderId);
      console.log(status)
      if (status.status === "SUCCESS") {
        console.log(result.paymentDetails.paymentMessage);
        return { success: true, message: result.paymentDetails.paymentMessage };
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
      } else {
        throw new Error(`Payment verification failed. Status: ${status}`);
      }
    }

    // Step 6: Fallback if none of the above blocks run
    throw new Error("Unknown result from checkout process.");

  } catch (error) {
    console.error("Error occurred during payment:", error.message);
    throw error; // Rethrow for upstream error handling
  }
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
