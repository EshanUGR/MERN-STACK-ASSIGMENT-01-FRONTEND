import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:7000/api/orders", {
        withCredentials: true,
      });

      setOrders(res.data);
      console.log(res.data);
    } catch (error) {
      console.error("Error fetching orders", error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await axios.put(
        `http://localhost:7000/api/orders/${orderId}/status`,
        { status: newStatus.toLowerCase() },
        { withCredentials: true }
      );

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? { ...order, status: res.data.order.status.toLowerCase() }
            : order
        )
      );

      toast.success(`Order marked as ${newStatus}`);
    } catch (error) {
      console.error("Error updating status", error);
      toast.error("Failed to update order status");
    }
  };

  if (loading) return <p className="p-6 text-lg">Loading orders...</p>;

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-6">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-3">
          📦 Order Management
        </h2>

        {orders.length === 0 ? (
          <p className="text-gray-600">No orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                  <th className="p-3 text-left">Order ID</th>
                  <th className="p-3 text-left">Customer</th>
                  <th className="p-3 text-left">Total</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, idx) => (
                  <tr
                    key={order._id}
                    className={`transition duration-200 ${
                      idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-blue-50`}
                  >
                    <td className="p-3 font-medium text-gray-800">
                      {order._id}
                    </td>
                    <td className="p-3 text-gray-700">
                      {order.customer?.name || "Unknown"}
                    </td>
                    <td className="p-3 font-semibold text-green-600">
                      Rs.{order.finalAmount}
                    </td>
                    <td className="p-3">
                      <select
                        key={order._id}
                        value={order.status.toLowerCase()}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        className={`px-3 py-2 rounded-lg font-medium transition duration-200 
                          ${
                            order.status === "completed"
                              ? "bg-green-100 text-green-700 border border-green-300"
                              : order.status === "cancelled"
                              ? "bg-red-100 text-red-700 border border-red-300"
                              : "bg-yellow-100 text-yellow-700 border border-yellow-300"
                          }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;
