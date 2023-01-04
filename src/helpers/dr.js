export const getDiscountTotal = (discountModel, points) =>
  (points - discountModel.subtractor) *
  discountModel.base *
  (discountModel.percentage / 100);
