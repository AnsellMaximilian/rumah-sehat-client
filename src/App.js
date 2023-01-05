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
                <Route path="edit/:id" element={<CustomerEdit />} />
              </Route>

              <Route path="dr">
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
                  {/* <Route
                    path="deliveries"
                    element={
                      <DataLayout title="Deliveries" titleVariant="h5" />
                    }
                  >
                    <Route path="" element={<DrIdDeliveryIndex />} />
                    <Route path="create" element={<DrIdDeliveryCreate />} />
                    <Route path=":id" element={<DrIdDeliveryShow />} />
                  </Route> */}
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
