import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Customer = () => {
  const token = localStorage.getItem("access_token");
  const [customers, setCustomers] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false); // Controls form visibility
  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    NIC: "",
    address: "",
    contactNo: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const resetForm = () => {
    setFormData({ _id: "", name: "", NIC: "", address: "", contactNo: "" });
    setEditingId(null);
    setIsFormOpen(false);
  };

  // Create or Update handler
  const handleSubmit = async () => {
    const { _id, name, NIC, address, contactNo } = formData;
    if (!_id || !name || !NIC || !address || !contactNo) {
      return toast.error("All fields are required.");
    }

    try {
      if (editingId) {
        // Update Logic
        await axios.put(
          `http://localhost:7000/api/customers/${editingId}`,
          formData,
          { withCredentials: true }
        );
        toast.success("Customer updated!");
      } else {
        // Create Logic
        await axios.post("http://localhost:7000/api/customers", formData, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        toast.success("Customer created!");
      }
      resetForm();
      fetchCustomers();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Operation failed.");
    }
  };

  const editCustomer = (customer) => {
    setEditingId(customer._id);
    setFormData({ ...customer });
    setIsFormOpen(true); // Show form when editing
  };

  const deleteCustomer = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`http://localhost:7000/api/customers/${id}`, {
        withCredentials: true,
      });
      toast.success("Deleted successfully!");
      fetchCustomers();
    } catch {
      toast.error("Delete failed.");
    }
  };

  return (
    <div className="max-w-4xl p-5 mx-auto mt-10 border rounded-lg shadow-lg bg-white">
      <ToastContainer />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          👥 Customer Management
        </h2>
        {!isFormOpen && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            + Add New Customer
          </button>
        )}
      </div>

      {/* CONDITIONAL FORM VIEW: Only shows when adding or editing */}
      {isFormOpen && (
        <div className="mb-8 p-6 bg-gray-50 border-2 border-blue-100 rounded-xl">
          <h3 className="text-lg font-semibold mb-4 text-blue-800">
            {editingId
              ? "✏️ Edit Full Details"
              : "➕ Enter New Customer Details"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="_id"
              placeholder="Customer ID"
              value={formData._id}
              onChange={handleInputChange}
              className="p-2 border rounded"
              disabled={editingId}
            />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              className="p-2 border rounded"
            />
            <input
              type="text"
              name="NIC"
              placeholder="NIC Number"
              value={formData.NIC}
              onChange={handleInputChange}
              className="p-2 border rounded"
            />
            <input
              type="text"
              name="contactNo"
              placeholder="Contact No"
              value={formData.contactNo}
              onChange={handleInputChange}
              className="p-2 border rounded"
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleInputChange}
              className="p-2 border rounded md:col-span-2"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-bold"
            >
              {editingId ? "Save Changes" : "Save Customer"}
            </button>
            <button
              onClick={resetForm}
              className="px-6 bg-gray-400 text-white py-2 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* SUMMARY TABLE VIEW */}
      <h3 className="mb-3 text-lg font-semibold">Customers List</h3>
      {customers.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border border-gray-300 rounded-lg">
            <thead className="text-white bg-gray-700">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((cust) => (
                <tr
                  key={cust._id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium">{cust._id}</td>
                  <td className="px-4 py-3">{cust.name}</td>
                  <td className="px-4 py-3 flex justify-center gap-2">
                    <button
                      onClick={() => editCustomer(cust)}
                      className="px-3 py-1 text-sm text-white bg-yellow-600 rounded hover:bg-yellow-700"
                    >
                      View & Edit
                    </button>
                    <button
                      onClick={() => deleteCustomer(cust._id)}
                      className="px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700"
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
        <p className="text-gray-500 italic">No customers found.</p>
      )}
    </div>
  );
};

export default Customer;
