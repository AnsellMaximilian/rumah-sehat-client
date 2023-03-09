/**
 *
 * @param {item, qty} deliveryDetails
 * @returns number
 */

export const getTableColumn = (headerName, field, renderCell, rest = {}) => ({
  headerName,
  field,
  renderCell,
  ...rest,
});

export const getSubtotal = (deliveryDetails) =>
  deliveryDetails.reduce((sum, detail) => sum + detail.price * detail.qty, 0);

export const getPurchaseSubtotal = (purchaseDetails) =>
  purchaseDetails.reduce((sum, detail) => sum + detail.cost * detail.qty, 0);

export const getBillSubtotal = (details) =>
  details.reduce((sum, detail) => sum + parseFloat(detail.total), 0);
