import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Item = () => {
  const [items, setItems] = useState([]);
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
        { withCredentials: true }
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
  };

  const deleteItem = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this item?"
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

  return (
    <div className="max-w-5xl p-6 mx-auto mt-10 bg-white rounded-lg shadow-lg">
      <ToastContainer />
      <h2 className="mb-6 text-2xl font-bold text-gray-800">
        {editingId ? "✏️ Edit Item" : "➕ Add Item"}
      </h2>

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <input
          type="text"
          name="_id"
          placeholder="Item ID"
          value={formData._id}
          onChange={handleInputChange}
          className="p-3 rounded border border-gray-300 w-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          disabled={editingId}
        />
        <input
          type="text"
          name="name"
          placeholder="Item Name"
          value={formData.name}
          onChange={handleInputChange}
          className="p-3 rounded border border-gray-300 w-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleInputChange}
          className="p-3 rounded border border-gray-300 w-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={handleInputChange}
          className="p-3 rounded border border-gray-300 w-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="flex gap-3 mb-6">
        <button
          onClick={editingId ? updateItem : createItem}
          className={`flex-1 py-2 text-white rounded ${
            editingId
              ? "bg-yellow-600 hover:bg-yellow-700"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {editingId ? "Update Item" : "Add Item"}
        </button>
        <button
          onClick={clearForm}
          className="flex-1 py-2 bg-gray-400 hover:bg-gray-500 rounded text-white"
        >
          Clear
        </button>
      </div>

      <h3 className="mb-4 text-xl font-semibold text-gray-800">
        📦 Items List
      </h3>

      {items.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-blue-600 text-white">
              <tr>
               
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Quantity</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item._id} className="odd:bg-gray-50 even:bg-gray-100">
                  <td className="px-4 py-2">{item._id}</td>
                  <td className="px-4 py-2">{item.name}</td>
                  <td className="px-4 py-2">{item.price}</td>
                  <td className="px-4 py-2">{item.quantity}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() => editItem(item)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteItem(item._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
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
        <p className="text-gray-500">No items found.</p>
      )}
    </div>
  );
};

export default Item;
