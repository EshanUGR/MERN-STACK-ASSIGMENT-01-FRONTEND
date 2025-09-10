import { useState } from 'react'
import './App.css'
import { BrowserRouter,Routes,Route,Navigate } from 'react-router-dom'

import Home from './pages/Home' 
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Item from './pages/Item'
import Customer from './pages/Customer'
import Order from './pages/Order'
import Header from './components/Header'
import Footer from './components/Footer'
import DashboardStats from './pages/DashboardStats'
import InvoicePage from './pages/InvoicePage'
import QuotationPage from './pages/QuotationPage'
import OrderList from './pages/OrderList'
function App() {

 const PrivateRoute = ({ children }) => {
   const user = JSON.parse(localStorage.getItem("user"));

   if (!user) {
     return <Navigate to="/sign-in" replace />;
   }

   return children;
 };


 

  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route
            path="/items"
            element={
              <PrivateRoute>
                <Item />
              </PrivateRoute>
            }
          />
          <Route path="/customers" element={<PrivateRoute><Customer /></PrivateRoute>} />
          <Route path="/orders" element={<PrivateRoute><Order /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><DashboardStats /></PrivateRoute>} />
          <Route path="/invoice" element={<PrivateRoute><InvoicePage /></PrivateRoute>} />
          <Route path="/quotation" element={<PrivateRoute><QuotationPage /></PrivateRoute>} />
          <Route path="/order-status" element={<PrivateRoute><OrderList /></PrivateRoute>} />
        </Routes>

        <Footer/>
      </BrowserRouter>
    </>
  );
}

export default App
