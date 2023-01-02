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

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<h1>Dashboard</h1>} />
            <Route path="customers" element={<DataLayout title="Customers" />}>
              <Route path="" element={<CustomerIndex />} />
              <Route path="create" element={<CustomerCreate />} />
              <Route path="edit/:id" element={<CustomerEdit />} />
            </Route>

            <Route path="dr">
              <Route
                path="id"
                element={<DataLayout title="Dr's Secret Indonesia" />}
              >
                <Route path="items" element={<DataLayout title="Items" />}>
                  <Route path="" element={<DrIdItemIndex />} />
                  <Route path="create" element={<DrIdItemCreate />} />
                  <Route path="edit/:id" element={<DrIdItemEdit />} />
                </Route>
                <Route
                  path="deliveries"
                  element={<DataLayout title="Deliveries" />}
                >
                  <Route path="" element={<DrIdDeliveryIndex />} />
                </Route>
              </Route>
            </Route>
            <Route path="other" element={<h1>Other Page</h1>} />
            <Route path="*" element={<h1>404 Not Found</h1>} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </div>
  );
}

export default App;
