import { parseSupplierDeliveryDraft } from "./supplierDeliveryDraft";

const context = {
  invoice: { id: 9249, CustomerId: 91 },
  customers: [
    { id: 91, fullName: "Marinee" },
    { id: 92, fullName: "Another customer" },
  ],
  suppliers: [{ id: 41, name: "Cisarua" }],
  deliveryTypes: [{ id: 10, name: "Supplier delivery" }],
  products: [
    { id: 683, name: "Jeruk Nipis", SupplierId: 41, cost: 65000 },
    { id: 999, name: "Other Supplier Product", SupplierId: 50, cost: 1000 },
  ],
};

const payload = {
  editId: null,
  InvoiceId: 9249,
  cost: 10000,
  CustomerId: 91,
  date: "2026-07-22",
  mode: "supplier",
  note: "",
  DeliveryTypeId: 10,
  deliveryDetails: [
    {
      qty: ".5",
      price: 80000,
      ProductId: 683,
      cost: 65000,
      overallCost: 65000,
    },
  ],
  SupplierId: 41,
  supplierCost: "10000",
};

test("converts a supplier-delivery payload into form values", () => {
  const draft = parseSupplierDeliveryDraft(JSON.stringify(payload), context);

  expect(draft.customer).toBe(context.customers[0]);
  expect(draft.supplier).toBe(context.suppliers[0]);
  expect(draft.deliveryType).toBe(context.deliveryTypes[0]);
  expect(draft.supplierCost).toBe(10000);
  expect(draft.details).toEqual([
    {
      product: context.products[0],
      qty: 0.5,
      price: 80000,
      cost: 65000,
      overallCost: 65000,
    },
  ]);
});

test("accepts the complete invoice-reader result containing deliveryPayload", () => {
  const draft = parseSupplierDeliveryDraft(
    JSON.stringify({ readyToPaste: true, warnings: [], deliveryPayload: payload }),
    context
  );

  expect(draft.invoiceId).toBe(9249);
  expect(draft.details).toHaveLength(1);
});

test("rejects a draft for a different open invoice", () => {
  expect(() =>
    parseSupplierDeliveryDraft(
      JSON.stringify({ ...payload, InvoiceId: 9250 }),
      context
    )
  ).toThrow("invoice #9250, but invoice #9249 is open");
});

test("rejects products that do not belong to the selected supplier", () => {
  const wrongProductPayload = {
    ...payload,
    deliveryDetails: [{ ...payload.deliveryDetails[0], ProductId: 999 }],
  };

  expect(() =>
    parseSupplierDeliveryDraft(JSON.stringify(wrongProductPayload), context)
  ).toThrow("does not belong to Cisarua");
});

test("rejects invalid quantities and calendar dates", () => {
  expect(() =>
    parseSupplierDeliveryDraft(
      JSON.stringify({
        ...payload,
        deliveryDetails: [{ ...payload.deliveryDetails[0], qty: 0 }],
      }),
      context
    )
  ).toThrow("quantity must be greater than zero");

  expect(() =>
    parseSupplierDeliveryDraft(
      JSON.stringify({ ...payload, date: "2026-02-31" }),
      context
    )
  ).toThrow("date is not a valid calendar date");
});
