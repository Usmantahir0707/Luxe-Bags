import './App.css'
import { Outlet } from 'react-router-dom'
import { ShopContextProvider } from './context/ShopContext'

function App() {

  return (
    <>
    <ShopContextProvider>
      <Outlet/>
    </ShopContextProvider>
      
    </>
  )
}

export default App
