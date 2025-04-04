import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './index.css'
import Home from './pages/Home.jsx'
import Product from './pages/Registers/Product.jsx'
import Card from './pages/Registers/Card.jsx'
import Employee from './pages/Registers/Employee.jsx'
import Sale from './pages/Registers/Sale.jsx'
import Sales from './pages/Sales.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />}/>
        <Route path='/sales' element={<Sales />}/>
        <Route path='/product' element={<Product />}/>
        <Route path='/card' element={<Card />}/>
        <Route path='/employee' element={<Employee />}/>
        <Route path='/sale' element={<Sale />}/>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)