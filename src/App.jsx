import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import CampaignCenter from "./pages/CampaignPage";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Item from "./pages/Item";
import Customer from "./pages/Customer";
import Order from "./pages/Order";
import Header from "./components/Header";
import Footer from "./components/Footer";
import DashboardStats from "./pages/DashboardStats";
import InvoicePage from "./pages/InvoicePage";
import QuotationPage from "./pages/QuotationPage";
import OrderList from "./pages/OrderList";

function App() {
  const location = useLocation();

  // Logic to hide main layout elements when inside the Campaign tool
  const isCampaignPage = location.pathname === "/campaign";

  // Private Route Wrapper
  const PrivateRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      return <Navigate to="/sign-in" replace />;
    }
    return children;
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* 1. Hide main site header if on the campaign dashboard */}
      {!isCampaignPage && <Header />}

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />

          {/* Campaign Center (Has its own internal Sidebar) */}
          <Route
            path="/campaign"
            element={
              <PrivateRoute>
                <CampaignCenter />
              </PrivateRoute>
            }
          />

          {/* Other Protected Routes */}
          <Route
            path="/items"
            element={
              <PrivateRoute>
                <Item />
              </PrivateRoute>
            }
          />
          <Route
            path="/customers"
            element={
              <PrivateRoute>
                <Customer />
              </PrivateRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <PrivateRoute>
                <Order />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardStats />
              </PrivateRoute>
            }
          />
          <Route
            path="/invoice"
            element={
              <PrivateRoute>
                <InvoicePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/quotation"
            element={
              <PrivateRoute>
                <QuotationPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/order-status"
            element={
              <PrivateRoute>
                <OrderList />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>

      {/* 2. Hide footer on campaign page so it doesn't break the dashboard layout */}
      {!isCampaignPage && <Footer />}
    </div>
  );
}

export default App;
