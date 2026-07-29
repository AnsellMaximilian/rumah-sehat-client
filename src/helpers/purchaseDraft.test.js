import { parsePurchaseDraft } from "./purchaseDraft";

const context = {
  suppliers: [{ id: 41, name: "Cisarua" }],
  products: [
    { id: 683, name: "Jeruk Nipis", SupplierId: 41, cost: 65000 },
    { id: 999, name: "Other Supplier Product", SupplierId: 50, cost: 1000 },
  ],
};

const payload = {
  cost: 10000,
  makePurchaseInvoice: false,
  SupplierId: 41,
  note: "Stock for Rumah Sehat",
  purchaseDetails: [
    {
      qty: ".5",
      price: 65000,
      ProductId: 683,
      CustomerId: null,
    },
  ],
  date: "2026-07-29",
};

test("converts a customer-free purchase payload into form values", () => {
  const draft = parsePurchaseDraft(JSON.stringify(payload), context);

  expect(draft.supplier).toBe(context.suppliers[0]);
  expect(draft.date).toBe("2026-07-29");
  expect(draft.deliveryCost).toBe(10000);
  expect(draft.makePurchaseInvoice).toBe(false);
  expect(draft.details).toEqual([
    {
      product: context.products[0],
      customer: null,
      qty: 0.5,
      price: 65000,
      search: "",
      customerSearch: "",
    },
  ]);
});

test("accepts the complete invoice-reader result containing purchasePayload", () => {
  const draft = parsePurchaseDraft(
    JSON.stringify({ readyToPaste: true, warnings: [], purchasePayload: payload }),
    context
  );

  expect(draft.details).toHaveLength(1);
});

test("rejects customer-designated rows", () => {
  expect(() =>
    parsePurchaseDraft(
      JSON.stringify({
        ...payload,
        purchaseDetails: [{ ...payload.purchaseDetails[0], CustomerId: 91 }],
      }),
      context
    )
  ).toThrow("only for direct stock purchases");
});

test("rejects products from another supplier", () => {
  expect(() =>
    parsePurchaseDraft(
      JSON.stringify({
        ...payload,
        purchaseDetails: [{ ...payload.purchaseDetails[0], ProductId: 999 }],
      }),
      context
    )
  ).toThrow("does not belong to Cisarua");
});

test("rejects invalid quantities and dates", () => {
  expect(() =>
    parsePurchaseDraft(
      JSON.stringify({
        ...payload,
        purchaseDetails: [{ ...payload.purchaseDetails[0], qty: 0 }],
      }),
      context
    )
  ).toThrow("quantity must be greater than zero");

  expect(() =>
    parsePurchaseDraft(JSON.stringify({ ...payload, date: "2026-02-31" }), context)
  ).toThrow("date is not a valid calendar date");
});
