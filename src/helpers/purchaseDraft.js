const requireObject = (value, label) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label} must be a JSON object.`);
  }
  return value;
};

const requireId = (value, label) => {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error(`${label} must be a positive integer.`);
  }
  return id;
};

const requireNumber = (value, label, { positive = false } = {}) => {
  if (value === "" || value === null || value === undefined) {
    throw new Error(`${label} is required.`);
  }

  const number = Number(value);
  if (!Number.isFinite(number) || (positive ? number <= 0 : number < 0)) {
    throw new Error(
      `${label} must be ${positive ? "greater than zero" : "zero or greater"}.`
    );
  }
  return number;
};

const requireDate = (value) => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error("date must use YYYY-MM-DD format.");
  }

  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    throw new Error("date is not a valid calendar date.");
  }
  return value;
};

const findById = (items, id, label) => {
  const item = items.find((candidate) => Number(candidate.id) === id);
  if (!item) throw new Error(`${label} #${id} is not available in this form.`);
  return item;
};

export const parsePurchaseDraft = (rawJson, { suppliers, products }) => {
  let parsed;
  try {
    parsed = JSON.parse(rawJson);
  } catch (error) {
    throw new Error(`Invalid JSON: ${error.message}`);
  }

  const root = requireObject(parsed, "Imported JSON");
  const payloadCandidate =
    root.purchasePayload ??
    root.proposedDraft?.purchasePayload ??
    (root.purchaseDetails !== undefined ? root : null);
  if (!payloadCandidate) {
    throw new Error(
      "No purchasePayload was found. This review file may not be a direct-stock purchase or may still require confirmation."
    );
  }
  const payload = requireObject(payloadCandidate, "purchasePayload");

  const supplierId = requireId(payload.SupplierId, "SupplierId");
  const supplier = findById(suppliers, supplierId, "Supplier");
  if (!Array.isArray(payload.purchaseDetails) || payload.purchaseDetails.length === 0) {
    throw new Error("purchaseDetails must contain at least one product row.");
  }
  if (payload.purchaseDetails.length > 200) {
    throw new Error("purchaseDetails cannot contain more than 200 rows.");
  }

  const details = payload.purchaseDetails.map((rawDetail, index) => {
    const detail = requireObject(rawDetail, `purchaseDetails[${index}]`);
    if (detail.CustomerId !== null && detail.CustomerId !== undefined) {
      throw new Error(
        `Row ${index + 1} has a customer. This importer is only for direct stock purchases.`
      );
    }

    const productId = requireId(
      detail.ProductId,
      `purchaseDetails[${index}].ProductId`
    );
    const product = findById(products, productId, "Product");
    if (Number(product.SupplierId) !== supplierId) {
      throw new Error(
        `Product #${productId} (${product.name}) does not belong to ${supplier.name}.`
      );
    }

    return {
      product,
      customer: null,
      qty: requireNumber(detail.qty, `Row ${index + 1} quantity`, {
        positive: true,
      }),
      price: requireNumber(detail.price, `Row ${index + 1} price`),
      search: "",
      customerSearch: "",
    };
  });

  const note = payload.note === null || payload.note === undefined ? "" : payload.note;
  if (typeof note !== "string") throw new Error("note must be text.");
  if (note.length > 2000) throw new Error("note cannot exceed 2000 characters.");
  if (
    payload.makePurchaseInvoice !== undefined &&
    typeof payload.makePurchaseInvoice !== "boolean"
  ) {
    throw new Error("makePurchaseInvoice must be true or false.");
  }

  return {
    supplier,
    date: requireDate(payload.date),
    deliveryCost: requireNumber(payload.cost, "Delivery cost"),
    note,
    makePurchaseInvoice: payload.makePurchaseInvoice ?? false,
    details,
  };
};
