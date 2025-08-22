import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [itemsList, setItemsList] = useState([]);
  const [formData, setFormData] = useState({
    _id: "",
    customer: "",
    items: [],
    discountPercent: 0,
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchOrders();
    fetchCustomers();
    fetchItems();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:7000/api/orders", {
        withCredentials: true,
      });
      setOrders(res.data);
    } catch {
      toast.error("Failed to fetch orders.");
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await axios.get("http://localhost:7000/api/customers", {
        withCredentials: true,
      });
      setCustomers(res.data);
    } catch {
      toast.error("Failed to fetch customers.");
    }
  };

  const fetchItems = async () => {
    try {
      const res = await axios.get("http://localhost:7000/api/items", {
        withCredentials: true,
      });
      setItemsList(res.data);
    } catch {
      toast.error("Failed to fetch items.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (e, index) => {
    const newItems = [...formData.items];
    const selectedItem = itemsList.find((i) => i._id === e.target.value);
    if (selectedItem) {
      newItems[index] = { ...selectedItem, quantity: 1 };
      setFormData((prev) => ({ ...prev, items: newItems }));
    }
  };

  const handleItemQuantityChange = (e, index) => {
    const newItems = [...formData.items];
    newItems[index].quantity = Number(e.target.value);
    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  const addItemRow = () => {
    setFormData((prev) => ({ ...prev, items: [...prev.items, {}] }));
  };

  const removeItemRow = (index) => {
    const newItems = [...formData.items];
    newItems.splice(index, 1);
    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  const totalValue = formData.items.reduce(
    (sum, i) => sum + (i.price || 0) * (i.quantity || 0),
    0
  );
  const finalAmount =
    totalValue - (totalValue * (formData.discountPercent || 0)) / 100;

  const createOrder = async () => {
    if (!formData._id || !formData.customer || formData.items.length === 0) {
      return toast.error("Order ID, customer, and items are required.");
    }

    const itemsPayload = formData.items
      .filter((i) => i._id)
      .map((i) => ({ itemId: i._id, quantity: i.quantity || 1 }));

    try {
      await axios.post(
        "http://localhost:7000/api/orders",
        {
          _id: formData._id,
          customerId: formData.customer,
          items: itemsPayload,
          discountPercent: formData.discountPercent || 0,
        },
        { withCredentials: true }
      );
      toast.success("Order created successfully!");
      setFormData({ _id: "", customer: "", items: [], discountPercent: 0 });
      fetchOrders();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create order.");
    }
  };

  const editOrder = (order) => {
    setEditingId(order._id);
    setFormData({
      _id: order._id,
      customer: order.customer?._id || "",
      items:
        order.items?.map((i) => ({
          ...i,
          _id: i.itemId?._id || i._id,
        })) || [],
      discountPercent: order.discountPercent || 0,
    });
  };

  const updateOrder = async () => {
    if (!editingId) return;

    const itemsPayload = formData.items
      .filter((i) => i._id)
      .map((i) => ({ itemId: i._id, quantity: i.quantity || 1 }));

    try {
      await axios.put(
        `http://localhost:7000/api/orders/${editingId}`,
        {
          customerId: formData.customer,
          items: itemsPayload,
          discountPercent: formData.discountPercent || 0,
        },
        { withCredentials: true }
      );
      toast.success("Order updated successfully!");
      setEditingId(null);
      setFormData({ _id: "", customer: "", items: [], discountPercent: 0 });
      fetchOrders();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update order.");
    }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await axios.delete(`http://localhost:7000/api/orders/${id}`, {
        withCredentials: true,
      });
      toast.success("Order deleted successfully!");
      fetchOrders();
    } catch {
      toast.error("Failed to delete order.");
    }
  };

  return (
    <div className="max-w-6xl p-6 mx-auto mt-10 bg-white rounded-lg shadow-lg">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4">
        {editingId ? "✏️ Edit Order" : "➕ Add Order"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          name="_id"
          placeholder="Order ID"
          value={formData._id}
          onChange={handleInputChange}
          className="p-2 border rounded w-full"
          disabled={editingId}
        />
        <select
          name="customer"
          value={formData.customer}
          onChange={handleInputChange}
          className="p-2 border rounded w-full"
        >
          <option value="">Select Customer</option>
          {customers.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          name="discountPercent"
          placeholder="Discount %"
          value={formData.discountPercent}
          onChange={handleInputChange}
          className="p-2 border rounded w-full"
        />
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Items</h3>
        {formData.items.map((item, idx) => (
          <div key={idx} className="grid grid-cols-4 gap-2 mb-2 items-center">
            <select
              value={item._id || ""}
              onChange={(e) => handleItemChange(e, idx)}
              className="p-2 border rounded"
            >
              <option value="">Select Item</option>
              {itemsList.map((i) => (
                <option key={i._id} value={i._id}>
                  {i.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={item.quantity || 1}
              onChange={(e) => handleItemQuantityChange(e, idx)}
              className="p-2 border rounded"
              min={1}
            />
            <span className="p-2">{item.price || 0}</span>
            <button
              onClick={() => removeItemRow(idx)}
              className="px-2 py-1 bg-red-600 text-white rounded"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={addItemRow}
          className="px-4 py-2 mb-4 bg-blue-600 text-white rounded"
        >
          Add Item
        </button>
      </div>

      <div className="mb-4">
        <p>Total: {totalValue.toFixed(2)}</p>
        <p>Final Amount: {finalAmount.toFixed(2)}</p>
      </div>

      <button
        onClick={editingId ? updateOrder : createOrder}
        className={`w-full py-2 mb-6 text-white rounded ${
          editingId
            ? "bg-yellow-600 hover:bg-yellow-700"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {editingId ? "Update Order" : "Create Order"}
      </button>

      <h3 className="text-xl font-semibold mb-2">Orders List</h3>
      {orders.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-300 rounded">
            <thead className="bg-gray-700 text-white">
              <tr>
                <th className="px-4 py-2">Order ID</th>
                <th className="px-4 py-2">Customer</th>
                <th className="px-4 py-2">Items</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2">Discount %</th>
                <th className="px-4 py-2">Final Amount</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="odd:bg-gray-100 even:bg-white">
                  <td className="px-4 py-2">{o._id}</td>
                  <td className="px-4 py-2">
                    {o.customer?.name || "No Customer"}
                  </td>
                  <td className="px-4 py-2">
                    {o.items?.map((i, idx) => (
                      <div key={idx}>
                        {i.itemName || "Unknown"} x {i.quantity}
                      </div>
                    ))}
                  </td>
                  <td className="px-4 py-2">{o.totalValue}</td>
                  <td className="px-4 py-2">{o.discountPercent}</td>
                  <td className="px-4 py-2">{o.finalAmount}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() => editOrder(o)}
                      className="px-2 py-1 text-white bg-yellow-600 rounded hover:bg-yellow-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteOrder(o._id)}
                      className="px-2 py-1 text-white bg-red-600 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default Order;
