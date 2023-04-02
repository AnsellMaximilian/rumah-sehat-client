/**
 *
 * @param {item, qty} deliveryDetails
 * @returns number
 */

export const getSubtotal = (deliveryDetails, attribute) =>
  deliveryDetails.reduce(
    (sum, detail) => sum + detail[attribute] * detail.qty,
    0
  );
