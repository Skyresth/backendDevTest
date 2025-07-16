import { Routes, Route } from 'react-router-dom'
import ProductListPage from './pages/ProductListPage'
import ProductDetailPage from './pages/ProductDetailPage'
import OrdersPage from './pages/OrdersPage'
import Layout from './components/Layout'
import NotFoundPage from './pages/NotFoundPage'
import Cart from './components/Cart'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ProductListPage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="product/:productId" element={<ProductDetailPage />} />
          <Route path="orders" element={<OrdersPage />} />
        </Route>
      </Routes>
      <Cart />
    </>
  )
}

export default App
