import { Navigate, Route, Routes } from "react-router";
import GlobalLayout from "./components/layout/global-layout";

import Splash from "./pages/customer/Splash";
import Login from "./pages/customer/Login";
import Signup from "./pages/customer/Signup";
import Home from "./pages/customer/Home";
import Category from "./pages/customer/Category";
import Products from "./pages/customer/Products";
import ProductDetail from "./pages/customer/ProductDetail";
import Cart from "./pages/customer/Cart";
import Payment from "./pages/customer/Payment";
import Tracking from "./pages/customer/Tracking";
import Pickup from "./pages/customer/Pickup";
import Transport from "./pages/customer/Transport";

import SellerOrders from "./pages/seller/SellerOrders";
import RiderDelivery from "./pages/rider/RiderDelivery";

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

        <Route path="/seller" element={<SellerOrders />} />
        <Route path="/rider" element={<RiderDelivery />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
