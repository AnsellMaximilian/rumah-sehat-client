# User Requirements

- [ ] Manage Customer Data
- [ ]
- [ ]

## Rumah Sehat

- [ ] Generate and print sales report between two dates.
- [ ] Manage purchases from suppliers
- [ ] Generate supplier invoices to pay
- [ ] Create delivery
  - [ ] Create supplier purchase simultaneously with sale/delivery detail
  - [ ] Isolate items by supplier to easily create delivery detail for every item
- [ ] Create and print invoices from delivery(s)
  - [ ] Show subtotal for each delivery in invoice
  - [ ] Create deductions/additions to resolve inaccurate payments of previous invoice(s)

## Dr's Secret

- [x] Manage item/product data from Indonesia and Singapore
- [x] Manage discount models
- [x] Create delivery (Indonesia)
  - [x] Toggle using discount on a delivery
- [x] Create delivery (Singapore)
  - [x] Set exchange rate for each delivery
  - [x] Toggle using discount on a delivery
  - [x] For each delivery, admin can optionally charge recipient for the individual delivery cost of each item/product in said delivery, which will be recorded in the product/item data
- [x] Update delivery data (add, delete, modify details)
- [ ] Instantly create invoice in delivery creation using checkbox
- [x] Combine multiple deliveries from either contries into an invoice to a recipient, who can be different from recipient of each delivery
- [x] Print invoices

# TODO

- [ ] Track product unit

# Scenarios to Consider

## Recording invoice deliveries for customers

- Recording a delivery sent by supplier, so system has to record supplier delivery, which includes per product charges and delivery cost. (Supplier directly sends products to customers with delivery cost and system has to record both supplier purchase and own delivery in invoice. I.e. Cisarua)
  - Record own delivery (details, cost, etc.) and supplier purchase (details, cost)
- Recording a delivery NOT sent by supplier but also simultaneously recording the corresponding supplier delivery sent to stock. (Supplier delivers goods to stock, and then products from stock gets delivered later, so system records supplier delivery/purchase)
