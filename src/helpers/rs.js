/**
 *
 * @param {item, qty} deliveryDetails
 * @returns number
 */

export const getSubtotal = (deliveryDetails) =>
  deliveryDetails.reduce((sum, detail) => sum + detail.price * detail.qty, 0);
