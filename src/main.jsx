import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Onboarding from './components/Onboarding.jsx'
import Home from './components/Home.jsx'

const route = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    children: [
      {
        path:'/',
        element: <Onboarding/>
      },
      {
        path:'/home',
        element: <Home/>
      }
    ]
  }
])


createRoot(document.getElementById('root')).render(
  <RouterProvider router={route}/>
)
