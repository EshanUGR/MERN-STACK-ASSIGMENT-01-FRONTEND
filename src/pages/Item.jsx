import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FiAlertTriangle,
  FiBox,
  FiDollarSign,
  FiEdit3,
  FiPackage,
  FiPlus,
  FiSearch,
  FiTrash2,
  FiX,
} from "react-icons/fi";

const Item = () => {
  const [items, setItems] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    price: "",
    quantity: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get("http://localhost:7000/api/items", {
        withCredentials: true,
      });
      setItems(res.data || []);
    } catch {
      setItems([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const clearForm = () => {
    setEditingId(null);
    setFormData({ _id: "", name: "", price: "", quantity: "" });
    setIsFormOpen(false);
  };

  const createItem = async () => {
    const { _id, name, price, quantity } = formData;
    if (!_id || !name || !price || !quantity) {
      return toast.error("All fields are required.");
    }

    try {
      await axios.post("http://localhost:7000/api/items", formData, {
        withCredentials: true,
      });
      toast.success("Item created successfully!");
      clearForm();
      fetchItems();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create item.");
    }
  };

  const updateItem = async () => {
    if (!editingId) return;
    try {
      await axios.put(
        `http://localhost:7000/api/items/${editingId}`,
        formData,
        { withCredentials: true },
      );
      toast.success("Item updated successfully!");
      clearForm();
      fetchItems();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update item.");
    }
  };

  const editItem = (item) => {
    setEditingId(item._id);
    setFormData({
      _id: item._id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    });
    setIsFormOpen(true);
  };

  const deleteItem = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this item?",
    );
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:7000/api/items/${id}`, {
        withCredentials: true,
      });
      toast.success("Item deleted successfully!");
      fetchItems();
    } catch {
      toast.error("Failed to delete item.");
    }
  };

  const openCreateForm = () => {
    setEditingId(null);
    setFormData({ _id: "", name: "", price: "", quantity: "" });
    setIsFormOpen(true);
  };

  const filteredItems = items.filter((item) => {
    const query = searchText.trim().toLowerCase();
    if (!query) return true;

    return (
      item._id?.toLowerCase().includes(query) ||
      item.name?.toLowerCase().includes(query)
    );
  });

  const totalStockUnits = items.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0),
    0,
  );
  const lowStockCount = items.filter(
    (item) => Number(item.quantity) < 10,
  ).length;

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
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_10%,rgba(6,182,212,0.22),transparent_40%),radial-gradient(circle_at_92%_15%,rgba(16,185,129,0.18),transparent_36%),radial-gradient(circle_at_70%_75%,rgba(56,189,248,0.14),transparent_46%)]" />

      <div className="relative mx-auto max-w-7xl">
        <ToastContainer theme="dark" />

        <section className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-cyan-300/35 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">
                <FiPackage size={14} />
                Safety Items Section
              </p>
              <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">
                Inventory Management Dashboard
              </h1>
              <p className="mt-2 text-sm text-slate-300 sm:text-base">
                Manage safety products, control stock levels, and keep pricing
                updated from one streamlined page.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-center">
                <p className="text-2xl font-extrabold text-cyan-200">
                  {items.length}
                </p>
                <p className="text-xs uppercase tracking-[0.14em] text-slate-300">
                  Total Items
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-center">
                <p className="text-2xl font-extrabold text-emerald-200">
                  {totalStockUnits}
                </p>
                <p className="text-xs uppercase tracking-[0.14em] text-slate-300">
                  Stock Units
                </p>
              </div>
              <div className="col-span-2 sm:col-span-1 rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-center">
                <p className="text-2xl font-extrabold text-amber-200">
                  {lowStockCount}
                </p>
                <p className="text-xs uppercase tracking-[0.14em] text-slate-300">
                  Low Stock
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
                placeholder="Search by item ID or name"
                className="w-full bg-transparent text-sm text-white placeholder:text-slate-400 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setIsFormOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-xl border border-cyan-300/40 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100 hover:bg-cyan-400/20"
              >
                {isFormOpen ? <FiX size={16} /> : <FiPlus size={16} />}
                {isFormOpen ? "Close Form" : "Add Item"}
              </button>
              <button
                onClick={openCreateForm}
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2 text-sm font-bold text-slate-900 hover:bg-cyan-300"
              >
                <FiEdit3 size={16} />
                New Entry
              </button>
            </div>
          </div>
        </section>

        {isFormOpen && (
          <section className="mb-6 rounded-2xl border border-cyan-300/20 bg-slate-900/75 p-5 backdrop-blur sm:p-6">
            <h2 className="text-lg font-bold text-white sm:text-xl">
              {editingId ? "Update Safety Item" : "Create Safety Item"}
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              Maintain item details accurately to improve procurement and order
              reliability.
            </p>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-4">
              <input
                type="text"
                name="_id"
                placeholder="Item ID"
                value={formData._id}
                onChange={handleInputChange}
                className="rounded-xl border border-white/15 bg-slate-950/80 px-3 py-2.5 text-sm text-white placeholder:text-slate-400 focus:border-cyan-300 focus:outline-none"
                disabled={editingId}
              />
              <input
                type="text"
                name="name"
                placeholder="Item Name"
                value={formData.name}
                onChange={handleInputChange}
                className="rounded-xl border border-white/15 bg-slate-950/80 px-3 py-2.5 text-sm text-white placeholder:text-slate-400 focus:border-cyan-300 focus:outline-none md:col-span-1"
              />
              <input
                type="number"
                name="price"
                placeholder="Unit Price"
                value={formData.price}
                onChange={handleInputChange}
                className="rounded-xl border border-white/15 bg-slate-950/80 px-3 py-2.5 text-sm text-white placeholder:text-slate-400 focus:border-cyan-300 focus:outline-none"
              />
              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                className="rounded-xl border border-white/15 bg-slate-950/80 px-3 py-2.5 text-sm text-white placeholder:text-slate-400 focus:border-cyan-300 focus:outline-none"
              />
            </div>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <button
                onClick={editingId ? updateItem : createItem}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-bold text-slate-900 hover:bg-cyan-300"
              >
                <FiBox size={15} />
                {editingId ? "Update Item" : "Save Item"}
              </button>
              <button
                onClick={clearForm}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
              >
                <FiX size={16} />
                Cancel
              </button>
            </div>
          </section>
        )}

        <section className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur sm:p-5">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-xl font-bold text-white">Items List</h3>
            <p className="text-sm text-slate-300">
              Showing {filteredItems.length} of {items.length} entries
            </p>
          </div>

          {lowStockCount > 0 && (
            <div className="mb-4 flex items-start gap-2 rounded-xl border border-amber-300/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
              <FiAlertTriangle className="mt-0.5" size={16} />
              <p>
                {lowStockCount} item{lowStockCount > 1 ? "s are" : " is"} below
                recommended stock level.
              </p>
            </div>
          )}

          {filteredItems.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-slate-900/90 text-slate-100">
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Unit Price</th>
                    <th className="px-4 py-3">Quantity</th>
                    <th className="px-4 py-3">Stock Value</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 bg-slate-950/50">
                  {filteredItems.map((item) => {
                    const itemPrice = Number(item.price) || 0;
                    const itemQty = Number(item.quantity) || 0;
                    return (
                      <tr
                        key={item._id}
                        className="hover:bg-white/5 transition-colors"
                      >
                        <td className="px-4 py-3 font-semibold text-cyan-100">
                          {item._id}
                        </td>
                        <td className="px-4 py-3 text-slate-100">
                          {item.name}
                        </td>
                        <td className="px-4 py-3 text-slate-300">
                          {formatCurrency(itemPrice)}
                        </td>
                        <td className="px-4 py-3 text-slate-300">{itemQty}</td>
                        <td className="px-4 py-3 text-emerald-200">
                          {formatCurrency(itemPrice * itemQty)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => editItem(item)}
                              className="inline-flex items-center gap-1 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-400"
                            >
                              <FiEdit3 size={13} />
                              Edit
                            </button>
                            <button
                              onClick={() => deleteItem(item._id)}
                              className="inline-flex items-center gap-1 rounded-lg bg-rose-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-400"
                            >
                              <FiTrash2 size={13} />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : items.length > 0 ? (
            <p className="rounded-xl border border-white/10 bg-slate-900/60 px-4 py-6 text-center text-slate-300">
              No items match your search.
            </p>
          ) : (
            <p className="rounded-xl border border-white/10 bg-slate-900/60 px-4 py-6 text-center text-slate-300">
              No items found. Add your first safety item to get started.
            </p>
          )}
        </section>
      </div>
    </div>
  );
};

export default Item;
