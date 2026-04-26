import { Navigate, Route, Routes } from "react-router";
import GlobalLayout from "./components/layout/global-layout";

import Splash from "./pages/Splash";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Category from "./pages/Category";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Payment from "./pages/Payment";
import Tracking from "./pages/Tracking";
import Pickup from "./pages/Pickup";
import Transport from "./pages/Transport";

export default function RootRoute() {
  return (
    <Routes>
      <Route element={<GlobalLayout />}>
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/transport" element={<Transport />} />
        <Route path="/home" element={<Home />} />
        <Route path="/category" element={<Category />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/tracking" element={<Tracking />} />
        <Route path="/pickup" element={<Pickup />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
