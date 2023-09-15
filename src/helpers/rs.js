/**
 *
 * @param {item, qty} deliveryDetails
 * @returns number
 */

export const getTableColumn = (
  headerName,
  field,
  renderCell,
  cellProps,
  rest = {}
) => ({
  headerName,
  field,
  renderCell,
  cellProps,
  ...rest,
});

export const getSubtotal = (deliveryDetails) =>
  deliveryDetails.reduce((sum, detail) => sum + detail.price * detail.qty, 0);

export const getExpenditureSubtotal = (expenseDetails) =>
  expenseDetails.reduce((sum, detail) => sum + detail.amount * detail.qty, 0);

export const getPurchaseSubtotal = (purchaseDetails) =>
  purchaseDetails.reduce((sum, detail) => sum + detail.cost * detail.qty, 0);

export const getBillSubtotal = (details) =>
  details.reduce((sum, detail) => sum + parseFloat(detail.total), 0);

export const getPurchaseInvoiceTotal = (purchases) =>
  purchases.reduce((sum, pc) => sum + pc.totalPrice, 0);

export const getProductStockColor = (restockNumber, stock) => {
  if (stock < restockNumber) return "red";
  if (Math.ceil(restockNumber + restockNumber * 0.1667) < restockNumber)
    return "orange";
  if (Math.ceil(restockNumber + restockNumber * 0.3333) < restockNumber)
    return "yellowgreen";
  return "black";
};
