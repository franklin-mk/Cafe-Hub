//src/App.jsx
import { Route, Routes, Navigate } from 'react-router-dom'
import { useUser } from './contexts/UserContext';

import ProtectedRoute from './components/ProtectedRoute'

import Login from './pages/Login'
import RegisterUser from './pages/Register'

//ADMIN
import AdminHomepage from './pages/Admin/AdminHomepage'
import AdminOrdersPage from './pages/Admin/AdminOrdersPage';
import AdminSeeReviewPage from './pages/Admin/AdminSeeReviewPage';

//CUSTOMER
import CustomerHomepage from './pages/Customer/CustomerHomepage'
import CustomerOrderPage from './pages/Customer/CustomerOrderPage';
import CustomerCartpage from './pages/Customer/CustomerCartpage';
import CustomerReviewPage from './pages/Customer/CustomerReviewPage';

//Individual Product Page
import ProductDetailPage from './pages/Customer/ProductDetailPage';

function App() {
  const { user } = useUser();

  return (
    <Routes>
      <Route path="/" element={user ? (user.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/customer" />) : <Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterUser />} />

      <Route path="/reviews" element={user ? (user.role === 'admin' ? <AdminSeeReviewPage/> : <CustomerReviewPage />) : <></>} />

      <Route path="/admin" element={
        <ProtectedRoute role="admin">
          <AdminHomepage />
        </ProtectedRoute>
      } />
      <Route path="/admin/orders" element={
        <ProtectedRoute role="admin">
          <AdminOrdersPage />
        </ProtectedRoute>
      } />

      <Route path="/customer" element={
        <ProtectedRoute role="customer">
          <CustomerHomepage />
        </ProtectedRoute>
      } />
      <Route path="/customer/orders" element={
        <ProtectedRoute role="customer">
          <CustomerOrderPage />
        </ProtectedRoute>
      } />
      <Route path="/cart" element={
        <ProtectedRoute role="customer">
          <CustomerCartpage />
        </ProtectedRoute>
      } />

      {/* New route for individual product details */}
      <Route path="/product/:productId" element={
        user ? <ProductDetailPage /> : <Navigate to="/login" />
      } />
    </Routes>
  )
}

export default App