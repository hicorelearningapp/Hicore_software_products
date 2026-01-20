const BASE_URL = import.meta.env.VITE_API_BASE || "/api";

/* GET ORDERS BY RETAILER */
export const getOrdersByRetailer = async (retailerId) => {
  try {
    const res = await fetch(`${BASE_URL}/orders/retailer/${retailerId}`);
    return await res.json();
  } catch (error) {
    console.error("Get Orders Error:", error);
    return null;
  }
};
/*   GET RETAILER DASHBOARD  */

export const getDashboard = async (retailer_id) => {
  try {
    const res = await fetch(`${BASE_URL}/retailer/${retailer_id}/dashboard`);
    return await res.json();
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return null;
  }
};
/*  CREATE NEW RETAILER  */
export const registerRetailer = async (formData) => {
  try {
    const res = await fetch(`${BASE_URL}/retailers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    return await res.json();
  } catch (error) {
    console.error("Retailer Registration Error:", error);
    return null;
  }
};
/*  ACCEPT ORDER  */
export const acceptOrder = async (orderId) => {
  try {
    const res = await fetch(`${BASE_URL}/order/${orderId}/accept`, {
      method: "POST",
    });
    return await res.json();
  } catch (error) {
    console.error("Accept Order Error:", error);
    return null;
  }
};
/*  REJECT ORDER  */
export const rejectOrder = async (orderId) => {
  try {
    const res = await fetch(`${BASE_URL}/order/${orderId}/reject`, {
      method: "POST",
    });
    return await res.json();
  } catch (error) {
    console.error("Reject Order Error:", error);
    return null;
  }
};
