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

export const parseSupplierDeliveryDraft = (
  rawJson,
  { invoice, customers, suppliers, deliveryTypes, products }
) => {
  let parsed;
  try {
    parsed = JSON.parse(rawJson);
  } catch (error) {
    throw new Error(`Invalid JSON: ${error.message}`);
  }

  const root = requireObject(parsed, "Imported JSON");
  const payloadCandidate =
    root.deliveryPayload ??
    root.proposedDraft?.deliveryPayload ??
    root.proposedPayload ??
    (root.mode !== undefined ? root : null);
  if (!payloadCandidate) {
    throw new Error(
      "No deliveryPayload was found. This review file may still require customer or product confirmation."
    );
  }
  const payload = requireObject(payloadCandidate, "deliveryPayload");

  if (payload.mode !== "supplier") {
    throw new Error('mode must be "supplier".');
  }
  if (payload.editId !== null && payload.editId !== undefined) {
    throw new Error("Only new supplier deliveries can be imported.");
  }

  const bindsToOpenInvoice =
    payload.InvoiceId === null || payload.InvoiceId === undefined;
  const invoiceId = bindsToOpenInvoice
    ? requireId(invoice.id, "Open invoice ID")
    : requireId(payload.InvoiceId, "InvoiceId");
  if (!bindsToOpenInvoice && invoiceId !== Number(invoice.id)) {
    throw new Error(
      `This draft belongs to invoice #${invoiceId}, but invoice #${invoice.id} is open.`
    );
  }

  const openInvoiceCustomerId = Number(
    invoice.CustomerId ?? invoice.Customer?.id
  );
  const bindsCustomerToOpenInvoice =
    payload.CustomerId === null || payload.CustomerId === undefined;
  if (bindsCustomerToOpenInvoice && !bindsToOpenInvoice) {
    throw new Error(
      "CustomerId may be null only when InvoiceId is also null."
    );
  }
  if (
    bindsCustomerToOpenInvoice &&
    (!Number.isInteger(openInvoiceCustomerId) || openInvoiceCustomerId <= 0)
  ) {
    throw new Error("The open invoice does not have an available customer.");
  }
  const customerId = bindsCustomerToOpenInvoice
    ? openInvoiceCustomerId
    : requireId(payload.CustomerId, "CustomerId");
  if (
    !bindsCustomerToOpenInvoice &&
    Number.isInteger(openInvoiceCustomerId) &&
    openInvoiceCustomerId > 0 &&
    customerId !== openInvoiceCustomerId
  ) {
    throw new Error(
      `This draft belongs to customer #${customerId}, but invoice #${invoice.id} belongs to customer #${openInvoiceCustomerId}.`
    );
  }
  const supplierId = requireId(payload.SupplierId, "SupplierId");
  const deliveryTypeId = requireId(payload.DeliveryTypeId, "DeliveryTypeId");
  const customer = findById(customers, customerId, "Customer");
  const supplier = findById(suppliers, supplierId, "Supplier");
  const deliveryType = findById(
    deliveryTypes,
    deliveryTypeId,
    "Delivery type"
  );

  if (!Array.isArray(payload.deliveryDetails) || payload.deliveryDetails.length === 0) {
    throw new Error("deliveryDetails must contain at least one product row.");
  }
  if (payload.deliveryDetails.length > 200) {
    throw new Error("deliveryDetails cannot contain more than 200 rows.");
  }

  const details = payload.deliveryDetails.map((rawDetail, index) => {
    const detail = requireObject(rawDetail, `deliveryDetails[${index}]`);
    const productId = requireId(
      detail.ProductId,
      `deliveryDetails[${index}].ProductId`
    );
    const product = findById(products, productId, "Product");
    if (Number(product.SupplierId) !== supplierId) {
      throw new Error(
        `Product #${productId} (${product.name}) does not belong to ${supplier.name}.`
      );
    }

    const cost = requireNumber(detail.cost, `Row ${index + 1} cost`);
    return {
      product,
      qty: requireNumber(detail.qty, `Row ${index + 1} quantity`, {
        positive: true,
      }),
      price: requireNumber(detail.price, `Row ${index + 1} price`),
      cost,
      overallCost:
        detail.overallCost === undefined
          ? cost
          : requireNumber(detail.overallCost, `Row ${index + 1} overall cost`),
    };
  });

  const note = payload.note === null || payload.note === undefined ? "" : payload.note;
  if (typeof note !== "string") throw new Error("note must be text.");
  if (note.length > 2000) throw new Error("note cannot exceed 2000 characters.");

  return {
    invoiceId,
    bindsToOpenInvoice,
    bindsCustomerToOpenInvoice,
    customer,
    supplier,
    deliveryType,
    date: requireDate(payload.date),
    deliveryCost: requireNumber(payload.cost, "Delivery cost"),
    supplierCost: requireNumber(payload.supplierCost, "Supplier delivery cost"),
    note,
    details,
  };
};
