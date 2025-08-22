import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Customer = () => {
  const [customers, setCustomers] = useState([]);
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

  // Fetch customers
  const fetchCustomers = async () => {
    try {
      const res = await axios.get("http://localhost:7000/api/customers", {
        withCredentials: true, // ✅ include cookie automatically
      });
      setCustomers(res.data);
    } catch {
      toast.error("Failed to fetch customers.");
    }
  };

  // Input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Create new customer
  const createCustomer = async () => {
    const { _id, name, NIC, address, contactNo } = formData;
    if (!_id || !name || !NIC || !address || !contactNo) {
      return toast.error("All fields including ID are required.");
    }

    try {
      await axios.post("http://localhost:7000/api/customers", formData, {
        withCredentials: true,
      });
      toast.success("Customer created successfully!");
      setFormData({ _id: "", name: "", NIC: "", address: "", contactNo: "" });
      fetchCustomers();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create customer.");
    }
  };

  // Set form for editing
  const editCustomer = (customer) => {
    setEditingId(customer._id);
    setFormData({
      _id: customer._id,
      name: customer.name,
      NIC: customer.NIC,
      address: customer.address,
      contactNo: customer.contactNo,
    });
  };

  // Update customer
  const updateCustomer = async () => {
    if (!editingId) return;
    try {
      await axios.put(
        `http://localhost:7000/api/customers/${editingId}`,
        formData,
        { withCredentials: true }
      );
      toast.success("Customer updated successfully!");
      setEditingId(null);
      setFormData({ _id: "", name: "", NIC: "", address: "", contactNo: "" });
      fetchCustomers();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update customer.");
    }
  };

  // Delete customer
  const deleteCustomer = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this customer?"
    );
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:7000/api/customers/${id}`, {
        withCredentials: true,
      });
      toast.success("Customer deleted successfully!");
      fetchCustomers();
    } catch {
      toast.error("Failed to delete customer.");
    }
  };

  return (
    <div className="max-w-3xl p-5 mx-auto mt-10 border rounded-lg shadow-lg">
      <ToastContainer />

      <h2 className="mb-4 text-xl font-bold">
        {editingId ? "✏️ Edit Customer" : "➕ Add Customer"}
      </h2>

      {/* ID input */}
      <input
        type="text"
        name="_id"
        placeholder="Customer ID"
        value={formData._id}
        onChange={handleInputChange}
        className="w-full p-2 mb-2 border rounded"
        disabled={editingId} // prevent changing ID while editing
      />

      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleInputChange}
        className="w-full p-2 mb-2 border rounded"
      />
      <input
        type="text"
        name="NIC"
        placeholder="NIC"
        value={formData.NIC}
        onChange={handleInputChange}
        className="w-full p-2 mb-2 border rounded"
      />
      <input
        type="text"
        name="address"
        placeholder="Address"
        value={formData.address}
        onChange={handleInputChange}
        className="w-full p-2 mb-2 border rounded"
      />
      <input
        type="text"
        name="contactNo"
        placeholder="Contact No"
        value={formData.contactNo}
        onChange={handleInputChange}
        className="w-full p-2 mb-2 border rounded"
      />

      <button
        onClick={editingId ? updateCustomer : createCustomer}
        className={`w-full py-2 mb-4 text-white ${
          editingId
            ? "bg-yellow-600 hover:bg-yellow-700"
            : "bg-blue-600 hover:bg-blue-700"
        } rounded`}
      >
        {editingId ? "Update Customer" : "Add Customer"}
      </button>

      <h3 className="mb-3 text-lg font-semibold">👥 Customers List</h3>
      {customers.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border border-gray-300 rounded-lg">
            <thead className="text-white bg-gray-700">
              <tr>
              
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">NIC</th>
                <th className="px-4 py-2">Address</th>
                <th className="px-4 py-2">Contact No</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((cust, index) => (
                <tr key={cust._id} className="odd:bg-gray-100 even:bg-white">
                 
                  <td className="px-4 py-2">{cust._id}</td>
                  <td className="px-4 py-2">{cust.name}</td>
                  <td className="px-4 py-2">{cust.NIC}</td>
                  <td className="px-4 py-2">{cust.address}</td>
                  <td className="px-4 py-2">{cust.contactNo}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() => editCustomer(cust)}
                      className="px-2 py-1 text-white bg-yellow-600 rounded hover:bg-yellow-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCustomer(cust._id)}
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
        <p>No customers found.</p>
      )}
    </div>
  );
};

export default Customer;
