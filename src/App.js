import { Routes, Route, BrowserRouter } from "react-router-dom";

import "./App.css";
import DataLayout from "./components/DataLayout";
import Layout from "./components/Layout";
import CustomerCreate from "./pages/customers/CustomerCreate";
import CustomerIndex from "./pages/customers/CustomerIndex";
import DrIdItemIndex from "./pages/drSecret/id/ItemIndex";

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
            </Route>
            <Route path="other" element={<h1>Other Page</h1>} />
            <Route path="*" element={<h1>404 Not Found</h1>} />
            <Route path="dr-secret">
              <Route path="id">
                <Route path="items" element={<DrIdItemIndex />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
