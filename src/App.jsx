import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import ProductDetail from "./pages/ProductDetail";
import ProductGrid from "./pages/ProductGrid";
import CartPage from "./pages/CartPage";
import OrderPage from "./pages/OrderPage";

const App = () => {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<ProductGrid />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/order" element={<OrderPage />} />
        </Routes>
      </AppLayout>
    </Router>
  );
};

export default App; // ✅ Đảm bảo export mặc định
