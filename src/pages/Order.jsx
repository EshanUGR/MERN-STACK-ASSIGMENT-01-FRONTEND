import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FiArrowDown,
  FiArrowUp,
  FiBox,
  FiClipboard,
  FiPackage,
  FiPlus,
  FiSearch,
  FiTrash2,
  FiUsers,
  FiX,
} from "react-icons/fi";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [itemsList, setItemsList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(true);
  const [formData, setFormData] = useState({
    _id: "",
    customer: "",
    items: [],
    discountPercent: 0,
  });

  const topRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    fetchOrders();
    fetchCustomers();
    fetchItems();
  }, []);

  const scrollToTop = () =>
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToBottom = () =>
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });

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
    0,
  );
  const discountAmount = (totalValue * (formData.discountPercent || 0)) / 100;
  const finalAmount = totalValue - discountAmount;

  const resetForm = () => {
    setFormData({ _id: "", customer: "", items: [], discountPercent: 0 });
    setIsFormOpen(false);
  };

  const createOrder = async () => {
    if (!formData._id || !formData.customer || formData.items.length === 0) {
      return toast.error("Order ID, customer, and items are required.");
    }

    const hasInvalidItem = formData.items.some((i) => !i._id || !i.quantity);
    if (hasInvalidItem) {
      return toast.error("Please select valid products and quantities.");
    }

    const itemsPayload = formData.items.map((i) => ({
      itemId: i._id,
      quantity: i.quantity || 1,
    }));
    try {
      await axios.post(
        "http://localhost:7000/api/orders",
        {
          _id: formData._id,
          customerId: formData.customer,
          items: itemsPayload,
          discountPercent: formData.discountPercent || 0,
        },
        { withCredentials: true },
      );
      toast.success("Order created successfully!");
      resetForm();
      fetchOrders();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create order.");
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

  const filteredOrders = orders.filter((order) => {
    const query = searchText.trim().toLowerCase();
    if (!query) return true;

    return (
      order._id?.toLowerCase().includes(query) ||
      order.customer?.name?.toLowerCase().includes(query) ||
      order.status?.toLowerCase().includes(query)
    );
  });

  const totalRevenue = orders.reduce(
    (sum, order) => sum + (Number(order.finalAmount) || 0),
    0,
  );
  const pendingOrders = orders.filter((o) => o.status !== "Completed").length;

  const formatCurrency = (value) => {
    const amount = Number(value) || 0;
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_12%,rgba(6,182,212,0.22),transparent_42%),radial-gradient(circle_at_92%_14%,rgba(16,185,129,0.18),transparent_38%),radial-gradient(circle_at_70%_74%,rgba(56,189,248,0.14),transparent_45%)]" />

      <div ref={topRef} />

      <div className="relative mx-auto max-w-7xl">
        <ToastContainer position="top-right" theme="dark" />

        <section className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-cyan-300/35 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">
                <FiClipboard size={14} />
                Order Section
              </p>
              <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">
                Order Management Dashboard
              </h1>
              <p className="mt-2 text-sm text-slate-300 sm:text-base">
                Create and monitor orders with fast entry flow, clean totals,
                and easier historical tracking.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-center">
                <p className="text-2xl font-extrabold text-cyan-200">
                  {orders.length}
                </p>
                <p className="text-xs uppercase tracking-[0.14em] text-slate-300">
                  Total Orders
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-center">
                <p className="text-2xl font-extrabold text-emerald-200">
                  {formatCurrency(totalRevenue)}
                </p>
                <p className="text-xs uppercase tracking-[0.14em] text-slate-300">
                  Revenue
                </p>
              </div>
              <div className="col-span-2 sm:col-span-1 rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-center">
                <p className="text-2xl font-extrabold text-amber-200">
                  {pendingOrders}
                </p>
                <p className="text-xs uppercase tracking-[0.14em] text-slate-300">
                  In Progress
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 sm:w-80">
              <FiSearch className="text-slate-300" />
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search by order ID, customer, status"
                className="w-full bg-transparent text-sm text-white placeholder:text-slate-400 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setIsFormOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-xl border border-cyan-300/40 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100 hover:bg-cyan-400/20"
              >
                {isFormOpen ? <FiX size={16} /> : <FiPlus size={16} />}
                {isFormOpen ? "Close Form" : "Create Order"}
              </button>
              <button
                onClick={() => {
                  setFormData({
                    _id: "",
                    customer: "",
                    items: [],
                    discountPercent: 0,
                  });
                  setIsFormOpen(true);
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2 text-sm font-bold text-slate-900 hover:bg-cyan-300"
              >
                <FiPackage size={16} />
                New Entry
              </button>
            </div>
          </div>
        </section>

        {isFormOpen && (
          <section className="mb-6 rounded-2xl border border-cyan-300/20 bg-slate-900/75 p-5 backdrop-blur sm:p-6">
            <h2 className="text-lg font-bold text-white sm:text-xl">
              Create New Order
            </h2>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
              <input
                type="text"
                name="_id"
                value={formData._id}
                onChange={handleInputChange}
                className="rounded-xl border border-white/15 bg-slate-950/80 px-3 py-2.5 text-sm text-white placeholder:text-slate-400 focus:border-cyan-300 focus:outline-none"
                placeholder="Order ID (e.g. ORD-001)"
              />

              <select
                name="customer"
                value={formData.customer}
                onChange={handleInputChange}
                className="rounded-xl border border-white/15 bg-slate-950/80 px-3 py-2.5 text-sm text-white focus:border-cyan-300 focus:outline-none"
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
                value={formData.discountPercent}
                onChange={handleInputChange}
                className="rounded-xl border border-white/15 bg-slate-950/80 px-3 py-2.5 text-sm text-white placeholder:text-slate-400 focus:border-cyan-300 focus:outline-none"
                placeholder="Discount %"
              />
            </div>

            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-200">
                  Line Items
                </h4>
                <button
                  onClick={addItemRow}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-slate-200 hover:bg-white/10"
                >
                  <FiPlus size={13} />
                  Add Product
                </button>
              </div>

              <div className="space-y-3">
                {formData.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-1 gap-3 rounded-xl border border-white/10 bg-slate-950/60 p-3 md:grid-cols-12 md:items-end"
                  >
                    <div className="md:col-span-5">
                      <label className="mb-1 block text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                        Product
                      </label>
                      <select
                        value={item._id || ""}
                        onChange={(e) => handleItemChange(e, idx)}
                        className="w-full rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-sm text-white focus:border-cyan-300 focus:outline-none"
                      >
                        <option value="">Choose Product</option>
                        {itemsList.map((i) => (
                          <option key={i._id} value={i._id}>
                            {i.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-1 block text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                        Unit Price
                      </label>
                      <p className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-sm font-semibold text-cyan-100">
                        {formatCurrency(item.price || 0)}
                      </p>
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-1 block text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                        Quantity
                      </label>
                      <input
                        type="number"
                        value={item.quantity || 1}
                        onChange={(e) => handleItemQuantityChange(e, idx)}
                        className="w-full rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-sm text-white focus:border-cyan-300 focus:outline-none"
                        min={1}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-1 block text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                        Line Total
                      </label>
                      <p className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-sm font-semibold text-emerald-200">
                        {formatCurrency(
                          (item.price || 0) * (item.quantity || 0),
                        )}
                      </p>
                    </div>

                    <div className="md:col-span-1 md:text-right">
                      <button
                        onClick={() => removeItemRow(idx)}
                        className="inline-flex items-center justify-center rounded-lg border border-rose-300/40 bg-rose-500/10 p-2 text-rose-200 hover:bg-rose-500/20"
                        aria-label="Remove item row"
                      >
                        <FiX size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-4 border-t border-white/10 pt-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="w-full space-y-2 lg:w-96">
                <div className="flex justify-between text-sm text-slate-300">
                  <span>Gross Total</span>
                  <span className="font-semibold">
                    {formatCurrency(totalValue)}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-amber-200">
                  <span>Discount Amount</span>
                  <span className="font-semibold">
                    - {formatCurrency(discountAmount)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-2 text-xl font-black">
                  <span>Total</span>
                  <span className="text-cyan-200">
                    {formatCurrency(finalAmount)}
                  </span>
                </div>
              </div>

              <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
                <button
                  onClick={createOrder}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 text-sm font-bold text-slate-900 hover:bg-cyan-300"
                >
                  <FiBox size={15} />
                  Place Order
                </button>
                <button
                  onClick={resetForm}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
                >
                  <FiX size={15} />
                  Cancel
                </button>
              </div>
            </div>
          </section>
        )}

        <section className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur sm:p-5">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-xl font-bold text-white">Order History</h3>
            <p className="text-sm text-slate-300">
              Showing {filteredOrders.length} of {orders.length} orders
            </p>
          </div>

          {filteredOrders.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="min-w-[980px] w-full text-left text-sm">
                <thead className="bg-slate-900/90 text-slate-100">
                  <tr>
                    <th className="px-4 py-3">Order ID</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Items</th>
                    <th className="px-4 py-3">Total</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 bg-slate-950/50">
                  {filteredOrders.map((o) => (
                    <tr
                      key={o._id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-4 py-3 font-semibold text-cyan-100">
                        {o._id}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-100">
                          {o.customer?.name || "Guest"}
                        </p>
                        <p className="text-xs text-slate-400">
                          {new Date(o.orderDate).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-2">
                          {o.items?.map((i, idx) => {
                            const unitPrice = i.price || 0;
                            const qty = i.quantity || 0;
                            const lineTotal = i.total || unitPrice * qty;

                            return (
                              <div
                                key={idx}
                                className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs"
                              >
                                <span className="font-semibold text-slate-100">
                                  {i.name}
                                </span>
                                <span className="text-slate-300">
                                  {formatCurrency(unitPrice)} x {qty} ={" "}
                                  {formatCurrency(lineTotal)}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-bold text-emerald-200">
                          {formatCurrency(o.finalAmount)}
                        </p>
                        {o.discountPercent > 0 && (
                          <p className="text-xs text-amber-200">
                            Discount {o.discountPercent}%
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            o.status === "Completed"
                              ? "bg-emerald-400/20 text-emerald-200"
                              : "bg-amber-400/20 text-amber-200"
                          }`}
                        >
                          {o.status || "In Progress"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => deleteOrder(o._id)}
                          className="inline-flex items-center gap-1 rounded-lg bg-rose-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-400"
                        >
                          <FiTrash2 size={13} />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : orders.length > 0 ? (
            <p className="rounded-xl border border-white/10 bg-slate-900/60 px-4 py-6 text-center text-slate-300">
              No orders match your search.
            </p>
          ) : (
            <p className="rounded-xl border border-white/10 bg-slate-900/60 px-4 py-6 text-center text-slate-300">
              No orders yet. Create your first order to start tracking.
            </p>
          )}
        </section>

        <div ref={bottomRef} />

        <div className="fixed bottom-6 right-4 z-40 flex flex-col gap-2 sm:right-6">
          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-slate-900/90 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-cyan-100 shadow-lg shadow-cyan-950/40 backdrop-blur hover:bg-cyan-400/20"
            aria-label="Scroll to top"
          >
            <FiArrowUp size={14} />
            Top
          </button>
          <button
            onClick={scrollToBottom}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-300/40 bg-slate-900/90 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-emerald-100 shadow-lg shadow-emerald-950/40 backdrop-blur hover:bg-emerald-400/20"
            aria-label="Scroll to bottom"
          >
            <FiArrowDown size={14} />
            Bottom
          </button>
        </div>
      </div>
    </div>
  );
};

export default Order;
