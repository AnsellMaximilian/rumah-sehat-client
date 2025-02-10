import { Routes, Route, BrowserRouter } from "react-router-dom";

import "./App.css";
import DataLayout from "./components/DataLayout";
import Layout from "./components/Layout";
import CustomerCreate from "./pages/customers/CustomerCreate";
import CustomerIndex from "./pages/customers/CustomerIndex";
import DrIdItemIndex from "./pages/dr/id/items/ItemIndex";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DrIdItemCreate from "./pages/dr/id/items/ItemCreate";
import DrIdDeliveryIndex from "./pages/dr/id/deliveries/DeliveryIndex";
import DrDiscountModelIndex from "./pages/dr/discountModels/DiscountModelIndex";
import DrDiscountModelCreate from "./pages/dr/discountModels/DiscountModelCreate";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import DrIdDeliveryShow from "./pages/dr/id/deliveries/DeliveryShow";
import DrSgItemIndex from "./pages/dr/sg/items/ItemIndex";
import DrSgItemCreate from "./pages/dr/sg/items/ItemCreate";
import DrSgDeliveryIndex from "./pages/dr/sg/deliveries/DeliveryIndex";
import DrSgDeliveryShow from "./pages/dr/sg/deliveries/DeliveryShow";
import DrInvoiceIndex from "./pages/dr/invoices/InvoiceIndex";
import DrInvoiceManage from "./pages/dr/invoices/InvoiceManage";
import DrInvoiceCreate from "./pages/dr/invoices/InvoiceCreate";
import DrInvoiceShow from "./pages/dr/invoices/InvoiceShow";
import SupplierIndex from "./pages/rs/suppliers/SupplierIndex";
import SupplierCreate from "./pages/rs/suppliers/SupplierCreate";
import ProductCategoryIndex from "./pages/rs/productCategories/ProductCategoryIndex";
import ProductCategoryCreate from "./pages/rs/productCategories/ProductCategoryCreate";
import ProductCategoryEdit from "./pages/rs/productCategories/ProductCategoryEdit";
import ProductIndex from "./pages/rs/products/ProductIndex";
import ProductCreate from "./pages/rs/products/ProductCreate";
import DeliveryTypeIndex from "./pages/rs/deliveryTypes/DeliveryTypeIndex";
import DeliveryTypeCreate from "./pages/rs/deliveryTypes/DeliveryTypeCreate";
import DeliveryTypeEdit from "./pages/rs/deliveryTypes/DeliveryTypeEdit";
import DeliveryIndex from "./pages/rs/deliveries/DeliveryIndex";
// import DeliveryCreate from "./pages/rs/deliveries/DeliveryCreate";
import InvoiceIndex from "./pages/rs/invoices/InvoiceIndex";
import InvoiceCreate from "./pages/rs/invoices/InvoiceCreate";
import InvoiceShow from "./pages/rs/invoices/InvoiceShow";
import PurchaseIndex from "./pages/rs/purchases/PurchaseIndex";
import PurchaseCreate from "./pages/rs/purchases/PurchaseCreate";
import Test from "./pages/rs/purchases/Test";
import PurchaseShow from "./pages/rs/purchases/PurchaseShow";
import SupplierBillIndex from "./pages/rs/supplierBills/SupplierBillIndex";
import Dashboard from "./pages/dashboard/Dashboard";
import ProfitsIndex from "./pages/rs/profits/ProfitsIndex";
import ProductsReport from "./pages/rs/reports/ProductsReport";
import CustomerShow from "./pages/customers/CustomerShow";
import InvoiceManage from "./pages/rs/invoices/InvoiceManage";
import SupplierShow from "./pages/rs/suppliers/SupplierShow";
import DeliveryShow from "./pages/rs/deliveries/DeliveryShow";
import DrMyItemIndex from "./pages/dr/my/items/ItemIndex";
import DrMyItemCreate from "./pages/dr/my/items/ItemCreate";
import DrMyItemEdit from "./pages/dr/my/items/ItemEdit";
import DrMyDeliveryIndex from "./pages/dr/my/deliveries/DeliveryIndex";
import DrMyDeliveryShow from "./pages/dr/my/deliveries/DeliveryShow";
import CompareReport from "./pages/rs/reports/CompareReport";
import Actions from "./pages/rs/reports/Actions";
import ExpenseIndex from "./pages/expenses/ExpenseIndex";
import ExpenseCreate from "./pages/expenses/ExpenseCreate";
import ExpenditureIndex from "./pages/expenditures/ExpenditureIndex";
import ExpenditureCreate from "./pages/expenditures/ExpenditureCreate";
import ProductShow from "./pages/rs/products/ProductShow";
import StockReportIndex from "./pages/rs/reports/StockReportIndex";
import PurchaseInvoiceIndex from "./pages/rs/purchaseInvoices/PurchaseInvoiceIndex";
import PurchaseInvoiceCreate from "./pages/rs/purchaseInvoices/PurchaseInvoiceCreate";
import PurchaseInvoiceEdit from "./pages/rs/purchaseInvoices/PurchaseInvoiceEdit";
import PurchaseInvoiceShow from "./pages/rs/purchaseInvoices/PurchaseInvoiceShow";
import FullReport from "./pages/rs/reports/FullReport";
import FinancialReport from "./pages/rs/reports/FinancialReport";
import TransactionIndex from "./pages/transactions/TransactionIndex";
import OutstandingCustomers from "./pages/rs/reports/OutstandingCustomers";
import DrIdItemShow from "./pages/dr/id/items/ItemShow";
import DrSgItemShow from "./pages/dr/sg/items/ItemShow";
import DrLoanIndex from "./pages/dr/loans/LoanIndex";
import ConfigureOverallCost from "./pages/rs/products/ConfigureOverallCost";
import DetailedProfitsIndex from "./pages/rs/profits/DetailedProfitsIndex";
import Analytics from "./pages/rs/reports/Analytics";
import DrStockReportIndexId from "./pages/dr/reports/DrStockReportIndexId";
import BulkDraw from "./pages/rs/products/BulkDraw";
import DrStockReportIndexSg from "./pages/dr/reports/DrStockReportIndexSg";
import RegionIndex from "./pages/regions/RegionIndex";
import RegionCreate from "./pages/regions/RegionCreate";
import DeliveryTransactionIndex from "./pages/transactions/DeliveryTransactionIndex";
import DrIdBundleIndex from "./pages/dr/id/bundles/BundleIndex";
import DrSgBundleIndex from "./pages/dr/sg/bundles/BundleIndex";
import NoteIndex from "./pages/notes/NoteIndex";
import TodoIndex from "./pages/todos/TodoIndex";

function App() {
  return (
    <div className="App">
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route
                path="customers"
                element={
                  <DataLayout title="Customers" titleVariant="subtitle" />
                }
              >
                <Route path="" element={<CustomerIndex />} />
                <Route path="create" element={<CustomerCreate />} />
                <Route path=":id" element={<CustomerShow />} />
                <Route path="edit/:id" element={<CustomerCreate edit />} />
              </Route>
              <Route
                path="regions"
                element={<DataLayout title="Regions" titleVariant="subtitle" />}
              >
                <Route path="" element={<RegionIndex />} />
                <Route path="create" element={<RegionCreate />} />
                <Route path="edit/:id" element={<RegionCreate edit />} />
              </Route>
              <Route
                path="expenses"
                element={
                  <DataLayout title="Expenses" titleVariant="subtitle" />
                }
              >
                <Route path="" element={<ExpenseIndex />} />
                <Route path="create" element={<ExpenseCreate />} />
                {/* <Route path=":id" element={<CustomerShow />} /> */}
                <Route path="edit/:id" element={<ExpenseCreate edit />} />
              </Route>
              <Route
                path="expenditures"
                element={
                  <DataLayout title="Expenditures" titleVariant="subtitle" />
                }
              >
                <Route path="" element={<ExpenditureIndex />} />
                <Route path="create" element={<ExpenditureCreate />} />
                {/* <Route path=":id" element={<CustomerShow />} /> */}
                <Route path="edit/:id" element={<ExpenditureCreate edit />} />
              </Route>
              <Route
                path="transactions"
                element={
                  <DataLayout title="Transactions" titleVariant="subtitle" />
                }
              >
                <Route path="" element={<TransactionIndex />} />
                <Route path="delivery" element={<DeliveryTransactionIndex />} />
              </Route>
              <Route
                path="rs"
                element={
                  <DataLayout title="Rumah Sehat" titleVariant="subtitle" />
                }
              >
                <Route
                  path="suppliers"
                  element={<DataLayout title="Suppliers" titleVariant="h5" />}
                >
                  <Route path="" element={<SupplierIndex />} />
                  <Route path="create" element={<SupplierCreate />} />
                  <Route path=":id" element={<SupplierShow />} />
                  <Route path="edit/:id" element={<SupplierCreate edit />} />
                </Route>
                <Route
                  path="purchases"
                  element={<DataLayout title="Purchases" titleVariant="h5" />}
                >
                  <Route path="" element={<PurchaseIndex />} />
                  <Route path="create" element={<PurchaseCreate />} />
                  <Route path="bitch" element={<Test />} />
                  <Route path="edit/:id" element={<PurchaseCreate edit />} />
                  <Route path=":id" element={<PurchaseShow />} />
                </Route>
                <Route
                  path="purchase-invoices"
                  element={
                    <DataLayout title="Purchase Invoices" titleVariant="h5" />
                  }
                >
                  <Route path="" element={<PurchaseInvoiceIndex />} />
                  <Route path="create" element={<PurchaseInvoiceCreate />} />
                  <Route path="edit/:id" element={<PurchaseInvoiceEdit />} />
                  <Route
                    path="edit/:id"
                    element={<PurchaseInvoiceCreate edit />}
                  />
                  <Route path=":id" element={<PurchaseInvoiceShow />} />
                </Route>
                <Route
                  path="product-categories"
                  element={
                    <DataLayout title="Product Categories" titleVariant="h5" />
                  }
                >
                  <Route path="" element={<ProductCategoryIndex />} />
                  <Route path="create" element={<ProductCategoryCreate />} />
                  <Route path="edit/:id" element={<ProductCategoryEdit />} />
                </Route>
                <Route
                  path="products"
                  element={<DataLayout title="Products" titleVariant="h5" />}
                >
                  <Route path="" element={<ProductIndex />} />
                  <Route path="create" element={<ProductCreate />} />
                  <Route
                    path="configure-overall-cost"
                    element={<ConfigureOverallCost />}
                  />
                  <Route path="bulk-draw" element={<BulkDraw />} />
                  <Route path="edit/:id" element={<ProductCreate edit />} />
                  <Route path=":id" element={<ProductShow />} />
                </Route>

                <Route
                  path="delivery-types"
                  element={
                    <DataLayout title="Delivery Types" titleVariant="h5" />
                  }
                >
                  <Route path="" element={<DeliveryTypeIndex />} />
                  <Route path="create" element={<DeliveryTypeCreate />} />
                  <Route path="edit/:id" element={<DeliveryTypeEdit />} />
                </Route>
                <Route
                  path="deliveries"
                  element={<DataLayout title="Deliveries" titleVariant="h5" />}
                >
                  <Route path="" element={<DeliveryIndex />} />
                  <Route path=":id" element={<DeliveryShow />} />
                  <Route path="create" element={<InvoiceManage />} />
                  <Route path="edit/:id" element={<DeliveryTypeEdit />} />
                </Route>
                <Route
                  path="invoices"
                  element={<DataLayout title="Invoices" titleVariant="h5" />}
                >
                  <Route path="" element={<InvoiceIndex />} />
                  <Route path="manage" element={<InvoiceManage />} />
                  <Route path="create" element={<InvoiceCreate />} />
                  {/* <Route path="edit/:id" element={<InvoiceCreate edit />} /> */}
                  <Route path=":id" element={<InvoiceShow />} />
                </Route>
                <Route
                  path="reports"
                  element={<DataLayout title="Reports" titleVariant="h5" />}
                >
                  <Route path="profits" element={<ProfitsIndex />} />
                  <Route
                    path="detailed-profits"
                    element={<DetailedProfitsIndex />}
                  />
                  <Route
                    path="supplier-invoice"
                    element={<SupplierBillIndex />}
                  />
                  <Route path="stock" element={<StockReportIndex />} />
                  <Route
                    path="outstanding-customers"
                    element={<OutstandingCustomers />}
                  />
                  <Route path="products" element={<ProductsReport />} />
                  <Route path="compare" element={<CompareReport />} />
                  <Route path="full-report" element={<FullReport />} />
                  <Route
                    path="financial-report"
                    element={<FinancialReport />}
                  />
                  <Route path="actions" element={<Actions />} />
                  <Route path="analytics" element={<Analytics />} />
                </Route>
              </Route>

              <Route path="dr">
                <Route
                  path="invoices"
                  element={
                    <DataLayout title="Invoices" titleVariant="subtitle" />
                  }
                >
                  <Route path="" element={<DrInvoiceIndex />} />
                  <Route path="manage" element={<DrInvoiceManage />} />
                  <Route path="create" element={<DrInvoiceCreate />} />
                  <Route path=":id" element={<DrInvoiceShow />} />
                </Route>
                <Route
                  path="id"
                  element={
                    <DataLayout
                      title="DR'S SECRET ID"
                      titleVariant="subtitle"
                    />
                  }
                >
                  <Route
                    path="items"
                    element={<DataLayout title="Items" titleVariant="h5" />}
                  >
                    <Route path="" element={<DrIdItemIndex />} />
                    <Route path="create" element={<DrIdItemCreate />} />
                    <Route path="edit/:id" element={<DrIdItemCreate edit />} />
                    <Route path=":id" element={<DrIdItemShow />} />
                  </Route>

                  <Route
                    path="bundles"
                    element={<DataLayout title="Bundles" titleVariant="h5" />}
                  >
                    <Route path="" element={<DrIdBundleIndex />} />
                  </Route>
                  <Route
                    path="deliveries"
                    element={
                      <DataLayout title="Deliveries" titleVariant="h5" />
                    }
                  >
                    <Route path="" element={<DrIdDeliveryIndex />} />
                    <Route path=":id" element={<DrIdDeliveryShow />} />
                  </Route>
                </Route>
                <Route
                  path="sg"
                  element={
                    <DataLayout
                      title="DR'S SECRET SG"
                      titleVariant="subtitle"
                    />
                  }
                >
                  <Route
                    path="items"
                    element={<DataLayout title="Items" titleVariant="h5" />}
                  >
                    <Route path="" element={<DrSgItemIndex />} />
                    <Route path="create" element={<DrSgItemCreate />} />
                    <Route path="edit/:id" element={<DrSgItemCreate edit />} />
                    <Route path=":id" element={<DrSgItemShow />} />
                  </Route>

                  <Route
                    path="bundles"
                    element={<DataLayout title="Bundles" titleVariant="h5" />}
                  >
                    <Route path="" element={<DrSgBundleIndex />} />
                  </Route>
                  <Route
                    path="deliveries"
                    element={
                      <DataLayout title="Deliveries" titleVariant="h5" />
                    }
                  >
                    <Route path="" element={<DrSgDeliveryIndex />} />
                    <Route path=":id" element={<DrSgDeliveryShow />} />
                  </Route>
                </Route>
                <Route
                  path="my"
                  element={
                    <DataLayout
                      title="DR'S SECRET MY"
                      titleVariant="subtitle"
                    />
                  }
                >
                  <Route
                    path="items"
                    element={<DataLayout title="Items" titleVariant="h5" />}
                  >
                    <Route path="" element={<DrMyItemIndex />} />
                    <Route path="create" element={<DrMyItemCreate />} />
                    <Route path="edit/:id" element={<DrMyItemEdit />} />
                  </Route>
                  <Route
                    path="deliveries"
                    element={
                      <DataLayout title="Deliveries" titleVariant="h5" />
                    }
                  >
                    <Route path="" element={<DrMyDeliveryIndex />} />
                    <Route path=":id" element={<DrMyDeliveryShow />} />
                  </Route>
                </Route>
                <Route
                  path="discount-models"
                  element={
                    <DataLayout
                      title="Discount Models"
                      titleVariant="subtitle"
                    />
                  }
                >
                  <Route path="" element={<DrDiscountModelIndex />} />
                  <Route path="create" element={<DrDiscountModelCreate />} />
                  {/* <Route path="edit/:id" element={<DrIdItemEdit />} /> */}
                </Route>
                <Route
                  path="loans"
                  element={<DataLayout title="Loans" titleVariant="subtitle" />}
                >
                  <Route path="" element={<DrLoanIndex />} />
                  {/* <Route path="manage" element={<DrInvoiceManage />} />
                  <Route path="create" element={<DrInvoiceCreate />} />
                  <Route path=":id" element={<DrInvoiceShow />} /> */}
                </Route>
                <Route
                  path="reports"
                  element={<DataLayout title="Reports" titleVariant="h5" />}
                >
                  <Route path="stock">
                    <Route path="id" element={<DrStockReportIndexId />} />
                    <Route path="sg" element={<DrStockReportIndexSg />} />
                  </Route>
                </Route>
              </Route>
              <Route
                path="notes"
                element={<DataLayout title="Notes" titleVariant="subtitle" />}
              >
                <Route path="" element={<NoteIndex />} />
              </Route>
              <Route
                path="todos"
                element={<DataLayout title="Todos" titleVariant="subtitle" />}
              >
                <Route path="" element={<TodoIndex />} />
              </Route>
              <Route path="other" element={<h1>Other Page</h1>} />
              <Route path="*" element={<h1>404 Not Found</h1>} />
            </Route>
          </Routes>
        </BrowserRouter>
        <ToastContainer />
      </LocalizationProvider>
    </div>
  );
}

export default App;
