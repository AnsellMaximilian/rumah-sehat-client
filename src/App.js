import { Routes, Route, Outlet, Link, BrowserRouter } from "react-router-dom";

import "./App.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<h1>Test</h1>}>
            <Route index element={<h1>sss</h1>} />
            <Route path="about" element={<h1>Test</h1>} />
            <Route path="dashboard" element={<h1>Test</h1>} />

            {/* Using path="*"" means "match anything", so this route
                acts like a catch-all for URLs that we don't have explicit
                routes for. */}
            <Route path="*" element={<h1>Test</h1>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
