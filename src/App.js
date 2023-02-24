import { Routes, Route, BrowserRouter } from "react-router-dom";

import "./App.css";
import DataLayout from "./components/DataLayout";
import Layout from "./components/Layout";
import CustomerCreate from "./pages/customers/CustomerCreate";
import CustomerEdit from "./pages/customers/CustomerEdit";
import CustomerIndex from "./pages/customers/CustomerIndex";
import DrIdItemIndex from "./pages/dr/id/items/ItemIndex";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DrIdItemCreate from "./pages/dr/id/items/ItemCreate";
import DrIdItemEdit from "./pages/dr/id/items/ItemEdit";
import DrIdDeliveryIndex from "./pages/dr/id/deliveries/DeliveryIndex";
import DrDiscountModelIndex from "./pages/dr/discountModels/DiscountModelIndex";
import DrDiscountModelCreate from "./pages/dr/discountModels/DiscountModelCreate";
import DrIdDeliveryCreate from "./pages/dr/id/deliveries/DeliveryCreate";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import DrIdDeliveryShow from "./pages/dr/id/deliveries/DeliveryShow";
import DrSgItemIndex from "./pages/dr/sg/items/ItemIndex";
import DrSgItemCreate from "./pages/dr/sg/items/ItemCreate";
import DrSgItemEdit from "./pages/dr/sg/items/ItemEdit";
import DrSgDeliveryIndex from "./pages/dr/sg/deliveries/DeliveryIndex";
import DrSgDeliveryCreate from "./pages/dr/sg/deliveries/DeliveryCreate";
import DrSgDeliveryShow from "./pages/dr/sg/deliveries/DeliveryShow";
import DrInvoiceIndex from "./pages/dr/invoices/InvoiceIndex";
import DrInvoiceCreate from "./pages/dr/invoices/InvoiceCreate";
import DrInvoiceShow from "./pages/dr/invoices/InvoiceShow";
import SupplierIndex from "./pages/rs/suppliers/SupplierIndex";
import SupplierCreate from "./pages/rs/suppliers/SupplierCreate";
import SupplierEdit from "./pages/rs/suppliers/SupplierEdit";
import ProductCategoryIndex from "./pages/rs/productCategories/ProductCategoryIndex";
import ProductCategoryCreate from "./pages/rs/productCategories/ProductCategoryCreate";
import ProductCategoryEdit from "./pages/rs/productCategories/ProductCategoryEdit";
import ProductIndex from "./pages/rs/products/ProductIndex";
import ProductCreate from "./pages/rs/products/ProductCreate";
import ProductEdit from "./pages/rs/products/ProductEdit";
import DeliveryTypeIndex from "./pages/rs/deliveryTypes/DeliveryTypeIndex";
import DeliveryTypeCreate from "./pages/rs/deliveryTypes/DeliveryTypeCreate";
import DeliveryTypeEdit from "./pages/rs/deliveryTypes/DeliveryTypeEdit";
import DeliveryIndex from "./pages/rs/deliveries/DeliveryIndex";
import DeliveryCrate from "./pages/rs/deliveries/DeliveryCreate";
import InvoiceIndex from "./pages/rs/invoices/InvoiceIndex";
import InvoiceCreate from "./pages/rs/invoices/InvoiceCreate";
import InvoiceShow from "./pages/rs/invoices/InvoiceShow";
import PurchaseIndex from "./pages/rs/purchases/PurchaseIndex";
import PurchaseCreate from "./pages/rs/purchases/PurchaseCreate";
import Test from "./pages/rs/purchases/Test";

function App() {
  return (
    <div className="App">
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<h1>Dashboard</h1>} />
              <Route
                path="customers"
                element={
                  <DataLayout title="Customers" titleVariant="subtitle" />
                }
              >
                <Route path="" element={<CustomerIndex />} />
                <Route path="create" element={<CustomerCreate />} />
                <Route path="edit/:id" element={<CustomerCreate edit />} />
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
                  <Route path="edit/:id" element={<SupplierEdit />} />
                </Route>
                <Route
                  path="purchases"
                  element={<DataLayout title="Purchases" titleVariant="h5" />}
                >
                  <Route path="" element={<PurchaseIndex />} />
                  <Route path="create" element={<PurchaseCreate />} />
                  <Route path="bitch" element={<Test />} />
                  <Route path="edit/:id" element={<PurchaseCreate edit />} />
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
                  <Route path="edit/:id" element={<ProductEdit />} />
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
                  <Route path="create" element={<DeliveryCrate />} />
                  <Route path="edit/:id" element={<DeliveryTypeEdit />} />
                </Route>
                <Route
                  path="invoices"
                  element={<DataLayout title="Invoices" titleVariant="h5" />}
                >
                  <Route path="" element={<InvoiceIndex />} />
                  <Route path="create" element={<InvoiceCreate />} />
                  <Route path="edit/:id" element={<InvoiceCreate edit />} />
                  <Route path=":id" element={<InvoiceShow />} />
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
                    <Route path="edit/:id" element={<DrIdItemEdit />} />
                  </Route>
                  <Route
                    path="deliveries"
                    element={
                      <DataLayout title="Deliveries" titleVariant="h5" />
                    }
                  >
                    <Route path="" element={<DrIdDeliveryIndex />} />
                    <Route path="create" element={<DrIdDeliveryCreate />} />
                    <Route path=":id" element={<DrIdDeliveryShow />} />
                    <Route
                      path="edit/:id"
                      element={<DrIdDeliveryCreate edit />}
                    />
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
                    <Route path="edit/:id" element={<DrSgItemEdit />} />
                  </Route>
                  <Route
                    path="deliveries"
                    element={
                      <DataLayout title="Deliveries" titleVariant="h5" />
                    }
                  >
                    <Route path="" element={<DrSgDeliveryIndex />} />
                    <Route path="create" element={<DrSgDeliveryCreate />} />
                    <Route path=":id" element={<DrSgDeliveryShow />} />
                    <Route
                      path="edit/:id"
                      element={<DrSgDeliveryCreate edit />}
                    />
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
