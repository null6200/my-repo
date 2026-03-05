import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { ScrollToTop } from '@/lib/scroll-to-top';
import HomePage from '@/components/pages/HomePageNew';
import ProductsPage from '@/components/pages/ProductsPage';
import ProductDetailPage from '@/components/pages/ProductDetailPage';
import AdminPage from '@/components/pages/AdminPage';
import AdminSalesPage from '@/components/pages/AdminSalesPage';
import AdminLogisticsPage from '@/components/pages/AdminLogisticsPage';
import CheckoutPage from '@/components/pages/CheckoutPage';
import OrderConfirmationPage from '@/components/pages/OrderConfirmationPage';
import AboutPage from '@/components/pages/AboutPage';
import ContactPage from '@/components/pages/ContactPage';

// Layout component that includes ScrollToTop
function Layout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
        routeMetadata: {
          pageIdentifier: 'home',
        },
      },
      {
        path: "products",
        element: <ProductsPage />,
        routeMetadata: {
          pageIdentifier: 'products',
        },
      },
      {
        path: "products/:id",
        element: <ProductDetailPage />,
        routeMetadata: {
          pageIdentifier: 'product-detail',
        },
      },
      {
        path: "about",
        element: <AboutPage />,
        routeMetadata: {
          pageIdentifier: 'about',
        },
      },
      {
        path: "contact",
        element: <ContactPage />,
        routeMetadata: {
          pageIdentifier: 'contact',
        },
      },
      {
        path: "admin",
        element: <AdminPage />,
        routeMetadata: {
          pageIdentifier: 'admin',
        },
      },
      {
        path: "admin/sales",
        element: <AdminSalesPage />,
        routeMetadata: {
          pageIdentifier: 'admin-sales',
        },
      },
      {
        path: "admin/logistics",
        element: <AdminLogisticsPage />,
        routeMetadata: {
          pageIdentifier: 'admin-logistics',
        },
      },
      {
        path: "checkout",
        element: <CheckoutPage />,
        routeMetadata: {
          pageIdentifier: 'checkout',
        },
      },
      {
        path: "order-confirmation",
        element: <OrderConfirmationPage />,
        routeMetadata: {
          pageIdentifier: 'order-confirmation',
        },
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
], {
  basename: import.meta.env.BASE_NAME,
});

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
