import { useEffect, useState } from "react";
import axios from "axios";
import InvoicePage from "./InvoicePage";
import QuotationPage from "./QuotationPage";
const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalCustomers: 0,
    totalItems: 0,
  });

  // ✅ Define fetchStats first
  const fetchStats = async () => {
    try {
      const res = await axios.get(
        "http://localhost:7000/api/dashboard/counts",
        {
          withCredentials: true, // ✅ include cookies automatically
        }
      );
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  // ✅ Then call it inside useEffect
  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard Stats</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-500 text-white p-6 rounded shadow text-center">
          <h2 className="text-xl font-semibold">Orders</h2>
          <p className="text-3xl">{stats.totalOrders}</p>
        </div>
        <div className="bg-green-500 text-white p-6 rounded shadow text-center">
          <h2 className="text-xl font-semibold">Customers</h2>
          <p className="text-3xl">{stats.totalCustomers}</p>
        </div>
        <div className="bg-yellow-500 text-white p-6 rounded shadow text-center">
          <h2 className="text-xl font-semibold">Items</h2>
          <p className="text-3xl">{stats.totalItems}</p>
        </div>
      </div>
<InvoicePage/>

<QuotationPage/>
    </div>

  );
};

export default DashboardStats;
