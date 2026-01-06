import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import './index.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Lazy load components
const App = lazy(() => import('./App.jsx'))
const Home = lazy(() => import('./components/Home.jsx'))
const About = lazy(() => import('./components/About.jsx'))
const Contact = lazy(() => import('./components/Contact.jsx'))
const ShopCategory = lazy(() => import('./components/ShopCategory.jsx'))
const SearchResults = lazy(() => import('./components/SearchResults.jsx'))
const ProductPage = lazy(() => import('./components/ProductPage.jsx'))
const UserProfile = lazy(() => import('./components/UserProfile.jsx'))
const OrderHistory = lazy(() => import('./components/OrderHistory.jsx'))
const CheckoutPage = lazy(() => import('./components/CheckoutPage.jsx'))
const PaymentPage = lazy(() => import('./components/PaymentPage.jsx'))
const OrderSuccessPage = lazy(() => import('./components/OrderSuccessPage.jsx'))
const VerifyEmail = lazy(() => import('./components/VerifyEmail.jsx'))
const ForgotPassword = lazy(() => import('./components/ForgotPassword.jsx'))
const ResetPassword = lazy(() => import('./components/ResetPassword.jsx'))

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-(--main-1)"></div>
  </div>
)

const route = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <App/>
      </Suspense>
    ),
    children: [
      {
        path:'/',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Home/>
          </Suspense>
        )
      },
      {
        path:'/about',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <About/>
          </Suspense>
        )
      },
      {
        path:'/contact',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Contact/>
          </Suspense>
        )
      },
      {
        path:'/shop/:category',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ShopCategory/>
          </Suspense>
        )
      },
      {
        path:'/search-result',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <SearchResults/>
          </Suspense>
        )
      },
      {
        path:'/product-page',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ProductPage/>
          </Suspense>
        )
      },
      {
        path:'/profile',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <UserProfile/>
          </Suspense>
        )
      },
      {
        path:'/orders',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <OrderHistory/>
          </Suspense>
        )
      },
      {
        path:'/checkout',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <CheckoutPage/>
          </Suspense>
        )
      },
      {
        path:'/payment',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <PaymentPage/>
          </Suspense>
        )
      },
      {
        path:'/order-success',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <OrderSuccessPage/>
          </Suspense>
        )
      },
      {
        path:'/verify-email',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <VerifyEmail/>
          </Suspense>
        )
      },
      {
        path:'/forgot-password',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ForgotPassword/>
          </Suspense>
        )
      },
      {
        path:'/reset-password',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ResetPassword/>
          </Suspense>
        )
      },
      {
        path:'*',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            {window.location.pathname.startsWith('//verify-email') ? <VerifyEmail /> : <div>404 - Page Not Found</div>}
          </Suspense>
        )
      },
    ]
  }
])


createRoot(document.getElementById('root')).render(
  <RouterProvider router={route}/>
)
